/**
 * Created by fp on 2018/10/23.
 */
import ol from "@/map/js/xmap/ol_extend";
import xmap from "@/map/js/xmap/export/xmap";
import mapUtil from "@/map/js/util/mapUtil";
import {getParamsByKey} from "@/utils/paramsCache";
import Constants from "@/utils/Constants";
class Map {
  constructor(options) {
    let mapInfo = getParamsByKey(Constants.mapInfo);
    this.mapDetailInfo = {};
    if (options.showChinaMap) {
      this.mapDetailInfo = getParamsByKey(Constants.chinaMapInfo);
    } else {
      this.mapDetailInfo = mapInfo;
    }
    if (process.env.NODE_ENV !== 'production') {
      this.mapDetailInfo.ipPort = mapInfo.ipPortDev;
    }
    
    let baseLayersOptions = [{
      type: this.mapDetailInfo.type,
      url: this.mapDetailInfo.ipPort + this.mapDetailInfo.server,
      layer: this.mapDetailInfo.layer
    }];
    if (this.mapDetailInfo.gType) {
      baseLayersOptions.push({
        type: this.mapDetailInfo.gType,
        url: this.mapDetailInfo.gIpPort + this.mapDetailInfo.gServer,
        layer: this.mapDetailInfo.gLayer
      });
    }

    const mapParams = {
      target: options.target,
      center: options.center ? options.center : this.mapDetailInfo.center,
      zoom: options.zoom !== undefined ? options.zoom : this.mapDetailInfo.zoom,
      minZoom: options.minZoom ? options.minZoom : this.mapDetailInfo.minZoom,
      maxZoom: this.mapDetailInfo.maxZoom,
      ripper: false,
      baseLayersOptions: baseLayersOptions,
      singleclick: options.singleClick ? options.singleClick : null,
      controls: options.controls
    }
    this.$mapEvtBus = options.$mapEvtBus
    this.map = new xmap.Map(mapParams)
    window._map = this.map;
    //矢量
    this.vectorLayers = []
    if (this.$mapEvtBus) {
      this.$mapEvtBus.$on(mapUtil.EVT_NAME.map_updateMonitorMapType, (params) => {
        let baseLayer0 = this.map.olMap.getLayers().item(0)
        // console.log(baseLayer0)
        if ("vector" == params) {
          let vectorSource = new ol.source.TileWMS({
            url: this.mapDetailInfo.ipPort + this.mapDetailInfo.server,
            crossOrigin: undefined,
            params: {
              'LAYERS': this.mapDetailInfo.layer,
              'TILED': true,
              "WIDTH": 256,
              "HEIGHT": 256,
              "dpi": 96,
              "version": "1.3.0",
              styles: ''
            }
          })
          baseLayer0.setSource(vectorSource)
        } else if ("image" == params) {
          let imageSource = new ol.source.TileWMS({
            url: this.mapDetailInfo.ipPort + this.mapDetailInfo.server,
            crossOrigin: undefined,
            params: {
              'LAYERS': "pywp:output_4326",
              'TILED': true,
              "WIDTH": 256,
              "HEIGHT": 256,
              "dpi": 96,
              "version": "1.3.0",
              styles: ''
            }
          })
          baseLayer0.setSource(imageSource)
        }
      })
    }
  }

  closeDialog() {
    if (this.$mapEvtBus) {
      this.$mapEvtBus.$emit(mapUtil.EVT_NAME.dialog_removeDialog)
    }
  }

  showDetail(item) {
    if (this.$mapEvtBus) {
      this.closeDialog()
      this.$mapEvtBus.$emit(mapUtil.EVT_NAME.dialog_showDialog, item)
    }
  }

  // 显示数据
  showData(params) {
    this.vectorLayers.some(item => {
      // console.log('item为：',item);
      if (item.name === params.name) {
        if (item.xLayer) {
          item.xLayer.showData(params)
        } else {
          item.layer.showData(params);
        }
        return true
      } else {
        return false
      }
    })
  }

  getLayer(params) {
    let layer = null
    this.vectorLayers.some(item => {
      if (item.name === params.name) {
        layer = item
        return true
      } else {
        return false
      }
    })
    return layer
  }

  setFitExtent(dataList, tmpExtent) {
    if (!dataList && dataList.length === 0) {
      return
    }
    dataList.forEach(item => {
      item.longitude = parseFloat(item.longitude)
      item.latitude = parseFloat(item.latitude)
    })
    if (dataList.length === 1) {
      let obj = dataList[0]
      this.map.setCenter([obj.longitude, obj.latitude])
    } else {
      let extent = xmap.util.getPointerRange(dataList)

      if (extent) {
        if (tmpExtent) {
          if (extent[0] < tmpExtent[0]) {
            extent[0] = tmpExtent[0];
          }
          if (extent[1] < tmpExtent[1]) {
            extent[1] = tmpExtent[1];
          }
          if (extent[2] > tmpExtent[2]) {
            extent[2] = tmpExtent[2];
          }
          if (extent[3] > tmpExtent[3]) {
            extent[3] = tmpExtent[3];
          }
        }
        if (extent[0] === extent[2] && extent[1] === extent[3]) {
          this.map.setCenter([extent[0], extent[1]])
        } else {
          this.map.fitExtent(extent, {
            padding: [0, 0, 0, 400]
          })
        }
      }
    }
  }


