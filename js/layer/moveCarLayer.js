/**
 * Created by fp on 2018/11/15.
 * 空气质量站点弹框
 */

import xmap from '@/map/js/xmap/export/xmap'
import PolluteLayer from './polluteLayer'
import mapUtil from '@/map/js/util/mapUtil'

class MoveCarLayer extends PolluteLayer {
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
      zIndex: 200,
      styleFunction: function (itemData, zoom, resolution, point) {//默认样式函数
        return self.getPicStyle(itemData, zoom, resolution, point, params);
      },
      selectStyleFunction: function (itemData, zoom, resolution, point) {
        return self.getSelectedPicStyle(itemData, zoom, resolution, point, params);
      },
      singleclick: function (itemData, zoom, point) {
        //获取数据
        self.xmap.clearHoverTip();
        self.showDetail(itemData, [itemData.longitude, itemData.latitude], params);
      }
    })
    this.xmap.addLayer(layer)
    this.vectorLayers.push({
      name: params.name,
      layer: layer
    })
  }

  getScale(zoom) {
    let scale = 0.8;
    if (zoom < 2) {
      scale = 0.5;
    } else if (zoom >= 2 && zoom < 4) {
      scale = 0.6;
    } else if (zoom >= 4 && zoom < 6) {
      scale = 0.7;
    }
    return scale;
  }

  getSelectedScale(zoom) {
    let scale = 0.9;
    if (zoom < 2) {
      scale = 0.6;
    } else if (zoom >= 2 && zoom < 4) {
      scale = 0.7;
    } else if (zoom >= 4 && zoom < 6) {
      scale = 0.8;
    }
    return scale;
  }

  getPicPath(itemData) {
    let pic = 0;
    if (itemData.status === mapUtil.status.normal) {
      pic = 1;
    }
    return this.imgPrePath + `/mapImg/air/car/${pic}.png`
  }

  showDetail(item) {
    this.map.showDetail(item)
  }
}

export default MoveCarLayer
