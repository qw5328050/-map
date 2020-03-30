/**
 * Created by fp on 2018/1/12.
 */
import ol from '../../ol_extend';
import defaultStyle from '../style/defaultStyle'

const DrawInteraction = function (opt_options) {
    opt_options = Object.assign({},  this.getDefaultOptions(), opt_options);
    this.olMap = opt_options.olMap;
    //绘制类型
    this.type_ = this.getDrawType_(opt_options.type);
    this.measureInteraction = null;
    this.showOne = opt_options.showOne;
    this.drawStyle_ = opt_options.drawStyle;
    this.layerStyle_ = opt_options.layerStyle;
    this.onEnd_ = opt_options.onEnd;
    this.drawLayer_ = null;
    this.wgs84Sphere = new ol.Sphere(6378137);
    this.addEvent();
    this.initDrawLayer_();
    this.initKeyDown_();
    this.addMeasureInteraction_();
};
ol.inherits(DrawInteraction, ol.Object);

DrawInteraction.prototype.getDrawType_ = function (type) {
    if (type.toLowerCase().indexOf('line') >= 0) {
        return DrawInteraction.MeasureType.LINESTRING;
    } else if (type.toLowerCase().indexOf('polygon') >= 0) {
        return DrawInteraction.MeasureType.POLYGON;
    } else if (type.toLowerCase().indexOf('circle') >= 0) {
        return DrawInteraction.MeasureType.CIRCLE;
    } else {
        return DrawInteraction.MeasureType.POINT;
    }
};

DrawInteraction.prototype.addEvent = function () {
   /* this.olMap.getViewport().addEventListener('mouseout', this.mouseoutEvent.bind(this));
    this.olMap.getViewport().addEventListener('mouseover', this.mouseoverEvent.bind(this));*/
};

DrawInteraction.prototype.removeEvent = function () {
    /*this.olMap.getViewport().removeEventListener('mouseout', this.mouseoutEvent.bind(this));
    this.olMap.getViewport().removeEventListener('mouseover', this.mouseoverEvent.bind(this));*/
};


DrawInteraction.prototype.mouseoutEvent = function(){
    if (this.measureInteraction) {
        this.measureInteraction.setActive(false);
    }
};

DrawInteraction.prototype.mouseoverEvent = function(){
    if (this.measureInteraction) {
        this.measureInteraction.setActive(true);
    }
};

DrawInteraction.prototype.initDrawLayer_ = function () {
    this.drawLayer_ = new ol.layer.Vector({
        source: new ol.source.Vector(),
        style: this.getLayerStyle_.bind(this),
        renderOrder: function (f1, f2) {
            if (f1.getGeometry() instanceof ol.geom.Polygon) {
                return 1;
            } else {
                return -1;
            }
        }
    });
    this.olMap.addLayer(this.drawLayer_);
    //渲染的顺序
};

DrawInteraction.prototype.getLayerStyle_ = function () {
    return defaultStyle.getStyleByType(this.layerStyle_);
};

DrawInteraction.prototype.getDrawStyle_ = function () {
    if (this.drawStyle_) {
        return defaultStyle.getStyleByType(this.drawStyle_);
    } else if (this.type_ === DrawInteraction.MeasureType.POINT) {
        return new ol.style.Style({
            image: new ol.style.Circle({
                radius: DrawInteraction.defaultStyle.width * 2,
                fill: new ol.style.Fill({
                    color: DrawInteraction.defaultStyle.lineStrokeColor
                }),
                stroke: new ol.style.Stroke({
                    color: DrawInteraction.defaultStyle.whiteColor,
                    width: DrawInteraction.defaultStyle.width / 2
                })
            })
        });
    } else if (this.type_ === DrawInteraction.MeasureType.LINESTRING) {
        return [
            new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: DrawInteraction.defaultStyle.whiteColor,
                    width: DrawInteraction.defaultStyle.width + 2
                })
            }),
            new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: DrawInteraction.defaultStyle.lineStrokeColor,
                    width: DrawInteraction.defaultStyle.width
                })
            })];
    } else if (this.type_ === DrawInteraction.MeasureType.POLYGON) {
        return new ol.style.Style({
            fill: new ol.style.Fill({
                color: DrawInteraction.defaultStyle.fillColor
            }),
            stroke: new ol.style.Stroke({
                color: DrawInteraction.defaultStyle.fillStrokeColor,
                width: DrawInteraction.defaultStyle.width / 2
            })
        })
    }
};

DrawInteraction.prototype.initKeyDown_ = function () {
    let self = this;
    window.document.addEventListener('keydown', this.keyDownFunc_.bind(this));
};

DrawInteraction.prototype.keyDownFunc_ = function (e) {
    switch (e.keyCode) {
        case 27:// esc 退出测绘
            this.clear_();
            break;
    }
};


