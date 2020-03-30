<template>
  <div class="map-area">
    <div
      class="map-container mapTime"
      id="chooseMapDiv"
      v-zt-stop-propagation="true"
      style="width: 100%; "
      :style="{'height': height + 'px'}"
    ></div>
  </div>
</template>

<script>
import mixins from "@/mixins/index";
import xmap from "@/map/js/xmap/export/xmap";
import mapUtil from "@/map/js/util/mapUtil";
import { getParamsByKey } from "@/utils/paramsCache";
import Constants from "@/utils/Constants";
export default {
  name: "mapLocation",
  props: {
    height: {
      type: Number,
      default: 300
    }
  },
  data() {
    return {
      mapObje: null,
      imgPrePath: window.SITE_CONFIG.imgPreUrl,
      searchLayer: null
    };
  },
  mixins: [mixins],
  provide() {
    return {
      getMap: this.getMap
    };
  },
  mounted() {},
  methods: {
    init() {
      window.setTimeout(() => {
        this.initMap();
      }, 100);
    },
    initMap() {
      let self = this;
      document.querySelector("#chooseMapDiv").innerHTML = "";
      let mapInfo = getParamsByKey(Constants.mapInfo);
      this.mapDetailInfo = mapInfo;

      const mapParams = {
        target: "chooseMapDiv",
        center: this.mapDetailInfo.centerSearch,
        zoom: this.mapDetailInfo.zoomSearch,
        minZoom: this.mapDetailInfo.minZoom,
        maxZoom: this.mapDetailInfo.maxZoom,
        ripper: false,
        baseLayersOptions: [
          {
            type: "tileWMS",
            url: mapInfo.ipPort + this.mapDetailInfo.server,
            layer: this.mapDetailInfo.layer
          }
        ],
        singleclick: function(point) {
          window.document.body.style.cursor = "default";
          self.mapChoosePoint(point);
        }
      };
      this.mapObj = new xmap.Map(mapParams);
      let layer = new xmap.VectorLayer({
        map: this.mapObj,
        styleFunction: function(itemData, zoom, resolution, point) {
          // 默认样式函数
          return {
            styleType: "icon",
            scale: 0.5,
            src: self.imgPrePath + "/mapImg/_public/point.png"
          };
        }
      });
      this.searchLayer = new xmap.VectorLayer({
        map: this.mapObj,
        styleFunction: function(itemData, zoom, resolution, point) {
          // 默认样式函数
          return self.getPicStyle(itemData, zoom, resolution, point);
        },
        selectStyleFunction: function(itemData, zoom, resolution, point) {
          return self.getSelectedPicStyle(itemData, zoom, resolution, point);
        },
        singleclick: function(itemData, zoom, point) {
          // 获取数据
          window.document.body.style.cursor = "default";
          self.emitChoosePoint(point, itemData.name);
        }
      });
    },
    mapChoosePoint(point) {
      this.$ztAlert("根据经纬度查询地名中...");
      this.emitChoosePoint(point);//显示经纬度，不显示地址
      // 根据经纬度获取详细地址
      // mapUtil.getRegionByPos(point).then(result => {
      //   this.emitChoosePoint(point, result);
      // });
    },
    getMap() {
      return this.mapObj;
    },
    setFitExtent(dataList) {
      if (!dataList && dataList.length === 0) {
        return;
      }
      let extent = xmap.util.getPointerRange(dataList);
      let tmpExtent = window.SITE_CONFIG.map.extent;
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
          padding: [10, 10, 10, 400]
        });
      }
    },
    getPicStyle(itemData, zoom) {
      return {
        styleType: "icon",
        scale: this.getScale(zoom),
        src: this.getPicPath(itemData)
      };
    },
    getSelectedPicStyle(itemData, zoom) {
      return {
        styleType: "icon",
        scale: this.getSelectedScale(zoom),
        src: this.getSelectedPicPath(itemData)
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
      return this.imgPrePath + "/mapImg/search/" + index + ".png";
    },
    getSelectedPicPath(itemData) {
      let index = itemData.index;
      return this.imgPrePath + "/mapImg/search/" + index + "-s.png";
    },
    emitChoosePoint(point, address) {
      this.$emit("select", {
        point: point,
        address: address
      });
    }
  }
};
</script>

<style scoped>
</style>
