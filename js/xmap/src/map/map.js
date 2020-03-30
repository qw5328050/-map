/**
 * Created by fp on 2017/11/9.
 */
import ol from '../../ol_extend';
import DrawInteraction from '../interaction/drawInteraction';
import Measure from '../control/measure';
import Navigation from '../control/navigation';
import VectorLayer from '../layer/vectorLayer';
import TdtLayer from '../layer/tdtLayer';
import TileWMSLayer from '../layer/tileWMSLayer';
import TileWMTSLayer from '../layer/tileWMTSLayer';
import TileArcGISRestLayer from '../layer/tileArcGISRestLayer';
import TileArcGISXYZLayer from '../layer/tileArcGISXYZLayer';
import ImageLayer from '../layer/imageLayer';
import RipperUtil from '../util/ripperUtil';
import util from '../util/util';
const xmap = {};

xmap.DrawInteraction = DrawInteraction;
xmap.control = {
  Measure: Measure,
  Navigation: Navigation
};
xmap.VectorLayer = VectorLayer;
xmap.TdtLayer = TdtLayer;
xmap.TileWMSLayer = TileWMSLayer;
xmap.TileWMTSLayer = TileWMTSLayer;
xmap.TileArcGISRestLayer = TileArcGISRestLayer;
xmap.TileArcGISXYZLayer = TileArcGISXYZLayer;
xmap.ImageLayer = ImageLayer;
xmap.RipperUtil = RipperUtil;
xmap.util = util;


const Map = function (opt_options) {
  //初始化配置参数
  let options = Object.assign({}, this.getDefaultOptions(),
    opt_options ? opt_options : {});
  this.options = options;
  this.markerOverlay = null;
  this.drawInteraction = null;
  this.measureControl = null;
  this.excludeFocusLayer = [];
  this.addPromptBoxElement(options.target);
  let baseLayersOptions = opt_options.baseLayersOptions ? opt_options.baseLayersOptions : [{
    type: 'tdt'
  }];
  let proj = ol.proj.get('EPSG:' + this.options.projection);
  let baseLayers = this.getBaseLayers(baseLayersOptions);
  let viewOption = {
    projection: proj,
    center: xmap.util.transformPointProj(options.center, xmap.util.EPSG4326Obj, proj),
    zoom: options.zoom,
    minZoom: options.minZoom,
    maxZoom: options.maxZoom,
    extent: options.extent
  };
  let view = this.createView(viewOption);
  let controls = this.createControl(options.controls, baseLayers, viewOption);
  let interactions = this.createInteractions(options);
  this.olMap = this.createMap({
    layers: baseLayers,
    target: options.target,
    view: view,
    controls: controls,
    interactions: interactions
  });
  this.initAddControls();
  this.initEvent(options);
  this.hoverRipperUtil = null;
  this.clickRipperUtil = null;
  //支持ripper效果，悬停的水波纹效果
  if (options.ripper) {
    this.hoverRipperUtil = new xmap.RipperUtil({
      map: this
    });
    this.clickRipperUtil = new xmap.RipperUtil({
      map: this
    });
  }
};

Map.prototype.getBaseLayers = function (baseLayersOptions) {
  let layers = [];
  for (let i = 0; i < baseLayersOptions.length; i++) {
    let item = baseLayersOptions[i];
    let type = item.type;
    if (type.toLowerCase() === 'tdt') {
      let vec_cLayer = new xmap.TdtLayer({layerId: 'vec_c'});
      let cva_cLayer = new xmap.TdtLayer({layerId: 'cva_c'});
      layers.push(vec_cLayer.getLayer());
      layers.push(cva_cLayer.getLayer());
    } else if (type.toLowerCase() === 'tilewms') {
      let wmsLayer = new xmap.TileWMSLayer(item);
      layers.push(wmsLayer.getLayer());
    } else if (type.toLowerCase() === 'tilewmts') {
      let wmtsLayer = new xmap.TileWMTSLayer(item);
      layers.push(wmtsLayer.getLayer());
    } else if (type.toLowerCase() === 'arcgisrest') {
      let arcgisRestLayer = new xmap.TileArcGISRestLayer(item);
      layers.push(arcgisRestLayer.getLayer());
    } else if (type.toLowerCase() === 'arcgisxyz') {
      let arcgisXYZLayer = new xmap.TileArcGISXYZLayer(item);
      layers.push(arcgisXYZLayer.getLayer());
    } else if (type.toLowerCase() === 'singleimage') {
      let imagelayer = new xmap.ImageLayer(item);
      layers.push(imagelayer.getLayer());
    }
  }
  return layers;
};

