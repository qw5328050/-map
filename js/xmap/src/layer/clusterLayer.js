/**
 * 聚集处理类
 * Created by fp on 2018/3/9.
 */
import ol from '../../ol_extend'
import VectorLayer from './vectorLayer'
import util from '../util/util';
import defaultStyle from '../style/defaultStyle'

const ClusterLayer = function (opt_options) {
  this.options = Object.assign({}, this.getDefaultOptions(), opt_options);
  this.map = this.options.map;
  this.olMap = this.options.map.olMap;
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
  this.showSingleZoom = this.options.showSingleZoom;
  this.layer_ = null;
  this.source = null;
  this.initLayers();
};
ol.inherits(ClusterLayer, VectorLayer);


ClusterLayer.prototype.initStyle_ = function () {
  if (this.options.styleFunction) {
    this.styleFunction_ = this.options.styleFunction;
  } else {
  }
  if (this.options.selectStyleFunction) {
    this.selectStyleFunction_ = this.options.selectStyleFunction;
  } else {
    this.selectStyleFunction_ = this.styleFunction_;
  }
};

ClusterLayer.prototype.initLayers = function () {
  this.source = new ol.source.Vector();
  if (this.olMap.getView().getZoom() >= this.showSingleZoom) {
    this.initSingleLayers();
  } else {
    this.initClusterLayers();
  }
  //处理图层级别缩放时需要控制的
  ol.events.listen(this.olMap.getView(), 'change:resolution', this.changeResolution, this);
  // this.olMap.getView().on('change:resolution', this.changeResolution, this);
};


ClusterLayer.prototype.changeResolution = function (evt) {
  this.map.clearSelectedFeature();
  var nowZoom = this.olMap.getView().getZoom();
  var oldZoom = this.olMap.getView().getZoomForResolution(evt.oldValue);
  if (nowZoom < oldZoom && nowZoom < this.showSingleZoom && oldZoom >= this.showSingleZoom) {
    this.initClusterLayers();
  } else if (nowZoom > oldZoom && nowZoom >= this.showSingleZoom && oldZoom < this.showSingleZoom) {
    this.initSingleLayers();
  }
}


ClusterLayer.prototype.removeLayer = function () {
  if (this.layer_) {
    ol.events.unlisten(this.olMap.getView(), 'change:resolution', this.changeResolution, this);
    // this.olMap.getView().un('change:resolution', this.changeResolution, this);
    this.olMap.removeLayer(this.layer_);
    this.layer_ = null;
  }
};

ClusterLayer.prototype.clear = function () {
  this.clearData_();
};

//清空数据
ClusterLayer.prototype.clearData_ = function (opt_options) {
  this.map.emptySelectFeatures();
  this.source.clear();
};


ClusterLayer.prototype.refresh = function () {
  this.source.refresh();
};

//对外接口触发数据更新
ClusterLayer.prototype.showData = function (opt_options) {
  this.map.emptySelectFeatures();
  var options = Object.assign({}, {
    operateType: 'replace'
  }, opt_options);
  this.showDataInter_(options);
};


//显示数据
ClusterLayer.prototype.showDataInter_ = function (opt_options) {
  if (opt_options.operateType === 'replace') {
    this.clearData_();
  }
  var len = opt_options.data.length;
  var dataList = opt_options.data;
  var features = [];
  for (var i = 0; i < len; i++) {
    var element = dataList[i];
    var feature = this.constructFeature(element);
    if (feature) {
      features.push(feature);
    }
  }
  if (features.length > 0) {
    this.source.addFeatures(features);
  }
};

ClusterLayer.prototype.constructFeature = function (element) {
  let feature = null;
  let projection = this.map.getViewProjection();
  try{
    if (element.longitude !== undefined && element.latitude !== undefined) {
      feature = util.getFeatureFromPoint(element.longitude, element.latitude, this.projection, projection);
    } else if(element.geometry){
      feature = util.getFeatureFromWkt(element.geometry, this.projection, projection);
    }
    if (!feature) {
      return null;
    }
  }catch(e){
    console.log(e);
  }
  feature.setProperties({
    data: element,
    name: element.name,
    rootLayer: this
  });
  feature.setId(element.id);
  return feature;
};

ClusterLayer.prototype.fitExtent = function (featureList) {
  var pointsList = [];
  featureList.forEach(function (item) {
    pointsList.push(item.getGeometry().getLastCoordinate());
  });
  util.fitExtent(this.olMap, pointsList, this.maxExtent_);
};


ClusterLayer.prototype.singleclick = function (feature, evt) {
  if (this.singleclickFunc_) {
    var itemDatas = this.getItemDatas(feature);
    var coordinate = evt.coordinate;
    var geometry = feature.getGeometry();
    if (geometry instanceof ol.geom.Point) {
      coordinate = geometry.getLastCoordinate();
    }
    this.singleclickFunc_(itemDatas.length, itemDatas, this.olMap.getView().getZoom(),
      util.transformPointT4326(coordinate, this.map.getViewProjection()));
  }
};

ClusterLayer.prototype.dblclick = function (feature, evt) {
  if (this.dblclickFunc_) {
    var itemDatas = this.getItemDatas(feature);
    var coordinate = evt.coordinate;
    var geometry = feature.getGeometry();
    if (geometry instanceof ol.geom.Point) {
      coordinate = geometry.getLastCoordinate();
    }
    this.dblclickFunc_(itemDatas.length, itemDatas, this.olMap.getView().getZoom(),
      util.transformPointT4326(coordinate, this.map.getViewProjection()));
  }
};

