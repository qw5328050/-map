import xmap from "@/map/js/xmap/export/xmap";
import BaseLayer from "./baseLayer";
import aqiColor from "@/utils/aqiColor";

class BoundLabelLayer extends BaseLayer {

  constructor(options) {
    super(options)
  }

  // 创建图层
  createLayer(params) {
    if (this.alreadyInclude(params)) {
      return
    }
    const self = this;
    const layer = new xmap.VectorLayer({
      zIndex: 100,
      styleFunction: function (itemData, zoom, resolution, point) { // 默认样式函数
        return self.getDefaultFontStyle(itemData, zoom, resolution, point, params)
      },
      selectStyleFunction: function (itemData, zoom, resolution, point) {
        return self.getDefaultFontStyle(itemData, zoom, resolution, point, params)
      },
      singleclick: function (itemData, zoom, point) {
        // 获取数据
      },
    });
    this.xmap.addLayer(layer);
    this.vectorLayers.push({
      name: params.name,
      layer: layer
    })
  }

  // 获取默认字体样式
  getDefaultFontStyle(itemData, zoom) {
    let color = aqiColor.ztAirColorRgb('aqi', itemData.value);
    return {
      styleType: 'text',
      fontSize: '14',
      backgroundStrokeColor: '#FFF',
      backgroundFillColor: '#FFF',
      padding: [2, 2, 1, 2],
      fillColor: color,
      strokeColor: '#ffffff',
      offsetX: 0,
      offsetY: 0,
      text: itemData.text.toString()
    }
  }
}

export default BoundLabelLayer
