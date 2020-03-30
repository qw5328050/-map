<template>
  <zt-dialog :title="dialogTitle" :visible.sync="dialogVisible" modal>
    <div v-if="dialogVisible" class="map-wrapper">
      <div class="map-area">
        <div class="map-container mapTime"
             id="chooseMapDiv"
             v-zt-stop-propagation="true"
             style="width:780px;margin: -30px;"
             :style="{'height':documentClientHeight - 250 +'px'}"></div>
        <choose-search ref="chooseSearch" @select="searchChoosePoint"
                       @showSearchData="showSearchData"
                       @clearSearchData="clearSearchData"
                       @addFocus="addFocus"
                       @removeFocus="removeFocus"></choose-search>
      </div>
    </div>
  </zt-dialog>
</template>

<script type="text/jsx">
  import mixins from '@/mixins/index'
  import chooseSearch from './chooseSearch.vue'
  import xmap from '@/map/js/xmap/export/xmap'
  import mapUtil from '@/map/js/util/mapUtil'
  import {getParamsByKey} from "@/utils/paramsCache";
  import Constants from '@/utils/Constants'
  export default {
    name: 'choosePoint',
    data(){
      return {
        mapObj: null,
        imgPrePath: window.SITE_CONFIG.imgPreUrl,
        searchLayer: null,
        dialogTitle: '地图选点',
        dialogVisible: false,
        mapDetailInfo: {}
      }
    },
    mixins: [mixins],
    components: {
      chooseSearch
    },
    provide() {
      return {
        getMap: this.getMap
      };
    },
    methods: {
      show(){
        this.dialogVisible = true;
        window.setTimeout(() => {
          this.initMap();
        }, 100);
      },
      initMap(){
        this.mapDetailInfo = getParamsByKey(Constants.mapInfo);
        if (process.env.NODE_ENV !== 'production') {
          this.mapDetailInfo.ipPort = this.mapDetailInfo.ipPortDev;
        }
        let baseLayersOptions = [{
          type: this.mapDetailInfo.type,
          url: this.mapDetailInfo.ipPort + this.mapDetailInfo.server,
          layer: this.mapDetailInfo.layer
        }];
        let self = this;
        document.querySelector('#chooseMapDiv').innerHTML = '';
        const mapParams = {
          target: 'chooseMapDiv',
          center: this.mapDetailInfo.center,
          zoom: this.mapDetailInfo.zoom,
          minZoom: this.mapDetailInfo.minZoom,
          maxZoom: this.mapDetailInfo.maxZoom,
          ripper: false,
          baseLayersOptions: baseLayersOptions,
          singleclick: function (point) {
            window.document.body.style.cursor = 'default';
            self.mapChoosePoint(point);
          }
        }
        this.mapObj = new xmap.Map(mapParams);
        let layer = new xmap.VectorLayer({
          map: this.mapObj,
          styleFunction: function (itemData, zoom, resolution, point) {//默认样式函数
            return {
              styleType: 'icon',
              scale: 0.5,
              src: self.imgPrePath + '/mapImg/_public/point.png'
            };
          }
        });
        this.searchLayer = new xmap.VectorLayer({
          map: this.mapObj,
          styleFunction: function (itemData, zoom, resolution, point) {//默认样式函数
            return self.getPicStyle(itemData, zoom, resolution, point);
          },
          selectStyleFunction: function (itemData, zoom, resolution, point) {
            return self.getSelectedPicStyle(itemData, zoom, resolution, point);
          },
          singleclick: function (itemData, zoom, point) {
            //获取数据
            window.document.body.style.cursor = 'default';
            self.emitChoosePoint(point, itemData.name);
          }
        });
      },
      mapChoosePoint(point){
//        this.$ztAlert('根据经纬度查询地名中...');
//        this.emitChoosePoint(point);
        mapUtil.getRegionByPos(point).then(result => {
          this.emitChoosePoint(point, result);
        });
      },
      getMap(){
        return this.mapObj;
      },
      setFitExtent(dataList) {
        let mapInfo = getParamsByKey(Constants.mapInfo);
        if (!dataList && dataList.length === 0) {
          return;
        }
        let extent = xmap.util.getPointerRange(dataList);
        let tmpExtent = mapInfo.extent;
        if (extent) {
          if (extent[0] < tmpExtent[0]) {
            extent[0] = tmpExtent[0];
          }
          if (extent[1] < tmpExtent[1]) {
            extent[1] = tmpExtent[1];
          }
          if (extent[2] > tmpExtent[2]) {
            extent[2] = tmpExtent[2];
          }
          if (extent[3] > tmpExtent[3]) {
            extent[3] = tmpExtent[3];
          }
        }
        if (extent[0] === extent[2] && extent[1] === extent[3]) {
          this.mapObj.setCenter([extent[0], extent[1]]);
        } else {
          this.mapObj.fitExtent(extent, {
            padding: [10, 10, 10, 400],
          })
        }
      },
      showSearchData(mapDataList){
        this.setFitExtent(mapDataList);
        this.searchLayer.showData({
          data: mapDataList
        });
      },

      clearSearchData(){
        this.searchLayer.showData({
          data: []
        });
      },
      getPicStyle(itemData, zoom) {
        return {
          styleType: 'icon',
          scale: this.getScale(zoom),
          src: this.getPicPath(itemData)
        };
      },
      getSelectedPicStyle(itemData, zoom) {
        return {
          styleType: 'icon',
          scale: this.getSelectedScale(zoom),
          src: this.getSelectedPicPath(itemData),
        };
      },
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
      },
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
      },
      getPicPath(itemData) {
        let index = itemData.index;
        return this.imgPrePath + '/mapImg/search/' + index + '.png'
      },
      getSelectedPicPath(itemData) {
        let index = itemData.index;
        return this.imgPrePath + '/mapImg/search/' + index + '-s.png'
      },
      searchChoosePoint(params){
        this.emitChoosePoint(params.point, params.address);
      },
      emitChoosePoint(point, address){
        this.$emit('select', {
          point: point,
          address: address
        });
        this.dialogVisible = false;
      },
      addFocus(itemData){
        this.searchLayer.setFocusById(itemData.id);
      },
      removeFocus(){
        this.mapObj.clearSelectedFeature();
      }
    }
  }
</script>

