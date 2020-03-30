/**
 * Created by fp on 2018/12/18.
 */
import Vue from 'vue'
import {objectAssign} from '@/utils/util'
import videoDialog from './videoDialog.vue'

export default {
  showDialog(params){
    //弹框在地图左侧显示
    let dialogObj = Vue.extend(videoDialog);
    let itemData = {};
    objectAssign(itemData, params);
    let info = {
      itemData: itemData,
    };
    const obj = new dialogObj({
      data: info
    });
    obj.show();
    return obj;
  }
}
