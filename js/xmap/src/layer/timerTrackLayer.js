/**
 * 轨迹回放功能
 * Created by fp on 2017/11/16.
 */
import ol from '../../ol_extend';
import Layer from './layer'
import VectorLayer from './vectorLayer'
import util from '../util/util'
import defaultStyle from '../style/defaultStyle'

const TimerTrackLayer = function (opt_options) {
  Layer.call(this, opt_options);
  this.map = opt_options.map;
  this.olMap = this.map.olMap;
  //定时器
  this.timer = null;
  this.data = [];
  this.dataLen = 0;
  //位置更新时的回调函数
  this.updatePosFunction = this.options.updatePosFunction;
  //切换的判断函数
  this.changeSortFunction = this.options.changeSortFunction;
  //线样式函数
  this.styleFunction_ = opt_options.styleFunction;
  //移动点的样式函数
  this.moveStyleFunction_ = opt_options.moveStyleFunction;
  //初始化事件
  this.singleclickFunc_ = opt_options.singleclick;
  this.dblclickFunc_ = opt_options.dblclick;
  this.hover = opt_options.hover;
  //移动图标图层
  this.moveLayer = null;
  //当前播放序号
  this.index_ = 0;
  this.totalDistance = 0;
  this.runDistance = 0;
  this.init_();
};
ol.inherits(TimerTrackLayer, Layer);


TimerTrackLayer.prototype.init_ = function () {
  this.layer_ = new ol.layer.Vector({
    source: new ol.source.Vector({
      wrapX: false
    }),
    style: this.pointStyle_.bind(this)
  });
  this.layer_.setProperties({
    xmapLayer: this
  });
  this.olMap.addLayer(this.layer_);
  if (this.options.showMovePoint) {
    this.moveLayer = new VectorLayer({
      map: this.map,
      zIndex: 200,
      styleFunction: function (itemData) {
        var style = this.moveStyleFunction_(itemData);
        // style.rotation = itemData.rotation;
        return style;
      }.bind(this)
    });
    this.map.addExcludeFocusLayer(this.moveLayer);
  }
};


TimerTrackLayer.prototype.showTrack = function (opt_options) {
  this.clear_();
  //轨迹数据
  this.data = opt_options.data;
  this.dataLen = this.data.length;
  //计算路径
  this.computeTotalDistance();
  if (this.options.initShowAll) {
    this.refreshLineFeatures(this.data);
    this.playMovePoint(this.data[0], Math.PI / 2);
  }
};

TimerTrackLayer.prototype.start = function () {
  this.clear_();
  if (this.options.initShowAll) {
    this.refreshLineFeatures(this.data);
  }
  if (this.options.showType === TimerTrackLayer.showType.LINE) {
    this.playLine_();
  } else {
    this.playPoint_();
  }
};

TimerTrackLayer.prototype.playLine_ = function () {
  //播放轨迹
  var index = 0;
  var nextIndex = this.index_ + this.options.intervalSpeed;
  if (nextIndex >= this.dataLen - 1) {
    index = this.dataLen;
  } else {
    index = nextIndex;
  }
  var points = this.data.slice(this.index_, index + 1);
  this.index_ = index;
  var features = this.addLineFeatures_(points);
  if (!this.options.initShowAll) {
    this.layer_.getSource().addFeatures(features);
  }
  if (nextIndex < this.dataLen - 1) {
    this.timer = window.setTimeout(this.playLine_.bind(this), this.options.intervalTime);
  } else {
    this.finish_();
  }
};


TimerTrackLayer.prototype.addLineFeatures_ = function (points) {
  var features = [];
  if (points === null || points.length <= 1) {
    return features;
  }
  var len = points.length;
  var beginIndex = 0;
  for (var i = 0; i < len - 1; i++) {
    if (this.changeSortFunction(points[i], points[i + 1])) {
      features.push(this.addLineFeature_(points.slice(beginIndex, i + 2)));
      beginIndex = i + 1;
    }
  }
  var feature = this.addLineFeature_(points.slice(beginIndex, len));
  features.push(feature);
  //回调，更新位置
  var runDistance = this.computeRunDistance();
  if (this.index_ > 0 && this.index_ < this.dataLen - 1) {
    var nowItemData = this.data[this.index_], preItemData = this.data[this.index_ - 1];
    /* var rotation = -(Math.atan2(nowItemData.latitude - preItemData.latitude,
     nowItemData.longitude - preItemData.longitude) - Math.PI / 2);
     console.log('rotation' + rotation);*/
    this.playMovePoint(nowItemData, 0);
  } else {
    this.clearMovePoint();
  }
  this.updatePosFunction(runDistance, this.totalDistance, this.index_);
  return features;
};

