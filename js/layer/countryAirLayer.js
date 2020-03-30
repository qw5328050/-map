import Vue from 'vue'
import BaseLayer from './baseLayer'
import xmap from '@/map/js/xmap/export/xmap'
import aqiColor from '@/utils/aqiColor'

class CountryAirLayer extends BaseLayer {

  constructor(options){
    super(options)
  }

  // createLayer (params) {
  //   if (this.alreadyInclude(params)) {
  //     return
  //   }
  //   const self = this
  //   this.layer = new xmap.VectorLayer({
  //     zIndex: 1000,
  //     styleFunction: function (itemData, zoom, resolution, point) { // 默认样式函数
  //       return self.getPicStyle(itemData, zoom, resolution, point, params)
  //     },
  //     selectStyleFunction: function (itemData, zoom, resolution, point) {
  //       return self.getSelectedPicStyle(itemData, zoom, resolution, point, params)
  //     },
  //     singleclick: function (itemData, zoom, point) {
  //       // 获取数据
  //       self.xmap.clearHoverTip()
  //       self.showDetail(itemData, [itemData.longitude, itemData.latitude], params)
  //     },
  //     // 排序，让数字大的显示在上面，即出现故障的点现在上上面
  //     orderFunction: function (itemData1, itemData2) {
  //       return itemData1.value > itemData2.value
  //     }
  //   })
  //   this.xmap.addLayer(this.layer)
  //   this.vectorLayers.push({
  //     name: params.name,
  //     layer: this.layer,
  //     xLayer: this
  //   })
  // }

  getPicStyle (itemData, zoom, resolution, point, params) {
    return [this.getDefaultFontStyle(itemData, zoom)]

    // return {
    //   styleType: 'icon',
    //   scale: this.getScale(zoom),
    //   src: this.getPicPath(itemData)
    // }
  }

  getFontSize (zoom) {
    let scale = 14
    if (zoom < 2) {
      scale = 8
    } else if (zoom >= 2 && zoom < 4) {
      scale = 10
    } else if (zoom >= 4 && zoom < 6) {
      scale = 12
    }
    return scale
  }

  // 获取默认字体样式
  getDefaultFontStyle (itemData, zoom) {
    let backgroundFillColor = aqiColor.ztAirColorRgb(itemData.factorCode, itemData.value)
    return {
      styleType: 'text',
      fontSize: this.getFontSize(zoom),
      backgroundStrokeColor: backgroundFillColor,
      backgroundFillColor: backgroundFillColor,
      padding: [3, 3, 3, 3],
      fillColor: '#333333',
      strokeColor: '#ffffff',
      offsetX: 0,
      offsetY: -32,
      text: itemData.value
    }
  }

  getSelectedPicStyle (itemData, zoom, resolution, point, params) {
    // return {
    //   styleType: 'icon',
    //   scale: this.getSelectedScale(zoom),
    //   src: this.getSelectPicPath(itemData),
    // }
    return [this.getDefaultFontStyle(itemData, zoom)]
  }

  getPicPath(itemData) {
    let type = 'gywr';
    if (itemData.sitetype !== '' && itemData.sitetype !== undefined) {
      type = itemData.sitetype;
    }
    return this.imgPrePath + '/mapImg/polluteSrc/normal/' + type + '.png'
  }

  getScale(zoom) {
    let scale = 0.9;
    if (zoom < 2) {
      scale = 0.7;
    } else if (zoom >= 2 && zoom < 4) {
      scale = 0.8;
    } else if (zoom >= 4 && zoom < 6) {
      scale = 0.9;
    }
    return scale;
  }

  getSelectPicPath(itemData) {
    let type = 'gywr';
    if (itemData.sitetype !== '' && itemData.sitetype !== undefined) {
      type = itemData.sitetype;
    }
    return this.imgPrePath + '/mapImg/polluteSrc/high/' + type + '.png'
  }

  getSelectedScale(zoom) {
    let scale = 1;
    if (zoom < 2) {
      scale = 0.8;
    } else if (zoom >= 2 && zoom < 4) {
      scale = 0.9;
    } else if (zoom >= 4 && zoom < 6) {
      scale = 1;
    }
    return scale;
  }

  showDetail (item) {
    this.map.showDetail(item)
  }
}

export default CountryAirLayer
