import {objectAssign} from "@/utils/util";
import VideoAlarmLayer from "@/map/js/layer/videoAlarmLayer";
import videoAlarmMapHttp from "@/https/video/videoAlarmMapHttp";
import mapUtil from "@/map/js/util/mapUtil";

class VideoAlarmLayerHandle {

  constructor(options) {
    this.mapEvtHandle = options.mapEvtHandle
    this.mapObj = options.mapObj
  }

  showDataInMap(tempOptions) {
    let options = {}
    objectAssign(options, tempOptions);
    if (options.recognitionType && options.recognitionType.length > 0) {
      new VideoAlarmLayer(options);
      this._showDataInMap(options);
    } else {
      this.mapObj.removeLayer(options);
      this.mapEvtHandle.$mapEvtBus.$emit(mapUtil.EVT_NAME.panel_showVideoAlarmDataList, {
        name: options.name,
        data: []
      })
    }
  }

  _showDataInMap(options) {
    let params = {
      recognitionType: options.recognitionType,
    };
    videoAlarmMapHttp.mapShowPoint(params).then(response => {
      this.mapObj.showData({
        name: options.name,
        data: response.result
      });
      this.mapEvtHandle.$mapEvtBus.$emit(mapUtil.EVT_NAME.panel_showVideoAlarmDataList, {
        name: options.name,
        data: response.result
      })
    }).catch((error) => {
      console.error(error)
    })
  }
}

export default VideoAlarmLayerHandle
