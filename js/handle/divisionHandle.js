/**
 * Created by fp on 2019/1/11.
 * 行政区域图层处理
 */
import {isNumber} from '@/utils/util'
class DivisionHandle {
  constructor(options) {
    this.mapObj = options.mapObj;
  }

  updateDivision(options) {
    if (this.mapObj) {
      if (isNumber(options.centerx) && isNumber(options.centery)) {
        this.mapObj.map.setCenter([parseFloat(options.centerx), parseFloat(options.centery)]);
        const level = parseInt(options.divisionLevel);
        let zoom = level;
        if (level === 2) {
          zoom = 1;
        } else if (level === 3) {
          zoom = 3;
        } else if (level === 4) {
          zoom = 6;
        } else {
          zoom = 1;
        }
        this.mapObj.map.setZoom(zoom);
      }
    }
  }
}

export default DivisionHandle;
