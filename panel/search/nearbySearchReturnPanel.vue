<template>
  <!-- 附近搜索详情 -->
  <div class="result-detail" v-if="visible">
    <div class="return-btn-box" @click="emitBack">
      <a href="javascript:void(0);"><span class="iconfont">&#xe882;</span>返回附近搜索结果列表</a>
    </div>
  </div>
</template>

<script>
  import basePanel from '../basePanel'

  export default {
    name: 'nearby-search-result-detail-panel',
    mixins: [basePanel],
    data () {
      return {
        /* searchType: '',
         code: ''*/
      }
    },
    mounted () {
      /* // 隐藏查询详情面板
       this.$eventHub.$on(this.constants.event_name.hide_search_detail_panel, () => {
       this.hide()
       })*/
    },
    methods: {
      init () {
      },
      emitBack () {
        this.$emit('nearbySearchDetailBack')
        this.close()
      }
    }
  }
</script>
