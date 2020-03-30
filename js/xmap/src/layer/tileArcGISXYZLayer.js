/**
 * Created by fp on 2017/11/9.
 * 加载ArcGisXYZ图层
 */
import ol from '../../ol_extend'
import TileLayer from './tileLayer'
const TileArcGISXYZLayer = function (opt_options) {
  TileLayer.call(this, opt_options);
  this.options = Object.assign({}, this.getDefaultOptions(opt_options.projection), opt_options);
  this.map = this.options.map;
  this.initLayer_();
  if (this.map && this.map.olMap) {
    this.map.olMap.addLayer(this.getLayer());
  }
};
ol.inherits(TileArcGISXYZLayer, TileLayer);


TileArcGISXYZLayer.prototype.initLayer_ = function () {
  let projection = ol.proj.get('EPSG:' + this.options.projection);
  let tileGrid = new ol.tilegrid.TileGrid({
    // extent: this.options.extent,
    tileSize: this.options.tileSize,
    origin: this.options.origin,
    resolutions: this.options.resolutions
  });
  let tileArcGISXYZ = new ol.source.XYZ({
    tileGrid: tileGrid,
    projection: projection,
    url: this.options.url,
    crossOrigin: this.options.crossOrigin
  });
  this.layer_ = new ol.layer.Tile({
    source: tileArcGISXYZ
  });
  //加入load函数，为了防止缓存
  this.setTileLoadFunction(this.layer_);
};


TileArcGISXYZLayer.prototype.getDefaultOptions = function (projection) {
  let resolutions = [];
  if (!projection || parseInt(projection) === 4326) {
    for (let i = 0; i < 24; i++) {
      resolutions.push(0.3515625 / Math.pow(2, i));
    }
    return {
      tileSize: [256, 256],
      projection: '4326',
      origin: [-180, 90],
      resolutions: resolutions,
      //是否每次都重新获取图片
      autoRefresh: false,
      crossOrigin: undefined,
      //刷新的构造函数
      refreshParamsFun: function () {
        return Math.random();
      }
    };
  } else {
    for (let j = 0; j < 24; j++) {
      resolutions.push(156543.03392800014 / Math.pow(2, j));
    }
    return {
      tileSize: 256,
      projection: '3857',
      origin: [-2.0037508342787E7, 2.0037508342787E7],
      //是否每次都重新获取图片
      autoRefresh: false,
      crossOrigin: undefined,
      resolutions: resolutions,
      //刷新的构造函数
      refreshParamsFun: function () {
        return Math.random();
      }
    };
  }
};
export default TileArcGISXYZLayer;
