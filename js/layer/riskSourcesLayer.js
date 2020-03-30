/**
 * Created by fp on 2018/11/15.
 * 监管图层处理
 */
import store from '@/store'
import BaseLayer from './baseLayer'
import { objectAssign } from '@/utils/util'
import constants from '@/utils/Constants'
import Vue from 'vue'
import xmap from '@/map/js/xmap/export/xmap'
//加入图层
class RiskSourcesLayer extends BaseLayer {
  constructor(options) {
    super(options);
  }

  createLayer(params) {
    if (this.alreadyInclude(params)) {
      return;
    }
    const self = this;
    const layer = new xmap.VectorLayer({
      zIndex: 100,
      useOrderStrategy: true,
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
    });
    this.xmap.addLayer(layer);
    this.vectorLayers.push({
      name: params.name,
      layer: layer
    });
  }

  getPicStyle(itemData, zoom, resolution, point, params) {
    return {
      styleType: 'icon',
      scale: this.getScale(zoom),
      src: this.getPicPath(itemData)
    };
  }

  getSelectedPicStyle(itemData, zoom, resolution, point, params) {
    return {
      styleType: 'icon',
      scale: this.getSelectedScale(zoom),
      src: this.getPicPath(itemData),
    };
  }

  getPicPath(itemData) {
    let picPath = '';
    if (itemData.reportId && itemData.riskLevelType && itemData.riskLevel) {
      picPath = this.imgPrePath + '/mapImg/env/' + itemData.riskLevelType + '/' + itemData.riskLevel + '.png';
    } else {
      picPath = this.imgPrePath + '/mapImg/env/0.png';
    }
    return picPath;
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

  showDetail(params) {
    if (params.reportId !== undefined && params.riskLevel !== undefined) {
      store.commit('user/updateReportId', params.reportId);
      store.commit('user/updateSopId', params.sopId);
      Vue.prototype.$eventHub.$emit(constants.showEnvDetail, {})
    }
  }
}
export default RiskSourcesLayer