DrawInteraction.prototype.addMeasureInteraction_ = function () {
    if (this.measureInteraction) {
        this.measureInteraction.setActive(false);
        this.olMap.removeInteraction(this.measureInteraction);
        this.measureInteraction = null;
    }

    //测量交互
    this.measureInteraction = new ol.interaction.Draw({
        source: this.drawLayer_.getSource(),
        type: this.type_,
        style: this.getDrawStyle_()
    });
    this.olMap.addInteraction(this.measureInteraction);
    //绘画工具的开始绘画事件
    this.measureInteraction.on('drawstart', function (event) {
        this.measureFeature = event.feature;
    }.bind(this));
    //绘画工具的结束绘画事件
    this.measureInteraction.on('drawend', function (event) {
        //判断是否只显示最近一个元素，如果要求只显示一个，需要删除之前的元素
        if(this.showOne){
            let features = this.drawLayer_.getSource().getFeatures();
            features.forEach(function(item){
                if(item !== event.feature){
                    this.drawLayer_.getSource().removeFeature(item);
                }
            }.bind(this));
            // this.olMap.renderSync();
        }
        //针对面积，计算范围, 结束绘制
        let caluResult = this.caluDistanceOrSqua(event);
        //绘制的元素
        this.measureFeature = null;
        if (typeof this.onEnd_ === 'function' && event.feature) {
            window.setTimeout(function(){
                this.onEnd_(event.feature.getGeometry().getCoordinates(), caluResult);
            }.bind(this), 0);

        }
    }.bind(this));
};

//处理绘制的数据集
DrawInteraction.prototype.caluDistanceOrSqua = function (event) {
    if (!event.feature) {
        return;
    }
    let feature = event.feature;
    if (this.type_ === DrawInteraction.MeasureType.LINESTRING) {
        return this.formatLength_(feature.getGeometry());
    } else if (this.type_ === DrawInteraction.MeasureType.POLYGON) {
        return this.formatArea_(feature.getGeometry());
    }
};

//清除测量遗留的动作信息
DrawInteraction.prototype.removeMeasure = function () {
    let self = this;
    if (this.drawLayer_.getSource()) {
        this.drawLayer_.getSource().clear(true);
        this.olMap.removeLayer(this.drawLayer_);
    }

    //恢复地图操作到移动模式
    if (this.measureInteraction) {
        //移除测量交互
        this.measureInteraction.setActive(false);
        this.olMap.removeInteraction(this.measureInteraction);
        this.measureInteraction = null;
    }
    window.document.removeEventListener('keydown', this.keyDownFunc_.bind(this));
};


DrawInteraction.prototype.clear_ = function () {
    let self = this;
    if (this.drawLayer_.getSource()) {
        this.drawLayer_.getSource().clear(true);
    }
    //恢复地图操作到移动模式
    if (this.measureInteraction) {
        //移除测量交互
        this.measureInteraction.setActive(false);
        this.measureInteraction.setActive(true);
    }
};


/**
 * 计算长度
 */
DrawInteraction.prototype.formatLength_ = function (line) {
    let length = 0;
    let coordinates = line.getCoordinates();
    let sourceProj = this.olMap.getView().getProjection();
    for (let i = 0, ii = coordinates.length - 1; i < ii; ++i) {
        let c1 = ol.proj.transform(coordinates[i], sourceProj, 'EPSG:4326');
        let c2 = ol.proj.transform(coordinates[i + 1], sourceProj, 'EPSG:4326');
        length += this.wgs84Sphere.getDistance(c1, c2);
    }
    return (Math.round(length * 100) / 100) + '米';
};

/**
 * 计算面积
 */
DrawInteraction.prototype.formatArea_ = function (geometry) {
    let area;
    let sourceProj = this.olMap.getView().getProjection();
    if (geometry && geometry instanceof ol.geom.Polygon) {
        let geom = (geometry.clone().transform(sourceProj, 'EPSG:4326'));
        let coordinates = geom.getLinearRing(0).getCoordinates();
        area = Math.abs(ol.Sphere.getArea(coordinates));
    } else if (geometry && geometry instanceof ol.geom.Circle) {
        let center = geometry.getCenter();
        let pointOnPerimeter = [center[0], center[1] + geometry.getRadius()];
        let c1 = ol.proj.transform(center, sourceProj, 'EPSG:4326');
        let c2 = ol.proj.transform(pointOnPerimeter, sourceProj, 'EPSG:4326');
        let radius = ol.Sphere.getArea(c1, c2);
        area = Math.PI * Math.pow(radius, 2);
    }
    return (Math.round(area * 100) / 100) + '平方米';
};

//'Point', 'LineString', 'Polygon', 'MultiPoint', 'MultiLineString', 'MultiPolygon' or 'Circle'
DrawInteraction.MeasureType = {
    POINT: 'Point',
    LINESTRING: 'LineString',
    POLYGON: 'Polygon',
    CIRCLE: 'Circle'
};

DrawInteraction.defaultStyle = {
    fillStrokeColor: [0, 153, 255, 1],
    fillColor: [255, 255, 255, 1],
    lineStrokeColor: [0, 153, 255, 1],
    whiteColor: [255, 255, 255, 1],
    width: 3
};


DrawInteraction.prototype.getDefaultOptions = function(){
    return {
        showOne: true
    }
};
export default DrawInteraction;