//创建ol view对象
Map.prototype.createView = function (options) {
  let resolutions = this.getResolutions({
    minZoom: options.minZoom,
    maxZoom: options.maxZoom
  });
  return new ol.View({
    projection: options.projection,
    center: options.center,
    zoom: options.zoom,
    resolutions: resolutions,
    extent: options.extent
  });
};

Map.prototype.createControl = function (controls, baseLayers, viewOption) {
  let controlArr = [];
  if (controls === undefined) {
    controlArr.push(new ol.control.Zoom({
      className: 'ol-zoom',
      zoomInTipLabel: '放大',
      zoomOutTipLabel: '缩小'
    }));
    controlArr.push(new ol.control.MousePosition({
      undefinedHTML: '&nbsp;',
      projection: 'EPSG:4326',
      coordinateFormat: function (coordinate) {
        return ol.coordinate.format(coordinate, '{x}, {y}', 4);
      }
    }));
  } else {
    if (controls.navigation !== undefined) {
      let navigationControl = new xmap.control.Navigation();
      controlArr = controlArr.concat(navigationControl.getControl());
    }
    if (controls.OverviewMap !== undefined) {
      controlArr.push(//鹰眼图
        new ol.control.OverviewMap({
          layers: baseLayers,
          view: this.createView(viewOption),
          tipLabel: "缩略图",
          collapsed: false,
          collapseLabel: '\u00BB',
          label: '\u00AB'
        }));
    }
    if (controls.mousePosition !== undefined) {
      let precision = controls.mousePosition.precision ? controls.mousePosition.precision : 4
      controlArr.push(new ol.control.MousePosition({
        undefinedHTML: '&nbsp;',
        projection: 'EPSG:4326',
        coordinateFormat: function (coordinate) {
          return ol.coordinate.format(coordinate, '{x}, {y}', precision);
        }
      }));
    }
  }
  return controlArr;
};

Map.prototype.createInteractions = function (options) {
  return ol.interaction.defaults({
    doubleClickZoom: false
  });
};
/**
 * 创建地图对象
 * @param options
 */
Map.prototype.createMap = function (options) {
  return new ol.Map({
    layers: options.layers,
    renderer: 'canvas',
    target: options.target,
    view: options.view,
    controls: options.controls,
    interactions: options.interactions
  });
};

Map.prototype.initAddControls = function () {
  this.measureControl = new xmap.control.Measure({
    map: this.olMap
  });
};

/**
 * 初始化事件
 */
Map.prototype.initEvent = function (options) {
  let self = this;
  this.pointmoveSelect = new ol.interaction.Select({
    style: this.hoverSelectStyle.bind(this),
    condition: ol.events.condition.pointerMove,
    hitTolerance: this.options.hitTolerance,
    layers: function (layer) {
      if (layer.get('_type') === 'ripper') {
        return false;
      } else {
        return !xmap.util.isInLayer(layer, self.excludeFocusLayer);
      }
    }
  });
  this.olMap.addInteraction(this.pointmoveSelect);
  ol.events.listen(this.pointmoveSelect, 'select', this.showFeatureTip, this);
  if (options.ripper) {
    ol.events.listen(this.pointmoveSelect, 'select', this.hoverSelectedStyle, this);
  }

  this.singleClickSelect = new ol.interaction.Select({
    condition: ol.events.condition.singleClick,
    style: this.singleClickStyle.bind(this),
    hitTolerance: this.options.hitTolerance,
    layers: function (layer) {
      if (layer.get('_type') === 'ripper') {
        return false;
      } else {
        return !xmap.util.isInLayer(layer, self.excludeFocusLayer);
      }
    }
  });
  this.olMap.addInteraction(this.singleClickSelect);
  if (options.ripper) {
    ol.events.listen(this.singleClickSelect, 'select', this.clickSelectedStyle, this);
  }
  //监听鼠标点击地图事件
  this.addClickEventsInMap();

  this.olMap.on('startMeasure', function () {
    this.pauseHoverClickEvent();
  }.bind(this));

  this.olMap.on('endMeasure', function () {
    this.resumeHoverClickEvent();
  }.bind(this));

  let resizeTimer = null;
  window.onresize = function () {
    if (resizeTimer) {
      window.clearTimeout(resizeTimer);
    }
    resizeTimer = setTimeout(function () {
      this.updateSize();
    }.bind(self), 200);
  };
  this.olMap.getViewport().addEventListener('mouseout', function (e) {
    if (!e.currentTarget.classList.contains("ol-viewport")) {
      self.closeHoverInfoWindow();
    }
  });
};

