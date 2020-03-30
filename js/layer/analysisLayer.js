/**
 * Created by fp on 2018/11/15.
 * 空气质量站点弹框
 */

import xmap from "@/map/js/xmap/export/xmap";
import PolluteLayer from "./polluteLayer";
import aqiColor from "@/utils/aqiColor";

class AnalysisLayer extends PolluteLayer {
  constructor(options) {
    super(options)
  }

  // 创建图层
  createLayer(params) {
    if (this.alreadyInclude(params)) {
      return
    }
    const self = this
    const layer = new xmap.VectorLayer({
      zIndex: 100,
      styleFunction: function (itemData, zoom, resolution, point) { // 默认样式函数
        return self.getPicStyle(itemData, zoom, resolution, point, params)
      },
      selectStyleFunction: function (itemData, zoom, resolution, point) {
        return self.getSelectedPicStyle(itemData, zoom, resolution, point, params)
      },
      singleclick: function (itemData, zoom, point) {
        // 获取数据
        self.xmap.clearHoverTip()
        self.showDetail(itemData, [itemData.longitude, itemData.latitude], params)
      },
    })
    this.xmap.addLayer(layer);
    this.vectorLayers.push({
      name: params.name,
      layer: layer
    })
  }

  getPicStyle(itemData, zoom, resolution, point, params) {
    let styleArr = [{
      styleType: 'icon',
      scale: this.getScale(zoom),
      src: this.getPicPath(itemData)
    }];
    if(this.needShowFont(itemData)) {
      styleArr.push(this.getDefaultFontStyle(itemData, zoom));
    }
    return styleArr;
  }

  getSelectedPicStyle(itemData, zoom, resolution, point, params) {
    let styleArr = [{
      styleType: 'icon',
      scale: this.getSelectedScale(zoom),
      src: this.getPicPath(itemData)
    }];
    if(this.needShowFont(itemData)){
      styleArr.push(this.getSelectedFontStyle(itemData, zoom));
    }
    return styleArr;
  }

  getScale(zoom) {
    let scale = 0.9
    return scale
  }

  getSelectedScale(zoom) {
    let scale = 1
    return scale
  }

  // 获取默认字体样式
  getDefaultFontStyle(itemData, zoom) {
    return {
      styleType: 'text',
      fontSize: this.getFontSize(zoom),
      strokeColor: '#d5af00',
      offsetX: 0,
      offsetY: -14,
      text: itemData.value
    }
  }

  // 获取选中字体样式
  getSelectedFontStyle(itemData, zoom) {
    return {
      styleType: 'text',
      fontSize: this.getSelectedFontSize(zoom),
      offsetX: 0,
      offsetY: -17,
      text: itemData.value
    }
  }

  getFontSize(zoom) {
    let size = 12
    return size
  }

  getSelectedFontSize(zoom) {
    let size = 13
    return size
  }

  needShowFont(itemData) {
    if (itemData.value === null || itemData.value === '' || itemData.value == 0) {
      return false;
    } else {
      return true;
    }
  }

  getPicPath(itemData) {
    let status = '';
    if (itemData.value === null || itemData.value === '' || itemData.value == 0) {
      status = 0;
    } else {
      status = aqiColor.formatStatusType(itemData.factorName.toLowerCase(), itemData.value);
    }
    return this.imgPrePath + `/mapImg/analysis/air/${status}.png`
  }

  showDetail(item) {
    this.map.showDetail(item)
  }
}

export default AnalysisLayer
