/**
 * Created by fp on 2019/1/11.
 * 污染源 企业图层处理 ，包括企业站点
 */
import mapLayerHttp from '@/https/map/mapLayerHttp'
import IndustryNormalLayer from '@/map/js/layer/industryNormalLayer'

class PolluteLayerHandle {
  constructor(options) {
    this.mapEvtHandle = options.mapEvtHandle;
    this.mapObj = options.mapObj;
  }

  showDataInMap(options) {
    if(options.checked){
      new IndustryNormalLayer(options);
      this._showDataInMap(options);
    }else{
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

  _showDataInner(layerName, data){
    this.mapObj.showData({
      name: layerName,
      data: data
    })
  }
}


export default PolluteLayerHandle;
