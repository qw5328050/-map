/**
 * Created by admin on 2019/5/16.
 */
import xmap from '@/map/js/xmap/export/xmap'
import mapUtil from '@/map/js/util/mapUtil'

class ZtcTrackLayerHandle {
  constructor(options) {
    this.mapObj = options.mapObj
    this.mapEvtHandle = options.mapEvtHandle
    this.pointerLayer = null
    this.trackLayer = null;
    this.imgPrePath = window.SITE_CONFIG.imgPreUrl;
    this.gisDataLen = 0;
    this.init();
  }

  init() {
    this.mapEvtHandle.$mapEvtBus.$on(mapUtil.EVT_NAME.map_showTrack, params => {
      this.showDataInMap(params);
    });
    this.mapEvtHandle.$mapEvtBus.$on(mapUtil.EVT_NAME.map_updateTrackParams, params => {
      this.updateTrackParams(params);
    });
    this.mapEvtHandle.$mapEvtBus.$on(mapUtil.EVT_NAME.map_endTrack, params => {
      this.clear();
    })
  }

  showDataInMap(gisData) {
    let self = this;
    this.clear();
    this.gisDataLen = gisData.length;
    this.pointerLayer = new xmap.VectorLayer({
      map: this.mapObj.map,
      zIndex: 200,
      styleFunction: function (itemData, zoom, resolution, point) {//默认样式函数
        var offset = [], size = [50, 80];
        if (itemData.status === 'begin') {
          offset = [400, 278];
        } else {
          offset = [450, 278];
        }
        return {
          styleType: 'icon',
          offset: offset,
          size: size,
          scale: 0.5,
          src: self.imgPrePath + '/mapImg/_public/bubble.png'
        };
      }
    });
    gisData[0].status = 'begin';
    gisData[gisData.length - 1].status = 'end';
    this.pointerLayer.showData({
      type: 'replace',
      data: [
        gisData[0],
        gisData[gisData.length - 1],
      ]
    });

    //加载显示
    this.trackLayer = new xmap.TimerTrackLayer({
      map: this.mapObj.map,
      zIndex: 200,
      intervalSpeed: 2,
      showMovePoint: true,
      showType: 'point',
      moveStyleFunction: function (data) {
        return {
          styleType: 'icon',
          src: self.imgPrePath + '/mapImg/industry/ztc/1.png',
          scale: 0.7,
          anchor: [0.5, 1],
        }
      },
      styleFunction: function (data) {
        let color = 'rgb(0,189,1)';
        return {
          styleType: 'circle',
          radius: 3,
          strokeColor: color,
          fillColor: color,
          strokeWeight: 0
        }
      },
      updatePosFunction: function (distance, totalDistance, process) {
        let len = parseInt(process * 100 / self.gisDataLen);
        if (len > 98 || len > 100) {
          len = 100;
        }
        self.mapEvtHandle.$mapEvtBus.$emit(mapUtil.EVT_NAME.panel_updateTrackIndex, len);
      },
      changeSortFunction: function (point1, point2) {
        return point1.status !== point2.status;
      },
      singleclick: function (data) {
        console.log('singleclick');
        console.log(data);
      },
      dblclick: function (data) {
        console.log('dblclick');
        console.log(data);
      },
      hover: function (data) {
        console.log('hover');
        console.log(data);
      }
    });
    let extent = xmap.util.getPointerRange(gisData);
    let len = gisData.length;
    this.mapObj.setFitExtentPadding(extent, [10, 10, 10, 10]);
    let speed = parseInt(len / window.SITE_CONFIG.map.trackTimer);
    this.trackLayer.updateSpeed(speed < 1 ? 1 : speed);
    this.trackLayer.showTrack({
      data: gisData
    });
    this.trackLayer.start();
  }

  updateTrackParams(params) {
    //如果是速度
    if (params.type === 'speed') {
      let speed = params.value;
      let tmp = parseInt(this.gisDataLen * speed / window.SITE_CONFIG.map.trackTimer);
      if (tmp < 1) {
        tmp = 1;
      }
      this.trackLayer && this.trackLayer.updateSpeed(tmp);
    } else if (params.type === 'process') {
      let percent = params.value;
      let tmp = parseInt(percent * this.gisDataLen / 100);
      if (tmp < 1) {
        tmp = 1;
      }
      this.trackLayer && this.trackLayer.updateProcess(tmp < 0 ? 0 : tmp);
    } else if (params.type === 'pause') {
      this.trackLayer && this.trackLayer.pause();
    } else if (params.type === 'resume') {
      this.trackLayer && this.trackLayer.resume();
    }
  }

  clear() {
    this.pointerLayer && this.pointerLayer.removeLayer();
    this.trackLayer && this.trackLayer.clear_();
    this.pointerLayer = null;
    this.trackLayer = null;
  }
}

export default ZtcTrackLayerHandle
