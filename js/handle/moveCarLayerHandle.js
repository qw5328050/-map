/**
 * Created by fp on 2019/4/3.
 */
import mapLayerHttp from '@/https/map/mapLayerHttp'
import MoveCarLayer from '../layer/moveCarLayer'
import mapUtil from '@/map/js/util/mapUtil'

class MoveCarLayerHandle {
  constructor(options) {
    this.mapObj = options.mapObj;
    this.mapEvtHandle = options.mapEvtHandle;
    this.mapObj = options.mapObj;
    this.moveCarLayer = null;
    // this.movePointLayer = null;
    this.timer = null;
  }

  showDataInMap(options) {
    this.clear();
    if (options.checked) {
      this.initLayer();
      this.addDataInMap();
      this.timer = window.setInterval(() => {
        this.addDataInMap(options);
      }, window.SITE_CONFIG.map.carInterval ? window.SITE_CONFIG.map.carInterval : 5000);
    }
  }

  clear() {
    this.removeLayer();
    window.clearInterval(this.timer);
    this.timer = null;
  }

 /* refresh() {
    if (this.timer) {
      let layer = this.mapObj.getLayer({
        name: mapUtil.staticParams.moveCar
      });
      if (layer) {
        layer.setPmType(this.mapEvtHandle.getSelectedFactorByCode(mapUtil.staticParams.zhgc));
        layer.layer.refresh();
      }
    }
  }*/

  addDataInMap() {
    mapLayerHttp.getPointInMap({
      type: mapUtil.staticParams.sscl,
    }).then(result => {
      if (result.data && result.data.length > 0) {
        this.addDataToCarLayer(result.data);
        // this.addDataToPointLayer(result.data);
      }
    })
  }

  addDataToCarLayer(data) {
    data.forEach(item => {
      item.bakName = item.name;
      item.name = item.carNo;
    })
    this.mapObj.showData({
      name: mapUtil.staticParams.moveCar,
      data: data
    })
  }

  addDataToPointLayer(data) {
    let validData = [];
    data.forEach(item => {
      if (item.status === mapUtil.status.normal) {
        validData.push({
          id: Math.random() + '_',
          longitude: item.longitude,
          latitude: item.latitude,
          pm10: item.pm10,
          pm25: item.pm25
        });
      }
    });
    this.mapObj.showData({
      name: mapUtil.staticParams.movePoint,
      operateType: 'add',
      data: validData
    })
  }

  initLayer() {
    !this.moveCarLayer && (this.moveCarLayer = new MoveCarLayer({
      name: mapUtil.staticParams.moveCar,
      map: this.mapObj,
    }));
   /* !this.movePointLayer && (this.movePointLayer = new MovePointLayer({
      name: mapUtil.staticParams.movePoint,
      map: this.mapObj,
      pmType: this.mapEvtHandle.getSelectedFactorByCode(mapUtil.staticParams.zhgc)
    }));*/
  }

  removeLayer() {
    this.mapObj.removeLayer({
      name: mapUtil.staticParams.moveCar
    });
   /* this.mapObj.removeLayer({
      name: mapUtil.staticParams.movePoint
    });*/
    this.moveCarLayer = null;
    // this.movePointLayer = null;
  }
}

export default MoveCarLayerHandle;
