/**
 * Created by fp on 2018/11/15.
 * 工业图层处理与点位显示
 */
import {objectAssign} from '@/utils/util'
import IndustryLayer from './industryLayer'

//加入图层
class IndustryNormalLayer extends IndustryLayer {
  constructor(options) {
    super(options);
  }

  showDetail(item, position, params) {
    this.map.showDetail(item);
  }
}
export default IndustryNormalLayer
