/**
 * Created by fp on 2018/11/30.
 * 搜索图层
 */
import BaseLayer from './baseLayer'


class SearchLayer extends BaseLayer {
  constructor(params) {
    super(params);
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
      src: this.getSelectedPicPath(itemData),
    };
  }

  getPicPath(itemData) {
    let index = itemData.index;
    return this.imgPrePath + '/mapImg/search/' + index + '.png'
  }

  getSelectedPicPath(itemData) {
    let index = itemData.index;
    return this.imgPrePath + '/mapImg/search/' + index + '-s.png'
  }

  getScale(zoom) {
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

  getSelectedScale(zoom) {
    let scale = 1;
    if (zoom < 2) {
      scale = 0.7;
    } else if (zoom >= 2 && zoom < 4) {
      scale = 0.8;
    } else if (zoom >= 4 && zoom < 6) {
      scale = 0.9;
    }
    return scale;
  }

  showDetail(item) {
    this.map.showDetail(item);
  }
}

export default SearchLayer;
