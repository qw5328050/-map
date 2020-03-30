/**
 * Created by fp on 2018/12/18.
 */
import moment from "moment";
import AirLayerHandle from "@/map/js/handle/airLayerHandle";
import PolluteLayerHandle from "@/map/js/handle/polluteLayerHandle";
import DivisionHandle from "@/map/js/handle/divisionHandle";
import BaseLayerHandle from "@/map/js/handle/baseLayerHandle";
import HeatmapLayerHandle from "@/map/js/handle/heatmapLayerHandle";
import SearchLayerHandle from "@/map/js/handle/searchLayerHandle";
import RankLayerHandle from "@/map/js/handle/rankLayerHandle";
import WaterLayerHandle from "@/map/js/handle/waterLayerHandle";
import DustLayerHandle from "@/map/js/handle/dustLayerHandle";
import MonitorLayerHandle from "@/map/js/handle/monitorLayerHandle";
import VideoLayerHandle from "@/map/js/handle/videoLayerHandle";
import MoveCarLayerHandle from "@/map/js/handle/moveCarLayerHandle";
import ZtcLayerHandle from "@/map/js/handle/ztcLayerHandle";
import FsyLayerHandle from "@/map/js/handle/fsyLayerHandle";
import CustomAlarmLayerHandle from "@/map/js/handle/customAlarmLayerHandle";
import VideoAlarmLayerHandle from "@/map/js/handle/videoAlarmLayerHandle";

import RelatedAnalysisLayer from "@/map/js/layer/relatedAnalysisLayer";
import ZtcTrackLayerHandle from "@/map/js/handle/ztcTrackLayerHandle";
import ApiLayerHandle from "@/map/js/handle/apiLayerHandle";
import {isNumber, objectAssign} from "@/utils/util";
import {getQueryHash, resetAnalysisStatus} from "@/utils/index";
import mapUtil from "@/map/js/util/mapUtil";
import timeUtil from "@/map/js/util/timeUtil";
import TimeBarCache from "@/map/js/cache/timerBarCache";
import store from "@/store";
import {getParamsByKey} from '@/utils/paramsCache'

