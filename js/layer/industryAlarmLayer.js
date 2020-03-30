/**
 * Created by fp on 2018/11/15.
 * 工业图层处理与点位显示
 */
import xmap from '@/map/js/xmap/export/xmap'
import IndustryLayer from './industryLayer'
import mapUtil from '@/map/js/util/mapUtil'

//加入图层
class IndustryAlarmLayer extends IndustryLayer {
  constructor(options) {
    super(options);
    this.initRipperLayer();
  }
  //创建图层
  createLayer(params) {
    if (this.alreadyInclude(params)) {
      return;
    }
    const self = this;
    this.layer = new xmap.VectorLayer({
      zIndex: 1000,
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
      },
      //排序，让数字大的显示在上面，即出现故障的点现在上上面
      orderFunction: function (itemData1, itemData2) {
        return mapUtil.transformStatus(itemData1.status) > mapUtil.transformStatus(itemData2.status);
      }
    });
    this.xmap.addLayer(this.layer);
    this.vectorLayers.push({
      name: params.name,
      layer: this.layer,
      xLayer: this
    });
  }

  getPicPath(itemData) {
    let type = 'qy';
    if (itemData.type !== '' && itemData.type !== undefined) {
      if(itemData.type ==='zxqy' ||
        itemData.type ==='zdqy' || itemData.type ==='syqy'){
        type = 'qy';
      }else if(itemData.type==='wrfeiq'){
        type = 'feiq';
      }else{
        type = itemData.type;
      }
    }
    return this.imgPrePath + '/mapImg/industry/' + type + '/2.png'
  }

  initRipperLayer() {
    this.ripperLayer = new xmap.RipperUtil({
      map: this.xmap
    });
  }

  showData(params) {
    this.layer.showData(params);
    this.ripperLayer.clear();
    this.ripperLayer.startArray(params.data);
  }

  removeLayer() {
    this.xmap.removeLayer(this.layer);
    this.ripperLayer.clear();
    this.xmap = null;
    this.ripperLayer = null;
  }
}
export default IndustryAlarmLayer