ClusterLayer.prototype.hover = function (feature, evt) {
  if (this.hoverFunc_) {
    var itemDatas = this.getItemDatas(feature);
    var coordinate = evt.coordinate;
    var geometry = feature.getGeometry();
    if (geometry instanceof ol.geom.Point) {
      coordinate = geometry.getLastCoordinate();
    }
    this.hoverFunc_(itemDatas.length, itemDatas, this.olMap.getView().getZoom(),
      util.transformPointT4326(coordinate, this.map.getViewProjection()));
  }
};

ClusterLayer.prototype.initSingleLayers = function () {
  if (this.layer_) {
    this.layer_.setVisible(true);
    this.olMap.removeLayer(this.layer_);
  }
  this.layer_ = new ol.layer.Vector({
    source: this.source,
    style: this.pointStyle_.bind(this)
  });
  this.layer_.setProperties({
    xmapLayer: this
  });
  this.olMap.addLayer(this.layer_);
};

ClusterLayer.prototype.initClusterLayers = function () {
  if (this.layer_) {
    this.layer_.setVisible(true);
    this.olMap.removeLayer(this.layer_);
  }
  var clusterSource = new ol.source.Cluster({
    distance: this.options.distance,
    source: this.source
  });
  /* if (this.options.animate) {
   this.layer_ = new ol.layer.AnimatedCluster(
   {
   name: 'Cluster',
   source: clusterSource,
   animationDuration: 700,
   style: this.pointStyle_.bind(this)
   });
   } else {*/
  this.layer_ = new ol.layer.Vector(
    {
      name: 'Cluster',
      source: clusterSource,
      style: this.pointStyle_.bind(this)
    });
  // }

  this.olMap.addLayer(this.layer_);
  this.layer_.setProperties({
    xmapLayer: this
  });
  clusterSource.on('addfeature', function (evt) {
    var feature = evt.feature;
    var name = '';
    if (feature.get('features').length === 1) {
      name = feature.get('features')[0].get('name');
    }
    feature.setProperties({
      name: name,
      rootLayer: this
    });
  }.bind(this));
};

ClusterLayer.prototype.getItemDatas = function (feature) {
  var itemDatas = [];
  if (feature.get('features')) {
    feature.get('features').forEach(function (item) {
      itemDatas.push(item.get('data'));
    });
  } else {
    itemDatas.push(feature.get('data'));
  }
  return itemDatas
};

ClusterLayer.prototype.pointStyle_ = function (feature, resolution) {
  var size = 1;
  if (feature.get('features')) {
    size = feature.get('features').length;
  }
  var itemDatas = this.getItemDatas(feature);
  if (!this.styleFunction_) {
    util.error('请初始化styleFunction样式函数');
    return;
  }
  var styleParams = this.styleFunction_(size, itemDatas, this.olMap.getView().getZoom(),
    resolution, util.transformPointT4326(feature.getGeometry().getLastCoordinate(),
      this.map.getViewProjection()));
  return defaultStyle.getStyleByType(styleParams);
};

//选中样式
ClusterLayer.prototype.hoverSelectStyle_ = function (feature, resolution) {
  if (this.selectStyleFunction_) {
    var size = 1;
    if (feature.get('features')) {
      size = feature.get('features').length;
    }
    var itemDatas = this.getItemDatas(feature);
    var styleParams = this.selectStyleFunction_(size, itemDatas, this.olMap.getView().getZoom(),
      resolution, util.transformPointT4326(feature.getGeometry().getLastCoordinate(),
        this.map.getViewProjection()));
    return defaultStyle.getStyleByType(styleParams);
  } else {
    return this.pointStyle_(feature, resolution);
  }
};

/*ClusterLayer.prototype.clusterStyle_ = function (feature, resolution) {
 var styleParams = this.clusterStyleFunction_(feature.get('features').length, this.olMap.getView().getZoom(),
 this.olMap.getView().getResolution(),
 util.transformPointT4326(feature.getGeometry().getLastCoordinate(), this.map.getViewProjection()));
 return defaultStyle.getStyleByType(styleParams);
 };

 ClusterLayer.prototype.hoverSelectClusterStyle_ = function (feature, resolution) {
 var styleParams = this.selectClusterStyleFunction_(feature.get('features').length, this.olMap.getView().getZoom(),
 resolution,
 util.transformPointT4326(feature.getGeometry().getLastCoordinate(), this.map.getViewProjection()));
 return defaultStyle.getStyleByType(styleParams);
 };*/


ClusterLayer.prototype.getDefaultOptions = function () {
  return {
    projection: '4326',
    showSingleZoom: 14,
    animate: false,
    distance: 180,
    styleFunction: function (size, itemDatas, resolution) {
      if (size === 1) {
        return {
          styleType: 'circle',
          radius: 8,
          strokeWeight: 2,
          strokeColor: [255, 255, 255, 1],
          fillColor: [0, 153, 255, 1]
        }
      } else {
        var color = size > 25 ? "192,0,0" : size > 8 ? "255,128,0" : "0,128,0";
        var radius = Math.max(12, Math.min(size * 1.5, 20));
        return [{
          styleType: 'circle',
          strokeColor: "rgba(" + color + ",0.4)",
          strokeWeight: 15,
          radius: radius,
          fillColor: "rgba(" + color + ",1)"
        },
          {
            styleType: 'text',
            text: size.toString(),
            font: '500 14px 微软雅黑',
            fillColor: '#fff'
          }];
      }
    }
  }
};
export default ClusterLayer
