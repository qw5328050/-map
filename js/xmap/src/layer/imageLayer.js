/**
 * Created by fp on 2018/1/11.
 */
import ol from '../../ol_extend'
import Layer from './layer'
import util from '../util/util'
const ImageLayer = function(opt_options){
    Layer.call(this, opt_options);
    this.map = this.options.map;
    this.initLayer_();
    if (this.map && this.map.olMap) {
        this.map.olMap.addLayer(this.getLayer());
    }
};
ol.inherits(ImageLayer, Layer);

ImageLayer.prototype.initLayer_ = function(){
    this.layer_ = new ol.layer.Image({});
    if(this.options.zIndex){
        this.layer_.setZIndex(this.options.zIndex);
    }
    if(this.options.opacity){
    	this.layer_.setOpacity(this.options.opacity);
    }
    if(this.options.filter){
        let filter = util.getFilterFromWKT(this.options.filter, this.map.getViewProjection());
        this.layer_.addFilter(filter);
    }
    if(this.options.url){
        let source = new ol.source.ImageStatic({
            url: this.options.url,
            imageExtent: this.options.extent
        });
        this.layer_.setSource(source);
    }
};

ImageLayer.prototype.showData = function(opt_options){
    if(!this.getLayer()){
        this.initLayer_();
        if (this.map && this.map.olMap) {
            this.map.olMap.addLayer(this.getLayer());
        }
    }
    if(opt_options.url){
        let source = new ol.source.ImageStatic({
            url: opt_options.url,
            imageExtent: this.options.extent
        });
        this.layer_.setSource(source);
    }
};

ImageLayer.prototype.clear = function(){
    this.removeLayer();
};

ImageLayer.prototype.removeLayer = function(){
    this.getLayer()&&this.map.olMap.removeLayer(this.getLayer());
    this.layer_ = null;
};


ImageLayer.prototype.initFilter_ = function () {
    let format = new ol.format.WKT();
    let boundFeature = format.readFeature(this.options.filterGeometry);
    return new ol.filter.Crop({
        feature: boundFeature,
        inner: false
    });
};

export default ImageLayer;