/**
 * 悬停提示内容
 * @param targetElement
 */
Map.prototype.addPromptBoxElement = function (targetElement) {
  let mapElement = document.querySelector('#' + targetElement);
  if (!mapElement) {
    return;
  }
  let promptBoxElement = mapElement.querySelector('.promptBox');
  if (!promptBoxElement) {
    let element = document.createElement('DIV');
    element.className = 'promptBox dis_none';
    document.querySelector('#' + targetElement).appendChild(element);
  }
};

/**
 * 处理选中的样式，对于比较复杂的动画显示效果处理模式
 * @param event
 */
Map.prototype.hoverSelectedStyle = function (event) {
  if (this.hoverRipperUtil) {
    if (event.selected && event.selected.length > 0) {
      let feature = event.selected[0];
      if (feature.get('_ripper')) {//需要显示波纹
        this.hoverRipperUtil.start(feature);
      }
    } else {
      this.hoverRipperUtil.clear();
    }
  }
};

/**
 * 处理选中的样式，对于比较复杂的动画显示效果处理模式
 * @param event
 */
Map.prototype.clickSelectedStyle = function (event) {
  if (this.clickRipperUtil) {
    if (event.selected && event.selected.length > 0) {
      let feature = event.selected[0];
      if (feature.get('_ripper')) {//需要显示波纹
        this.clickRipperUtil.start(feature, feature.get('rootLayer'));
      }
    }
  }
};

Map.prototype.emptyAllRipper = function () {
  this.emptyHoverRipper();
  this.emptyClickRipper();
};

Map.prototype.emptyHoverRipper = function () {
  if (this.hoverRipperUtil) {
    this.hoverRipperUtil.clear();
  }
};

Map.prototype.emptyClickRipper = function () {
  if (this.clickRipperUtil) {
    this.clickRipperUtil.clear();
  }
};

Map.prototype.listenerChangeZoom = function (callbackFunction) {
  this.olMap.getView().on('change:resolution', function (evt) {
    let zoom = this.olMap.getView().getZoom();
    if (xmap.util.isInteger(zoom)) {
      callbackFunction(zoom);
    }
  }.bind(this));
};

Map.prototype.listenerChangeCenter = function (callbackFunction) {
  this.olMap.getView().on('change:center', function (evt) {
    let center = this.olMap.getView().getCenter();
    if (callbackFunction) {
      callbackFunction(center);
    }
  }.bind(this));
};

Map.prototype.addExcludeFocusLayer = function (layer) {
  if (!xmap.util.isInArray(layer, this.excludeFocusLayer)) {
    this.excludeFocusLayer.push(layer);
  }
};

Map.prototype.removeExcludeFocusLayer = function (layer) {
  xmap.util.removeInArray(layer, this.excludeFocusLayer);
};

Map.prototype.updateSize = function () {
  this.olMap.updateSize();
};

Map.prototype.getCenter = function () {
  let center = this.olMap.getView().getCenter();
  return xmap.util.transformPointProj(center, ol.proj.get('EPSG:' + this.options.projection), xmap.util.EPSG4326Obj);
};

Map.prototype.setCenter = function (point) {
  let flag = xmap.util.checkPosLegal(point[0], point[1]);
  if (flag) {
    let newCenter = xmap.util.transformPointProj(point, ol.proj.get('EPSG:' + this.options.projection), xmap.util.EPSG4326Obj);
    this.olMap.getView().setCenter(newCenter);
  }
};

Map.prototype.getZoom = function () {
  return this.olMap.getView().getZoom();
};

Map.prototype.setZoom = function (zoom) {
  this.olMap.getView().setZoom(parseInt(zoom));
};

Map.prototype.setMaxZIndex = function (zoom) {
  this.olMap.getView().setMaxZoom(zoom);
};


Map.prototype.setZoomAndCenter = function (zoom, center) {
  this.olMap.getView().setZoom(parseInt(zoom));
  if (xmap.util.checkPosLegal(center[0], center[1])) {
    let coordinate = xmap.util.transformPointF4326([parseFloat(center[0]), parseFloat(center[1])],
      this.olMap.getView().getProjection());
    this.olMap.getView().setCenter(coordinate);
  }
};


