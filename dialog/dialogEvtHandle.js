/**
 * Created by fp on 2018/12/18.
 */
import mapUtil from "@/map/js/util/mapUtil";
import airDialogCtrl from "@/map/dialog/air/airDialogCtrl";
import constructionDialogCtrl from "@/map/dialog/construction/constructionDialogCtrl";
import egDialogCtrl from "@/map/dialog/eg/egDialogCtrl";
import polluteDialogCtrl from "@/map/dialog/pollute/polluteDialogCtrl";
import waterDialogCtrl from "@/map/dialog/water/waterDialogCtrl";
import dustDialogCtrl from "@/map/dialog/dust/dustDialogCtrl";
import monitorDialogCtrl from "@/map/dialog/monitor/monitorDialogCtrl";
import videoDialogCtrl from "@/map/dialog/video/videoDialogCtrl";
class DialogEvtHandle {

  constructor(options) {
    // 数据总线
    this.$mapEvtBus = options.$mapEvtBus
    this.dialog = null
    this.addListener()
  }

  addListener() {
    this.$mapEvtBus.$on(mapUtil.EVT_NAME.dialog_showDialog, params => {
      console.log("params0:",params);
      this.showDialog(params)
    })
    this.$mapEvtBus.$on(mapUtil.EVT_NAME.dialog_removeDialog, params => {
      this.removeDialog(params)
    })
  }

  // 弹框
  showDialog(params) {
    console.log("showDialog-params:",params);
    // 判断是否需要关闭之前的弹框
    if (!params.notCloseBefore) {
      this.removeDialog(params)
    }
    if(params.type === 'sewage'){
      params.type = 'wscl';
    }
    this.$mapEvtBus.$emit(mapUtil.EVT_NAME.search_hideResultPanel)
    let dialog = null;
    if (mapUtil.waterTypeList.indexOf(params.type) >= 0 || mapUtil.waterType.wscl === params.type) {
      dialog = waterDialogCtrl.showDialog(params)
    } else if (mapUtil.videoAlarm.indexOf(params.type) >= 0) {
      dialog = videoDialogCtrl.showDialog(params)
    } else if (mapUtil.airTypeList.indexOf(params.type) >= 0 ||
      mapUtil.carTypeList.indexOf(params.type) >= 0 || mapUtil.pmPoint === params.type) {
      dialog = airDialogCtrl.showDialog(params)
    } else if (mapUtil.constructionList.indexOf(params.type) >= 0) {
      dialog = constructionDialogCtrl.showDialog(params)
    } else if (mapUtil.egList.indexOf(params.type) >= 0) {
      dialog = egDialogCtrl.showDialog(params)
    } else if (mapUtil.qyWrList.indexOf(params.type) >= 0 ||
      mapUtil.feiqAlarmTypeList.indexOf(params.type) >= 0 ||
      mapUtil.staticParams.ztc === params.type ||
      mapUtil.staticParams.gridQuestionFlag === params.type) {
      dialog = polluteDialogCtrl.showDialog(params)
    } else if (mapUtil.dustTypeList.indexOf(params.type) >= 0) {
      dialog = dustDialogCtrl.showDialog(params)
    } else if (mapUtil.monitorTypeList.indexOf(params.type) >= 0) {
      dialog = monitorDialogCtrl.showDialog(params)
    } else if (mapUtil.staticParams.fsy.indexOf(params.type) >= 0) {
      dialog = polluteDialogCtrl.showDialog(params)
    } else if (mapUtil.staticParams.yc.indexOf(params.type) >= 0) {
      console.log('yc地图参数请求：', params);
      dialog = polluteDialogCtrl.showDialog(params)
    }
/*    if (dialog) {
      this.$mapEvtBus.$emit(mapUtil.EVT_NAME.panel_showPanel, {})
    }*/
    if (!(params.nameNotToSearch === true)) {
      this.setKeysName(params.name)
    }
    dialog && (this.dialog = dialog)
  }

  removeDialog(params) {
    if (this.dialog && this.dialog.close) {
      this.dialog.close(params)
    }
  }

  setKeysName(name) {
    this.$mapEvtBus.$emit(mapUtil.EVT_NAME.search_setKeywords, name)
  }
}

export default DialogEvtHandle
