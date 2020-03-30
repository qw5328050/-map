/**
 * 天地图地图
 * vec_c cva_c
 * @param opt_options
 * @constructor
 */
import ol from '../../ol_extend'
import TileLayer from './tileLayer'
const TdtLayer = function (opt_options) {
  TileLayer.call(this, opt_options);
  this.initLayer_();
};
ol.inherits(TdtLayer, TileLayer);

TdtLayer.prototype.initLayer_ = function () {
  let projection = ol.proj.get('EPSG:4326');
  let projectionExtent = [-180, -90, 180, 90];
  let maxResolutionStr = (ol.extent.getWidth(projectionExtent) / (256 * 2));
  let resolutions = new Array(16);
  for (let z = 0; z < 16; ++z) {
    resolutions[z] = maxResolutionStr / Math.pow(2, z);
  }
  let url = this.options.url + '?T=' + this.options.layerId + '&X={x}&Y={y}&L={z}';
  let tileOrigin = ol.extent.getTopLeft(projectionExtent);
  this.layer_ = new ol.layer.Tile({
    extent: [-180, -90, 180, 90],
    source: new ol.source.TileImage({
      tileUrlFunction: function (tileCoord) {
        let z = tileCoord[0] + 1;
        let x = tileCoord[1];
        let y = -tileCoord[2] - 1;
        let n = Math.pow(2, z + 1);
        x = x % n;
        if (x * n < 0) {
          x = x + n;
        }
        return url.replace('{z}', z.toString()).replace('{y}', y.toString()).replace('{x}', x.toString());
      },
      projection: projection,
      tileGrid: new ol.tilegrid.TileGrid({origin: tileOrigin, resolutions: resolutions, tileSize: 256})
    }),
  });
};


TdtLayer.prototype.getDefaultOptions = function () {
  return {
    url: 'http://t0.tianditu.com/DataServer',
    layerId: 'vec_c'
  };
};

TdtLayer.prototype.removeLayer = function(){
  if (this.layer_) {
    this.map.olMap.removeLayer(this.layer_);
    this.layer_ = null;
  }
};

export default TdtLayer;
