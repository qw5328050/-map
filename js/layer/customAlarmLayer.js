/**
 * 自定义报警图层处理
 */
import BaseLayer from "./baseLayer";
import xmap from "@/map/js/xmap/export/xmap";
import {objectAssign} from "@/utils/util";
import Confirm from "@/components/_public/zt/confirm/index";
import {getExeLoadDownHref, getVideoExeHref} from "@/utils/index";
import Constants from "@/utils/Constants";

class CustomAlarmLayer extends BaseLayer {

  constructor(options) {
    super(options)
    this.initRipperLayer()
  }

  // 创建图层
  createLayer(params) {
    if (this.alreadyInclude(params)) {
      return
    }
    const self = this
    this.layer = new xmap.VectorLayer({
      zIndex: 1000,
      styleFunction: function (itemData, zoom, resolution, point) { // 默认样式函数
        return self.getPicStyle(itemData, zoom, resolution, point, params)
      },
      selectStyleFunction: function (itemData, zoom, resolution, point) {
        return self.getSelectedPicStyle(itemData, zoom, resolution, point, params)
      },
      singleclick: function (itemData, zoom, point) {
        // 获取数据
        self.xmap.clearHoverTip()
        self.showDetail(itemData, [itemData.longitude, itemData.latitude], params)
      },
      // 排序，让数字大的显示在上面，即出现故障的点现在上上面
      orderFunction: function (itemData1, itemData2) {
        return itemData1.value > itemData2.value
      }
    })
    this.xmap.addLayer(this.layer)
    this.vectorLayers.push({
      name: params.name,
      layer: this.layer,
      xLayer: this
    })
  }

  getPicStyle(itemData, zoom, resolution, point, params) {
    let color = 'rgba(255, 0, 0, 1)'
    return [{
      styleType: 'circle',
      strokeColor: "rgba(255, 0, 0, 0)",
      strokeWeight: 0,
      fillColor: color,
      radius: 6
    }]
  }

  getSelectedPicStyle(itemData, zoom, resolution, point, params) {
    let color = 'rgba(255, 0, 0, 1)'
    return [{
      styleType: 'circle',
      strokeColor: "rgba(255, 0, 0, 0)",
      strokeWeight: 0,
      fillColor: color,
      radius: 8
    }]
  }

  initRipperLayer() {
    this.ripperLayer = new xmap.RipperUtil({
      map: this.xmap
    })
  }

  showData(params) {
    this.layer.showData(params)
    this.ripperLayer.clear()
    this.ripperLayer.startArray(params.data)
  }

  removeLayer() {
    this.xmap.removeLayer(this.layer)
    this.ripperLayer.clear()
    this.xmap = null
    this.ripperLayer = null
  }

  showVideoDetail(item) {//打开视频监控弹窗
    this.newPlayVideo(item.code, item.name)
  }

  // 播放单个视频
  newPlayVideo(id, name) {
    var that = this
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    var myBrowser = false
    var isChrome = userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Safari") > -1 //判断Chrome浏览器
    console.log('isChrome:', isChrome)
    if (isChrome) {
      myBrowser = true
    }
    var exeUrl = getExeLoadDownHref()
    var isInstallActive = localStorage.getItem('isInstallActive')
    if (isInstallActive == null || isInstallActive == ' ' || isInstallActive == undefined) {
      Confirm({
        message: '为提高视频播放的稳定性和流畅度，请下载安装专用播放插件并安装后再播放视频。',
        title: '视频播放提醒',
        comfirmButtonTxt: '点击下载并安装',
        cancelButtonTxt: '我已安装直接播放',
        cancelCallback: function () {
          localStorage.setItem('isInstallActive', 'true')
          var chineseTranscode
          if (myBrowser) {
            chineseTranscode = 'ChineseTranscode:'
          } else {
            chineseTranscode = ''
          }
          var urlLocation = `f3://[ver:${Constants.videoExeVersion}][url:${exeUrl}],${chineseTranscode}${id},${parseInt((this.videoClientWidth) * 0.1)},${parseInt((this.videoClientHeight) * 0.1) + 160},${parseInt((this.videoClientWidth) * 0.8)},${parseInt((this.videoClientHeight) * 0.8)},${name}`
          // console.log(urlLocation, parseInt((this.videoClientWidth) * 0.1))
          window.location.href = urlLocation
        }
      }).then(() => {
        window.location.href = getVideoExeHref()
      })
      return
    } else {
      var chineseTranscode
      if (myBrowser) {
        chineseTranscode = 'ChineseTranscode:'
      } else {
        chineseTranscode = ''
      }
      var urlLocation = `f3://[ver:${Constants.videoExeVersion}][url:${exeUrl}],${chineseTranscode}${id},${parseInt((this.videoClientWidth) * 0.1)},${parseInt((this.videoClientHeight) * 0.1) + 160},${parseInt((this.videoClientWidth) * 0.8)},${parseInt((this.videoClientHeight) * 0.8)},${name}`
      // console.log(urlLocation, parseInt((this.videoClientWidth) * 0.1))
      window.location.href = urlLocation
    }
  }

  showDetail(item) {
    if ('spsb' !== item.type) {
      this.map.showDetail(item)
    } else {
      this.showVideoDetail(item)
    }
  }
}

export default CustomAlarmLayer
