/**
 * Created by fp on 2019/1/11.
 * 基础图层处理
 */
import xmap from '@/map/js/xmap/export/xmap'

class BaseLayerHandle {
  constructor(options) {
    this.map = options.map;
    //卫星图层
    this.weixLayers = [];
    //其它图层
    this.layers = [];
  }

  showLayer(options) {
    if (!options.checked) {
      switch (options.code) {
        case 'weixt':
          this.removeWeixtLayer();
          break;
        case 'xzqy':
        case 'sthx':
        case 'rdwg':
          let item = BaseLayerHandle.getLayerParamsByCode(options.code);
          this.removeWMSLayer(item);
          break;
        default:
          break;
      }
    } else {
      switch (options.code) {
        case 'weixt':
          this.addWeixtLayer();
          break;
        case 'xzqy':
        case 'sthx':
        case 'rdwg':
          let item = BaseLayerHandle.getLayerParamsByCode(options.code);
          this.addWMSLayer(item);
          break;
        default:
          break;
      }
    }
  }

  addWeixtLayer() {
    let layers = [
      {"name": "weixt_dt", "type": "tdt", "layer": "img_c"},
      {"name": "weixt_bz", "type": "tdt", "layer": "cia_c"}
    ];
    layers.forEach(item => {
      this.addTdtLayer(item);
    })
  }

  removeWeixtLayer() {
    let list = [
      {"name": "weixt_dt", "type": "tdt", "layer": "img_c"},
      {"name": "weixt_bz", "type": "tdt", "layer": "cia_c"}
    ];
    list.forEach(item => {
      let index = -1;
      for (let i = 0, len = this.weixLayers.length; i < len; i++) {
        const item2 = this.weixLayers[i];
        if (item2.name === item.name) {
          index = i;
          this.map.removeLayer(item2.layer);
          item.layer = null;
          break;
        }
      }
      if (index >= 0) {
        this.weixLayers.splice(index, 1);
      }
    });
  }


  /**
   * 添加图层
   * @param params
   */
  addWMSLayer(params) {
    if (!params) {
      return;
    }
    this.removeWMSLayer(params);
    let url = window.SITE_CONFIG.map.ipPort + window.SITE_CONFIG.map.server;
    //瓦片图层
    const layer = new xmap.TileWMSLayer({
      zIndex: 1,
      url: url,
      layer: params.layer
    });
    this.map.addLayer(layer);
    this.layers.push({
      type: params.type,
      name: params.name,
      layer: layer
    })
  }

  removeWMSLayer(params) {
    if (!params) {
      return;
    }
    let index = -1;
    for (let i = 0, len = this.layers.length; i < len; i++) {
      const item = this.layers[i];
      if (item.name === params.name) {
        index = i;
        this.map.removeLayer(item.layer);
        item.layer = null;
        break;
      }
    }
    if (index >= 0) {
      this.layers.splice(index, 1);
    }
  }

  static getLayerParamsByCode(code) {
    if (code === 'xzqy') {
      return {"name": "xzqy", "type": "tileWMS", "layer": "jinanwp:JINAN_XZQH_PC"};
    } else if (code === 'sthx') {
      return {"name": "sthx", "type": "tileWMS", "layer": "jinanwp:JINAN_STHX_PC"};
    } else if (code === 'rdwg') {
      return {"name": "rdwg", "type": "tileWMS", "layer": "jinanwp:JINAN_HEATGRID_PC"};
    } else {
      return null;
    }
  }

  addTdtLayer(params) {
    let url = 'http://t0.tianditu.com/DataServer';
    const layer = new xmap.TdtLayer({
      url: url,
      layerId: params.layer
    });
    this.map.addLayer(layer);
    this.weixLayers.push({
      type: params.type,
      name: params.name,
      layer: layer
    })
  }


}

export default  BaseLayerHandle;
