/**
 * Created by fp on 2018/12/21.
 *  关联分析图层
 */
import Vue from "vue";
import xmap from "@/map/js/xmap/export/xmap";
import mapLayerHttp from "@/https/map/mapLayerHttp";
import AirLayer from "./airLayer";
import RoadLayer from "./roadLayer";
import IndustryNormalLayer from "./industryNormalLayer";
import WpqyLayer from "./wpqyLayer";
import {getParamsByKey} from "@/utils/paramsCache";
import mapUtil from "@/map/js/util/mapUtil";
import relatedSelectedPanel from "@/map/dialog/_public/relatedSelectedPanel.vue";
import Constants from "@/utils/Constants";
import {getFileDownloadUrl} from "@/utils/index";

class RelatedAnalysisLayer {
  constructor(options) {
    this.options = options;
    let mapInfo = getParamsByKey(Constants.mapInfo);
    this.radius = mapInfo.radius ? mapInfo.radius : 2000;
    this.center = options.center;
    this.mapObj = options.mapObj;
    this.selectedPanel = null;
    this.$mapEvtBus = options.$mapEvtBus;
    this.mapEvtHandle = options.mapEvtHandle;
    this.addListener();
    this.showSelectedPanel();
    this.selectedList = [];
    this.aqiHeatLayer = null;
    this.pm10HeatLayer = null;
    this.windyLayer = null;
    this.dragRadiusInteraction = new xmap.DragRadiusInteraction({
      center: options.center,
      map: options.mapObj.map,
      endCallback: () => {
        this.endRelated();
      },
      updateCallback: (params) => {
        this.updateRelatedRadius(params);
      },
      radius: this.radius
    });
    this.layers = [];
  }

  addListener() {
    this.$mapEvtBus.$on(mapUtil.EVT_NAME.map_updateRelatedSelected, params => {
      this.selectedList = params.all;
      if (params.single) {
        this.updateSelected(params.single);
      } else {
        this.updateAllSelected();
      }
    });
    this.$mapEvtBus.$on(mapUtil.EVT_NAME.map_updateTime, params => {
      this.updateAllSelected();
    });
  }

  removeLayer() {

  }

  showSelectedPanel() {
    let dialogObj = Vue.extend(relatedSelectedPanel);
    const obj = new dialogObj({
      data: {
        itemData: this.options.params
      }
    });
    obj.show(document.querySelector('.map-area'));
    this.selectedPanel = obj;
  }

  endRelated() {
    this.selectedPanel.close();
    this.cancelAll();
    this.$mapEvtBus.$emit(mapUtil.EVT_NAME.map_cancelAnalysis, {});
  }

  //选中或者取消内容
  updateSelected(single) {
    let upperType = single.type.charAt(0).toUpperCase() + single.type.slice(1);
    let func = 'show' + upperType + 'Data';
    this[func] && this[func](single);
  }

  updateRelatedRadius(params) {
    this.radius = params.radius;
    this.updateAllSelected();
  }

  //更新所有的效果
  updateAllSelected() {
    this.selectedList.forEach(item => {
      if (item.checked) {
        this.updateSelected(item);
      }
    })
  }

  cancelAll() {
    this.selectedList.forEach(item => {
      item.checked = false;
      this.updateSelected(item);
    })
  }

  showJiezData(single) {
    let layerName = single.type + 'Related';
    this.mapObj.removeLayer({
      name: layerName
    });
    if (single.checked) {
      new AirLayer({
        map: this.mapObj,
        name: layerName
      });
      this.showPointData(single, layerName);
    }
  }

  showWpqyData(single) {
    let layerName = single.type + 'Related';
    this.mapObj.removeLayer({
      name: layerName
    });
    if (single.checked) {
      new WpqyLayer({
        map: this.mapObj,
        name: layerName
      });
      this.showPointData(single, layerName);
    }
  }

  showBzzData(single) {
    let layerName = single.type + 'Related';
    this.mapObj.removeLayer({
      name: layerName
    });
    if (single.checked) {
      new AirLayer({
        map: this.mapObj,
        name: layerName
      });
      this.showPointData(single, layerName);
    }
  }

  showWeizData(single) {
    this.showJiezData(single);
  }

  showFeiqData(single) {
    this.showZxqyData(single);
  }

  showFeisData(single) {
    this.showZxqyData(single);
  }

  showWsclData(single) {
    this.showZxqyData(single);
  }


  showGdycData(single) {
    this.showZxqyData(single);
  }

  showJzgdData(single) {
    this.showZxqyData(single);
  }

  showZhgcData(single) {
    let layerName = single.type + 'Related';
    this.mapObj.removeLayer({
      name: layerName
    });
    if (single.checked) {
      new RoadLayer({
        map: this.mapObj,
        name: layerName
      });
      mapLayerHttp.getRoadColor({
        dateType: this.mapEvtHandle.getAirDateType(),
        time: this.mapEvtHandle.getDate(),
        factorName: this.mapEvtHandle.getSelectedFactorByCode(mapUtil.staticParams.zhgc),
        type: mapUtil.staticParams.zhgc
      }).then(result => {
        const newResult = [];
        result.data.forEach(item => {
          let inCircle = xmap.util.justiceInRadius(item.geometry, this.center, this.radius);
          if (inCircle) {
            newResult.push(item);
          }
        });
        this.mapObj.showData({
          name: layerName,
          data: newResult
        })
      })
    }
  }

