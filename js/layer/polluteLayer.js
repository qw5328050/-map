/**
 * Created by fp on 2018/11/15.
 * 污染源图层处理
 */
import BaseLayer from './baseLayer'


//加入图层
class PolluteLayer extends BaseLayer {
  constructor(options) {
    super(options);
  }

  getPicStyle(itemData, zoom, resolution, point, params) {
    return {
      styleType: 'icon',
      scale: this.getScale(zoom),
      src: this.getPicPath(itemData)
    };
  }

  getSelectedPicStyle(itemData, zoom, resolution, point, params) {
    return {
      styleType: 'icon',
      scale: this.getSelectedScale(zoom),
      src: this.getPicPath(itemData),
    };
  }

  getPicPath(itemData) {
    let type = '001';
    if (itemData._type !== '' && itemData._type !== undefined) {
      type = itemData._type;
    }
    return this.imgPrePath + '/mapImg/pollute/' + type + '/2.png'
  }

  getScale(zoom) {
    let scale = 0.8;
    if (zoom < 2) {
      scale = 0.5;
    } else if (zoom >= 2 && zoom < 4) {
      scale = 0.6;
    } else if (zoom >= 4 && zoom < 6) {
      scale = 0.7;
    }
    return scale;
  }

  getSelectedScale(zoom) {
    let scale = 0.9;
    if (zoom < 2) {
      scale = 0.6;
    } else if (zoom >= 2 && zoom < 4) {
      scale = 0.7;
    } else if (zoom >= 4 && zoom < 6) {
      scale = 0.8;
    }
    return scale;
  }

  showDetail(item) {
    this.map.showDetail(item);
  }

}
export default PolluteLayer
