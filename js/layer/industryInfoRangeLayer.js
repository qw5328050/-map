/**
 * 企业基本信息上地图上显示的范围
 * Created by fp on 2018/11/27.
 */

import xmap from '@/map/js/xmap/export/xmap'
import PolluteLayer from './polluteLayer'

class industryInfoRangeLayer extends PolluteLayer {
  constructor(options) {
    super(options);
  }

  //创建图层
  createLayer(params) {
    if (this.alreadyInclude(params)) {
      return;
    }
    const self = this;
    const layer = new xmap.VectorLayer({
      zIndex: 100,
      styleFunction: function (itemData, zoom, resolution, point) {//默认样式函数
        return self.getLineStyle(itemData, zoom, resolution, point, params);
      },
      selectStyleFunction: function (itemData, zoom, resolution, point) {
        return self.getLineStyle(itemData, zoom, resolution, point, params);
      }
    });
    this.xmap.addLayer(layer);
    this.xmap.addExcludeFocusLayer(layer);
    this.vectorLayers.push({
      name: params.name,
      layer: layer
    });
  }

  getLineStyle() {
    return {
      styleType: 'polygon',
      strokeColor: 'rgb(255,0,0,0.7)',
      fillColor: 'rgb(246,233,213, 0.7)',
      strokeWeight: '1'
    }
  }

}

export default industryInfoRangeLayer;