  showZxqyData(single) {
    let layerName = single.type + 'Related';
    this.mapObj.removeLayer({
      name: layerName
    });
    if (single.checked) {
      new IndustryNormalLayer({
        map: this.mapObj,
        name: layerName
      });
      this.showNoFactorPointData(single, layerName);
    }
  }

  showPointData(single, layerName) {
    let params = {
      longitude: this.center[0],
      latitude: this.center[1],
      distance: parseFloat(this.radius) / 1000,
      type: single.type,
      // time: this.mapEvtHandle.getDate(),
      dateType: this.mapEvtHandle.getAirDateType(),
      factorCode: this.mapEvtHandle.getRelatedSelectedFactorByCode(layerName)
    };
    // Promise.all([mapLayerHttp.getLinkAnalyPoint(Object.assign(params, {
    //   type: 'shik'
    // })), mapLayerHttp.getLinkAnalyPoint(Object.assign(params, {
    //   type: 'jiez'
    // }))]).then(responses => {
    mapLayerHttp.getLinkAnalyPoint(params).then(responses => {
      // let result = responses[0].result.concat(responses[1].result);
      let result = responses.result
      this.mapObj.showData({
        name: layerName,
        data: result
      })
    });
  }

  showNoFactorPointData(single, layerName) {
    mapLayerHttp.getLinkAnalyPoint({
      type: single.type,
      longitude: this.center[0],
      latitude: this.center[1],
      distance: parseFloat(this.radius) / 1000,
      // time: this.mapEvtHandle.getDate(),
      dateType: this.mapEvtHandle.getAirDateType(),
      factorCode: ''
    }).then(response => {
      this.mapObj.showData({
        name: layerName,
        data: response.result
      })
    });
  }

  showFengcData(single) {
    if (!single.checked) {
      this.removeLayer(single);
    } else {
      let mapInfo = getParamsByKey(Constants.mapInfo);
      if (mapInfo.showWindy) {
        this.addWindyLayer(single);
      }
    }
  }

  showAQIRLTData(single) {
    if (this.aqiHeatLayer) {
      this.aqiHeatLayer.removeLayer();
      this.aqiHeatLayer = null;
    }
    if (single.checked) {
      this.dealHeatMap({
        factor: 'aqi'
      });
    }
  }

  showPM10RLTData(single) {
    if (this.pm10HeatLayer) {
      this.pm10HeatLayer.removeLayer();
      this.pm10HeatLayer = null;
    }
    if (single.checked) {
      this.dealHeatMap({
        factor: 'pm10'
      });
    }
  }

  dealHeatMap(params) {
    mapLayerHttp.getHeatmapInfos({
      dataType: this.mapEvtHandle.getAirDateType(),
      factor: params.factor,
      startTime: this.mapEvtHandle.getDate(),
      endTime: this.mapEvtHandle.getDate()
    }).then(response => {
      if (response.result && response.result.length > 0) {
        if (params.factor === 'pm10') {
          this.pm10HeatLayer = this.addHeatmapLayer({
            url: getFileDownloadUrl(response.result[0].fFileUrl)
          })
        } else if (params.factor === 'aqi') {
          this.aqiHeatLayer = this.addHeatmapLayer({
            url: getFileDownloadUrl(response.result[0].fFileUrl)
          })
        }
      }
    });
  }

  getWKTFromRadius(radius) {
    return xmap.util.getWktFromRadius(this.center, radius);
  }

  /**
   * 添加热力图层
   * @param params
   */
  addHeatmapLayer(params) {
    const layer = new xmap.ImageLayer({
      map: this.mapObj.map,
      opacity: 0.85,
      filter: this.getWKTFromRadius(this.radius) / 1000,
      extent: getParamsByKey(Constants.mapInfo).extent
    });
    layer.showData({
      url: params.url
    });
    return layer;
  }

  /**
   * 添加风场图层
   * @param params
   */
  // addWindyLayer(params) {
  //   let code = 'EPSG:4326';
  //   const layer = new xmap.WindyLayer({
  //     projection: code,
  //     filter: this.getWKTFromRadius(this.radius)/1000,
  //     ratio: 1
  //   });
  //   this.mapObj.map.addLayer(layer);
  //   /*   layer.showData({
  //    data: window.SITE_CONFIG.WindyUtil.getWindyJson()
  //    });*/
  //   return layer;
  // }

  addWindyLayer(params) {
    let code = 'EPSG:4326';
    let layer = null;
    mapUtil.getLatestWindData().then((result) => {
      if(result && result.length > 0){
        let windyJson = result
        layer = new xmap.WindyLayer({
          projection: code,
          ratio: 1
        });
        this.mapObj.map.addLayer(layer);
        layer.showData({
          data: windyJson
        });
        this.layers.push({
          type: params.type,
          layer: layer
        })
      }
    })
  }

  /**
   * 移出风场图层
   * @param params
   */
  removeLayer(params) {
    let index = -1;
    //删除之前的
    this.layers.some((item, i) => {
      if (params.type === item.type) {
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

  destroy() {
    this.$mapEvtBus.$off(mapUtil.EVT_NAME.map_updateRelatedSelected);
    this.dragRadiusInteraction.destroy();
    this.selectedPanel.close();
    this.dragRadiusInteraction = null;
  }
}

export default RelatedAnalysisLayer;