Map.prototype.setZoomAndCenterLeft = function (zoom, center, left) {
  this.olMap.getView().setZoom(parseInt(zoom));
  let resolution = this.olMap.getView().getResolution();
  let disX = xmap.util.transformPixel2Degree(left, resolution);
  center[0] = parseFloat(center[0]) + disX / 2;
  if (xmap.util.checkPosLegal(center[0], center[1])) {
    let coordinate = xmap.util.transformPointF4326([parseFloat(center[0]), parseFloat(center[1])],
      this.olMap.getView().getProjection());
    this.olMap.getView().setCenter(coordinate);
  }
};

Map.prototype.getResolutions = function (zoomOptions) {
  if (!this.options.resolutions) {
    let startResolution =
      ol.extent.getWidth(ol.proj.get('EPSG:' + this.options.projection).getExtent()) / 256;
    let resolutions = new Array(22);
    for (let i = 0, ii = resolutions.length; i < ii; ++i) {
      resolutions[i] = startResolution / Math.pow(2, i);
    }
    this.options.resolutions = resolutions;
  }
  return this.options.resolutions.slice(zoomOptions.minZoom, zoomOptions.maxZoom);
};

//监听单击事件
Map.prototype.listenSingleclickFn_ = function (evt) {
  if (evt.dragging) {
    return;
  }
  let selectedFeatureFlag = false;
  let arr = [];
  this.olMap.forEachFeatureAtPixel(evt.pixel, function (feature) {
    arr.push(feature);
  });
  //如果没有找到4类中的元素
  if (arr.length > 0) {
    let len = arr.length;
    for (let i = 0; i < len; i++) {
      //去除获得的第一个元素
      let feature = arr[i];
      //触发选中元素
      let rootLayer = feature.get("rootLayer");
      if (rootLayer !== undefined && rootLayer.singleclick &&
        !xmap.util.isInArray(rootLayer, this.excludeFocusLayer)) {
        rootLayer.singleclick(feature, evt);
        selectedFeatureFlag = true;
        break;
      }
    }
  }
  if (this.options.singleclick && (!selectedFeatureFlag || this.options.ignoreSelect)) {
    this.options.singleclick(xmap.util.transformPointT4326(evt.coordinate, this.getViewProjection()),
      this.olMap.getView().getZoom(), arr);
  }
};

//监听单击事件
Map.prototype.listenDblclickFn_ = function (evt) {
  if (evt.dragging) {
    return;
  }
  let arr = [];
  let self = this;
  self.olMap.forEachFeatureAtPixel(evt.pixel, function (feature) {
    arr.push(feature);
  });
  //如果没有找到4类中的元素
  if (arr.length > 0) {
    let len = arr.length;
    for (let i = 0; i < len; i++) {
      //去除获得的第一个元素
      let feature = arr[i];
      //触发选中元素
      let rootLayer = feature.get("rootLayer");
      if (rootLayer !== undefined && rootLayer.singleclick &&
        !xmap.util.isInArray(rootLayer, this.excludeFocusLayer)) {
        rootLayer.dblclick(feature, evt);
        return;
      }
    }
  }
  self.handleDblclickEvent(evt);
};


Map.prototype.handleDblclickEvent = function (mapBrowserEvent) {
  let map = mapBrowserEvent.map;
  let anchor = mapBrowserEvent.coordinate;
  let view = map.getView();
  view.animate({
    zoom: view.getZoom() + 1,
    anchor: anchor,
    duration: 250
  });
};

Map.prototype.addLayer = function (layer) {
  this.olMap.addLayer(layer.getLayer());
  layer.setMap(this);
};

Map.prototype.removeLayer = function (layer) {
  this.olMap.dispatchEvent({type: 'clearVectorLayer', layer});
  this.removeExcludeFocusLayer();
  layer.removeLayer();
};

/**
 * 清空选中的元素
 */
Map.prototype.emptySelectFeatures = function () {
  setTimeout(function () {
    //只能采用异步的方式才最靠谱
    this.pointmoveSelect.getFeatures().clear();
    this.singleClickSelect.getFeatures().clear();
    this.olMap.render();
  }.bind(this), 0);
};

/**
 * 处理弹出框
 * @param htmlContent
 * @param opt_options
 * @constructor
 */
