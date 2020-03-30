/**
 * Created by fp on 2018/11/15.
 * 监管图层处理
 */
import Vue from 'vue'
import BaseLayer from './baseLayer'
import {objectAssign} from '@/utils/util'
import TaskDetailDialog from '@/map/dialog/gird/taskDetailDialog.vue'
import EventDetailDialog from '@/map/dialog/gird/eventDetailDialog.vue'
import XuncDetailDialog from '@/map/dialog/gird/xuncDetailDialog.vue'
import mapLeftDialog from '@/map/dialog/pollute/polluteIndustry/left/mapLeftDialog.vue'
import dianlDialog from '@/map/dialog/pollute/dianl/dianlDialog.vue'
import mapUtil from '@/map/js/util/mapUtil'
import gridDetailDialog from "../../dialog/gird/gridDetailDialog";

//加入图层
class MonitorLayer extends BaseLayer {
  constructor(options) {
    super(options);
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
    let type = 'patrol';
    if (itemData.type !== '' && itemData.type !== undefined) {
      type = itemData.type;
    }
    return this.imgPrePath + '/mapImg/monitor/' + type + '/1.png'
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
    //弹框在地图左侧显示
    let dialogObj = null;
    dialogObj = Vue.extend(gridDetailDialog);
    let itemData = {};
    objectAssign(itemData, params);
    let info = {
      itemData: itemData,
    };
    if (mapUtil.monitorTypeList.indexOf(itemData.type) >= 0) {
      info.itemData.sopId = itemData.id;
      info.pollutionId = params.pollutionId;
      info.timeStamp = params.params.timeStamp;
    } else {
      //污染源
      info.itemData.sopId = itemData.id;
    }
    const obj = new dialogObj({
      data: info
    });
    obj.show();
    return obj;
  }

}
export default MonitorLayer
