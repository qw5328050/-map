/**
 * Created by fp on 2019/4/2.
 */
import BaseLayer  from './baseLayer'
import xmap from '@/map/js/xmap/export/xmap'
import boundGis from '@/map/js/util/boundGis'

class ZhgcYuntuLayer extends BaseLayer {
  constructor(options) {
    super(options);
  }

  createLayer() {
    let layer = new xmap.TileWMSLayer({
      map: this.xmap,
      url: window.SITE_CONFIG.map.ipPort + '/geoserver/jinanywk/wms',
      layer: 'jinanywk:' + this.options.factorName + '_' + this.options.dateType + '_two',
      version: '1.1.1',
      filter: boundGis.getCityBound()
    });

    this.vectorLayers.push({
      name: this.options.code,
      layer: layer
    });
  }
}
export default ZhgcYuntuLayer;
