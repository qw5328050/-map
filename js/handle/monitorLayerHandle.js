/**
 * Created by fp on 2019/1/17.
 */
import mapLayerHttp from '@/https/map/mapLayerHttp'
import MonitorLayer from '../layer/monitorLayer'
import PolluteLayerHandle from './polluteLayerHandle'

class MonitorLayerHandle extends PolluteLayerHandle {
  constructor(options) {
    super(options);
  }
  showDataInMap(options) {
    if (options.checked) {
      new MonitorLayer(options);
      this._showDataInMap(options);
    } else {
      this.mapObj.removeLayer({
        name: options.code
      });
    }
  }
  _showDataInMap(options) {
    mapLayerHttp.getPointInMap({
      type: options.code,
      timeStamp: this.mapEvtHandle.getDate(),
      timeRangeType: this.mapEvtHandle.getMonitorTimeRange()
    }).then(result => {
      this._showDataInner(options.name, result.data);
    })
  }
}
export default MonitorLayerHandle;
