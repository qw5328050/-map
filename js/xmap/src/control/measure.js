/**
 * Created by fp on 2017/2/4.
 * this.dispatchEvent({ type:'drawing',level : 1});
 * 测量工具栏
 */
import ol from '../../ol_extend';
const Measure = function (opt_options) {
    this.options = opt_options;
    this.map = opt_options.map;
    this.isListener = false;
    this.zIndex_ = opt_options.zIndex ? opt_options.zIndex : 99;
    this.measureLayer = new ol.layer.Vector({
        source: new ol.source.Vector(),
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.5)'
            }),
            stroke: new ol.style.Stroke({
                color: 'blue',
                width: 2
            }),
            image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({
                    color: '#ffcc33'
                })
            })
        })
    });
    //添加测量图层
    this.map.addLayer(this.measureLayer);


    this.continuePolygonMsg = '请单击地图测面，双击结束测面';
    this.continueLineMsg = '请单击地图测距，双击结束测距';
    this.continueCircleMsg = '单击结束测面';
    //提示用户的帮助消息
    this.helpTooltip = null;
    this.helpTooltipElement = null;
    //用户在测量显示测量结果信息
    this.measureTooltipElement = null;
    this.measureTooltip = null;
    //测量方式 面 还是距离
    this.measureType = null;
    this.options.useGeodesic = true;
    this.wgs84Sphere = opt_options.wgs84Sphere || new ol.Sphere(6378137);
    ol.Object.call(this);
    this.initKeyDownFunc();
};
ol.inherits(Measure, ol.Object);


Measure.prototype.initKeyDownFunc = function () {
    let self = this;
    this.keyDownFunc = function (e) {
        switch (e.keyCode) {
            case 27:// esc 退出测绘
                if (self.isListener) {
                    self.clearData_();
                }
                break;
        }
    };
};
//监听ESC事件
//flag为true为绑定事件，为false为解绑事件
Measure.prototype.bindKeyDown = function (flag) {
    document.addEventListener('onkeydown', this.keyDownFunc.bind(this));
};

Measure.prototype.unbindKeyDown = function () {
    document.removeEventListener('onkeydown', this.keyDownFunc.bind(this));
};

//支持LineString与Polygon
Measure.prototype.start = function (type) {
    this.measureType = type;
    this.map.dispatchEvent({type: 'startMeasure'});
    //监听地图上清空数据的指令
    this.map.on("clearData", this.clearData_, this);
    this.addMeasureInteraction_();
    this.bindKeyDown();
};

//监听到清空数据的事件
Measure.prototype.clearData_ = function (event) {
    this.clearMeasure();
    //监听地图上清空数据的指令
    this.map.un("clearData", this.clearData_, this);
    this.isListener = false;
};

/**
 * 计算长度
 */
Measure.prototype.formatLength_ = function (line) {
    let length = xmap.util.computeLength(line, this.map, {
        useGeodesic: this.options.useGeodesic,
        wgs84Sphere: this.wgs84Sphere
    });
    let output;
    if (length > 100) {
        output = (Math.round(length / 1000 * 100) / 100) + '  ' + '千米';
    } else {
        output = (Math.round(length * 100) / 100) + '  ' + '米';
    }
    return output;
};

/**
 * 计算面积
 */