Map.prototype.openInfoWindow = function (htmlContent, opt_options) {
  if (opt_options.isHover && this.pointmoveSelect.getFeatures().getLength() === 0) {
    //对应悬停弹框显示的内容， 在弹框时，需要确定有点位被选中
    return false;
  }
  let options = Object.assign({}, {
    offset: [0, 0],
    direction: 'top-left',
    isHover: false
  }, opt_options);
  let self = this;
  let domElement = undefined;
  if (!xmap.util.isDom(htmlContent)) {
    domElement = document.createElement('div');
    domElement.className = 'mapPopBox';
    domElement.innerHTML = htmlContent;
  } else {
    domElement = htmlContent;
  }
  self.constructorPopElement(domElement, options);
  //控制更多的缩放
  let closeElement = domElement.querySelector('.' + opt_options.closeClass);
  if (closeElement) {
    closeElement.onclick = function () {
      self.closeInfoWindow();
      return false;
    };
  }
  //鼠标进入停止pointmove select事件
  domElement.addEventListener('mouseenter', function (e) {
    this.clearHoverTip();
    this.pointmoveSelect.setActive(false);

  }.bind(this));
  //鼠标离开，运行pointmove select事件
  domElement.addEventListener('mouseleave', function (e) {
    this.pointmoveSelect.setActive(true);
    if (this.pointmoveSelect.getFeatures().getLength() === 0) {
      this.closeHoverInfoWindow();
    }
  }.bind(this));
  return domElement;
};

Map.prototype.openHoverInfoWindow = function (htmlContent, opt_options) {
  opt_options.isHover = true;
  return this.openInfoWindow(htmlContent, opt_options);
};


Map.prototype.closeInfoWindow = function () {
  this.closeMarkerOverlay_();
  this.pointmoveSelect.setActive(true);
};


Map.prototype.getDefaultOptions = function () {
  return {
    projection: '4326',
    minZoom: 0,
    maxZoom: 19,
    hitTolerance: 0,
    ignoreSelect: true
  }
};

Map.prototype.constructorPopElement = function (domElement, options) {
  this.closeInfoWindow();
  //创建图层
  this.markerOverlay = new ol.Overlay(({
    element: domElement,
    offset: options.offset,
    positioning: options.direction
  }));
  this.markerOverlay.setProperties({
    isHover: options.isHover
  });
  let mapProj = this.getViewProjection();
  this.markerOverlay.setPosition(xmap.util.transformPointF4326(options.position, mapProj));
  this.olMap.addOverlay(this.markerOverlay);
};


Map.prototype.closeMarkerOverlay_ = function () {
  if (this.markerOverlay) {
    this.olMap.removeOverlay(this.markerOverlay);
    this.markerOverlay = null;
  }
};

//
Map.prototype.showFeatureTip = function (event) {
  let selectedFeatures = event.selected;
  //修改鼠标样式
  if (selectedFeatures.length > 0) {
    let features = selectedFeatures[0];
    if (features.get('name') !== undefined && features.get('name') !== '') {
      window.document.body.style.cursor = 'pointer';
    }
  } else {
    window.document.body.style.cursor = 'default';
  }
  //如果存在tip样式，显示出来
  let mapElement = this.olMap.getTargetElement();
  if (mapElement) {
    let tooltipEle = mapElement.querySelector('.promptBox');
    if (tooltipEle) {
      if (selectedFeatures.length > 0) {
        let selectedFeature = selectedFeatures[0];
        if (!this.existHoverEvent(selectedFeature)) {
          let name = selectedFeature.get('name');
          if (!xmap.util.isEmpty(name)) {
            tooltipEle.innerText = name;
            let position = this.olMap.getPixelFromCoordinate(event.mapBrowserEvent.coordinate);
            let size = this.olMap.getSize();
            let bottom = size[1] - position[1];
            let right = size[0] - position[0];
            if (bottom < tooltipEle.offsetHeight + 70) {
              tooltipEle.style.top = 'inherit';
              tooltipEle.style.bottom = bottom + 30 + 'px';
            } else {
              tooltipEle.style.bottom = 'inherit';
              tooltipEle.style.top = position[1] + 30 + 'px';
            }
            if (right < tooltipEle.offsetWidth + 70) {
              tooltipEle.style.left = 'inherit';
              tooltipEle.style.right = right + 'px';
            } else {
              tooltipEle.style.right = 'inherit';
              tooltipEle.style.left = position[0] + 10 + 'px';
            }
            tooltipEle.style.display = 'block';
          }
        }
      } else if (selectedFeatures.length === 0) {
        tooltipEle.innerText = '';
        tooltipEle.style.display = 'none';
      }
    }

    //处理悬停事件
    if (selectedFeatures.length > 0) {
      let selectedFeature = selectedFeatures[0];
      if (this.existHoverEvent(selectedFeature)) {
        if (tooltipEle) {
          tooltipEle.innerText = '';
          tooltipEle.style.display = 'none';
        }
        this.handleHoverEvent(selectedFeature, event.mapBrowserEvent);
      }
    } else {
      this.closeHoverInfoWindow();
    }
  }
};