class MapEvtHandle {
  constructor(options) {
    // 事件监听
    this.$mapEvtBus = options.$mapEvtBus
    this.mapObj = options.mapObj
    // 切换时，不重新渲染的图层
    this.excludeTypeCode = ['jichu']
    this.airLayerHandle = new AirLayerHandle({
      mapEvtHandle: this,
      mapObj: this.mapObj
    })
    this.polluteLayerHandle = new PolluteLayerHandle({
      mapEvtHandle: this,
      mapObj: this.mapObj
    })
    this.heatmapLayerHandle = new HeatmapLayerHandle({
      mapEvtHandle: this,
      mapObj: this.mapObj
    })
    this.divisionHandle = new DivisionHandle({
      mapEvtHandle: this,
      mapObj: this.mapObj
    })
    this.baseLayerHandle = new BaseLayerHandle({
      mapEvtHandle: this,
      map: this.mapObj.map
    })
    this.searchLayerHandle = new SearchLayerHandle({
      mapObj: this.mapObj
    })
    this.rankLayerHandle = new RankLayerHandle({
      mapEvtHandle: this,
      mapObj: this.mapObj
    })

    this.waterLayerHandle = new WaterLayerHandle({
      mapEvtHandle: this,
      mapObj: this.mapObj
    })
    this.dustLayerHandle = new DustLayerHandle({
      mapEvtHandle: this,
      mapObj: this.mapObj
    })
    this.monitorLayerHandle = new MonitorLayerHandle({
      mapEvtHandle: this,
      mapObj: this.mapObj
    })
    this.videoLayerHandle = new VideoLayerHandle({
      mapEvtHandle: this,
      mapObj: this.mapObj
    })
    this.moveCarLayerHandle = new MoveCarLayerHandle({
      mapEvtHandle: this,
      mapObj: this.mapObj
    })
    this.ztcLayerHandle = new ZtcLayerHandle({
      mapEvtHandle: this,
      mapObj: this.mapObj
    })
    this.fsyLayerHandle = new FsyLayerHandle({
      mapEvtHandle: this,
      mapObj: this.mapObj
    })

    this.customAlarmLayerHandle = new CustomAlarmLayerHandle({
      mapEvtHandle: this,
      mapObj: this.mapObj
    })

    this.videoAlarmLayerHandle = new VideoAlarmLayerHandle({
      mapEvtHandle: this,
      mapObj: this.mapObj
    })


    this.ztcTrackLayerHandle = new ZtcTrackLayerHandle({
      mapEvtHandle: this,
      mapObj: this.mapObj
    })

    this.apiLayerHandle = new ApiLayerHandle({
      mapEvtHandle: this,
      mapObj: this.mapObj
    })


    this.relatedAnalysisLayer = null
    this.timeBarParams = null
    this.mapSetting = null
    this.layerData = null
    this.zhgcType = mapUtil.roadDefault
    this.airAlarmType = mapUtil.staticParams.airAlarmType
    this.timeBarCache = new TimeBarCache({
      mapEvtHandle: this
    })
    this.addListener()
  }

// 增加事件监听
  addListener() {
    if (this.$mapEvtBus) {
      this.$mapEvtBus.$on(mapUtil.EVT_NAME.map_showLayer, ({obj, layerData}) => {
        if (obj.type === 'alarmGis') {
          let options = {}
          objectAssign(options, obj)
          options.map = this.mapObj
          options.name = 'alarmGis'
          this.customAlarmLayerHandle.showDataInMap(options)
        }
        if (obj.type === 'videoAlarmGis') {
          let options = {}
          objectAssign(options, obj)
          options.map = this.mapObj
          options.name = 'videoAlarmGis'
          this.videoAlarmLayerHandle.showDataInMap(options)
        } else {
          this.layerChange(obj)
          if (layerData) {
            this.layerData = layerData
          }
        }
      })
      this.$mapEvtBus.$on(mapUtil.EVT_NAME.map_removeLayer, params => {
        this.layerChange(params)
      })
      this.$mapEvtBus.$on(mapUtil.EVT_NAME.map_showDivision, params => {
        this.divisionHandle.updateDivision(params)
      })
      this.$mapEvtBus.$on(mapUtil.EVT_NAME.map_removeTip, params => {
      })
      this.$mapEvtBus.$on(mapUtil.EVT_NAME.map_showData, params => {
        this.mapObj.setFitExtent(params, getParamsByKey('mapInfo').extent);
        this.searchLayerHandle.showSearchDataInMap(params)
      })
      this.$mapEvtBus.$on(mapUtil.EVT_NAME.map_removeData, () => {
        this.searchLayerHandle.removeSearchDataInMap()
      })
      this.$mapEvtBus.$on(mapUtil.EVT_NAME.map_showRankData, params => {
        this.rankLayerHandle.showDataInMap({
          code: 'rank_' + params.type,
          name: 'rank_' + params.type,
          data: params.data
        })
      })
      this.$mapEvtBus.$on(mapUtil.EVT_NAME.map_removeRankData, params => {
        this.rankLayerHandle.showDataInMap({
          code: 'rank_' + params.type,
          name: 'rank_' + params.type,
          data: []
        })
      })

      this.$mapEvtBus.$on(mapUtil.EVT_NAME.map_showFocus, params => {
        this.mapObj.addFocus({
          name: 'search',
          id: params.id
        })
      })
      this.$mapEvtBus.$on(mapUtil.EVT_NAME.map_removeFocus, params => {
        this.mapObj.removeFocus({
          name: 'search',
          id: params.id
        })
      })

      this.$mapEvtBus.$on(mapUtil.EVT_NAME.map_showFocusAndCZ, params => {
        this.mapObj.addFocusAndCZ(params)
      })

      this.$mapEvtBus.$on(mapUtil.EVT_NAME.map_removeFocusAndCZ, params => {
        this.mapObj.removeFocusAndCZ(params)
      })


      this.$mapEvtBus.$on(mapUtil.EVT_NAME.map_resetPosition, params => {
        this.mapObj.resetPosition()
      })

      this.$mapEvtBus.$on(mapUtil.EVT_NAME.map_getCenter, params => {

      })

      this.$mapEvtBus.$on(mapUtil.EVT_NAME.map_relatedAnalysis, params => {
        if (this.relatedAnalysisLayer) {
          this.relatedAnalysisLayer.destroy()
          this.relatedAnalysisLayer = null
        }
        this.relatedAnalysisLayer = new RelatedAnalysisLayer({
          center: params.center,
          $mapEvtBus: this.$mapEvtBus,
          mapObj: this.mapObj,
          mapEvtHandle: this,
          params: params.params
        })
        store.commit('map/updataRelatedAnalysis', false)
      })

      this.$mapEvtBus.$on(mapUtil.EVT_NAME.map_cancelAnalysis, params => {
        resetAnalysisStatus();
        if (this.relatedAnalysisLayer) {
          this.isNeedShowShik();
          this.relatedAnalysisLayer.destroy()
          this.relatedAnalysisLayer = null
        }
      })
      this.$mapEvtBus.$on(mapUtil.EVT_NAME.map_endAnalysis, params => {
        resetAnalysisStatus();
        if (this.relatedAnalysisLayer) {
          this.isNeedShowShik();
          this.relatedAnalysisLayer.endRelated()
          this.relatedAnalysisLayer = null
        }
      })

      this.$mapEvtBus.$on(mapUtil.EVT_NAME.map_updateTime, params => {
        this.timeBarParams = params
        if (this.timeBarParams.playStatus === timeUtil.timeStatus.play) {

        }
        this.updateAllSelectedLayer()
      })

      this.$mapEvtBus.$on(mapUtil.EVT_NAME.map_timeStartPlay, params => {
        this.timeBarParams = params
        this.timeBarCache.setCacheOrder()
      })

      this.$mapEvtBus.$on(mapUtil.EVT_NAME.map_timeEndPlay, () => {
        this.timeBarCache.clear()
      })

      this.$mapEvtBus.$on(mapUtil.EVT_NAME.map_timeShowData, params => {
        let time = ''
        if (params.time.length <= 10) {
          time = params.time + ' 00:00:00'
        } else {
          time = params.time + ':00:00'
        }
        const data = this.timeBarCache.getDataFromCache(time)
        if (data) {
          this.showTimerData(data)
        }
      })

      this.$mapEvtBus.$on(mapUtil.EVT_NAME.map_updateMapSetting, ({classCode, typeCode, val, model}) => {
        this.mapSetting = model
        // TODO 更细化的更新数据
        /* if (classCode === '') {//初始化时，classCode为空
         this.updateAllSelectedLayer();
         } else if (classCode === 'air' && typeCode === 'frequency') {

         } else { */
        this.updateAllSelectedLayer()
      })
      this.$mapEvtBus.$on(mapUtil.EVT_NAME.map_updateZhgcShowType, params => {
        this.zhgcType = params
        this.handleZhgcLayerChange()
      })

      this.$mapEvtBus.$on(mapUtil.EVT_NAME.map_showMoveCarLayer, params => {
        this.moveCarLayerHandle.showDataInMap(params)
      })

      this.$mapEvtBus.$on(mapUtil.EVT_NAME.map_changeAirAlarmType, type => {
        this.airAlarmType = type
        this.layerChange({
          code: 'wrkqc',
          checked: true,
          name: '空气站点'
        })
      })

      this.$mapEvtBus.$on(mapUtil.EVT_NAME.map_showWgData, params => {
        this.showWgData(params);
      });
    }
  }

