/**
 * Created by fp on 2019/6/14.
 */
import xmap from '@/map/js/xmap/export/xmap'
import ZtcLayer from './ztcLayer'

class GridQuestionLayer extends ZtcLayer {
  constructor(options) {
    super(options)
  }

  getScale(zoom) {
    let scale = 0.6;
    if (zoom < 2) {
      scale = 0.3;
    } else if (zoom >= 2 && zoom < 4) {
      scale = 0.4;
    } else if (zoom >= 4 && zoom < 6) {
      scale = 0.5;
    }
    return scale;
  }

  getSelectedScale(zoom) {
    let scale = 0.7;
    if (zoom < 2) {
      scale = 0.35;
    } else if (zoom >= 2 && zoom < 4) {
      scale = 0.45;
    } else if (zoom >= 4 && zoom < 6) {
      scale = 0.55;
    }
    return scale;
  }

  getPicPath(itemData) {
    return this.imgPrePath + `/mapImg/industry/gridQuestion/2.png`
  }

  showDetail(item) {
    item.nameNotToSearch = true;
    this.map.showDetail(item)
  }
}

export default GridQuestionLayer
