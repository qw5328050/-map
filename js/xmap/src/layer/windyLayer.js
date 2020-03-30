/**
 * Created by yqs on 2018/10/27.
 */
import ol from '../../ol_extend'
import Layer from './layer'
import util from '../util/util'
import Windy from './windy'

/**
 * 风场图层类
 * @constructor
 */
const WindyLayer = function (opt_options) {
  Layer.call(this, opt_options);
  this.map = this.options.map;
  this.projection = this.options.hasOwnProperty('projection') ? this.options.projection : 'EPSG:3857';
  this.initLayer_();
  this.canvas = null;                     //Canvas对象
  this.windy = null;                       //Windy对象
  this.isClear = false;                   //是否清除
  if (this.map && this.map.olMap) {
    this.map.olMap.addLayer(this.getLayer());
  }
};
ol.inherits(WindyLayer, Layer);

WindyLayer.prototype.initLayer_ = function () {
  this.layer_ = new ol.layer.Image({});
  if (this.options.zIndex) {
    this.layer_.setZIndex(this.options.zIndex);
  }
  if (this.options.opacity) {
    this.layer_.setOpacity(this.options.opacity);
  }
  if (this.options.filter) {
    let filter = util.getFilterFromWKT(this.options.filter, this.projection);
    this.layer_.addFilter(filter);
  }
  if(this.options.filterCenter){
    let filter = util.getFilterFromRadiusMeter(this.options.filterCenter, this.options.filterRadius);
    this.layer_.addFilter(filter);
  }
  let source = new ol.source.ImageCanvas({
    logo: this.options.logo,
    state: this.options.state,
    attributions: this.options.attributions,
    resolutions: this.options.resolutions,
    canvasFunction: this.canvasFunction.bind(this),
    projection: this.projection,
    ratio: this.options.hasOwnProperty('ratio') ? this.options.ratio : 1
  })
  this.layer_.setSource(source);
  this.layer_.on('precompose', this.predraw, this);      //准备渲染，未开始渲染
  this.layer_.on('postcompose', this.postdraw, this);    //地图渲染中
  this.layer_.on('postrender', this.postrender, this);   //渲染全部完成
  this.layer_.root = this
};

/**
 * 获取数据
 */
WindyLayer.prototype.getData = function () {
  return this.options.data;
};

/**
 * 设置数据
 */
WindyLayer.prototype.showData = function (opt_options) {
  if (!this.getLayer()) {
    this.initLayer_();
    if (this.map && this.map.olMap) {
      this.map.olMap.addLayer(this.getLayer());
    }
  }
  if (this.map && this.map.olMap) {
    this.options.data = opt_options.data;
    this.isClear = false;
    if (!this.windy && this.canvas) {     //如果Canvas对象存在, Windy对象未存在
      this.render(this.canvas);
      this.map.olMap.renderSync();
    } else if (this.windy && this.canvas) {     //如果Canvas对象存在, Windy对象存在
      if (this.cloneLayer) {
        this.map.olMap.addLayer(this.cloneLayer.getLayer());
        delete this.cloneLayer;
      }
      let extent = this._getExtent();          //获取地图范围
      this.windy.update(this.getData(), extent[0], extent[1], extent[2], extent[3]);      //更新动画
    } else {
      console.warn('please create new instance');
    }
  }
};

/**
 * 获取地理范围
 * @private
 */
WindyLayer.prototype._getExtent = function () {
  let size = this._getMapSize();
  let mapExtent = this._getMapExtent();
  if (size && mapExtent) {
    let extent = ol.proj.transformExtent(mapExtent, this.projection, 'EPSG:4326');
    return [
      [
        [0, 0],
        [size[0], size[1]]
      ],
      size[0],
      size[1],
      [
        [extent[0], extent[1]],
        [extent[2], extent[3]]
      ]
    ];
  } else {
    return false;
  }
};

/**
 * 获取地图范围
 * @private
 */
WindyLayer.prototype._getMapExtent = function () {
  let extent = [];
  if (this.map && this.map.olMap) {
    let size = this._getMapSize();
    let view = this.map.olMap.getView();
    extent = view && view.calculateExtent(size);
  }
  return extent;
};

/**
 * 获取地图尺寸
 * @private
 */
WindyLayer.prototype._getMapSize = function () {
  let size = [];
  if (this.map && this.map.olMap) {
    size = this.map.olMap.getSize();
  }
  return size;
};

/**
 * 添加到地图
 * @param map
 */
WindyLayer.prototype.appendTo = function () {
  if (this.map && this.map.olMap) {
    this.map.olMap.addLayer(this.getLayer());
  }
};

/**
 * 渲染
 * @param canvas
 */
WindyLayer.prototype.render = function(canvas) {
  let extent = this._getExtent();
  if (this.isClear || !this.getData() || !extent) {       //
    return this;
  }
  if (!this.windy) {        //this.windy为空
    //实例化Windy对象
    this.windy = new Windy({
      canvas: canvas,                             //画布
      projection: this.projection,     //投影
      data: this.getData()                        //数据
    });
  }
  if (canvas) {     //canvas不为空
    this.windy.start(extent[0], extent[1], extent[2], extent[3]);       //开启动画
  }
  return this;
};

/**
 * 重新绘制
 * @param event
 */
WindyLayer.prototype.predraw = function (event) {
  let that = this.root
  if (that.isClear) {
    return;
  }
  let extent = that._getMapExtent();
  this.setExtent(extent);                       //设置范围
};

/**
 *
 * @param event
 */
WindyLayer.prototype.postdraw = function (event) {

}

/**
 *
 */
WindyLayer.prototype.postrender = function (event) {


};

/**
 * 创建canvas
 * @param width
 * @param height
 * @param Canvas
 */
WindyLayer.prototype.createCanvas = function (width, height, Canvas) {
  if (typeof document !== "undefined") {
    let canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    return canvas;
  } else {
    return new Canvas(width, height);
  }
};

/**
 * canvas方法
 * @param extent
 * @param resolution
 * @param pixelRatio
 * @param size
 * @param projection
 */
WindyLayer.prototype.canvasFunction = function (extent, resolution, pixelRatio, size, projection) {
  if (!this.canvas) {
    this.canvas = this.createCanvas(size[0], size[1]);      //创建Canvas
  } else {
    this.canvas.width = size[0];
    this.canvas.height = size[1];
  }
  if (resolution <= this.getLayer().get("maxResolution")) {
    this.render(this.canvas);               //渲染风场
  } else {

  }
  return this.canvas;
};

/**
 * 清除风场
 */
WindyLayer.prototype.clearWindy = function () {
  if (this.map && this.map.olMap) {
    //如果this.windy不为空, 则停止动画
    if (this.windy) {
      this.windy.stop();
    }
    this.isClear = true;
    this.cloneLayer = this;
    this.map.olMap.removeLayer(this.getLayer());
    this.map.olMap.renderSync();          //异步渲染
  }
};

/**
 * 移除图层
 */
WindyLayer.prototype.removeLayer = function () {
  if (this.map && this.map.olMap) {
    if (this.windy) {
      this.windy.stop();
    }
    this.isClear = true;
    this.map.olMap.renderSync();          //异步渲染
    this.un("precompose", this.predraw, this);      //准备渲染，未开始渲染
    this.un('postcompose', this.postdraw, this);    //地图渲染中
    this.un('postrender', this.postrender, this);   //渲染全部完成
    this.map.olMap.removeLayer(this.getLayer());
    delete this.canvas;
    delete this.windy;
    delete this.cloneLayer;
  }
};

export default WindyLayer;
