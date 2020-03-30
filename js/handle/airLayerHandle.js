/**
 * Created by fp on 2019/1/11.
 * 空气质量图层处理
 */
import mapLayerHttp from "@/https/map/mapLayerHttp";
import AirLayer from "@/map/js/layer/airLayer";
import RoadLayer from "@/map/js/layer/roadLayer";
import ZhgcYuntuLayer from "@/map/js/layer/zhgcYuntuLayer";
import mapUtil from "@/map/js/util/mapUtil";
import aqiColor from "@/utils/aqiColor";
class AirLayerHandle {
  constructor(options) {
    this.mapEvtHandle = options.mapEvtHandle;
    this.mapObj = options.mapObj;
  }

  //显示数据
  showDataInMap(options) {
    if (options.code === mapUtil.staticParams.zhgc) {
      this.mapObj.removeLayer({
        name: options.code
      });
      if (options.checked) {
        options.map = this.mapObj;
        let zhgcType = this.mapEvtHandle.getZhgcShowType();
        if (zhgcType === 'road') {
          new RoadLayer(options);
          this._showRoadDataInMap(options);
        } else {
          options.dateType = this.mapEvtHandle.getAirDateType();
          options.factorName = this.mapEvtHandle.getSelectedFactorByCode('zhgc');
          new ZhgcYuntuLayer(options);
        }
      }
    } else {
      if (options.checked) {
        new AirLayer(options);
        this._showAirDataInMap(options);
      } else {
        this.mapObj.removeLayer({
          name: options.code
        });
      }
    }
  }


  getYunTuLayer() {
    if (this.mapEvtHandle.getZhgcShowType() !== 'yuntu') {
      return null;
    }
    return this.mapObj.getLayer({
      name: 'zhgc'
    });
  }

  //显示时间轴的数据在地图上
  showTimerDataInMap(item) {
    if (item.type === mapUtil.staticParams.zhgc) {
      new RoadLayer({
        map: this.mapObj,
        name: item.type
      });
      let dateType = this.mapEvtHandle.getAirDateType();
      mapLayerHttp.getRoadColorByData(item.data, dateType).then(result => {
        this.showAirDataInner(item.type, result);
      });
    } else {
      new AirLayer({
        map: this.mapObj,
        name: item.type,
      });
      this.showAirDataInner(item.type, item.data);
    }
  }

  //显示普通的矢量点在地图上
  _showAirDataInMap(options) {
    mapLayerHttp.getPointInMap({
      type: options.code,
      time: this.mapEvtHandle.getDate(),
      dateType: this.mapEvtHandle.getAirDateType(),
      factorCode: this.mapEvtHandle.getSelectedFactorByCode(options.code)
    }).then(result => {
      result.data.forEach(item => {
        item.dateType = this.mapEvtHandle.getAirDateType()
      });
      this.showAirDataInner(options.name, result.data);
    })
  }


  _showAirDivDataInMap(options) {
    mapLayerHttp.getPointInMap({
      type: options.code,
      time: this.mapEvtHandle.getDate(),
      dateType: this.mapEvtHandle.getAirDateType(),
      factorCode: this.mapEvtHandle.getSelectedFactorByCode(options.code)
    }).then(result => {
      // result.data = [result.data[0]];
      result.data.forEach(item => {
        item.html = this.getHtml(item)
      });
      this.showAirDataInner(options.name, result.data);
    })
  }

  getHtml(data) {
    let colorClass = aqiColor.ztAirColorBgClass(data.factorName, data.value);
    return `<div class="map-aqi" style="position: static;cursor: pointer">
      <span class="aqi-val ${colorClass}">${data.value}</span>
      <span class="site-name">${data.name}</span>
    </div>`;
  }

  //显示道路信息在地图上
  _showRoadDataInMap(options) {

    mapLayerHttp.getRoadColor({
      type: options.code,
      time: this.mapEvtHandle.getDate(),
      dateType: this.mapEvtHandle.getAirDateType(),
      factorName: this.mapEvtHandle.getSelectedFactorByCode(options.code)
    }).then(result => {
      this.mapObj.map.setZoomAndCenter(window.SITE_CONFIG.map.xzqyZoom, window.SITE_CONFIG.map.xzqyCenter);
      this.showAirDataInner(options.code, result.data);
    })
  }

  showAirDataInner(layerName, data) {
    this.mapObj.showData({
      name: layerName,
      data: data
    })
  }
}
export default AirLayerHandle;
