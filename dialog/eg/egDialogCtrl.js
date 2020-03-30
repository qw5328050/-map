/**
 * Created by fp on 2018/12/18.
 */
import Vue from 'vue'
import onlineMonitorDialog from '@/map/dialog/eg/onlineMonitorDialog.vue'
import electricDialog from '@/map/dialog/eg/electricDialog.vue'
import constants from '@/utils/Constants'

const getDialogObjByItem = function (item) {
  let dialog = null;
  const type = item._type;
  if (type === constants.processPointType.online) {
    dialog = Vue.extend(onlineMonitorDialog);
  } else if (type === constants.processPointType.electric) {
    dialog = Vue.extend(electricDialog);
  }
  return dialog;
};

export default {
  showDialog(params){
    let dialogObj = getDialogObjByItem(params);
    if (dialogObj) {
      const obj = new dialogObj({
        data: params
      });
      obj.show();
      return obj;
    }
    return null;
  }
}
