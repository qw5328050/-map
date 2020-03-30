/**
 * Created by fp on 2018/12/18.
 */
import Vue from "vue";
import {objectAssign} from "@/utils/util";
import mapUtil from "@/map/js/util/mapUtil";
import mapLeftDialog from "@/map/dialog/pollute/polluteIndustry/left/mapLeftDialog.vue";
import dianlDialog from "@/map/dialog/pollute/dianl/dianlDialog.vue";
import ztcDialog from "@/map/dialog/pollute/ztc/ztcDialog.vue";
import gridQuestionDialog from "@/map/dialog/gird/gridQuestionDialog.vue";
import fsyDialog from "@/map/dialog/pollute/fsy/fsyDialog.vue";
import ycDialog from "@/map/dialog/pollute/yc/ycDialog.vue";
import vocsDialog from "@/map/dialog/pollute/vocs/vocsDialog.vue";

export default {
  showDialog(params) {
    //弹框在地图左侧显示
    let dialogObj = null
    if (params.type === 'qydl') {
      dialogObj = Vue.extend(dianlDialog)
    } else if (params.type === mapUtil.staticParams.ztc) {
      dialogObj = Vue.extend(ztcDialog)
    } else if (params.type === mapUtil.staticParams.gridQuestionFlag) {
      dialogObj = Vue.extend(gridQuestionDialog)
    } else if (params.type === mapUtil.staticParams.fsy) {
      dialogObj = Vue.extend(fsyDialog)
    } else if (params.type === mapUtil.staticParams.vocs) {
      dialogObj = Vue.extend(vocsDialog)
    } else if (params.type === mapUtil.staticParams.yc) {
      dialogObj = Vue.extend(ycDialog)
    } else {
      dialogObj = Vue.extend(mapLeftDialog)
    }
    let itemData = {}
    objectAssign(itemData, params)
    if (itemData.type === 'wrfeiq') {
      itemData.type = 'feiq'
    }
    let info = {
      itemData: itemData,
    }
    if (mapUtil.qyList.indexOf(itemData.type) >= 0) {
      info.itemData.selectedItem = {
        type: itemData.type,
        code: params.code,
        name: params.name
      }
    } else {
      //污染源
      info.itemData.sopId = itemData.id
    }
    const obj = new dialogObj({
      data: info
    })
    obj.show()
    return obj
  }
}
