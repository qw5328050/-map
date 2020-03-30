<template>
  <a href="javascript:void(0)" class="btn-item" @click="emitRelatedAnalysis"><span
    class="iconfont"　:class="isRelated ? 'active': ''">&#xe670;</span>关联分析</a>
</template>

<script type="text/jsx">
  import mapUtil from '@/map/js/util/mapUtil'
  import store from '@/store'

  export default {
    props: {
      params: Object,
    },
    methods: {
      emitRelatedAnalysis(){
        if (!this.isRelated) { return; }
        store.commit('map/updataRelatedAnalysis', true)
        this.$mapEvtBus.$emit(mapUtil.EVT_NAME.map_relatedAnalysis, {
          center: [parseFloat(this.params.lng), parseFloat(this.params.lat)],
          params: this.params
        })
      }
    },
    computed: {
      isRelated() {
        return store.state.map.relatedAnalysis;
      }
    }
  }

</script>

