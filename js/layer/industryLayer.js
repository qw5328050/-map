/**
 * Created by fp on 2018/11/15.
 * 工业图层处理与点位显示
 */
import xmap from "@/map/js/xmap/export/xmap";
import BaseLayer from "./baseLayer";
import {objectAssign} from "@/utils/util";
import mapUtil from "@/map/js/util/mapUtil";

// 加入图层
class IndustryLayer extends BaseLayer {
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
        return mapUtil.transformStatus(itemData1.status) > mapUtil.transformStatus(itemData2.status)
      }
    })
    this.xmap.addLayer(layer)
    this.vectorLayers.push({
      name: params.name,
      layer: layer
    })
  }

  getPicStyle(itemData, zoom, resolution, point, params) {
    let type = itemData.type
    let isGongd = ['gongd'].indexOf(type) === 0
    if (zoom < 6) {
      return [{
        styleType: 'icon',
        scale: this.getScale(zoom),
        src: this.getPicPath(itemData)
      }]
    } else {
      return [{
        styleType: 'icon',
        scale: this.getScale(zoom),
        src: this.getPicPath(itemData)
      }]
    }
  }

  getSelectedPicStyle(itemData, zoom, resolution, point, params) {
    let type = itemData.type
    let isGongd = ['gongd'].indexOf(type) === 0
    if (zoom < 6) {
      return [{
        styleType: 'icon',
        scale: this.getSelectedScale(zoom),
        src: this.getPicPath(itemData)
      }]
    } else {
      return [{
        styleType: 'icon',
        scale: this.getSelectedScale(zoom),
        src: this.getPicPath(itemData)
      }]
    }
  }

  getPicPath(itemData) {
    let type = 'qy'
    if (itemData.type !== '' && itemData.type !== undefined) {
      if (itemData.type === 'zxqy' ||
        itemData.type === 'zdqy' || itemData.type === 'syqy') {
        type = 'qy'
      } else if (itemData.type === 'wrfeiq') {
        type = 'feiq'
      } else {
        type = itemData.type
      }
    }
    //operateStatus
    let statusPic = mapUtil.transformStatus(itemData.operateStatus)
    return this.imgPrePath + '/mapImg/industry/' + type + '/' + statusPic + '.png'
  }

  getScale(zoom) {
    let scale = 0.8
    if (zoom < 5) {
      scale = 0.5
    } else if (zoom >= 5 && zoom < 6) {
      scale = 0.6
    } else if (zoom >= 6 && zoom < 7) {
      scale = 0.7
    }
    return scale
  }

  getSelectedScale(zoom) {
    let scale = 0.9
    if (zoom < 5) {
      scale = 0.6
    } else if (zoom >= 5 && zoom < 6) {
      scale = 0.7
    } else if (zoom >= 6 && zoom < 7) {
      scale = 0.8
    }
    return scale
  }

  showDetail(item, position, params) {
    this.map.showDetail(item)
  }
}
export default IndustryLayer
