/**
 * Created by fp on 2019/1/11.
 * 水处理图层
 */
import mapLayerHttp from '@/https/map/mapLayerHttp'
import WaterLayer from '@/map/js/layer/waterLayer'
import PolluteLayerHandle from './polluteLayerHandle'

class WaterLayerHandle extends PolluteLayerHandle {
  constructor(options) {
    super(options);
  }

  showDataInMap(options) {
    if (options.checked) {
      new WaterLayer(options);
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
      time: this.mapEvtHandle.getDate(),
      dateType: this.mapEvtHandle.getAirDateType(),
    }).then(result => {
      result.data.forEach(item => {
              item.dateType = this.mapEvtHandle.getAirDateType()
            });
      this._showDataInner(options.name, result.data);
    })
  }
}

export default WaterLayerHandle;
