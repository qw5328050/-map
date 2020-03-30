/**
 * Created by fp on 2019/5/7.
 */
import BaseLayer from './baseLayer'
import xmap from '@/map/js/xmap/export/xmap'
import mapUtil from '@/map/js/util/mapUtil'

class PolluteDivisionLayer extends BaseLayer {
  constructor(options) {
    super(options);
  }

  createLayer(params) {
    if (this.alreadyInclude(params)) {
      return;
    }
    const self = this;
    const layer = new xmap.VectorLayer({
      styleFunction: function (itemData, zoom, resolution, point) {//默认样式函数
        return [{
          styleType: 'circle',
          strokeColor: "rgba(35,149,249,0.4)",
          strokeWeight: 8,
          radius: 20,
          fillColor: "rgba(35,149,249,0.8)"
        },
          {
            styleType: 'text',
            text: mapUtil.toString(itemData.value),
            font: '500 14px 微软雅黑',
            fillColor: '#fff'
          }];
      },
      selectStyleFunction: function (itemData, zoom, resolution, point) {//默认样式函数
        return [{
          styleType: 'circle',
          strokeColor: "rgba(35,149,249,0.4)",
          strokeWeight: 8,
          radius: 20,
          fillColor: "rgba(35,149,249,0.8)"
        },
          {
            styleType: 'text',
            text: mapUtil.toString(itemData.value),
            font: '500 14px 微软雅黑',
            fillColor: '#fff'
          }];
      },
      singleclick: function (itemData, zoom, point) {
        self.xmap.setZoomAndCenter(self.options.singleZoom, point);
      }
    });
    this.xmap.addLayer(layer);
    this.vectorLayers.push({
      name: params.name,
      layer: layer
    });
  }
}

export default PolluteDivisionLayer;
