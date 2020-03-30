import {objectAssign} from "@/utils/util";
import CustomAlarmLayer from "@/map/js/layer/customAlarmLayer";
import alarmMapHttp from "@/https/alarm/alarmMapHttp";
import mapUtil from "@/map/js/util/mapUtil";

class CustomAlarmLayerHandle {

  constructor(options) {
    this.mapEvtHandle = options.mapEvtHandle
    this.mapObj = options.mapObj
  }

  showDataInMap(tempOptions) {
    let options = {}
    objectAssign(options, tempOptions)
    if (options.stationType && options.stationType.length > 0) {
      new CustomAlarmLayer(options)
      this._showDataInMap(options)
    } else {
      this.mapObj.removeLayer(options);
      this.mapEvtHandle.$mapEvtBus.$emit(mapUtil.EVT_NAME.panel_showAlarmDataList, {
        name: options.name,
        data: []
      })
    }
  }

  _showDataInMap(options) {
    let params = {
      type: options.stationType,
      time: options.time
    }
    alarmMapHttp.findWarnStationList(params).then(response => {
      this.mapObj.showData({
        name: options.name,
        data: response.result
      })
      this.mapEvtHandle.$mapEvtBus.$emit(mapUtil.EVT_NAME.panel_showAlarmDataList, {
        name: options.name,
        data: response.result
      })
    }).catch((error) => {
      console.error(error)
    })
  }
}

export default CustomAlarmLayerHandle