Measure.prototype.formatArea_ = function (geometry) {
    let area;
    if (this.options.useGeodesic) {
        let sourceProj = this.map.getView().getProjection();
        if (geometry && geometry instanceof ol.geom.Polygon) {
            let geom = (geometry.clone().transform(sourceProj, 'EPSG:4326'));
            let coordinates = geom.getLinearRing(0).getCoordinates();
            area = Math.abs(this.wgs84Sphere.geodesicArea(coordinates));
        } else if (geometry && geometry instanceof ol.geom.Circle) {
            let center = geometry.getCenter();
            let pointOnPerimeter = [center[0], center[1] + geometry.getRadius()];
            let c1 = ol.proj.transform(center, sourceProj, 'EPSG:4326');
            let c2 = ol.proj.transform(pointOnPerimeter, sourceProj, 'EPSG:4326');
            let radius = this.wgs84Sphere.haversineDistance(c1, c2);
            area = Math.PI * Math.pow(radius, 2);
        }
    } else {
        if (geometry && geometry instanceof ol.geom.Polygon) {
            area = geometry.getArea();
        } else if (geometry && geometry instanceof ol.geom.Circle) {
            let radius = Math.round(geometry.getRadius() * 100) / 100;
            area = Math.PI * Math.pow(radius, 2);
        }
    }
    let output;
    if (area > 10000) {
        output = (Math.round(area / 1000000 * 100) / 100) + '  ' + '平方公里';
    } else {
        output = (Math.round(area * 100) / 100) + '  ' + '平方米';
    }
    return output;
};

/**
 * 移除帮助提示
 */
Measure.prototype.removeHelpTooltip_ = function () {
    if (this.helpTooltipElement && this.helpTooltipElement.parentNode) {
        this.helpTooltipElement.parentNode.removeChild(this.helpTooltipElement);
    }
    if (this.helpTooltip) {
        this.map.removeOverlay(this.helpTooltip);
    }
};

/**
 * 添加帮助提示
 */
Measure.prototype.createHelpTooltip_ = function () {
    this.removeHelpTooltip_();
    this.helpTooltipElement = document.createElement('div');
    this.helpTooltipElement.className = 'tooltip-map tooltip-help';
    this.helpTooltip = new ol.Overlay({
        id: 'helpTooltip',
        stopEvent: false,
        insertFirst: false,
        element: this.helpTooltipElement,
        offset: [15, 0],
        positioning: 'center-left'
    });
    this.map.addOverlay(this.helpTooltip);
};

/**
 * 移除测量提示
 */
Measure.prototype.removeMeasureTooltip_ = function () {
    if (this.measureTooltipElement && this.measureTooltipElement.parentNode) {
        this.measureTooltipElement.parentNode.removeChild(this.measureTooltipElement);
        this.measureTooltipElement = null;
        this.measureTooltip = null;
    }
};

/**
 * 添加测量提示
 */
Measure.prototype.createMeasureTooltip_ = function () {
    this.removeMeasureTooltip_();
    this.measureTooltipElement = document.createElement('div');
    this.measureTooltipElement.className = 'tooltip-map tooltip-measure';
    this.measureTooltip = new ol.Overlay({
        id: 'measureTooltip',
        stopEvent: false,
        insertFirst: false,
        element: this.measureTooltipElement,
        offset: [0, -15],
        positioning: 'bottom-center'
    });
    this.map.addOverlay(this.measureTooltip);
};

/**
 * 添加测量交互
 */
