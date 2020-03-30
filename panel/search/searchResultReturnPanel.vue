<template>
  <!-- 返回搜索结果列表 -->
  <div class="return-btn-box" v-if="visible" @click="emitBack">
    <a href="javascript:void(0);"><span class="iconfont">&#xe664;</span>返回搜索结果列表</a>
  </div>
</template>

<script>
  import basePanel from '../basePanel'

  export default {
    name: 'search-result-detail-panel',
    mixins: [basePanel],
    data () {
      return {
        searchType: '',
        code: '',
        fromMap: false
      }
    },
    mounted () {
      // 隐藏查询详情面板
      this.$eventHub.$on(this.constants.event_name.hide_search_detail_panel, () => {
        this.hide()
      })
      this.$eventHub.$on(this.constants.event_name.show_search_detail_panel, () => {
        this.reshow()
      })
    },
    methods: {
      init () {
        const {searchType, code, fromMap} = this.obj
        this.searchType = searchType
        this.code = code
        this.fromMap = fromMap
      },
      emitBack () {
        this.$emit('searchBack')
        this.close()
      }
    }
  }
</script>
