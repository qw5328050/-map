/**
 * 企业基本信息上地图显示内容
 * Created by fp on 2018/11/27.
 */
import Vue from 'vue'
import PolluteSingleLayer from "./polluteSingleLayer";
import industryDialog from "@/map/dialog/pollute/polluteIndustry/industryDialog.vue";
import {objectAssign} from "@/utils/util";

class WpqyLayer extends PolluteSingleLayer {
  constructor(options) {
    super(options);
  }

  getPicPath(itemData) {
    return this.imgPrePath + '/mapImg/industry/qy/1.png'
  }

  showDetail(item, position, params) {
    let dialog = industryDialog;
    item.id = item.siteCode;
    item.sopId = item.id;
    let dialogObj = Vue.extend(dialog);
    let itemData = {};
    objectAssign(itemData, item);
    itemData.sopId = itemData.id;
    const info = {
      itemData: itemData
    };
    const obj = new dialogObj({
      data: info
    });
    obj.selectDailog = 'info';
    obj.show();
  }
}
export default WpqyLayer;
