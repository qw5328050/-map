/**
 * Created by fp on 2017/11/9.
 * WMTS格式的数据
 */
import ol from '../../ol_extend'
import TileLayer from './tileLayer'
const TileWMTSLayer = function (opt_options) {
  TileLayer.call(this, opt_options);
  this.map = this.options.map;
  this.initLayer_();
  if (this.map) {
    this.map.olMap.addLayer(this.getLayer());
  }
};
ol.inherits(TileWMTSLayer, TileLayer);

TileWMTSLayer.prototype.initLayer_ = function () {
  let zMax = 19;
  let projection = ol.proj.get("EPSG:4326");
  let projectionExtent = [-180, -90, 180, 90];
  let resolutions = new Array(zMax);
  let matrixIds = new Array(zMax);
  let maxResolutionStr = (ol.extent.getWidth(projectionExtent) / (256));
  for (let z = 0; z < zMax; ++z) {
    resolutions[z] = maxResolutionStr / Math.pow(2, z);
    matrixIds[z] = z;
  }
  this.layer_ = new ol.layer.Tile({
    source: new ol.source.WMTS({
      url: this.options.url,
      crossOrigin: this.options.crossOrigin,
      layer: this.options.layer,
      matrixSet: this.options.matrixSet,
      format: this.options.format,
      projection: projection,
      tileGrid: new ol.tilegrid.WMTS({
        origin: ol.extent.getTopLeft(projectionExtent),
        resolutions: resolutions,
        matrixIds: matrixIds
      }),
      style: 'default',
      wrapX: false
    })
  });
  if (this.options.filter) {
    let filter = xmap.util.getFilterFromWKT(this.options.filter, this.map.getViewProjection());
    this.layer_.addFilter(filter);
  }
  //加入load函数，为了防止缓存
  this.setTileLoadFunction(this.layer_);
};

TileWMTSLayer.prototype.getDefaultOptions = function () {
  return {
    version: '1.3.0',
    width: 256,
    height: 256,
    //是否每次都重新获取图片
    autoRefresh: false,
    crossOrigin: undefined,
    matrixSet: 'EPSG:4326',
    format: 'tiles',
    //刷新的构造函数
    refreshParamsFun: function () {
      return Math.random();
    }
  };
};

export default TileWMTSLayer;
