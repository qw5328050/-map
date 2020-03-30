/**
 * Created by fp on 2019/5/7.
 */
import Vue from 'vue'
import BaseLayer from './baseLayer'
import xmap from '@/map/js/xmap/export/xmap'
import industryDialog from '@/map/dialog/pollute/polluteIndustry/industryDialog.vue'
import husbandryDialog from '@/map/dialog/pollute/polluteHusbandry/husbandryDialog.vue'
import facilityDialog from '@/map/dialog/pollute/polluteFacility/facilityDialog.vue'
import constructionDialog from '@/map/dialog/pollute/polluteConstruction/constructionDialog.vue'
import cateringDialog from '@/map/dialog/pollute/polluteCatering/cateringDialog.vue'
import {objectAssign} from '@/utils/util'
import mapUtil from '@/map/js/util/mapUtil'

class PolluteClusterLayer extends BaseLayer {
  constructor(options) {
    super(options);
  }

  createLayer(params) {
    if (this.alreadyInclude(params)) {
      return;
    }
    const self = this;
    const layer = new xmap.ClusterLayer({
      map: self.xmap,
      zIndex: 100,
      //基本参数配置
      showSingleZoom: 5,
      animate: true,
      distance: 180,//像素范围内点聚合成一个点
      //样式配置
      //size为1，代表单个点
      styleFunction: function (size, itemDatas, zoom, resolution, point) {//默认样式函数
        if (size === 1) {
          return self.getPicStyle(itemDatas[0], zoom, resolution, point);
        } else {
          // let color = size > 25 ? "192,0,0" : size > 8 ? "255,128,0" : "0,128,0";
          let radius = parseInt(Math.max(12, Math.min(size * 1.5, 20)));
          return [{
            styleType: 'circle',
            strokeColor: "rgba(35,149,249,0.4)",
            strokeWeight: 8,
            radius: radius,
            fillColor: "rgba(35,149,249,0.8)"
          },
            {
              styleType: 'text',
              text: size.toString(),
              font: '500 14px 微软雅黑',
              fillColor: '#fff'
            }];
        }
      },
      selectStyleFunction: function (size, itemDatas, zoom, resolution, point) {//默认样式函数
        if (size === 1) {
          return self.getSelectedPicStyle(itemDatas[0], zoom, resolution, point);
        } else {
          let radius = parseInt(Math.max(12, Math.min(size * 1.5, 20)));
          return [{
            styleType: 'circle',
            strokeColor: "rgba(35,149,249,0.4)",
            strokeWeight: 8,
            radius: radius,
            fillColor: "rgba(35,149,249,0.8)"
          },
            {
              styleType: 'text',
              text: size.toString(),
              font: '500 14px 微软雅黑',
              fillColor: '#fff'
            }];
        }
      },
      singleclick: function (len, itemDatas, zoom, point) {
        //获取数据
        if (len === 1) {
          let itemData = itemDatas[0];
          self.xmap.clearHoverTip();
          self.showDetail(itemData, [itemData.longitude, itemData.latitude], params);
        }
      }
    });
    // this.xmap.addLayer(layer);
    this.vectorLayers.push({
      name: params.name,
      layer: layer
    });
  }

  getPicStyle(itemData, zoom, resolution, point, params) {
    return {
      styleType: 'icon',
      scale: this.getScale(zoom),
      src: this.getPicPath(itemData),
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
    let type = 'qy';
    if (itemData.type !== '' && itemData.type !== undefined) {
      if (itemData.type === '001') {
        type = 'qy';
      } else if (itemData.type === '002') {
        type = 'xqyz';
      } else if (itemData.type === '003') {
        type = 'jzzw';
      } else if (itemData.type === '004') {
        type = 'jzgd';
      } else if (itemData.type === '005') {
        type = 'cyqy';
      }
    }
    let statusPic = mapUtil.transformStatus(itemData.status);
    return this.imgPrePath + '/mapImg/industry/' + type + '/' + statusPic + '.png'
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

  showDetail(item, position, params) {
    let dialog = null;
    switch (item.type) {
      case '001':
        dialog = industryDialog
        break;
      case '002':
        dialog = industryDialog;
        break;
      case '003':
        dialog = industryDialog;
        break;
      case '004':
        dialog = industryDialog;
        break;
      case '005':
        dialog = industryDialog;
        break;
    }
    let dialogObj = Vue.extend(dialog);
    let itemData = {};
    objectAssign(itemData, item);
    const info = {
      itemData: itemData
    };
    const obj = new dialogObj({
      data: info
    });
    obj.show();
  }
}

export default PolluteClusterLayer;