  isNeedShowShik() {
    let type = getQueryHash('type');
    if (type) {
      this.$mapEvtBus.$emit(mapUtil.EVT_NAME.tool_showShik);
      this.mapObj.map.setZoomAndCenter(window.SITE_CONFIG.map.zoom, window.SITE_CONFIG.map.apiCenter);
    }
  }

  showWgData(params) {
    this.apiLayerHandle.showDataInMap({
      code: params.code,
      type: params.type,
      checked: true
    });
  }

  handleZhgcLayerChange() {
    this.airLayerHandle.showDataInMap({
      mapEvtHandle: this,
      name: 'zhgc',
      code: 'zhgc',
      checked: true
    })
  }

  getAirAlarmType() {
    return this.airAlarmType
  }

  // 触发事件
  emitMapEvent() {
    if (this.$mapEvtBus) {
      this.$mapEvtBus.$emit.apply(undefined, arguments)
    }
  }

  // 设置面板单项更改
  updateSingleSetting() {

  }

  loadSuccessTime(time) {
    this.$mapEvtBus.$emit(mapUtil.EVT_NAME.tool_cacheLoadingFinish, time)
  }

  layerChange(obj) {
    if (!this.mapObj) {
      return
    }
    const options = {}
    obj = obj || {}
    obj.code = obj && obj.code ? obj.code : ''
    objectAssign(options, obj)
    options.map = this.mapObj
    options.name = obj.code
    if (mapUtil.airTypeList.indexOf(obj.code) >= 0) {
      // 空气质量处理模块
      this.airLayerHandle.showDataInMap(options)
    } else if (mapUtil.qyWrList.indexOf(obj.code) >= 0) {
      // 污染源 企业
      this.polluteLayerHandle.showDataInMap(options)
    } else if (mapUtil.heatmapList.indexOf(obj.code) >= 0) {
      // 风场 热力图
      this.heatmapLayerHandle.showDataInMap(options)
    } else if (mapUtil.waterTypeList.indexOf(obj.code) >= 0) {
      // 水
      this.waterLayerHandle.showDataInMap(options)
    } else if (mapUtil.baseLayerList.indexOf(obj.code) >= 0) {
      // 基础栅格图层
      this.baseLayerHandle.showLayer(obj)
    } else if (mapUtil.dustTypeList.indexOf(obj.code) >= 0) {
      this.dustLayerHandle.showDataInMap(options)
    } else if (mapUtil.monitorTypeList.indexOf(obj.code) >= 0) {
      this.monitorLayerHandle.showDataInMap(options)
    } else if (mapUtil.videoList.indexOf(obj.code) >= 0) {
      // 视频点位图层
      this.videoLayerHandle.showDataInMap(options)
    } else if (mapUtil.staticParams.fsy === obj.code) {
      this.fsyLayerHandle.showDataInMap(options);
    }
    /* else if (mapUtil.staticParams.ztc === obj.code) {
     this.ztcLayerHandle.showDataInMap(options);
     } */
  }

