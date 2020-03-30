<template>
  <!-- 排名 -->
  <div class="ranking-wrapper">
    <!-- 头部区域 -->
    <header class="tool-title">
      <h4>排名展示</h4>
      <a href="javascript: void(0);" class="iconfont close-tool" @click="emitClose">&#xe601;</a>
    </header>
    <div class="ranking">
      <div class="widge-title-tab">
        <span class="tab-item "
              :class="{'cur': curType === 'air' }"
              @click="curType='air'">空气站点</span>
        <span class="tab-item"
              :class="{'cur': curType === 'xzqy' }"
              @click="curType='xzqy'">行政区域</span>
      </div>
      <ranking-air-panel v-show="curType === 'air'"></ranking-air-panel>
      <ranking-xzqy-panel v-show="curType === 'xzqy'"></ranking-xzqy-panel>
    </div>
  </div>
</template>

<script>
  import rankingAirPanel from './rankingAirPanel.vue'
  import rankingXzqyPanel from './rankingXzqyPanel.vue'
  import mixins from '@/mixins'

  export default {
    name: 'ranking-panel',
    components: {rankingAirPanel, rankingXzqyPanel},
    data () {
      return {
        curType: 'air',
      }
    },
    mixins: [mixins],
    methods: {
      emitClose () {
        this.$emit('close')
      },
    }
  }
</script>
