/**
 * Created by fp on 2018/11/26.
 */
import xmap from '@/map/js/xmap/export/xmap'
import BaseLayer from './baseLayer'
import mapUtil from '@/map/js/util/mapUtil'


const colorLevel = {
  'red': 6,
  'orange': 5,
  'yellow': 4,
  'green': 3,
  'gray': 2,
  'white': 1
}

class RoadLayer extends BaseLayer {
  constructor(options) {
    super(options)
  }

  //创建图层
  createLayer(params) {
    if (this.alreadyInclude(params)) {
      return;
    }
    const self = this;
    const layer = new xmap.VectorLayer({
      zIndex: 10,
      styleFunction: function (itemData, zoom, resolution, point) {//默认样式函数
        return self.getLineStyle(itemData, zoom, resolution, point, params);
      },
      selectStyleFunction: function (itemData, zoom, resolution, point) {
        return self.getSelectedLineStyle(itemData, zoom, resolution, point, params);
      },
      singleclick: function (itemData, zoom, point) {
        //获取数据
        self.xmap.clearHoverTip();
        self.showDetail(itemData, point, params);
      },
      orderFunction(itemData1, itemData2){
        return (colorLevel[itemData1.value] - colorLevel[itemData2.value]);
      },
      filter: self.options.filter
  });
    this.xmap.addLayer(layer);
    this.vectorLayers.push({
      name: params.name,
      layer: layer
    });
  }

  getLineStyle(itemData, zoom) {
    let lineWidth = this.getDefaultLineWidth(itemData, zoom);
    let color = itemData.value;
    return {
      styleType: 'line',
      strokeColor: color,
      strokeWeight: lineWidth
    }
  }

  getSelectedLineStyle(itemData, zoom) {
    let lineWidth = this.getSelectedLineWidth(itemData, zoom);
    let color = itemData.value;
    return {
      styleType: 'line',
      strokeColor: color,
      strokeWeight: lineWidth
    }
  }

  getDefaultLineWidth(itemData, zoom) {
    let width = 3;
    if (zoom >= 2) {
      width = 4;
    }
    return width;
  }

  getSelectedLineWidth(itemData, zoom) {
    return this.getDefaultLineWidth(itemData, zoom) + 2;
  }

  showDetail(item, position, params) {
    item.type = mapUtil.staticParams.zhgc;
    this.map.showDetail(item);

  }
}
export default RoadLayer;
