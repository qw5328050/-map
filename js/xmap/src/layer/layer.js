/**
 * Created by fp on 2017/11/9.
 */
import ol from '../../ol_extend'
const Layer = function (opt_options) {
    this.layer_ = null;
    this.options = Object.assign({}, this.getDefaultOptions(), opt_options);
};
ol.inherits(Layer, ol.Object);


Layer.prototype.getLayer =function(){
    return this.layer_;
};

Layer.prototype.setMap = function (map) {
  this.map = map;
  this.olMap = map.olMap;
};





//刷新图层
Layer.prototype.refresh = function () {
    this.layer_.getSource().refresh();
};

Layer.prototype.getDefaultOptions = function(){
  return {}
};

export default Layer;
