/**
 * Created by fp on 2017/11/9.
 * 加载ArcGisRest图层
 */
import ol from '../../ol_extend'
import TileLayer from './tileLayer'
const TileArcGISRestLayer = function (opt_options) {
  TileLayer.call(this, opt_options);
  this.map = this.options.map;
  this.initLayer_();
  if (this.map && this.map.olMap) {
    this.map.olMap.addLayer(this.getLayer());
  }
};
ol.inherits(TileArcGISRestLayer, TileLayer);


TileArcGISRestLayer.prototype.initLayer_ = function () {
  this.layer_ = new ol.layer.Tile({
    source: new ol.source.TileArcGISRest({
      url: this.options.url,
      crossOrigin: this.options.crossOrigin
    })
  });
  //加入load函数，为了防止缓存
  this.setTileLoadFunction(this.layer_);
};

TileArcGISRestLayer.prototype.getDefaultOptions = function () {
  return {
    version: '1.3.0',
    width: 256,
    height: 256,
    //是否每次都重新获取图片
    autoRefresh: false,
    crossOrigin: 'anonymous',
    //刷新的构造函数
    refreshParamsFun: function () {
      return Math.random();
    }
  };
};

export default TileArcGISRestLayer;

