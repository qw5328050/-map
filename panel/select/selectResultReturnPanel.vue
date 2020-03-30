<template>
  <div class="return-btn-box" v-if="visible" @click="emitDetail">
    <!-- <a href="#"><span class="iconfont">&#xe882;</span>返回选择结果列表</a> -->
    <a href="#"><span class="iconfont">&#xe882;</span>返回{{item.name}}</a>
  </div>
</template>
<script>
  import basePanel from '../basePanel'
  import store from '@/store'

  export default {
    name: 'selectResultReturnPanel',
    mixins: [
        basePanel
    ],
    data () {
      return {}
    },
    mounted () {
      // this.$eventHub.$on(this.constants.event_name.hide_search_detail_panel, () => {
      //   this.hide()
      // })
      // this.$eventHub.$on(this.constants.event_name.show_search_detail_panel, () => {
      //   this.reshow()
      // })
    },
    methods: {
      emitBack () {
        this.$emit('selectBack')
        this.close()
      },
      emitDetail () {
        this.$emit('showDetail', this.item);
        // this.close()        
      },
      close () {
        this.visible = false
      }
    },
    watch: {
      isRelated (newValue, value) {
        this.visible = !newValue
      }
    },
    computed: {
      isRelated () {
        let flag = store.state.map.relatedAnalysis
        // console.log('==flag==' + flag)
        return flag
      },
      item () {
        let itemData = store.state.map.item
        // console.log('==itemData==')
        // console.log(itemData)
        return itemData
      }
    }
  }
</script>
<style>
</style>
