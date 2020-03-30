/**
 * Created by fp on 2018/11/15.
 * 空气质量站点弹框
 */

import xmap from '@/map/js/xmap/export/xmap'
import PolluteLayer from './polluteLayer'
import aqiColor from '@/utils/aqiColor'

class MovePointLayer extends PolluteLayer {
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
        return self.getPointStyle(itemData, zoom, resolution, point, params);
      },
      selectStyleFunction: function (itemData, zoom, resolution, point) {
        return self.getPointStyle(itemData, zoom, resolution, point, params);
      }
    });
    this.xmap.addLayer(layer);
    this.xmap.addExcludeFocusLayer(layer);
    this.vectorLayers.push({
      name: params.name,
      layer: layer
    });
  }

  getPointStyle(item) {
    let pmType = this.getPmType();
    let color = aqiColor.ztAirColorRgb(pmType, item[pmType]);
    return {
      styleType: 'circle',
      fillColor: color,
      strokeWeight: 0,
      radius: 4
    }
  }

  setPmType(type) {
    this.options.pmType = type;
    this.map.refresh();
  }

  getPmType() {
    return this.options.pmType ? this.options.pmType : 'pm10';
  }
}

export default MovePointLayer
