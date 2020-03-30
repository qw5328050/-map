/**
 * Created by fp on 2018/12/29.
 */
import xmap from '@/map/js/xmap/export/xmap'
import mapUtil from '@/map/js/util/mapUtil'
import PolluteLayer from './polluteLayer'

// 加入图层
class WaterLayer extends PolluteLayer {
  constructor (options) {
    super(options)
  }

  // 创建图层
  createLayer (params) {
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

  getPicStyle (itemData, zoom, resolution, point, params) {
    let type = itemData.type
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

  getSelectedPicStyle (itemData, zoom, resolution, point, params) {
    let type = itemData.type
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

  getPicPath (itemData) {
    return this.imgPrePath + '/mapImg/water/' + itemData.type + '/'
      + mapUtil.transformStatus(itemData.operateStatus) + '.png'
  }

  getScale (zoom) {
    let scale = 0.8
    if (zoom < 5) {
      scale = 0.5
    } else if (zoom >= 5 && zoom < 6) {
      scale = 0.65
    } else if (zoom >= 6 && zoom < 7) {
      scale = 0.8
    }
    return scale
  }

  getSelectedScale (zoom) {
    let scale = 0.9
    if (zoom < 5) {
      scale = 0.6
    } else if (zoom >= 5 && zoom < 6) {
      scale = 0.75
    } else if (zoom >= 6 && zoom < 7) {
      scale = 0.8
    }
    return scale
  }

  showDetail (item) {
    this.map.showDetail(item)
  }
}
export default WaterLayer
