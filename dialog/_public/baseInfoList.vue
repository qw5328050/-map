<template>
  <div class="base-info-list">
    <ul>
      <tool-btn ref="toolBtn" :params="detailData" @trendClick="handleTrendCompare" @analysisClick="handleTrendAnalysis"></tool-btn>
      <li v-if="detailData.address" class="text-ellipsis width380">
        <em class="iconfont address">&#xe606;</em>{{detailData.address}}
      </li>
      <li class="contact-info" v-if="detailData.linkMan || detailData.phone">
                <span class="contact-item" v-if="detailData.linkMan" title="环保联系人"><em
                  class="iconfont iconmanage user"></em>{{detailData.linkMan}}</span>
        <span class="contact-item" v-if="detailData.phone" title="联系电话">
          <em class="iconfont icontel tel"></em>{{detailData.phone}}</span>
      </li>
    </ul>
  </div>
</template>

<script type="text/jsx">
  import toolBtn from './toolBtnWater.vue'
  export default {
    props: {
      detailData: Object
    },
    components: {
      toolBtn
    },
    mounted(){
      this.$refs.toolBtn.updateParams();
    },
    methods: {
      handleTrendCompare(ele){
        if(ele && ele.$parent){
          ele.$parent.handleTrendCompare();
        }else{
          this.handleTrendCompare(this.$parent);
        }
      },
      handleTrendAnalysis(ele){
        if(ele && ele.$parent){
          ele.$parent.handleTrendAnalysis();
        }else{
          this.handleTrendAnalysis(this.$parent);
        }
      }
    }
  }
</script>
