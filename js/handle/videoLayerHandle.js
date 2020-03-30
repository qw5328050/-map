/**
 * Created by admin on 2019/4/1.
 * 视频点位图层处理
 */
// import mapLayerHttp from '@/https/map/mapLayerHttp'
import videoMonitorHttp from '@/https/video/videoMonitorHttp'
import VideoLayer from '@/map/js/layer/videoLayer'
import BaseLayerHandle from '@/map/js/handle/baseLayerHandle'

class VideoLayerHandle {
  constructor(options) {
    this.mapEvtHandle = options.mapEvtHandle;
    this.mapObj = options.mapObj;
  }

  //显示数据
  showDataInMap(options) {
    options.name = 'video_' + options.code;
    if (options.checked) {
      new VideoLayer(options);
      this._showVideoDataInMap(options);
    } else {
      this.mapObj.removeLayer({
        name: options.name
      });
    }
  }

  //显示视频点位在地图上
  _showVideoDataInMap(options) {
    let params = {
      typeId: options.id
    }
    videoMonitorHttp.getSiteInfoByType(params).then(res => {
      if (res.code == "0") {
        this.showVideoDataInner(options.name, res.result);
      }
    }).catch(error => {
      console.error(error);
    })
  }

  showVideoDataInner(layerName, data) {
    this.mapObj.showData({
      name: layerName,
      data: data
    })
  }
}
export default VideoLayerHandle
