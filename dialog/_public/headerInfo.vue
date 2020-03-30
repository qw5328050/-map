<template>
  <header class="header-info">
   <!-- <a href="#" v-if="detailData.sopId" @click.prevent="detailHandle" class="detail-btn"><em
      class="iconfont">&#xe662;</em>详情</a>-->
    <h3 class="name">{{detailData.siteName}}</h3>
    <p>
            <span class="fl">
              <zt-dictionary itemCode="SITE_FACTOR"
                             :code="detailData.type"></zt-dictionary>
            </span>
      <span class="fr">{{detailData.countyName}} </span>
    </p>
  </header>
</template>

<script type="text/jsx">
  import Vue from 'vue'
  import mapUtil from '@/map/js/util/mapUtil'
  import industryDialog from '@/map/dialog/pollute/polluteIndustry/industryDialog.vue'
  import constructionDialog from '@/map/dialog/pollute/polluteConstruction/constructionDialog'
  import {objectAssign} from '@/utils/util'

  export default {
    props: {
      detailData: Object
    },
    methods: {
      detailHandle() {
        let that = this
        let dialogObj = Vue.extend(industryDialog)
        let constructionDialogObj = Vue.extend(constructionDialog)
        let itemData = {}
        objectAssign(itemData, this.detailData)
        const info = {
          itemData: itemData
        };
        let obj
        if (mapUtil.constructionList.indexOf(that.detailData.type) >= 0) {
          obj = new constructionDialogObj({
            data: info
          })
        } else {
          obj = new dialogObj({
            data: info
          })
        }
        obj.show()
      }
    }
  }
</script>
