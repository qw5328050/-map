/**
 * Created by fp on 2017/11/9.
 */
import ol from '../../ol_extend'
import Layer from './layer'
const TileLayer = function (opt_options) {
  Layer.call(this, opt_options);
};
ol.inherits(TileLayer, Layer);


/**
 * 为tile wms格式的数据增加
 */
TileLayer.prototype.setTileLoadFunction = function (layer) {
  let self = this;
  if (self.options.autoRefresh) {
    let refreshFun = self.options.refreshParamsFun;
    layer.getSource().setTileLoadFunction(function (imageTile, src) {
      imageTile.getImage().src = src + '&t=' + refreshFun()
    });
  }
};

export default TileLayer;





