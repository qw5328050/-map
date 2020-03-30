/**
 * Created by fp on 2018/11/15.
 */
import xmap from '@/map/js/xmap/export/xmap'
import store from '@/store'

class BaseLayer {
  constructor(options) {
    this.options = options;
    this.map = options.map;
    //xmap数据
    this.xmap = this.map.map;
    this.vectorLayers = this.map.vectorLayers;
    //图片路径前缀
    this.imgPrePath = window.SITE_CONFIG.imgPreUrl;
    this.createLayer(options);
  }

  //创建图层
  createLayer(params) {
    if (this.alreadyInclude(params)) {
      return;
    }
    const self = this;
    const layer = new xmap.VectorLayer({
      zIndex: 100,
      styleFunction: function (itemData, zoom, resolution, point) {//默认样式函数
        return self.getPicStyle(itemData, zoom, resolution, point, params);
      },
      selectStyleFunction: function (itemData, zoom, resolution, point) {
        return self.getSelectedPicStyle(itemData, zoom, resolution, point, params);
      },
      singleclick: function (itemData, zoom, point) {
        //获取数据
        self.xmap.clearHoverTip();
        self.showDetail(itemData, [itemData.longitude, itemData.latitude], params);
      }
    });
    this.xmap.addLayer(layer);
    this.vectorLayers.push({
      name: params.name,
      layer: layer
    });
  }



  //删除某个图层
  removeLayer(params) {
    this.map.removeLayer(params);
  }

  //显示数据
  showData(params) {
    this.map.showData(params);
  }

  //判断是否已经有此图层
  alreadyInclude(params) {
    let inArray = false;
    this.vectorLayers.some(item => {
      inArray = (item.name === params.name);
      return inArray;
    });
    return inArray;
  }
}

export default BaseLayer;
