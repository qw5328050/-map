/**
 * Created by fp on 2018/11/15.
 * 工业图层处理与点位显示
 */
import Vue from 'vue'
import BaseLayer from './baseLayer'
import industryDialog from '@/map/dialog/pollute/polluteIndustry/industryDialog.vue'
import husbandryDialog from '@/map/dialog/pollute/polluteHusbandry/husbandryDialog.vue'
import facilityDialog from '@/map/dialog/pollute/polluteFacility/facilityDialog.vue'
import constructionDialog from '@/map/dialog/pollute/polluteConstruction/constructionDialog.vue'
import cateringDialog from '@/map/dialog/pollute/polluteCatering/cateringDialog.vue'
import {objectAssign} from '@/utils/util'
import mapUtil from '@/map/js/util/mapUtil'

//加入图层
class IndustryPolluteLayer extends BaseLayer {
  constructor(options) {
    super(options);
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
    if (itemData.type !== '' && itemData.type !== undefined) {
      if (itemData.type === '001') {
        type = 'qy';
      } else if (itemData.type === '002') {
        type = 'xqyz';
      } else if (itemData.type === '003') {
        type = 'jzzw';
      } else if (itemData.type === '004') {
        type = 'jzgd';
      } else if (itemData.type === '005') {
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
    let dialog = null;
    switch (item.type) {
      case '001':
        dialog = industryDialog;
        break;
      case '002':
        dialog = husbandryDialog;
        break;
      case '003':
        dialog = facilityDialog;
        break;
      case '004':
        dialog = constructionDialog;
        break;
      case '005':
        dialog = cateringDialog;
        break;
    }
    let dialogObj = Vue.extend(dialog);
    let itemData = {};
    objectAssign(itemData, item);
    const info = {
      itemData: itemData
    };
    const obj = new dialogObj({
      data: info
    });
    obj.show();
  }
}
export default IndustryPolluteLayer