Measure.prototype.addMeasureInteraction_ = function () {
    if (this.measureInteraction) {
        this.measureInteraction.setActive(false);
        this.map.removeInteraction(this.measureInteraction);
        this.measureInteraction = null;
    }
    //测量交互
    this.measureInteraction = new ol.interaction.Draw({
        source: this.measureLayer.getSource(),
        type: this.measureType,
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.8)'
            }),
            stroke: new ol.style.Stroke({
                color: 'rgba(0, 0, 0, 0.5)',
                lineDash: [10, 10],
                width: 2
            }),
            image: new ol.style.Circle({
                radius: 5,
                stroke: new ol.style.Stroke({
                    color: 'rgba(0, 0, 0, 0.7)'
                }),
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 255, 0.8)'
                })
            })
        })
    });
    this.map.addInteraction(this.measureInteraction);

    this.createMeasureTooltip_();
    this.createHelpTooltip_();
    //绘画工具的开始绘画事件
    this.measureInteraction.on('drawstart', function (event) {
        let tooltipCoord = event.coordinate;
        this.measureFeature = event.feature;
        this.listener = this.measureFeature.getGeometry().on('change', function (evt) {
            let geom = evt.target;
            let output;
            if (geom instanceof ol.geom.Polygon) {
                output = this.formatArea_(geom);
                tooltipCoord = geom.getInteriorPoint().getCoordinates();
            } else if (geom instanceof ol.geom.LineString) {
                output = this.formatLength_(geom);
                tooltipCoord = geom.getLastCoordinate();
            } else if (geom instanceof ol.geom.Circle) {
                output = this.formatArea_(geom);
                tooltipCoord = geom.getCenter();
            }
            this.measureTooltipElement.innerHTML = output;
            this.measureTooltip.setPosition(tooltipCoord);
        }, this);
    }, this);
    //绘画工具的结束绘画事件
    this.measureInteraction.on('drawend', function (event) {
        this.helpTooltip.getElement().className = 'tooltip-map tooltip-hidden';
        this.measureTooltipElement.className = 'tooltip-map tooltip-static';
        this.measureTooltip.setOffset([0, -7]);
        this.measureTooltipElement = null;
        this.measureFeature = null;
        //创建新的测量提示框
        this.measureTooltipElement = null;
        this.createMeasureTooltip_();
        //取消鼠标移动监听
        ol.Observable.unByKey(this.listener);
    }, this);
};

//清除测量遗留的动作信息
Measure.prototype.clearMeasure = function (options) {
    let self = this;
    this.measureStatus = "";
    if (this.measureLayer.getSource()) {
        this.measureLayer.getSource().clear(true);
    }
    this.unbindKeyDown();
    //清空测量提示与测量结果的overlay
    this.map.getOverlays().getArray().slice(0).forEach(function (overlay) {
        if (overlay.getId() == "measureTooltip" || overlay.getId() == "helpTooltip") {
            self.map.removeOverlay(overlay);
        }
    });
    //清除测量提示框
    if (this.measureTooltip) {
        this.map.removeOverlay(this.measureTooltip);
    }
    //恢复地图操作到移动模式
    if (this.measureInteraction) {
        //移除测量交互
        this.measureInteraction.setActive(false);
        this.map.removeInteraction(this.measureInteraction);
        this.measureInteraction = null;
    }
    //停止事件监听
    this.map.un("pointermove", this.measureMoveHandler_, this);
    this.map.dispatchEvent({
        type: 'endMeasure'
    });
};

Measure.prototype.measureMoveHandler_ = function (event) {
    if (event.dragging) {
        return;
    }
    let helpMsg = '单击开始绘制，ESC键退出绘制';
    let tooltipCoord = event.coordinate;
    if (this.measureFeature) {
        let output;
        let geom = this.measureFeature.getGeometry();
        //如果属于多边形
        if (geom && geom instanceof ol.geom.Polygon) {
            output = this.formatArea_(geom);
            tooltipCoord = geom.getInteriorPoint().getCoordinates();
            if (this.measureTypeDetail == "Rectangle" || this.measureTypeDetail == "Circle") {//区分矩形与其它多边形
                helpMsg = this.continueCircleMsg;
            } else {
                helpMsg = this.continuePolygonMsg;
            }
        } else if (geom && geom instanceof ol.geom.Circle) {
            output = this.formatArea_(geom);
            helpMsg = this.continueCircleMsg;
            tooltipCoord = geom.getCenter();
        } else if (geom && geom instanceof ol.geom.Circle) {
            output = this.formatArea_(geom);
            helpMsg = this.continueCircleMsg;
            tooltipCoord = geom.getCenter();
        } else if (geom && geom instanceof ol.geom.LineString) {
            output = this.formatLength_(geom);
            helpMsg = this.continueLineMsg;
            tooltipCoord = geom.getLastCoordinate();
        }
    }
    if (this.helpTooltipElement) {
        this.helpTooltipElement.innerHTML = helpMsg;
    }
    if (this.helpTooltip) {
        this.helpTooltip.setPosition(event.coordinate);
    }
};

export default Measure;
