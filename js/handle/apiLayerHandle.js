/**
 * Created by fp on 2019/1/17.
 */
import mapLayerHttp from "@/https/map/mapLayerHttp";
import PolluteLayerHandle from "./polluteLayerHandle";
import AirLayer from "@/map/js/layer/airLayer";
import mapUtil from "@/map/js/util/mapUtil";
import Alert from "@/components/_public/zt/alert/index";

class ApiLayerHandle extends PolluteLayerHandle {
  constructor(options) {
    super(options);
  }

  showDataInMap(options) {
    if (options.checked) {
      options.name = 'api';
      options.map = this.mapObj;
      new AirLayer(options);
      this._showDataInMap(options);
    } else {
      this.mapObj.removeLayer({
        name: 'api'
      });
    }
  }

  isEmptyObject(data) {
    return (JSON.stringify(data) == "{}");
  }

  _showDataInMap(options) {
    mapLayerHttp.getPointInBySiteId({
      type: options.type,
      code: options.code,
      dateType: 'hour',
      factorName: 'aqi'
    }).then(result => {
      if (result.data && !this.isEmptyObject(result.data)) {
        this._showDataInner('api', [result.data]);
        this.mapEvtHandle.$mapEvtBus.$emit(mapUtil.EVT_NAME.dialog_showDialog, result.data);
        this.mapEvtHandle.$mapEvtBus.$emit(mapUtil.EVT_NAME.map_relatedAnalysis, {
          center: [parseFloat(result.data.lng), parseFloat(result.data.lat)],
          params: options
        })
      } else {
        Alert('找不到对应的站点');
      }
    })
  }
}
export default ApiLayerHandle;
