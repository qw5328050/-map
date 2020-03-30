/**
 * Created by fp on 2019/1/16.
 */
import Vue from 'vue'
import AirLayer from './airLayer'
import aqiColor from '@/utils/aqiColor'
import {objectAssign} from '@/utils/util'
import xmap from '@/map/js/xmap/export/xmap'
import alarmListDialog from '@/map/dialog/air/alarmListDialog.vue'
import mapUtil from '@/map/js/util/mapUtil'

class AirAlarmLayer extends AirLayer {
  constructor (options) {
    options.name = 'wrkqc'
    super(options)
    this.initRipperLayer()
  }

  // 创建图层
  createLayer (params) {
    if (this.alreadyInclude(params)) {
      return
    }
    const self = this
    this.layer = new xmap.VectorLayer({
      zIndex: 1000,
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
    this.xmap.addLayer(this.layer)
    this.vectorLayers.push({
      name: params.name,
      layer: this.layer,
      xLayer: this
    })
  }

  getPicStyle (itemData, zoom, resolution, point, params) {
    let type = itemData.type
    let isWz = ['weiz'].indexOf(type) === 0
    if (zoom < 1) {
      let color = aqiColor.ztAirColorRgb(itemData.factorName, itemData.value)
      return {
        styleType: 'circle',
        fillColor: color,
        strokeWeight: 1,
        strokeColor: color,
        radius: (isWz ? 1 : 3)
      }
    } else if (zoom < 2) {
      let color = aqiColor.ztAirColorRgb(itemData.factorName, itemData.value)
      return {
        styleType: 'circle',
        fillColor: color,
        strokeWeight: 1,
        strokeColor: color,
        radius: (isWz ? 2 : 4)
      }
    } else if (zoom < 3) {
      let color = aqiColor.ztAirColorRgb(itemData.factorName, itemData.value)
      return {
        styleType: 'circle',
        fillColor: color,
        strokeWeight: 1,
        strokeColor: color,
        radius: (isWz ? 3 : 5)
      }
    } else if (zoom < 4) {
      let color = aqiColor.ztAirColorRgb(itemData.factorName, itemData.value)
      return {
        styleType: 'circle',
        fillColor: color,
        strokeWeight: 1,
        strokeColor: color,
        radius: (isWz ? 4 : 6)
      }
    } else if (zoom < 5) {
      let color = aqiColor.ztAirColorRgb(itemData.factorName, itemData.value)
      return {
        styleType: 'circle',
        fillColor: color,
        strokeWeight: 1,
        strokeColor: color,
        radius: (isWz ? 5 : 7)
      }
    } else if (zoom < 6) {
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
        this.getDefaultFontStyle(itemData, zoom)
      ]
    }
  }

  getSelectedPicStyle (itemData, zoom, resolution, point, params) {
    let type = itemData.type
    let isWz = ['weiz'].indexOf(type) === 0
    if (zoom < 1) {
      let color = aqiColor.ztAirColorRgb(itemData.factorName, itemData.value)
      return {
        styleType: 'circle',
        fillColor: color,
        strokeWeight: 1,
        strokeColor: color,
        radius: (isWz ? 3 : 5)
      }
    } else if (zoom < 2) {
      let color = aqiColor.ztAirColorRgb(itemData.factorName, itemData.value)
      return {
        styleType: 'circle',
        fillColor: color,
        strokeWeight: 1,
        strokeColor: color,
        radius: (isWz ? 4 : 6)
      }
    } else if (zoom < 3) {
      let color = aqiColor.ztAirColorRgb(itemData.factorName, itemData.value)
      return {
        styleType: 'circle',
        fillColor: color,
        strokeWeight: 1,
        strokeColor: color,
        radius: (isWz ? 5 : 7)
      }
    } else if (zoom < 4) {
      let color = aqiColor.ztAirColorRgb(itemData.factorName, itemData.value)
      return {
        styleType: 'circle',
        fillColor: color,
        strokeWeight: 1,
        strokeColor: color,
        radius: (isWz ? 6 : 8)
      }
    } else if (zoom < 5) {
      let color = aqiColor.ztAirColorRgb(itemData.factorName, itemData.value)
      return {
        styleType: 'circle',
        fillColor: color,
        strokeWeight: 1,
        strokeColor: color,
        radius: (isWz ? 7 : 9)
      }
    } else if (zoom < 6) {
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
        this.getSelectedFontStyle(itemData, zoom)
      ]
    }
  }

  initRipperLayer () {
    this.ripperLayer = new xmap.RipperUtil({
      map: this.xmap
    })
  }

  showData (params) {
    this.layer.showData(params)
    this.ripperLayer.clear()
    this.ripperLayer.startArray(params.data)
  }

  removeLayer () {
    this.xmap.removeLayer(this.layer)
    this.ripperLayer.clear()
    this.xmap = null
    this.ripperLayer = null
  }

  showDetail (item, position, params) {
    let dialogObj = Vue.extend(alarmListDialog)
    let itemData = {}
    objectAssign(itemData, item)
    const info = {
      itemData: itemData
    }
    const obj = new dialogObj({
      data: info
    })
    obj.show()
    this.map.showAlarmDialog()
  }
}

export default AirAlarmLayer
