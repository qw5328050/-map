/**
 * Created by fp on 2018/11/14.
 */
import Vue from "vue";
import xmap from "@/map/js/xmap/export/xmap";
import {getParamsByKey} from "@/utils/paramsCache";
import Constants from "@/utils/Constants";
import szqBoundGis from "./szqBoundGis";
const getExplorer = function () {
  var explorer = window.navigator.userAgent,
    compare = function (s) {
      return (explorer.indexOf(s) >= 0);
    },
    ie11 = (function () {
      return ("ActiveXObject" in window)
    })();
  if (compare("MSIE") || ie11) {
    return 'ie';
  }
  else if (compare("Firefox") && !ie11) {
    return 'Firefox';
  }
  else if (compare("Chrome") && !ie11) {
    if (explorer.indexOf("Edge") > -1) {
      return 'Edge';
    } else {
      return 'Chrome';
    }
  }
  else if (compare("Opera") && !ie11) {
    return 'Opera';
  }
  else if (compare("Safari") && !ie11) {
    return 'Safari';
  }
}

const pollution_rang = {
  aqi: {
    rang_one: {min: 0, max: 150}
  },
  pm25: {
    rang_one: {min: 0, max: 115}
  },
  pm10: {
    rang_one: {min: 0, max: 250}
  },
  co: {
    rang_one: {min: 0, max: 35}
  },
  no2: {
    rang_one: {min: 0, max: 700}
  },
  so2: {
    rang_one: {min: 0, max: 650}
  },
  o3: {
    rang_one: {min: 0, max: 300}
  },
  tsp: {
    rang_one: {min: 0, max: 250}
  }
}