Map.prototype.closeHoverInfoWindow = function () {
  if (this.markerOverlay && this.markerOverlay.get('isHover')) {
    this.closeInfoWindow();
  }
};

//判断一个feature是否有hover事件
Map.prototype.existHoverEvent = function (selectedFeature) {
  let rootLayer = selectedFeature.get('rootLayer');
  return !!(rootLayer && rootLayer.hoverFunc_);
};

Map.prototype.handleHoverEvent = function (selectedFeature, event) {
  let rootLayer = selectedFeature.get('rootLayer');
  if (rootLayer && rootLayer.hover) {
    rootLayer.hover(selectedFeature, event);
  }
};


Map.prototype.hoverSelectStyle = function (feature, resolution) {
  let layer = this.pointmoveSelect.getLayer(feature);
  if (layer) {
    let xmapLayer = layer.get('xmapLayer');
    if (xmapLayer) {
      return xmapLayer.hoverSelectStyle_(feature, resolution);
    }
  }
};


Map.prototype.singleClickStyle = function (feature, resolution) {
  let layer = this.singleClickSelect.getLayer(feature);
  let xmapLayer = undefined;
  if (layer) {
    xmapLayer = layer.get('xmapLayer');
    if (xmapLayer) {
      return xmapLayer.hoverSelectStyle_(feature, resolution);
    } else {
      return (layer.getStyleFunction())();
    }
  } else if (feature.get('rootLayer')) {
    return feature.get('rootLayer').hoverSelectStyle_(feature, resolution);
  }
};


//map对外的API
//是否支持全屏模式
Map.prototype.supportFullScreen = function () {
  return xmap.util.supportFullScreen();
};

//全屏
Map.prototype.fullScreen = function () {
  xmap.util.requestFullScreen(this.olMap.getTargetElement());
};

//退出全屏
Map.prototype.exitFullScreen = function () {
  xmap.util.exitFullScreen();
};

//开始测量
Map.prototype.measureStart = function (type, measureOptions) {
  this.measureControl.start(type);
};

//结束测量
Map.prototype.measureEnd = function () {
  this.measureControl.clearMeasure();
};

//绘制开始
Map.prototype.drawStart = function (opt_options) {
  this.drawEnd();
  let options = Object.assign({}, {
    olMap: this.olMap,
    map: this
  }, opt_options);
  this.drawInteraction = new xmap.DrawInteraction(options);
  this.pauseHoverClickEvent();
};

//绘制结束
Map.prototype.drawEnd = function () {
  if (this.drawInteraction) {
    this.drawInteraction.removeMeasure();
  }
  this.drawInteraction = null;
  this.resumeHoverClickEvent();
};

//恢复所有的事件
Map.prototype.resumeHoverClickEvent = function () {
  this.pointmoveSelect.setActive(true);
  this.singleClickSelect.setActive(true);
  this.addClickEventsInMap();
};


Map.prototype.transformMi2Pixel = function (meter) {
  let resolution = this.olMap.getView().getResolution();
  return xmap.util.transformMi2Pixel(meter, resolution);
};

//将position处的经纬度调整距离地图左上角top left像素
Map.prototype.setTopLeftPosition = function (position, top, left) {
  //首先判断position是否在地图内，不在就直接移动，在的话，就使用动画移动
  let extent = this.olMap.getView().calculateExtent(this.olMap.getSize());
  let size = this.olMap.getSize();
  let disX = extent[3] - extent[1];

  let latitudeExtent = extent[3] - extent[1];
  let longitudeExtent = extent[2] - extent[0];
  let topLatitude = xmap.util.transformPixel2Degree(top, this.olMap.getView().getResolution());
  let leftLongitude = xmap.util.transformPixel2Degree(left, this.olMap.getView().getResolution());
  let newCenter = [position[0] + (longitudeExtent / 2 - leftLongitude), position[1] - (latitudeExtent / 2 - topLatitude)];
  if (!ol.extent.containsCoordinate(extent, position)) {
    this.olMap.getView().setCenter(newCenter);
  } else {
    xmap.util.animate(this.olMap, {
      newCenter: newCenter
    });
  }
  this.clearHoverTip();
};

