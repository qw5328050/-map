/**
 * Created by fp on 2018/12/18.
 */
import Vue from 'vue'
import stationDialog from './stationDialog.vue'
import microStationDialog from './microStationDialog.vue'
import roadDialog from './roadDialog.vue'
import moveCarDialog from './moveCarDialog.vue'
import pmPointDialog from './pmPointDialog.vue'
import mapUtil from '@/map/js/util/mapUtil'

const showStationDialog = function (params) {
  let dialogObj = Vue.extend(stationDialog)
  const obj = new dialogObj({
    data: params
  })
  obj.show()
  return obj
};

const showMicroStationDialog = function (params) {
  let dialogObj = Vue.extend(microStationDialog)
  const obj = new dialogObj({
    data: params
  })
  obj.show()
  return obj
};

const showRoadDialog = function (params) {
  let dialogObj = Vue.extend(roadDialog)
  const obj = new dialogObj({
    data: {
      code: params.code,
      type: params.type,
      dateType: params.dateType
    }
  })
  obj.show()
  return obj
};

const showMoveCarDialog = function (params) {
  let dialogObj = Vue.extend(moveCarDialog)
  const obj = new dialogObj({
    data: params
  })
  obj.show()
  return obj
};

const showPmPointDialog = function (params) {
  let dialogObj = Vue.extend(pmPointDialog)
  const obj = new dialogObj({
    data: params
  })
  obj.show()
  return obj
};

export default {
  showDialog (params) {
  /*else if (params.type === 'weiz') {
      dialog = showMicroStationDialog(params)
    } else if (params.type === 'jiez') {
   dialog = showStreetStationDialog(params)
   } */

    let dialog = null
    if (mapUtil.gssTypeList.indexOf(params.type) >= 0 || params.type === 'weiz' || params.type === 'jiez') {
      dialog = showStationDialog(params)
    }else if (params.type === 'zhgc') {
      dialog = showRoadDialog(params)
    } else if (params.type === 'sscl') {
      dialog = showMoveCarDialog(params)
    } else if (params.type === mapUtil.pmPoint) {
      dialog = showPmPointDialog(params)
    } else if (params.type === '') {
      dialog = showStationDialog(params)
    }
    return dialog
  }
}
