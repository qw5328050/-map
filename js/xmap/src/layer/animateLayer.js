/**
 * 动画图层
 * Created by fp on 2018/4/26.
 */
import ol from '../../ol_extend';

const AnimateLayer = function (opt_options) {
    this.options = Object.assign({}, this.getDefaultOptions(), opt_options);
    this.map = this.options.map;
    this.olMap = this.options.map.olMap;
    this.projection = ol.proj.get('EPSG:' + this.options.projection);
    this.styleFunction_ = undefined;//默认样式
    this.styleParams = {};
    this.layer_ = null;
    this.timer_ = null;
    this.runTimer = {};
    this.runAnimater = {};
    this.initStyle_();
    this.initLayers();
};
ol.inherits(xmap.AnimateLayer, xmap.VectorLayer);


AnimateLayer.prototype.initStyle_ = function () {
    var styleParams = {};
    if (this.options.styleFunction) {
        this.styleFunction_ = this.options.styleFunction;
        styleParams = this.styleFunction_();
    }
    this.styleParams = Object.assign({}, this.options.defaultStyle, styleParams);
};

//初始化图层
AnimateLayer.prototype.initLayers = function () {
    this.layer_ = new ol.layer.Vector({
        source: new ol.source.Vector({
            wrapX: false
        }),
        zIndex: this.options.zIndex
    });
    this.layer_.setProperties({
        xmapLayer: this
    });
    this.olMap.addLayer(this.layer_);
    this.map.addExcludeFocusLayer(this);
};

AnimateLayer.prototype.getLayer = function () {
    return this.layer_;
};

AnimateLayer.prototype.removeLayer = function () {
    this.map.removeExcludeFocusLayer(this);
    if (this.layer_) {
        this.olMap.removeLayer(this.layer_);
        this.layer_ = null;
    }
};
AnimateLayer.prototype.clearData_ = function (opt_options) {
    if (this.timer_) {
        window.clearInterval(this.timer_);
        this.timer_ = null;
    }
    for(var runTimer in this.runTimer){
        var itemTimer = this.runTimer[runTimer];
        if(itemTimer){
            window.clearTimeout(itemTimer);
        }
    }
    this.runTimer = {};

    for(var runAnim in this.runAnimater){
        var runAnimate = this.runAnimater[runAnim];
        if(runAnimate.isPlaying()){
            runAnimate.stop();
        }
    }
    this.runAnimater = {};
    this.layer_.getSource().clear();
};

//显示数据
AnimateLayer.prototype.showDataInter_ = function (opt_options) {
    var self = this;
    self.clearData_();
    var len = opt_options.data.length;
    var dataList = opt_options.data;
    self.timer_ = window.setInterval(function () {
        self.twinkleFeature_(dataList);
    }, self.options.intervalTime);
    self.twinkleFeature_(dataList);
};

AnimateLayer.prototype.twinkleFeature_ = function (dataList) {
    var self = this;
    var projection = this.map.getViewProjection();
    for (var i = 0; i < dataList.length; i++) {
        var item = dataList[i];
        for (var j = 0; j < self.options.countCircle; j++) {
            (function(tempItem, index){
                if(xmap.util.checkPosLegal(tempItem.longitude, tempItem.latitude)){
                    self.runTimer[j] = setTimeout(function () {
                        var coordinate = xmap.util.transformPointT4326([parseFloat(tempItem.longitude),
                                parseFloat(tempItem.latitude)],
                            projection);
                        self.addAnimatePoint(coordinate, index);
                    }, j * 500);
                }
            }(item, j));
        }
    }
};

AnimateLayer.prototype.addAnimatePoint = function (coord, index) {
    var self = this;
    var f = new ol.Feature(new ol.geom.Point(coord));
    f.setStyle(new ol.style.Style(
        {
            image: new ol.style.Circle(
                {
                    radius: self.styleParams.radius,
                    points: self.styleParams.points,
                    stroke: new ol.style.Stroke(
                        {
                            color: self.styleParams.strokeColor,
                            width: self.styleParams.strokeWeight
                        }
                    )
                })
        }));
    this.runAnimater[index] = self.layer_.animateFeature(f, new ol.featureAnimation.Zoom({
        fade: ol.easing.easeOut,
        duration: self.options.duration,
        easing: 'easeOut'
    }));
};

AnimateLayer.prototype.getDefaultOptions = function () {
    return {
        intervalTime: 3000,
        projection: '4326',
        zIndex: 0,
        duration: 3000,
        countCircle: 6,
        defaultStyle: {
            styleType: 'circle',
            radius: 10,
            points: 4,
            fillColor: 'rgba(255, 255, 255, 0)',
            strokeColor: 'red',
            strokeWeight: 3
        }
    }
};

export default AnimateLayer;
