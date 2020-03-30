/**
 * 企业基本信息上地图显示内容
 * Created by fp on 2018/11/27.
 */
import PolluteLayer from './polluteLayer'
import mapUtil from '@/map/js/util/mapUtil'

class IndustryInfoLayer extends PolluteLayer {
  constructor(options) {
    super(options);
  }

  getPicPath(itemData) {
    let type = 'qy';
    if (itemData.typeStr !== '' && itemData.typeStr !== undefined) {
      if (itemData.typeStr === '1') {
        type = 'qy';
      } else if (itemData.typeStr === '2') {
        type = 'xqyz';
      } else if (itemData.typeStr === '3') {
        type = 'jzzw';
      } else if (itemData.typeStr === '4') {
        type = 'jzgd';
      } else if (itemData.typeStr === '5') {
        type = 'cyqy';
      }
    }
    let statusPic = mapUtil.transformStatus(itemData.status);
    return this.imgPrePath + '/mapImg/industry/' + type + '/' + statusPic + '.png'
  }

  getSelectedScale(zoom) {
    return this.getScale(zoom);
  }

  showDetail(item) {
    //在这里写逻辑
    console.log('无弹框');
  }
}
export default IndustryInfoLayer;
