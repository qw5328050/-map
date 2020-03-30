/**
 * 矢量图层
 * Created by fp on 2017/11/16.
 */
import ol from '../../ol_extend';
import util from '../util/util';
import defaultStyle from '../style/defaultStyle'
import zIndexManage from '../util/zIndexManage'

const VectorLayer = function (opt_options) {
  this.options = Object.assign({}, this.getDefaultOptions(), opt_options);
  this.map = this.options.map;
  this.olMap = this.map ? this.options.map.olMap : null;
  this.projection = ol.proj.get('EPSG:' + this.options.projection);
  //init style
  this.styleFunction_ = undefined;//默认样式
  this.selectStyleFunction_ = undefined;//选中样式
  this.initStyle_();
  //初始化事件
  this.singleclickFunc_ = this.options.singleclick;
  this.dblclickFunc_ = this.options.dblclick;
  this.hoverFunc_ = this.options.hover;
  this.maxExtent_ = this.options.maxExtent_;
  this.layer_ = null;
  this.cacheData_ = [];
  this.initLayers();
  this.twinkleTimer_ = [];
  //显示的注册一次事件
  this.onceEvent_ = undefined;
  this._zIndex = 0;
};
ol.inherits(VectorLayer, ol.Object);


/**
 * 初始化样式
 * @private
 */
VectorLayer.prototype.initStyle_ = function () {
  if (this.options.styleFunction) {
    this.styleFunction_ = this.options.styleFunction;
  } else {
    // this.styleFunction_ = this.
  }
  if (this.options.selectStyleFunction) {
    this.selectStyleFunction_ = this.options.selectStyleFunction;
  } else {
    this.selectStyleFunction_ = this.styleFunction_;
  }
};

//初始化图层
VectorLayer.prototype.initLayers = function () {
  this.layer_ = new ol.layer.Vector({
    source: new ol.source.Vector({
      wrapX: false
    }),
    zIndex: this.options.zIndex,
    style: this.pointStyle_.bind(this)
  });
  this.layer_.setProperties({
    xmapLayer: this
  });
  //数据显示层级
  if (this.options.orderFunction) {
    this.layer_.set('renderOrder', function (f1, f2) {
      return this.options.orderFunction(f1.get('data'), f2.get('data'));
    }.bind(this));
  } else {
      this.options.useOrderStrategy && this.layer_.set('renderOrder', function (f1, f2) {
      let f1ZIndex = f1.get('data')._zIndexOrder === undefined ? 0 : f1.get('data')._zIndexOrder;
      let f2ZIndex = f2.get('data')._zIndexOrder === undefined ? 0 : f2.get('data')._zIndexOrder;
      return (f1ZIndex - f2ZIndex);
    }.bind(this));
  }
  if (this.olMap) {
    this.olMap.addLayer(this.layer_);
  }
};

VectorLayer.prototype.setMap = function (map) {
  this.map = map;
  this.olMap = map.olMap;
};

VectorLayer.prototype.getLayer = function () {
  return this.layer_;
};

VectorLayer.prototype.removeLayer = function () {
  if (this.layer_) {
    this.dispatchEvent();
    this.olMap.removeLayer(this.layer_);
    this.layer_ = null;
    this.cacheData_ = [];
  }
};

VectorLayer.prototype.clear = function () {
  this.clearData_();
};

//清空数据
VectorLayer.prototype.clearData_ = function (opt_options) {
  this.dispatchEvent();
  this.map.emptySelectFeatures();
  this.layer_.getSource().clear();
  this.cacheData_ = [];
  this.clearTwinkleTimer();
};

/**
 * 触发清空事件
 */
VectorLayer.prototype.dispatchEvent = function () {
  this.olMap.dispatchEvent({
    type: 'clearVectorLayer',
    layer: this
  });
};


VectorLayer.prototype.refresh = function () {
  this.layer_.getSource().refresh();
};


