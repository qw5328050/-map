<template>
  <li class="btn-wrapper" v-if="show">
    <a href="javascript:void(0)"
       v-if="canNearbySearch"
       class="btn-item"
       @click="handleNearbyClick"><span
      class="iconfont iconposition-strong"></span>附近查询</a>
    <a href="javascript:void(0)"
       class="btn-item"
       v-if="canRelatedAnalysis"
       @click="handleRelatedClick"
       :class="isRelated ? '' : 'active'"><span
      class="iconfont iconass-analysis"></span>关联分析</a>
    <a href="javascript:void(0)"
       v-if="canTrendCompare"
       @click.stop.prevent="handleTrendClick"
       class="btn-item"><span
      class="iconfont icontrend"></span>趋势对比</a>
  </li>
</template>

<script type="text/jsx">
  import mapUtil from '@/map/js/util/mapUtil'
  import {objectAssign} from '@/utils/util'
  import {getParamsByKey} from '@/utils/paramsCache'
  import store from '@/store'
  export default {
    props: {
      params: Object,
    },
    data(){
      let monitoringConfig = getParamsByKey(this.constants.monitoringConfig);
      return {
        monitoringConfig: monitoringConfig,
        canNearbySearch: false,
        canRelatedAnalysis: false,
        canTrendCompare: false,
        show: true,
      }
    },
    methods: {
      updateParams(){
        let val = this.params.type.split(',')[0];
//        this.canNearbySearch = true;
//        this.updateCanNearbySearch(val);
        this.canRelatedAnalysis = this.monitoringConfig.associationAnalysis.indexOf(val) >= 0;
        this.canTrendCompare = this.monitoringConfig.trendContrast.indexOf(val) >= 0;
        this.show = this.canNearbySearch || this.canRelatedAnalysis || this.canTrendCompare;
      },
      updateCanNearbySearch(val){
        return val.tabType.indexOf() >= 0
      },
      updateCanRelatedAnalysis(val){
        if (!val || !val.tabType) {
          return false;
        }
        return val.tabType.indexOf(mapUtil.tabType.glfx) >= 0
      },
      updateCanTrendCompare(val){
        if (!val || !val.tabType) {
          return false;
        }
        return val.tabType.indexOf(mapUtil.tabType.qsdb) >= 0
      },
      handleTrendClick(){
        this.$emit('trendClick');
      },
      handleRelatedClick(){
        if (!this.isRelated) {
          //  store.commit('map/updateItem', null)
          //  return;
        } else {
          this.$mapEvtBus.$emit(mapUtil.EVT_NAME.map_relatedAnalysis, {
            center: [parseFloat(this.params.longitude), parseFloat(this.params.latitude)],
            params: this.params
          })
          // store.commit('map/updateItem', this.params)
        }
      },
      handleNearbyClick(){
        if (this.params) {
          let obj = {};
          objectAssign(obj, this.params);
          obj.divisionCode = obj.divCode;
          this.$mapEvtBus.$emit(mapUtil.EVT_NAME.search_nearbySearch, obj);
        }
      }
    },
    computed: {
      isRelated() {
        return store.state.map.relatedAnalysis;
      }
    }
  }
</script>

<style>
  .map-wrapper .point-info-detail .base-info-list .btn-wrapper a.active {
    color: #b3b3b3
  }
</style>
