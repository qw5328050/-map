/**
 * Created by admin on 2019/5/16.
 */
import ztcHttp from '@/https/monitor/ztcHttp'
import ZtcLayer from '../layer/ztcLayer'
import mapUtil from '@/map/js/util/mapUtil'

class ZtcLayerHandle {
  constructor(options) {
    this.mapObj = options.mapObj
    this.mapEvtHandle = options.mapEvtHandle
    this.mapObj = options.mapObj
    this.ztcLayer = null
    this.timer = null;
  }

  initListener() {
    this.mapEvtHandle.$mapEvtBus.$on(mapUtil.EVT_NAME.map_ztcHide, () => {
      this.removeLayer()
      window.clearInterval(this.timer);
      this.timer = null;
    });
    this.mapEvtHandle.$mapEvtBus.$on(mapUtil.EVT_NAME.map_ztcResume, () => {
      this.resume();
    });
  }

  showDataInMap(options) {
    this.clear();
    if (options.checked) {
      this.initListener();
      this.initLayer()
      this.addDataInMap()
      this.timer = window.setInterval(() => {
        this.addDataInMap(options)
      }, window.SITE_CONFIG.map.ztcMonitorInterval ? window.SITE_CONFIG.map.ztcMonitorInterval : 5000)
    }
  }

  resume() {
    !this.ztcLayer && this.showDataInMap({
      checked: true
    });
  }

  clear() {
    this.mapEvtHandle.$mapEvtBus.$emit(mapUtil.EVT_NAME.panel_removeTrackDialog, {});
    this.mapEvtHandle.$mapEvtBus.$emit(mapUtil.EVT_NAME.map_endTrack, {});
    this.removeLayer();
    window.clearInterval(this.timer);
    this.timer = null;
    this.mapEvtHandle.$mapEvtBus.$off(mapUtil.EVT_NAME.map_ztcHide);
    this.mapEvtHandle.$mapEvtBus.$off(mapUtil.EVT_NAME.map_ztcResume);
  }

  addDataInMap() {
    ztcHttp.VehicleList().then(result => {
      if (result.data && result.data.length > 0) {
        this.addDataToLayer(result.data)
      }
    })
  }

  addDataToLayer(data) {
    this.mapObj.showData({
      name: mapUtil.staticParams.ztc,
      data: data
    })
  }

  initLayer() {
    !this.ztcLayer && (this.ztcLayer = new ZtcLayer({
      name: mapUtil.staticParams.ztc,
      map: this.mapObj,
    }))
  }

  removeLayer() {
    this.mapObj.removeLayer({
      name: mapUtil.staticParams.ztc
    })
    this.ztcLayer = null
  }
}

export default ZtcLayerHandle
