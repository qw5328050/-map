/**
 * Created by fp on 2019/5/7.
 */
import Vue from 'vue'
import BaseLayer from './baseLayer'
import xmap from '@/map/js/xmap/export/xmap'
import industryDialog from '@/map/dialog/pollute/polluteIndustry/industryDialog.vue'
import husbandryDialog from '@/map/dialog/pollute/polluteHusbandry/husbandryDialog.vue'
import facilityDialog from '@/map/dialog/pollute/polluteFacility/facilityDialog.vue'
import constructionDialog from '@/map/dialog/pollute/polluteConstruction/constructionDialog.vue'
import cateringDialog from '@/map/dialog/pollute/polluteCatering/cateringDialog.vue'
import {objectAssign} from '@/utils/util'
import mapUtil from '@/map/js/util/mapUtil'

class PolluteSingleLayer extends BaseLayer {
  constructor(options) {
    super(options);
  }

  createLayer(params) {
    if (this.alreadyInclude(params)) {
      return;
    }
    const self = this;
    const layer = new xmap.VectorLayer({
      styleFunction: function (itemData, zoom, resolution, point) {//默认样式函数
        return self.getPicStyle(itemData, zoom, resolution, point);
      },
      selectStyleFunction: function (itemData, zoom, resolution, point) {//默认样式函数
        return self.getSelectedPicStyle(itemData, zoom, resolution, point);
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
      src: this.getPicPath(itemData),
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
    let type = 'qy';
    if (itemData.typeStr !== '' && itemData.typeStr !== undefined) {
      if (itemData.typeStr === '1') {
        type = 'qy';
      } else if (itemData.typeStr === '2') {
        type = 'xqyz';
      } else if (itemData.typeStr === '3') {
        type = 'jzzw';
      } else if (itemData.typeStr === '4') {
        type = 'jzgd';
      } else if (itemData.typeStr === '5') {
        type = 'cyqy';
      }
    }
    let statusPic = mapUtil.transformStatus(itemData.status);
    return this.imgPrePath + '/mapImg/industry/' + type + '/' + statusPic + '.png'
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

  showDetail(item, position, params) {
    console.log('params:', item)
    let dialog = industryDialog;
   /* item.id = item.id
    item.sopId = item.id
    let dialog = industryDialog;
    let selectNavCode = '';
    let dialogObj = Vue.extend(dialog);
    let itemData = {};
    objectAssign(itemData, item);
    const info = {
      itemData: itemData
    };
    const obj = new dialogObj({
      data: info
    });
    obj.selectDailog = 'info';
    obj.selectNavCode = selectNavCode;
    obj.show();*/
    let dialogObj = Vue.extend(dialog);
    let itemData = {};
    objectAssign(itemData, item);
    itemData.sopId = itemData.id;
    const info = {
      itemData: itemData
    };
    const obj = new dialogObj({
      data: info
    });
    obj.selectDailog = 'info';
    obj.show();
  }
}

export default PolluteSingleLayer;
