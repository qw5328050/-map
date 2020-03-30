/**
 * Created by fp on 2018/11/15.
 * 移动执法图层处理与点位显示
 */
import Vue from 'vue'
import BaseLayer from './baseLayer'
import MoveLine from '@/map/js/xmap/src/util/moveLine'
import ol from '@/map/js/xmap/ol_extend'
import {objectAssign} from '@/utils/util'
import moblieLawDialog from '@/map/dialog/mobileLaw/mobileLawDialog.vue'
import mapUtil from '@/map/js/util/mapUtil'
//加入图层
class MoblieLawLayer extends BaseLayer {
  constructor(options) {
    super(options);
    this.moveLine = null;
    this.baseImgCanLayer = null;
    this.animateImgCanLayer = null;
  }

  showData(params) {

  }

  getPicStyle(itemData, zoom, resolution, point, params) {
    return {
      styleType: 'icon',
      scale: this.getScale(zoom),
      src: this.getPicPath(itemData),
    };
  }

  initMoveLine(data) {
    const self = this;

    let map = self.map.map.olMap;

    if (!self.moveLine) {
      self.moveLine = new MoveLine({
        map: map,
        //marker点半径
        markerRadius: 2,
        //marker点颜色,为空或null则默认取线条颜色
        markerColor: null,
        //线条类型:solid, dashed, dotted
        lineType: 'dashed',
        //虚线间隔
        lineDash: [35, 10],
        //线条宽度
        lineWidth: 1,
        //线条颜色
        colors: ['#f04b4c'],
        //移动点半径
        moveRadius: 2,
        //移动点颜色
        fillColor: '#f04b4c',
        //移动点阴影颜色
        shadowColor: '#f04b4c',
        //移动点阴影大小
        shadowBlur: 4,
        //
        data: data
      });
    }

    if (self.baseImgCanLayer) {
      map.removeLayer(self.baseImgCanLayer);
    }

    if (data && data.length > 0) {
      var baseLayerSourceOptions = {
        canvasFunction: function (extent, resolution, pixelRatio, size, projection) {
          var canvas = document.createElement('canvas');
          var context = canvas.getContext('2d');
          var canvasWidth = size[0], canvasHeight = size[1];

          canvas.setAttribute('width', canvasWidth);
          canvas.setAttribute('height', canvasHeight);
          canvas.width = canvasWidth;
          canvas.height = canvasHeight;

          var mapExtent = map.getView().calculateExtent(map.getSize());
          var canvasOrigin = map.getPixelFromCoordinate([extent[0], extent[3]]);
          var mapOrigin = map.getPixelFromCoordinate([mapExtent[0], mapExtent[3]]);
          var delta = [mapOrigin[0] - canvasOrigin[0], mapOrigin[1] - canvasOrigin[1]];

          context.translate(delta[0], delta[1]);

          if (self.moveLine) {
            self.moveLine.setBaseContext(context);       //设置底层canvas上下文
            // self.moveLine.setBaseDelta(delta);           //设置底层canvas偏移量
            self.moveLine.addMarkLines();                 //添加
          }
          return canvas;
        }
      };
      var baseImgCanvas = new ol.source.ImageCanvas(baseLayerSourceOptions);
      self.baseImgCanLayer = new ol.layer.Image({source: baseImgCanvas});
      map.addLayer(self.baseImgCanLayer);
    }


    if (self.animateImgCanLayer) {
      map.removeLayer(self.animateImgCanLayer);
      if(self.moveLine){
        self.moveLine.stop();
      }
    }

    if (data && data.length > 0) {
      var animateLayerSourcOptions = {
        canvasFunction: function (extent, resolution, pixelRatio, size, projection) {
          var canvas = document.createElement('canvas');
          var context = canvas.getContext('2d');
          var canvasWidth = size[0], canvasHeight = size[1];

          canvas.setAttribute('width', canvasWidth);
          canvas.setAttribute('height', canvasHeight);
          canvas.width = canvasWidth;
          canvas.height = canvasHeight;
          var mapExtent = map.getView().calculateExtent(map.getSize());
          var canvasOrigin = map.getPixelFromCoordinate([extent[0], extent[3]]);
          var mapOrigin = map.getPixelFromCoordinate([mapExtent[0], mapExtent[3]]);
          var delta = [mapOrigin[0] - canvasOrigin[0], mapOrigin[1] - canvasOrigin[1]];
          context.translate(delta[0], delta[1]);

          if (self.moveLine) {
            self.moveLine.setAnimateContext(context);    //设置动画层canvas上下文
            // self.moveLine.setAnimateDelta(delta);        //设置动画层canvas上下文
            self.moveLine.startLoop();
          }
          return canvas;
        }
      };
      var animateImgCanvas = new ol.source.ImageCanvas(animateLayerSourcOptions);
      self.animateImgCanLayer = new ol.layer.Image({source: animateImgCanvas});
      map.addLayer(self.animateImgCanLayer);
    }
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
      } else if (itemData.type === 'zfdw') {
        type = 'zfdw';
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
    if (item.type == 'zfdw')return;
    let dialogObj = Vue.extend(moblieLawDialog);
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
export default MoblieLawLayer