TimerTrackLayer.prototype.addLineFeature_ = function (linePoints) {
  var self = this;
  var tempLinePoints = [];
  linePoints.forEach(function (item) {
    tempLinePoints.push(util.transformPoint([item.longitude, item.latitude],
      self.olMap.getView().getProjection().getCode()));
  });
  var feature = new ol.Feature(new ol.geom.LineString(tempLinePoints));
  feature.setProperties({
    data: linePoints[0],
    rootLayer: self
  });
  return feature;
};

/**
 * 显示移动的点
 * @param itemData
 * @param rotation
 */
TimerTrackLayer.prototype.playMovePoint = function (itemData, rotation) {
  itemData.rotation = rotation;
  if (this.moveLayer) {
    this.moveLayer.showData({
      type: 'replace',
      data: [itemData]
    })
  }
};

TimerTrackLayer.prototype.clearMovePoint = function () {
  if (this.moveLayer) {
    this.moveLayer.showData({
      type: 'replace',
      data: []
    })
  }
};

TimerTrackLayer.prototype.playPoint_ = function () {
  //播放轨迹
  var index = 0;
  var nextIndex = this.index_ + this.options.intervalSpeed;
  if (nextIndex >= this.dataLen - 1) {
    index = this.dataLen;
  } else {
    index = nextIndex;
  }
  var points = this.data.slice(this.index_, index);
  var features = this.addPointFeatures_(points);
  if (!this.options.initShowAll) {
    this.layer_.getSource().addFeatures(features);
  }
  this.index_ = index;
  if (nextIndex < this.dataLen) {
    this.timer = window.setTimeout(this.playPoint_.bind(this), this.options.intervalTime);
  } else {
    this.finish_();
  }
};

TimerTrackLayer.prototype.addPointFeatures_ = function (points) {
  var features = [];
  if (points === null || points.length <= 1) {
    return features;
  }
  var len = points.length;
  for (var i = 0; i < len; i++) {
    features.push(this.addPointFeature_(points[i]));
  }
  //回调，更新位置
  var runDistance = this.computeRunDistance();
  if (this.index_ > 0 && this.index_ < this.dataLen - 1) {
    var nowItemData = this.data[this.index_], preItemData = this.data[this.index_ - 1];
    /*var rotation = -(Math.atan2(nowItemData.latitude - preItemData.latitude,
     nowItemData.longitude - preItemData.longitude) - Math.PI / 2);
     console.log('rotation' + rotation);*/
    this.playMovePoint(nowItemData, 0);
  } else {
    this.clearMovePoint();
  }
  this.updatePosFunction(runDistance, this.totalDistance, this.index_);
  return features;
};

TimerTrackLayer.prototype.addPointFeature_ = function (points) {
  var feature = util.getFeatureFromPoint(points.longitude, points.latitude, util.EPSG4326Str,
    this.olMap.getView().getProjection().getCode());
  feature.setProperties({
    data: points,
    rootLayer: this
  });
  return feature;

};

TimerTrackLayer.prototype.pause = function () {
  if (this.timer) {
    window.clearTimeout(this.timer);
    this.timer = null;
  }
};

TimerTrackLayer.prototype.resume = function () {
  if (this.timer) {
    window.clearTimeout(this.timer);
    this.timer = null;
  }
  if (this.options.showType === TimerTrackLayer.showType.LINE) {
    this.playLine_();
  } else {
    this.playPoint_();
  }
};

TimerTrackLayer.prototype.finish_ = function () {
  if (this.timer) {
    window.clearTimeout(this.timer);
    this.timer = null;
  }
  this.index_ = 0;
};

TimerTrackLayer.prototype.end = function () {
  this.clear_();
  this.refreshLineFeatures(this.data);
};