  setFitExtentPadding(tmpExtent, padding) {
    this.map.fitExtent(tmpExtent, {
      padding: padding
    })
  }

  getCenter() {
    return this.map.getCenter()
  }

  getZoom() {
    return this.map.getZoom();
  }

  getExtent() {
    return this.map.getExtent();
  }


  // 删除某个图层
  removeLayer(params) {
    let index = -1
    for (let i = 0, len = this.vectorLayers.length; i < len; i++) {
      const item = this.vectorLayers[i]
      if (item.name === params.name) {
        index = i
        //隐藏名称悬停框
        this.map.clearHoverTip()
        if (item.xLayer) {
          item.xLayer.removeLayer()
          item.xLayer = null
        } else {
          this.map.removeLayer(item.layer)
          item.layer = null
        }
        break
      }
    }
    if (index >= 0) {
      this.map.emptySelectFeatures()
      this.vectorLayers.splice(index, 1)
    }
  }

  addFocus(params) {
    for (let i = 0, len = this.vectorLayers.length; i < len; i++) {
      const item = this.vectorLayers[i]
      if (item.name === params.name) {
        item.layer.setFocusById(params.id)
        break;
      }
    }
  }

  removeFocus(params) {
    this.map.clearSelectedFeature()
  }

  addFocusAndCZ(params, tempZoom) {
    let zoom = tempZoom ? tempZoom : getParamsByKey(Constants.mapInfo).focusZoom;
    if (params.name === 'video' || params.name === 'alarmGis') {
      this.map.setZoomAndCenter(zoom, [params.lng, params.lat]);
      return;
    }
    let isSetCenter = false;
    for (let i = 0, len = this.vectorLayers.length; i < len; i++) {
      const item = this.vectorLayers[i];
      if (item.name === params.name) {
        item.layer.setFocusById(params.id);
        let itemData = item.layer.getItemDataById(params.id);
        itemData && this.map.setZoomAndCenter(zoom, [itemData.longitude, itemData.latitude]);
        if (itemData) {
          isSetCenter = true
        }
        break;
      } else if (params.name === 'guok' && (item.name === 'shik' || item.name === 'shengk' || item.name === 'jiez')) {
        item.layer.setFocusById(params.id);
        let itemData = item.layer.getItemDataById(params.id);
        itemData && this.map.setZoomAndCenter(zoom, [itemData.longitude, itemData.latitude]);
        if (itemData) {
          isSetCenter = true
        }
        break;
      } else if (params.name === 'shengk' && (item.name === 'shik' || item.name === 'jiez')) {
        item.layer.setFocusById(params.id);
        let itemData = item.layer.getItemDataById(params.id);
        itemData && this.map.setZoomAndCenter(zoom, [itemData.longitude, itemData.latitude]);
        if (itemData) {
          isSetCenter = true
        }
        break;
      } else if (params.name === 'shik' && item.name === 'jiez') {
        item.layer.setFocusById(params.id);
        let itemData = item.layer.getItemDataById(params.id);
        itemData && this.map.setZoomAndCenter(zoom, [itemData.longitude, itemData.latitude]);
        if (itemData) {
          isSetCenter = true
        }
        break;
      }
    }
    //找不到图层
    if (!isSetCenter) {
      if (params.longitude && params.latitude) {
        this.map.setZoomAndCenter(zoom, [params.longitude, params.latitude]);
      }
    }
  }

  addFocusAndCZLeft(params, tempZoom) {
    let zoom = tempZoom ? tempZoom : getParamsByKey(Constants.mapInfo).focusZoom;
    for (let i = 0, len = this.vectorLayers.length; i < len; i++) {
      const item = this.vectorLayers[i];
      if (item.name === params.name) {
        item.layer.setFocusById(params.id);
        let itemData = item.layer.getItemDataById(params.id);
        itemData && this.map.setZoomAndCenterLeft(zoom, [itemData.longitude, itemData.latitude], 300);
        break;
      } else if (params.name === 'guok' && (item.name === 'shik' || item.name === 'shengk')) {
        item.layer.setFocusById(params.id);
        let itemData = item.layer.getItemDataById(params.id);
        itemData && this.map.setZoomAndCenterLeft(zoom, [itemData.longitude, itemData.latitude], 300);
        break;
      } else if (params.name === 'shengk' && item.name === 'shik') {
        item.layer.setFocusById(params.id);
        let itemData = item.layer.getItemDataById(params.id);
        itemData && this.map.setZoomAndCenterLeft(zoom, [itemData.longitude, itemData.latitude], 300);
        break;
      }
    }
  }

  removeFocusAndCZ(params) {
    this.map.clearSelectedFeature();
  }

  resetPosition() {
    this.map.setZoomAndCenter(getParamsByKey(Constants.mapInfo).zoom, getParamsByKey(Constants.mapInfo).center);
  }

  showAlarmDialog() {
    this.$mapEvtBus.$emit(mapUtil.EVT_NAME.panel_hidePanel, {})
  }

  closeAlarmDialog() {
    this.$mapEvtBus.$emit(mapUtil.EVT_NAME.panel_showPanel, {})
  }
}
export default Map
