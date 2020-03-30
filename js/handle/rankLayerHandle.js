/**
 * Created by fp on 2019/1/11.
 * 空气质量图层处理
 */
import AirLayer from '@/map/js/layer/airLayer'

class RankLayerHandle {
  constructor(options) {
    this.mapEvtHandle = options.mapEvtHandle;
    this.mapObj = options.mapObj;
    this.beforeCode = '';
  }

  //显示数据
  showDataInMap(options) {
    if (this.beforeCode) {
      this.mapObj.showData({
        name: this.beforeCode,
        data: []
      })
    }
    options.map = this.mapObj;
    this.beforeCode = options.code;
    new AirLayer(options);
    this._showAirDataInMap(options);
  }

  //显示普通的矢量点在地图上
  _showAirDataInMap(options) {
    this.mapObj.showData({
      name: options.name,
      data: options.data
    });
  }
}
export default RankLayerHandle;