TimerTrackLayer.prototype.clear_ = function () {
  this.map.clearSelectedFeature();
  if (this.timer) {
    window.clearTimeout(this.timer);
    this.timer = null;
  }
  this.layer_.getSource().clear();
  this.clearMovePoint();
  this.index_ = 0;
};

//更新速度
TimerTrackLayer.prototype.updateSpeed = function (newSpeed) {
  this.options.intervalSpeed = newSpeed;
};

//更新进度
TimerTrackLayer.prototype.updateProcess = function (newProcess) {
  if (newProcess >= this.dataLen) {
    this.refreshLineFeatures(this.data.slice(0, this.dataLen));
    this.end();
  } else {
    this.refreshLineFeatures(this.data.slice(0, this.dataLen));
    this.index_ = newProcess;
  }
};

TimerTrackLayer.prototype.refreshLineFeatures = function (points) {
  this.layer_.getSource().clear();
  var features = this.addLineFeatures_(points);
  this.layer_.getSource().addFeatures(features);
};

TimerTrackLayer.prototype.getDefaultOptions = function () {
  return {
    showType: 'line',
    initShowAll: false,
    intervalTime: 1000,//每次间隔的时间
    intervalSpeed: 4, //每次跳跃的点PointLen
    showMovePoint: false,
    updatePosFunction: function () {
    },
    changeSortFunction: function () {
      return true;
    }
  }
};

TimerTrackLayer.prototype.singleclick = function (feature, evt) {
  if (this.singleclickFunc_) {
    var coordinate = evt.coordinate;
    var geometry = feature.getGeometry();
    if (geometry instanceof ol.geom.Point) {
      coordinate = geometry.getLastCoordinate();
    }
    this.singleclickFunc_(feature.get('data'), this.olMap.getView().getZoom(),
      util.transformPointT4326(coordinate, this.map.getViewProjection()));
  }
};

TimerTrackLayer.prototype.dblclick = function (feature, evt) {
  if (this.dblclickFunc_) {
    var coordinate = evt.coordinate;
    var geometry = feature.getGeometry();
    if (geometry instanceof ol.geom.Point) {
      coordinate = geometry.getLastCoordinate();
    }
    this.dblclickFunc_(feature.get('data'), this.olMap.getView().getZoom(),
      util.transformPointT4326(coordinate, this.map.getViewProjection()));
  }
};

TimerTrackLayer.prototype.handleHoverEvent = function (feature, evt) {
  if (this.hover) {
    var coordinate = evt.coordinate;
    var geometry = feature.getGeometry();
    if (geometry instanceof ol.geom.Point) {
      coordinate = geometry.getLastCoordinate();
    }
    this.hover(feature.get('data'), this.olMap.getView().getZoom(),
      util.transformPointT4326(coordinate, this.map.getViewProjection()));
  }
};

TimerTrackLayer.prototype.computeTotalDistance = function () {
  this.totalDistance = this.computeByPoints(this.data);
};

TimerTrackLayer.prototype.computeByPoints = function (linePoints) {
  var self = this;
  var tempLinePoints = [];
  linePoints.forEach(function (item) {
    tempLinePoints.push(util.transformPoint([item.longitude, item.latitude],
      self.olMap.getView().getProjection().getCode()));
  });
  return util.computeLength(new ol.geom.LineString(tempLinePoints), this.olMap);
};


//计算已运行的距离
TimerTrackLayer.prototype.computeRunDistance = function () {
  var runPoints = this.data.slice(0, this.index_ + 2);
  return this.computeByPoints(runPoints);
};

TimerTrackLayer.prototype.pointStyle_ = function (feature, resolution) {
  if (!this.styleFunction_) {
    util.error('请初始化styleFunction样式函数');
    return;
  }
  var styleParams = this.styleFunction_(feature.get('data'), this.olMap.getView().getZoom(),
    this.olMap.getView().getResolution(),
    util.transformPointT4326(feature.getGeometry().getLastCoordinate(), this.map.getViewProjection()));
  return defaultStyle.getStyleByType(styleParams);
};


TimerTrackLayer.prototype.hoverSelectStyle_ = function (feature, resolution) {
  return this.pointStyle_(feature, resolution);
};

TimerTrackLayer.showType = {
  LINE: 'line',
  POINT: 'point'
};


export default TimerTrackLayer;







