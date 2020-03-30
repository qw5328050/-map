/**
 * Created by fp on 2018/11/15.
 * 空气质量站点弹框
 */

import xmap from "@/map/js/xmap/export/xmap";
import PolluteLayer from "./polluteLayer";

class AirDivLayer extends PolluteLayer {
  constructor(options) {
    super(options)
  }

  // 创建图层
  createLayer(params) {
    if (this.alreadyInclude(params)) {
      return
    }
    const self = this
    const layer = new xmap.DivLayer({
      zIndex: 100,
      map: this.xmap,
      singleclick: function (itemData, zoom, point) {
        // 获取数据
        self.xmap.clearHoverTip()
        self.showDetail(itemData, [itemData.longitude, itemData.latitude], params)
      },
      // 排序，让数字大的显示在上面，即出现故障的点现在上上面
      orderFunction: function (itemData1, itemData2) {
        return itemData1.value > itemData2.value
      }
    });
    this.vectorLayers.push({
      name: params.name,
      layer: layer
    })
  }

  showDetail(item) {
    this.map.showDetail(item)
  }
}

export default AirDivLayer