  /**
   * 根据时间轴上的数据，显示在地图上，现在只做空气质量与热力图的
   * @param data
   */
  showTimerData(data) {
    data && data.forEach(item => {
      if (mapUtil.airTypeList.indexOf(item.type) >= 0) {
        this.airLayerHandle.showTimerDataInMap(item)
      } else if (mapUtil.heatmapList.indexOf(item.type) >= 0) {
        this.heatmapLayerHandle.showTimerDataInMap(item)
      }
    })
  }

  // 更新地图上的数据
  updateAllSelectedLayer() {
    this.layerData && this.layerData.forEach(classItem => {
      classItem.childs.forEach(typeItem => {
        typeItem.childs.forEach(item => {
          if (item.checked && this.excludeTypeCode.indexOf(typeItem.code) < 0) {
            this.layerChange(item)
          }
        })
      })
    })
  }

  getAirDateType() {
    if (this.mapSetting) {
      return this.mapSetting.airSetInfo.frequency
    } else {
      return mapUtil.defaultParams.airDateType
    }
  }

  getZhgcShowType() {
    return this.zhgcType
  }

  /**
   * 根据code类型（zhgc guok  shengk），获取选中的因子
   * @param code
   * @returns {*}
   */
  getSelectedFactorByCode(code) {
    let factor = 'pm10'
    if (mapUtil.timeBarAirTypeList.indexOf(code) >= 0) {
      if (this.mapSetting) {
        factor = this.mapSetting.airSetInfo.bzFactor
      } else {
        factor = mapUtil.defaultParams.jiezFactor
      }
    } else if (code === mapUtil.staticParams.weiz) {
      if (this.mapSetting) {
        factor = this.mapSetting.airSetInfo.wzFactor
      } else {
        factor = mapUtil.defaultParams.weizFactor
      }
    } else if (code === mapUtil.staticParams.zhgc) {
      if (this.mapSetting) {
        factor = this.mapSetting.airSetInfo.zhFactor
      } else {
        factor = mapUtil.defaultParams.zhgcFactor
      }
    }
    return factor
  }

  getRelatedSelectedFactorByCode(code) {
    let tempCode = (code !== undefined ? code.replace('Related', '') : code)
    return this.getSelectedFactorByCode(tempCode)
  }

  // 获取日期
  getDate() {
    if (this.timeBarParams && this.timeBarParams.selectedTime) {
      if (this.timeBarParams.selectedTime.allName.length <= 10) {
        return this.timeBarParams.selectedTime.allName + ' 00:00:00'
      } else {
        return this.timeBarParams.selectedTime.allName + ':00:00'
      }
    } else {
      let airDateType = this.getAirDateType()
      if (airDateType === 'hour') {
        return moment().format('YYYY-MM-DD HH') + ':00:00'
      } else {
        return moment().format('YYYY-MM-DD') + ' 00:00:00'
      }
    }
  }

  /**
   * 获取结束日志，用于图片url获取
   * @returns {*}
   */
  getTimerEndDate() {
    if (this.timeBarParams && this.timeBarParams.selectedTime) {
      let endDate = this.timeBarParams.axisEndDate
      if (endDate.length <= 10) {
        return endDate + ' 00:00:00'
      } else {
        return endDate + ':00:00'
      }
    }
    return null
  }

  getMonitorTimeRange() {
    if (this.mapSetting) {
      return this.mapSetting.superviseSetInfo.frequency
    } else {
      return mapUtil.defaultParams.monitorTimeRange
    }
  }

  showXzqyLayer() {
    this.baseLayerHandle.addWMSLayer(BaseLayerHandle.getLayerParamsByCode(mapUtil.staticParams.xzqy))
  }

  removeXzqyLayer() {
    this.baseLayerHandle.removeWMSLayer(BaseLayerHandle.getLayerParamsByCode(mapUtil.staticParams.xzqy))
  }
}

export default MapEvtHandle
