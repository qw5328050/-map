<template>
  <div v-if="$parent.visible">
    <header class="header-info">
      <!--<a v-if="info.sopId" href="#" @click.prevent="detailHandle" class="detail-btn"><em class="iconfont">&#xe672;</em>详情</a>-->
      <h3 class="name">{{info.name}}</h3>
      <p>
        <span class="fl">{{info.conLevel}}</span>
        <span class="fr">{{info.county}}</span>
      </p>
    </header>

  </div>
</template>

<script type="text/jsx">
  import Vue from 'vue'
  import mapUtil from '@/map/js/util/mapUtil'
  import industryDialog from '@/map/dialog/pollute/polluteIndustry/industryDialog.vue'
  import constructionDialog from '@/map/dialog/pollute/polluteConstruction/constructionDialog'
  import {objectAssign} from '@/utils/util'
  export default{
    props: {
      info: Object
    },
    methods: {
      detailHandle(){
        let that = this;
        let dialogObj = Vue.extend(industryDialog);
        let constructionDialogObj = Vue.extend(constructionDialog)
        let itemData = {};
        objectAssign(itemData, this.info);
        const info = {
          itemData: itemData
        };
        let obj;
        if (mapUtil.constructionList.indexOf(that.info.type) >= 0) {
          obj = new constructionDialogObj({
            data: info
          })
        } else {
          obj = new dialogObj({
            data: info
          });
        }
        obj.show();
      }
    },
  }
</script>