VectorLayer.prototype.clearTwinkleTimer = function () {
  if (this.twinkleTimer_) {
    window.clearInterval(this.twinkleTimer_);
    this.twinkleTimer_ = null;
  }
};

//对外接口触发数据更新
VectorLayer.prototype.showData = function (opt_options) {
  this.map.emptySelectFeatures();
  let options = Object.assign({}, {
    operateType: 'replace'
  }, opt_options);
  //将图层置顶
  if (options.setToTop) {
    this.layer_.setZIndex(zIndexManage.getNextZIndex());
  }
  this.showDataInter_(options);
};


//显示数据
VectorLayer.prototype.showDataInter_ = function (opt_options) {
  this.clearTwinkleTimer();
  if (opt_options.operateType === 'replace') {
    this.clearData_();
  }
  this.cacheData_ = this.cacheData_.concat(opt_options.data);
  let len = opt_options.data.length;
  let dataList = opt_options.data;
  let features = [];
  for (let i = 0; i < len; i++) {
    let element = dataList[i];
    let feature = this.constructFeature(element);
    if (feature) {
      features.push(feature);
    }
  }
  if (features.length > 0) {
    this.layer_.getSource().addFeatures(features);
    if (opt_options.scale) {
      let extent = this.layer_.getSource().getExtent();
      this.justifyExtentZoom(extent, features);
    }
  }
  this.map.clearHoverTip();
  if (features.length > 0 && this.options.twinkle) {
    this.twinkleLayer();
  }
};

/**
 * 闪烁效果
 */
VectorLayer.prototype.twinkleLayer = function () {
  //需要闪烁
  let show = true;
  this.twinkleTimer_ = window.setInterval(function () {
    if (show) {
      if (this.onceEvent_) {
        this.onceEvent_();
        this.onceEvent_ = undefined;
      }
      this.layer_.setVisible(false);
    } else {
      this.layer_.setVisible(true);
    }
    show = !show;
  }.bind(this), this.options.twinkleInterval);
};

VectorLayer.prototype.showOnceEvent = function (f) {
  this.onceEvent_ = f;
};

VectorLayer.prototype.constructFeature = function (element) {
  let feature = null;
  let projection = this.map.getViewProjection();
  try {
    if (element.center !== undefined && element.radius !== undefined) {
      let radiusDegree = util.transformMi2Degree(parseFloat(element.radius * 11 / 10));
      feature = util.getFeatureFromCircle(element.center, radiusDegree, this.projection, projection);
    } else if (element.longitude !== undefined && element.latitude !== undefined) {
      feature = util.getFeatureFromPoint(element.longitude, element.latitude, this.projection, projection);
    } else if (element.geometry) {
      feature = util.getFeatureFromWkt(element.geometry, this.projection, projection);
    } else if (element.lineGeometry) {
      feature = util.getFeatureFromLineGeometry(element.lineGeometry, this.projection, projection);
    }
  } catch (e) {
    console.log(e);
  }
  if (!feature) {
    return null;
  }
  let properties = {
    data: element,
    name: element.name,
    rootLayer: this
  };
  if (this.options.ripper) {
    properties._ripper = true;
  }
  feature.setProperties(properties);
  feature.setId(element.id);
  return feature;
};


VectorLayer.prototype.justifyExtentZoom = function (extent, featureList) {
  if (featureList.length !== 0) {
    if (featureList.length === 1 && featureList[0].getGeometry() instanceof ol.geom.Point) {
      this.map.getView().setCenter(featureList[0].getGeometry().getLastCoordinate());
    } else {
      let maxLatitude = extent[3], maxLongitude = extent[2],
        minLatitude = extent[1], minLongitude = extent[0];
      let perLongitude = 0, perLatitude = 0;
      this.olMap.getView().fit([minLongitude, minLatitude - perLatitude,
        maxLongitude + perLongitude, maxLatitude + perLatitude], this.olMap.getSize());
    }
  }
};

