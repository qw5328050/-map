/**
 * Created by fp on 2018/11/15.
 * 空气质量站点弹框
 */

import xmap from "@/map/js/xmap/export/xmap";
import PolluteLayer from "./polluteLayer";
import aqiColor from "@/utils/aqiColor";

class AirLayer extends PolluteLayer {
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
      // 排序，让数字大的显示在上面，即出现故障的点现在上上面
      orderFunction: function (itemData1, itemData2) {
        return itemData1.value > itemData2.value
      }
    })
    this.xmap.addLayer(layer)
    this.vectorLayers.push({
      name: params.name,
      layer: layer
    })
  }

  getPicStyle(itemData, zoom, resolution, point, params) {
    let type = itemData.type.split(',')[0]
    if (zoom < 6) {
      return [{
        styleType: 'icon',
        scale: this.getScale(zoom),
        src: this.getPicPath(itemData)
      }]
    } else {
      return [{
        styleType: 'icon',
        scale: this.getFontScale(zoom),
        src: this.getPicPath(itemData)
      },
        // this.getDefaultFontStyle(itemData, zoom)
      ]
    }
  }

  getSelectedPicStyle(itemData, zoom, resolution, point, params) {
    if (zoom < 6) {
      return [{
        styleType: 'icon',
        scale: this.getSelectedScale(zoom),
        src: this.getPicPath(itemData)
      }]
    } else {
      return [{
        styleType: 'icon',
        scale: this.getSelectedFontScale(zoom),
        src: this.getPicPath(itemData)
      },
        // this.getSelectedFontStyle(itemData, zoom)
      ]
    }
  }

  getScale(zoom) {
    let scale = 0.8
    if (zoom < 1) {
      scale = 0.5
    } else if (zoom >= 1 && zoom < 2) {
      scale = 0.55
    } else if (zoom >= 2 && zoom < 3) {
      scale = 0.6
    } else if (zoom >= 3 && zoom < 4) {
      scale = 0.65
    } else if (zoom >= 4 && zoom < 5) {
      scale = 0.7
    } else if (zoom >= 5 && zoom < 6) {
      scale = 0.75
    } else if (zoom >= 6 && zoom < 7) {
      scale = 0.8
    }
    return scale
  }

  getSelectedScale(zoom) {
    let scale = 0.9
    if ( zoom < 1) {
      scale = 0.6
    } else if (zoom >= 1 && zoom < 2) {
      scale = 0.65
    } else if (zoom >= 2 && zoom < 3) {
      scale = 0.7
    } else if (zoom >= 3 && zoom < 4) {
      scale = 0.75
    } else if (zoom >= 4 && zoom < 5) {
      scale = 0.8
    } else if (zoom >= 5 && zoom < 6) {
      scale = 0.85
    } else if (zoom >= 6 && zoom < 7) {
      scale = 0.9
    }
    return scale
  }

  getFontScale() {
    return 0.88
  }

  getSelectedFontScale() {
    return 1
  }

  // 获取默认字体样式
  getDefaultFontStyle(itemData, zoom) {
    return {
      styleType: 'text',
      fontSize: this.getFontSize(zoom),
      strokeColor: '#d5af00',
      offsetX: 0,
      offsetY: -32,
      text: itemData.value
    }
  }

  // 获取选中字体样式
  getSelectedFontStyle(itemData, zoom) {
    return {
      styleType: 'text',
      fontSize: this.getSelectedFontSize(zoom),
      offsetX: 0,
      offsetY: -36,
      text: itemData.value
    }
  }

  getFontSize(zoom) {
    let scale = 20
    if (zoom < 2) {
      scale = 16
    } else if (zoom >= 2 && zoom < 4) {
      scale = 18
    } else if (zoom >= 4 && zoom < 6) {
      scale = 20
    }
    return scale
  }

  getSelectedFontSize(zoom) {
    let scale = 22
    if (zoom < 2) {
      scale = 18
    } else if (zoom >= 2 && zoom < 4) {
      scale = 20
    } else if (zoom >= 4 && zoom < 6) {
      scale = 22
    }
    return scale
  }

  getPicPath(itemData) {
    let type = itemData.type.split(',')[0];
    const status = aqiColor.formatStatusType(itemData.factorName.toLowerCase(), itemData.value)
    return this.imgPrePath + `/mapImg/air/${type}/${status}.png`
  }

  showDetail(item) {
    this.map.showDetail(item)
  }
}

export default AirLayer