//暂停所有的事件
Map.prototype.pauseHoverClickEvent = function () {
  this.pointmoveSelect.setActive(false);
  this.singleClickSelect.setActive(false);
  this.addClickEventsInMap();
  this.clearHoverTip();
};

Map.prototype.clearHoverTip = function () {
  window.document.body.style.cursor = 'default';
  let mapElement = this.olMap.getTargetElement();
  if (mapElement) {
    let tooltipEle = mapElement.querySelector('.promptBox');
    if (tooltipEle) {
      tooltipEle.innerText = '';
      tooltipEle.style.display = 'none';
    }
  }
};

Map.prototype.addClickEventsInMap = function () {
  ol.events.listen(this.olMap, 'singleclick', this.listenSingleclickFn_, this);
  ol.events.listen(this.olMap, 'dblclick', this.listenDblclickFn_, this);
};


//恢复所有的事件
Map.prototype.resumeHoverClickEvent = function () {
  this.pointmoveSelect.setActive(true);
  this.singleClickSelect.setActive(true);
  this.addClickEventsInMap();
};

Map.prototype.getTopLeftPosition = function (point) {
  return this.olMap.getPixelFromCoordinate(point);
};

Map.prototype.setSelectedFeature = function (feature) {
  this.clearSelectedFeature();
  if (feature) {
    this.singleClickSelect.getFeatures().push(feature);
    if (this.clickRipperUtil) {
      this.clickRipperUtil.start(feature, feature.get('rootLayer'));
    }
  }
};

Map.prototype.setClickRipperFeature = function (feature) {
  this.emptyClickRipper();
  if (this.clickRipperUtil && feature) {
    this.clickRipperUtil.start(feature, feature.get('rootLayer'));
  }
};

Map.prototype.setClickRipperDatas = function (itemDatas, vectorLayer) {
  this.emptyClickRipper();
  if (this.clickRipperUtil && itemDatas.length > 0) {
    this.clickRipperUtil.startArray(itemDatas, vectorLayer);
  }
};

Map.prototype.clearSelectedFeature = function () {
  this.singleClickSelect.getFeatures().clear();
  this.pointmoveSelect.getFeatures().clear();
};

Map.prototype.clearClickSelectedFeature = function () {
  //点击后取消被高亮的效果
  window.setTimeout(function () {
    this.singleClickSelect.getFeatures().clear();
  }.bind(this), 0);
};

Map.prototype.getViewProjection = function () {
  return this.olMap.getView().getProjection();
};

//根据点集获取总长度
Map.prototype.getLength = function (lineData) {

};
Map.prototype.addSingleClickEvent = function (opt_options) {
  this.options.singleclick = opt_options.singleclick;

};


Map.prototype.readGeojsonFeatures = function (geojson) {
  let format = new ol.format.GeoJSON({defaultDataProjection: "EPSG:4326"});
  return format.readFeatures(geojson);
};

//获取blob字段
Map.prototype.getCanvasBlob = function (callback) {
  this.olMap.once('postcompose', function (event) {
    try {
      let canvas = event.context.canvas;
      if (navigator.msSaveBlob) {
        callback(canvas.msToBlob());
      } else {
        canvas.toBlob(function (blob) {
          callback(blob);
        });
      }
    } catch (e) {
      callback('');
      console.error(e);
    }

  });
  this.olMap.renderSync();
};

/**
 * 判断一个点是否在屏幕范围内
 * @param center
 */
Map.prototype.pointIsInExtent = function (center) {
  let extent = this.olMap.getView().calculateExtent(this.olMap.getSize());
  let newCenter = xmap.util.transformPointF4326(center, this.getViewProjection());
  return ol.extent.containsCoordinate(extent, newCenter);
};


Map.prototype.getExtent = function () {
  return this.olMap.getView().calculateExtent(this.olMap.getSize());

};
Map.prototype.fitExtent = function (extent, options) {
  options.size = this.olMap.getSize();
  this.olMap.getView().fit(extent, options);
};

export default Map;
