/**
 * Created by fp on 2019/1/11.
 * 风场  热力图图层处理
 */
import xmap from '@/map/js/xmap/export/xmap'
import mapLayerHttp from '@/https/map/mapLayerHttp'
import mapUtil from '../util/mapUtil';

class HeatmapLayerHandle {
  constructor(options) {
    this.mapEvtHandle = options.mapEvtHandle;
    this.mapObj = options.mapObj;
    this.layers = [];
  }

  showDataInMap(options) {
    switch (options.code) {
      case 'AQIRLT':
      case 'PM10RLT':
        this.dealHeatMap(options);
        break;
      case 'fengc':
        this.dealWindyLayer(options);
        break;
      default:
        break;
    }
  }

  showTimerDataInMap(item) {
    this.addHeatMapLayer({
      name: item.type,
      url: item.url
    })
  }

  dealHeatMap(obj) {
    this.removeLayer({
      name: obj.code,
    });
    if (obj.checked) {
      mapLayerHttp.getHeatmapInfos({
        dataType: this.mapEvtHandle.getAirDateType(),
        factor: HeatmapLayerHandle.getHeatmapFactor(obj.code),
        startTime: this.mapEvtHandle.getDate(),
        endTime: this.mapEvtHandle.getDate()
      }).then(result => {
        if (result.data && result.data.length > 0) {
          this.addHeatMapLayer({
            name: obj.code,
            url: window.SITE_CONFIG.proxyName + result.data[0].fFileUrl,
          })
        }
      });
    }
  }

  static getHeatmapFactor(code) {
    if (code === 'AQIRLT') {
      return 'aqi';
    } else if (code === 'PM10RLT') {
      return 'pm10'
    } else {
      return '';
    }
  }

  /**
   * 添加热力图层
   * @param params
   */
  addHeatMapLayer(params) {
    this.removeLayer(params);
    if (params.url) {
      const layer = new xmap.ImageLayer({
        zIndex: 5,
        map: this.mapObj.map,
        opacity: 0.85,
        extent: window.SITE_CONFIG.map.extent
      });
      layer.showData({
        url: params.url
      });
      this.layers.push({
        name: params.name,
        layer: layer
      })
    }
  }

  dealWindyLayer(params) {
    if (!params.checked) {
      this.removeLayer(params);
    } else {
      this.addWindyLayer(params);
    }
  }

  /**
   * 添加风场图层
   * @param params
   */
  // addWindyLayer(params) {
  //   let code = 'EPSG:4326';
  //   let boundaryJson = window.SITE_CONFIG.WindyUtil.getBoundaryJson();
  //   let windyJson = window.SITE_CONFIG.WindyUtil.getWindyJson();
  //   const layer = new xmap.WindyLayer({
  //     projection: code,
  //     filter: boundaryJson,
  //     ratio: 1
  //   });
  //   layer.showData({
  //     data: windyJson
  //   });
  //   this.mapObj.map.addLayer(layer);
  //   this.layers.push({
  //     name: params.code,
  //     layer: layer
  //   })
  // }

  addWindyLayer(params) {
    let code = 'EPSG:4326';
    mapUtil.getLatestWindData().then((result) => {
      let windyJson = result
      const layer = new xmap.WindyLayer({
        projection: code,
        ratio: 1
      });
      this.mapObj.map.addLayer(layer);
      layer.showData({
        data: windyJson
      });
      this.layers.push({
        name: params.code,
        layer: layer
      })
    })
  }

  /**
   * 移出图层
   * @param params
   */
  removeLayer(params) {
    let index = -1;
    //删除之前的
    this.layers.some((item, i) => {
      if (params.name === item.name) {
        index = i;
        return true;
      } else {
        return false;
      }
    });
    if (index >= 0) {
      let data = this.layers.splice(index, 1)[0];
      this.mapObj.map.removeLayer(data.layer)
    }
  }


}

export default HeatmapLayerHandle;
