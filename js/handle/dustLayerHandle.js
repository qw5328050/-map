/**
 * Created by fp on 2019/1/17.
 */
import mapLayerHttp from '@/https/map/mapLayerHttp'
import PolluteLayerHandle from './polluteLayerHandle'

class DustLayerHandle extends PolluteLayerHandle {
  constructor(options) {
    super(options);
  }

  _showDataInMap(options) {
    mapLayerHttp.getPointInMap({
      type: options.code,
      time: this.mapEvtHandle.getDate(),
      dateType: this.mapEvtHandle.getAirDateType(),
      factorCode: this.mapEvtHandle.getSelectedFactorByCode(options.code)
    }).then(result => {
      this._showDataInner(options.name, result.data);
    })
  }
}
export default DustLayerHandle;
