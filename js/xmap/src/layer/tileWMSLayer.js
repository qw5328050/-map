/**
 * Created by fp on 2017/11/9.
 * TileWMS格式的数据
 */
import ol from '../../ol_extend'
import TileLayer from './tileLayer'
import util from '../util/util'
const TileWMSLayer = function (opt_options) {
    TileLayer.call(this, opt_options);
    this.map = this.options.map;
    this.initLayer_();
    if (this.map && this.map.olMap) {
        this.map.olMap.addLayer(this.getLayer());
    }
};
ol.inherits(TileWMSLayer, TileLayer);

TileWMSLayer.prototype.initLayer_ = function () {
    this.layer_ = new ol.layer.Tile({
        source: new ol.source.TileWMS({
            url: this.options.url,
            crossOrigin: this.options.crossOrigin,
            params: {
                'LAYERS': this.options.layer, 'TILED': true,
                "WIDTH": this.options.width, "HEIGHT": this.options.height, "dpi": 96,
                "version": "1.3.0", styles: this.options.styles ? this.options.styles : ''
            }
        })
    });
    //加入load函数，为了防止缓存
    this.setTileLoadFunction(this.layer_);
    if (this.options.zIndex !== undefined) {
        this.layer_.setZIndex(this.options.zIndex);
    }
    //过滤
    if (this.options.filter) {
        var filter = util.getFilterFromWKT(this.options.filter, this.map.getViewProjection());
        this.layer_.addFilter(filter);
    }
};


TileWMSLayer.prototype.removeLayer = function () {
    if (this.layer_) {
        this.map.olMap.removeLayer(this.layer_);
        this.layer_ = null;
    }
};

TileWMSLayer.prototype.onSingleClick = function (callbackFun) {
    var self = this;
    this.map.addSingleClickEvent({
        singleclick: function (evt) {
            var urlParams = self.getGetFeatureInfoUrl(evt);
            util.ajax({
            },function(features){

            });
        }
    });
};


TileWMSLayer.prototype.getGetFeatureInfoUrl = function (coordinate) {
    var viewResolution = this.map.olMap.getView().getResolution();
    return this.layer_.getSource().getGetFeatureInfoUrl(
        coordinate, viewResolution, 'EPSG:4326',
        {
            'INFO_FORMAT': 'text/javascript',
            'FEATURE_COUNT': 1
        });
};


TileWMSLayer.prototype.getDefaultOptions = function () {
    return {
        version: '1.3.0',
        width: 256,
        height: 256,
        //是否每次都重新获取图片
        autoRefresh: false,
        crossOrigin: undefined,
        //刷新的构造函数
        refreshParamsFun: function () {
            return Math.random();
        }
    };
};
export default TileWMSLayer;
