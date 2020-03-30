/**
 * Created by admin on 2019/4/1
 *
 */
import xmap from '@/map/js/xmap/export/xmap'
import BaseLayer from './baseLayer'
import mapUtil from '@/map/js/util/mapUtil'

class VideoLayer extends BaseLayer {
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
      }
    })
    this.xmap.addLayer(layer)
    this.vectorLayers.push({
      name: params.name,
      layer: layer
    })
  }

  getPicStyle (itemData, zoom, resolution, point, params) {
      return [{
        styleType: 'icon',
        scale: this.getScale(zoom),
        src: this.getPicPath(itemData, params.id)
      }]
  }

  getSelectedPicStyle (itemData, zoom, resolution, point, params) {
      return [{
        styleType: 'icon',
        scale: this.getSelectedScale(zoom),
        src: this.getPicPath(itemData, params.id)
      }]
  }

  getPicPath (itemData, id) {
    let status = '1'
    if (itemData.status !== '' && itemData.status !== undefined) {
      status = itemData.status
    }
    return this.imgPrePath + '/mapImg/video/' + id+'/'+ status + '.png'
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

  showDetail (item) {
    if(item.type === 'ztc'){
      item.type = 'cgj'
    }
    this.map.showDetail(item)
  }
}
export default VideoLayer