VectorLayer.prototype.getAllData = function () {
  return this.cacheData_;
};

VectorLayer.prototype.singleclick = function (feature, evt) {
  if (this.singleclickFunc_) {
    let coordinate = evt.coordinate;
    let geometry = feature.getGeometry();
    if (geometry instanceof ol.geom.Point) {
      coordinate = geometry.getLastCoordinate();
    }
    this.singleclickFunc_(feature.get('data'), this.olMap.getView().getZoom(),
      util.transformPointT4326(coordinate, this.map.getViewProjection()));
  }
};

VectorLayer.prototype.dblclick = function (feature, evt) {
  if (this.dblclickFunc_) {
    let coordinate = evt.coordinate;
    let geometry = feature.getGeometry();
    if (geometry instanceof ol.geom.Point) {
      coordinate = geometry.getLastCoordinate();
    }
    this.dblclickFunc_(feature.get('data'), this.olMap.getView().getZoom(),
      util.transformPointT4326(coordinate, this.map.getViewProjection()));
  }
};

VectorLayer.prototype.hover = function (feature, evt) {
  if (this.hoverFunc_) {
    let coordinate = evt.coordinate;
    let geometry = feature.getGeometry();
    if (geometry instanceof ol.geom.Point) {
      coordinate = geometry.getLastCoordinate();
    }
    this.hoverFunc_(feature.get('data'), this.olMap.getView().getZoom(),
      util.transformPointT4326(coordinate, this.map.getViewProjection()));
  }
};

//地图样式
VectorLayer.prototype.pointStyle_ = function (feature, resolution) {
  if (!this.styleFunction_) {
    util.error('请初始化styleFunction样式函数');
    return;
  }
  let styleParams = this.styleFunction_(feature.get('data'), this.olMap.getView().getZoom(),
    this.olMap.getView().getResolution(),
    util.transformPointT4326(feature.getGeometry().getLastCoordinate(), this.map.getViewProjection()));
  return defaultStyle.getStyleByType(styleParams, this.map, feature, resolution);
};

//选中样式
VectorLayer.prototype.hoverSelectStyle_ = function (feature, resolution) {
  if (this.selectStyleFunction_) {
    let selectStyleParams = this.selectStyleFunction_(feature.get('data'),
      this.olMap.getView().getZoom(), this.olMap.getView().getResolution(),
      util.transformPointT4326(feature.getGeometry().getLastCoordinate(), this.map.getViewProjection()));
    return defaultStyle.getStyleByType(selectStyleParams, this.map, feature, resolution);
  } else {
    return this.pointStyle_(feature, resolution);
  }
};

VectorLayer.prototype.getItemDataById = function (id) {
  if (id === undefined || id === '') {
    return;
  }
  let feature = this.layer_.getSource().getFeatureById(id);
  if (feature) {
    return feature.get('data');
  } else {
    return undefined;
  }
};


VectorLayer.prototype.setFocusById = function (id) {
  if (id === undefined || id === '') {
    return;
  }
  let feature = this.layer_.getSource().getFeatureById(id);
  if (feature) {
    if(this.options.useOrderStrategy){
      feature.get('data')._zIndexOrder = this._zIndex++;
      this.layer_.getSource() && this.layer_.getSource().refresh();
    }
    this.map.setSelectedFeature(feature);
  }
};


VectorLayer.prototype.setZIndex = function (zIndex) {
  this.layer_.setZIndex(parseInt(zIndex));
};

VectorLayer.prototype.getZIndex = function (zIndex) {
  this.layer_.getZIndex();
};

VectorLayer.prototype.restoreZIndex = function () {
  this.layer_.setZIndex(this.options.zIndex);
};

VectorLayer.prototype.getDefaultOptions = function () {
  return {
    twinkle: false,
    twinkleInterval: 1000,
    projection: '4326',
    zIndex: 0,
    ripper: false
  }
};

export default VectorLayer;
