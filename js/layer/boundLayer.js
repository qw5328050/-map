/**
 * Created by fp on 2019/1/30.
 */
import xmap from "@/map/js/xmap/export/xmap";
import BaseLayer from "./baseLayer";
import aqiColor from "@/utils/aqiColor";
import mapUtil from "@/map/js/util/mapUtil";

class BoundLayer extends BaseLayer {
  constructor(options) {
    super(options);
  }

  /**
   * 创建图层
   */
  createLayer(params) {
    const self = this;
    const layer = new xmap.VectorLayer({
      zIndex: 10,
      //默认样式函数
      styleFunction: function (itemData, zoom, resolution, point) {
        return self.getStyle(itemData, zoom, resolution, point, params);
      },
      //选中样式函数
      selectStyleFunction: function (itemData, zoom, resolution, point) {
        return self.getStyle(itemData, zoom, resolution, point, params);
      }
    });
    this.xmap.addLayer(layer);
    this.xmap.addExcludeFocusLayer(layer);
    this.vectorLayers.push({
      name: params.name,
      layer: layer
    });
  }

  getStyle(itemData) {
    let fillColor = aqiColor.ztAirColorRgb('aqi', itemData.value);
    if (mapUtil.isChrome()) {
      fillColor = fillColor + '99';
    }
    return {
      styleType: 'polygon',
      strokeColor: 'blue',
      strokeWeight: 0,
      fillColor: fillColor,
    }
  }
}
export default BoundLayer;
