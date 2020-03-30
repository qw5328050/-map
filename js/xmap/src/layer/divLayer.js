/**
 * div效果显示
 * Created by fp on 2017/11/16.
 */
import ol from "../../ol_extend";
import util from "../util/util";
const DivLayer = function (opt_options) {
  this.options = Object.assign({}, this.getDefaultOptions(), opt_options);
  this.map = this.options.map;
  this.olMap = this.options.map.olMap;
  this.projection = ol.proj.get('EPSG:' + this.options.projection);
  //初始化事件
  this.singleclickFunc_ = opt_options.singleclick;
  this.dblclickFunc_ = opt_options.dblclick;
  //存放div中overlayer数组
  this.overLayArray = [];
  this.cacheData_ = [];
  this.preId = Math.random() + '_'; //id前缀
};
ol.inherits(DivLayer, ol.Object);

DivLayer.prototype.removeLayer = function () {
  this.clearData_();
};

//外部接口调用 清除数据
DivLayer.prototype.clear = function () {
  this.clearData_();
};

//清空数据
DivLayer.prototype.clearData_ = function (opt_options) {
  const self = this;
  this.overLayArray.forEach(function (item) {
    self.olMap.removeOverlay(item);
  });
  this.overLayArray = [];
  this.cacheData_ = [];
};

//对外接口触发数据更新
DivLayer.prototype.showData = function (opt_options) {
  const options = Object.assign({}, {
    operateType: 'replace'
  }, opt_options);
  this.showDataInter_(options);
};


//显示数据
DivLayer.prototype.showDataInter_ = function (opt_options) {
  if (opt_options.operateType === 'replace') {
    this.clearData_();
  }
  this.cacheData_ = this.cacheData_.concat(opt_options.data);
  let len = opt_options.data.length;
  let dataList = opt_options.data;
  let features = [];
  for (let i = 0; i < len; i++) {
    let element = dataList[i];
    this.constructOverlay(element, element.html, element.offset, element.position);
  }
  //是否自适应
  if (opt_options.scale) {
    this.fitExtent();
  }
  this.map.clearHoverTip();
};

DivLayer.prototype.setFocusById = function (id) {
};


DivLayer.prototype.getItemDataById = function (id) {
  let data = null;
  this.cacheData_.some(item => {
    if (item.id == id) {
      data = item;
      return true;
    } else {
      return false;
    }
  })
  return data;
};


//构造overlay,与feature等同
DivLayer.prototype.constructOverlay = function (element, html, offset, position) {
  let isLegal = util.checkPosLegal(element.longitude, element.latitude);
  if (!isLegal) {
    return;
  }
  let self = this;
  let detailElement = document.createElement('div');
  detailElement.innerHTML = html;
  let animateOverlay = new ol.Overlay({
    id: this.preId + element.id,
    element: detailElement,
    positioning: 'top-left',
    offset: [-15, -15]
  });
  animateOverlay.setProperties({
    data: element
  });
  let mapProj = this.map.getViewProjection();
  animateOverlay.setPosition(util.transformPointProj([element.longitude, element.latitude],
    this.projection, mapProj));
  this.olMap.addOverlay(animateOverlay);
  this.overLayArray.push(animateOverlay);
  detailElement.addEventListener('click', function () {
    if (typeof self.singleclickFunc_ === 'function') {
      self.singleclickFunc_(element, self.map.getZoom(), [element.longitude, element.latitude]);
    }
    return false;
  });
  detailElement.addEventListener('dblclick', function () {
    if (typeof self.dblclickFunc_ === 'function') {
      self.dblclickFunc_(element, self.map.getZoom(), [element.longitude, element.latitude]);
    }
    return false;
  });
  if (this.options.showTip) {
    detailElement.addEventListener('mouseover', function () {
      let name = element.name;
      if (util.isEmpty(name)) {
        return;
      }
      let mapElement = self.olMap.getTargetElement();
      if (mapElement) {
        let mapTooltipElement = mapElement.querySelector('.promptBox');
        mapTooltipElement.innerHTML = name;
        let position = self.olMap.getPixelFromCoordinate(
          util.transformPoint([element.longitude, element.latitude]));
        mapTooltipElement.style.left = position[0] + 15 + 'px';
        mapTooltipElement.style.top = position[1] + 10 + 'px';
        mapTooltipElement.style.display = "block";
      }
    });
    detailElement.addEventListener('mouseout', function () {
      let mapElement = self.olMap.getTargetElement();
      if (mapElement) {
        let mapTooltipElement = mapElement.querySelector('.promptBox');
        mapTooltipElement.innerHTML = name;
        mapTooltipElement.style.display = "none";
      }
    })
  }
};


DivLayer.prototype.getAllData = function () {
  return this.cacheData_;
};

DivLayer.prototype.fitExtent = function () {
  let pointsList = [];
  this.overLayArray.forEach(function (item) {
    pointsList.push(item.getPosition());
  });
  util.fitExtent(this.olMap, pointsList, this.maxExtent_);
};

DivLayer.prototype.setZIndex = function (zIndex) {
  console.log('cannot set zIndex');
};

DivLayer.prototype.getZIndex = function (zIndex) {
  console.log('not have zIndex attribute');
};

DivLayer.prototype.restoreZIndex = function () {
  console.log('not have zIndex attribute');
};

DivLayer.prototype.getDefaultOptions = function () {
  return {
    projection: '4326',
    showTip: false
  }
};
export default DivLayer;