const mapUtil = {
  EVT_NAME: {
    // 弹出框组件处理事件
    dialog_showDialog: 'dialog_showDialog', // 弹出框
    dialog_removeDialog: 'dialog_removeDialog', // 隐藏弹出框
    // 地图组件处理事件
    map_showLayer: 'map_showLayer', // 显示图层，用于工具组件选中图层
    map_removeLayer: 'dialog_removeLayer', // 删除图层
    map_showDivision: 'map_showDivision', // 将某个区域移动到地图中间
    map_removeTip: 'map_removeTip', // 隐藏悬停提示
    map_showData: 'map_showData', // 加载数据显示，主要用于搜索组件结果在地图上的显示
    map_removeData: 'map_removeData', // 删除地图上的数据，主要用于搜索组件结果在地图上的删除
    map_showRankData: 'map_showRankData', // 加载数据显示，主要用于排名组件结果在地图上的显示
    map_removeRankData: 'map_removeRankData', // 删除地图上的数据示，主要用于排名组件结果在地图上的删除
    map_showFocus: 'map_showFocus', // 搜索组件结果列表悬停时，地图关联高亮效果
    map_removeFocus: 'map_removeFocus', // 取消选中
    map_showFocusAndCZ: 'map_showFocusAndCZ', // 搜索组件结果列表悬停时，地图关联高亮效果
    map_removeFocusAndCZ: 'map_removeFocusAndCZ', // 取消选中

    map_getCenter: 'map_getCenter', // 获取经纬度信息，针对需要获取的模式，
    map_relatedAnalysis: 'map_relatedAnalysis', // 关联分析
    map_cancelAnalysis: 'map_cancelAnalysis', // 取消关联分析
    map_endAnalysis: 'map_endAnalysis', // 结束关联分析
    map_updateRelatedSelected: 'map_updateRelatedSelected', // 更新关联分析面板选中的内容
    map_updateMapSetting: 'map_updateMapSetting', // 设置面板内容更新
    map_updateMapSingleSetting: 'map_updateMapSingleSetting', // 设置面板单个内容更新
    map_updateTime: 'map_updateTime', // 时间工具栏时间切换
    map_timeStartPlay: 'map_timeStartPlay',
    map_timeEndPlay: 'map_timeEndPlay',
    map_timeShowData: 'map_timeShowData', // '加载数据在地图上'
    map_updateMonitorDateType: 'map_updateMonitorDateType', // 更新日期类型
    map_updateMonitorFactorName: 'map_updateMonitorFactorName', // 更新因子
    map_updateMonitorAirFactorName: 'map_updateMonitorAirFactorName', // 更新空气质量因子
    map_updateZhgcShowType: 'map_updateZhgcShowType', // 更新走航观测选中因子
    map_showMonitorLayer: 'map_showMonitorLayer', // 监测预警面板选中，除guok shengk shik jiez
    map_showAirMonitorLayer: 'map_showAirMonitorLayer', // 监测预警面板选中 处理guok shengk shik jiez
    map_changeAirAlarmType: 'map_changeAirAlarmType', // 改变右侧面板选中选中告警项
    map_showMoveCarLayer: 'map_showMoveCarLayer',
    map_showYunTuDetail: 'map_showYunTuDetail',//显示云图详情
    map_hideMoveCar: 'map_hideMoveCar',//取消车辆实时显示效果
    map_resetPosition: 'map_resetPosition',//返回默认位置
    map_showTrack: 'map_showTrack',//显示渣土车轨迹
    map_updateTrackParams: 'map_updateTrackParams',//更新渣土车运行参数 当前位置 或  速度
    map_endTrack: 'map_endTrack',//结束轨迹回放
    map_ztcHide: 'map_ztcHide',//渣土车隐藏
    map_ztcResume: 'map_ztcResume',//渣土车显示
    map_showWgData: 'map_showWgData',//网格数据显示
    map_ztcRightHide: 'map_ztcRightHide',//渣土车右侧面板隐藏
    map_ztcRightResume: 'map_ztcRightResume',//渣土车右侧面板显示

    // 搜索框组件处理事件
    search_hideResultPanel: 'search_hideResultPanel', // 隐藏搜索结果面板，包含附近查询列表
    search_setKeywords: 'search_setKeywords', // 设置搜索框内容
    search_nearbySearch: 'search_nearbySearch', // 附近查询
    search_updateRadius: 'search_updateRadius', // 更新搜索范围半径
    // 工具栏组件处理事件
    tool_setSelected: 'tool_setSelected', // 设置选中或取消选中内容
    tool_showPanel: 'tool_showPanel', // 展开工具下拉面板
    tool_hidePanel: 'tool_hidePanel', // 隐藏工具下拉面板
    tool_cacheLoadingFinish: 'tool_cacheLoadingFinish', // 数据缓存成功
    tool_showShik: 'tool_showShik',
    // 右侧面板
    panel_showPanel: 'panel_showPanel',
    panel_hidePanel: 'panel_hidePanel',
    panel_updateTrackIndex: 'panel_updateTrackIndex',//轨迹回放更新位置
    panel_removeTrackDialog: 'panel_removeTrackDialog',//删除轨迹
    panel_showAlarmDataList: 'panel_showAlarmDataList',//在右侧面板显示列表

    panel_showVideoAlarmDataList: 'panel_showVideoAlarmDataList',//在右侧面板告警视频列表
    map_updateMonitorMapType: 'map_updateMonitorMapType', //更改地图底图类型

  },
  staticParams: {
    // 点层
    dianc: 'dianc',
    // 微站
    weiz: 'weiz',
    // 走航观测
    zhgc: 'zhgc',
    // 污染源子类型
    wury: 'wury',
    // 企业站点子类型
    qyzd: 'qyzd',
    // 水站
    shuiz: 'shuiz',
    level1: 'level1',
    level2: 'level2',
    AQIRLT: 'AQIRLT',
    PM10RLT: 'PM10RLT',
    xzqy: 'xzqy',
    airAlarmType: 'wrkqc',
    moveCar: 'moveCar',
    movePoint: 'movePoint',
    sscl: 'sscl',
    ztc: 'ztcMonitor',//渣土车监测预警中
    fsy: 'fsy',       // 放射源
    yc: 'yc',//机动车遥测
    gridQuestion: 'gridQuestion',//网格员问题上报
    gridQuestionFlag: 'patrol',//网格员问题上报弹框
    vocs: 'vocs'
  },
  defaultParams: {
    airDateType: 'hour',
    jiezFactor: 'aqi',
    weizFactor: 'pm10',
    zhgcFactor: 'pm10',
    monitorTimeRange: '1', // 今天
    airCheckedType: 'shik',
    monitorFactorName: 'pm10'
  },
  tabType: {
    fjcx: 'fjcx',
    glfx: 'glfx',
    qsdb: 'qsdb'
  },
  waterType: {
    yysy: 'yysy',
    hldm: 'hldm',
    wscl: 'wscl'
  },
  polluteType: {
    feiq: 'feiq',
    feis: 'feis',
    gdyc: 'gcyc'
  },

  videoType: {
    bzz: 'maw_standard_site_info',
    weiz: 'maw_micro_site_info'
  },
  // 空气质量小类
  airTypeList: ['guok', 'shengk', 'shik', 'jiez', 'weiz', 'zhgc', 'qycs'],
  airDivTypeList: ['guok', 'shengk', 'shik', 'jiez'],
  // 移动车
  carTypeList: ['sscl'],
  // 普通站点
  normalTypeList: ['guok', 'shengk', 'shik', 'jiez'],
  // weizzhgcList
  weizZhgcList: ['weiz', 'zhgc'],
  // 国控  省控 市控
  gssTypeList: ['guok', 'shengk', 'shik'],
  // 水资源小类
  waterTypeList: ['yysy', 'hldm', 'hlsgcy'],
  // 工地小类
  constructionList: ['gongd'],
  // 应急小类
  egList: ['eg-001', 'eg-002'],
  // 企业小类
  qyList: ['feiq', 'feis', 'gongd', 'wscl'],
  // 污染小类
  wrList: ['zxqy', 'zdqy', 'syqy', 'jzgd', 'xqyz', 'jzzw', 'zhatc'],
  // 企业 污染 2类小类，因为2个弹框是一样的
  qyWrList: ['zxqy', 'zdqy', 'syqy', 'jzgd', 'xqyz', 'jzzw', 'zhatc',
    'feiq', 'feis', 'dianl', 'qydl', 'gongd', 'wscl', 'gdyc', 'ztc', 'fsy', 'yc', 'szgd', 'dlyc', 'vocs', 'noise'],
  // 风场 AQI热力图  PM10热力图
  heatmapList: ['fengc', 'AQIRLT', 'PM10RLT'],
  // 基本图层小类
  baseLayerList: ['xzqy', 'sthx', 'rdwg', 'weixt'],
  // 设置面板日志类型
  timeBarAirTypeList: ['guok', 'shengk', 'shik', 'jiez'],
  // 空气告警
  airAlarmTypeList: ['guok', 'shengk', 'shik'],
  // 废气告警
  feiqAlarmTypeList: ['wrfeiq'],
  // 扬尘类型
  dustTypeList: ['szgc', 'cgj-zgd', 'cgj'],
  // 监管类型
  monitorTypeList: ['patrol', 'event', 'task'],
  // 走航观测因子
  pm1025: ['pm10', 'pm25'],
  pm1025TypeList: ['szgc', 'cgj-zgd', 'cgj', 'gongd'],
  // 视频监控
  videoList: ['0001', '0002', '0003', '0004', '0011', '0012', '0013'],

  videoAlarm: 'videoAlarm',
  //pm点位
  pmPoint: 'pmPoint',
  status: {
    outOfLimit: 'outOfLimit',
    offLine: 'offLine',
    normal: 'normal'
  },
  roadDefault: 'yuntu',
  FloatValue: true, // 统计是浮点数据
  // 方法
  transformStatus(status) {
    let retPic = '1'
    if (status) {
      if (status.toLowerCase() === 'outoflimit') {
        retPic = '2'
      } else if (status.toLowerCase() === 'offline') {
        retPic = '0'
      } else if (status.toLowerCase() === 'normal') {
        retPic = '1'
      }
    }
    return retPic
  },
  // 根据状态获取颜色
  getColorByStatus(status) {
    let color = '#7dcc53'
    if (status) {
      if (status.toLowerCase() === 'outoflimit') {
        color = '#fd634e'
      } else if (status.toLowerCase() === 'offline') {
        color = '#8d949e'
      } else if (status.toLowerCase() === 'normal') {
        color = '#7dcc53'
      }
    }

    return color
  },
  // 根据状态获取颜色
  getColorByStatusTwo(status) {
    let color = '#7dcc53'
    if (status === 2) {
      color = '#fd634e'
    } else if (status === 0) {
      color = '#8d949e'
    } else if (status === 1) {
      color = '#7dcc53'
    }
    return color
  },
  // 预加载图片，缓存用的
  loadSingleImage: function (url) {
    return new Promise((resolve, reject) => {
      let img = new Image() // 创建一个Image对象，实现图片的预下载
      img.src = url
      if (img.complete) { // 如果图片已经存在于浏览器缓存，直接调用回调函数
        setTimeout(function () {
          resolve('complete')
        }, 0)
      }
      img.onload = function () { // 图片下载完毕时异步调用callback函数。
        resolve('load')
      }
      img.onerror = function () {
        resolve('error')
      }
    })
  },

  loadingMultiImage: function (urls) {
    return new Promise((resolve, reject) => {
      const promises = []
      urls.forEach(item => {
        promises.push(mapUtil.loadSingleImage(item))
      })
      if (promises.length === 0) {
        resolve('load')
      } else {
        Promise.all(promises).then(result => {
          resolve('load')
        })
      }
    })
  },

  getRegionByPos: function (point) {
    return new Promise((resolve, reject) => {
      let mapInfo = getParamsByKey(Constants.mapInfo);
      let url = mapInfo.ipPort + mapInfo.wfsUrl
      let params = {
        request: 'GetFeature',
        typeName: mapInfo.locationLayers,
        maxFeatures: 1,
        viewparams: 'lon:' + point[0] + ';' + 'lat:' + point[1],
        outputFormat: 'text/javascript',
        service: 'WFS',
        version: '1.0.0',
        callbackQuery: 'format_options',
        callbackName: 'callback:ztGetRegionByPos'
      }
      window.ztGetRegionByPos = function (response) {
        let addr = (response && response.features && response.features.length &&
        response.features.length > 0 && response.features[0].properties &&
        response.features[0].properties.dladdr) ? response.features[0].properties.dladdr : ''
        resolve(addr)
      }
      Vue.jsonp(url, params).then(response => {
        resolve('后台查询服务待完善中...')
      }).catch(reason => {
        resolve('后台查询服务待完善中...')
      }).finally(() => {
        resolve('后台查询服务待完善中...')
      })
    })
  },

  getYunTuDetail: function (position, layer, viewResolution) {
    return new Promise((resolve, reject) => {
      window.airQuality_success_jsonpCallback = function (res) {
        let geojsonFormat = xmap.util.getGeomJsonFormat();
        let features = geojsonFormat.readFeatures(res);
        if (features.length >= 1) {
          let id = features[0].get('id');
          resolve({
            id: id,
            position: position
          });
        } else {
          reject();
        }
      };
      let url = layer.getGetFeatureInfoUrl(
        position, viewResolution, 'EPSG:4326',
        {
          'INFO_FORMAT': 'text/javascript',
          'FEATURE_COUNT': 1
        });
      Vue.jsonp(url, {
        callbackQuery: 'format_options',
        callbackName: 'callback:airQuality_success_jsonpCallback'
      })
    })
  },

  // 根据关键字搜索
  getDmByKeyword(params) {
    // keytxt, pageno, pagenum
    let mapInfo = getParamsByKey('mapInfo');
    return new Promise((resolve, reject) => {
      let pageno = params.page - 1
      let url = mapInfo.ipPort + mapInfo.wfsUrl
      let queryParams = {
        request: 'GetFeature',
        typeName: mapInfo.keywordLayers,
        maxFeatures: 100,
        viewparams: "pageno:0;pagenum:100;keytxt:'" + params.keyWord + "'",
        outputFormat: 'text/javascript',
        service: 'WFS',
        version: '1.0.0',
        callbackQuery: 'format_options',
        callbackName: 'callback:ztGetKeyword'
      }
      window.ztGetKeyword = function (response) {
        let dataList = []
        let geojsonFormat = xmap.util.getGeomJsonFormat();
        let features = geojsonFormat.readFeatures(response);
        features.forEach(item => {
          let prop = item.getProperties();
          if (prop.type.toLowerCase() === 'point') {
            dataList.push({
              id: item.getProperties().gid,
              name: item.getProperties().name,
              longitude: item.getGeometry().getExtent()[0],
              latitude: item.getGeometry().getExtent()[1]
            })
          }
        })
        resolve(dataList)
      }
      Vue.jsonp(url, queryParams)
    })
  },
  isChrome(){
    return getExplorer() === 'Chrome';
  },


  colorRgb(hex) {
    // 16进制颜色值的正则
    var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    // 把颜色值变成小写
    var color = hex.toLowerCase();
    if (reg.test(color)) {
      // 如果只有三位的值，需变成六位，如：#fff => #ffffff
      if (color.length === 4) {
        var colorNew = "#";
        for (var i = 1; i < 4; i += 1) {
          colorNew += color.slice(i, i + 1).concat(color.slice(i, i + 1));
        }
        color = colorNew;
      }
      // 处理六位的颜色值，转为RGB
      var colorChange = [];
      for (var i = 1; i < 7; i += 2) {
        colorChange.push(parseInt("0x" + color.slice(i, i + 2)));
      }
      return "RGB(" + colorChange.join(",") + ")";
    } else {
      return color;
    }
  },

  getDivisionBound(params){
    if (getParamsByKey('analysisConfig').fileBound) {
      return new Promise((resolve, reject) => {
        resolve(szqBoundGis.getBound())
      })
    }
    return new Promise((resolve, reject) => {
        let pageno = params.page - 1
        let url = params.ipPort + params.wfsUrl
        let queryParams = {
          request: 'GetFeature',
          typeName: params.layer,
          maxFeatures: 100,
          outputFormat: 'text/javascript',
          // outputFormat: 'application/json',
          service: 'WFS',
          version: '1.0.0',
          callbackQuery: 'format_options',
          callbackName: 'callback:ztDivisionBound'
        };
        window.ztDivisionBound = function (response) {
          let dataList = [];
          let geojsonFormat = xmap.util.getGeomJsonFormat();
          let features = geojsonFormat.readFeatures(response);
          features.forEach(item => {
            dataList.push({
              id: item.getProperties().distid,
              name: item.getProperties().distname,
              geometry: xmap.util.transformGemo2Str(item.getGeometry())
            });
          });
          resolve(dataList)
        };
        Vue.jsonp(url, queryParams)
      }
    )
  },

  toString(str){
    if (str === null || str === undefined) {
      return ''
    } else {
      return str.toString();
    }
  },

  getLatestWindData () {
    let url = window.SITE_CONFIG.map.windDataServer + '/latest?f=gz'
    return this.getWindData(url)
  },

  getNearestWindData (timeIso, searchLimit) {
    let url = window.SITE_CONFIG.map.windDataServer + '/nearest'
    let query = []
    if (timeIso) {
      query.push('timeIso=' + timeIso)
      if (searchLimit) {
        query.push('searchLimit=' + searchLimit)
      }
    }
    url = query.length > 0 ? (url + '?' + query.join('&')) : url
    return this.getWindData(url)
  },

  getWindData (url) {
    return new Promise((resolve, reject) => {
      fetch(url).then(res => {
        return res.json()
      }).then(data => {
        resolve(data)
      }).catch(err => {
        reject(err)
      })
    })
  }
};

export default mapUtil
