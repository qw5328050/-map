<template>
  <div class="popbox-detail-content">
    <!-- tab页 -->
    <!--<div class="tab-boder no-bg flex-start has-border">-->
    <!--<div class="tab-item" :class="index == tabIndex ? 'cur' : ''" v-for="(item, index) in tab"-->
    <!--@click="tabChange(index)">{{item}}-->
    <!--</div>-->
    <!--</div>-->
    <td-main-product :mainProduct="mainProduct"></td-main-product>
    <td-main-product-more :mainProductMore="mainProductMore"></td-main-product-more>
    <tech-detail-material :techDetailMaterial="techDetailMaterial"></tech-detail-material>
    <tech-detail-fuel :techDetailFuel="techDetailFuel"></tech-detail-fuel>
    <!--<env-statistics-list-one :esSopObj="itemData" :class="showFlag == 2 ? '' : 'dis_none'"></env-statistics-list-one>-->
    <!--<tech-detail-air :class="tabIndex !== 2 ? 'dis_none' : ''"></tech-detail-air>-->
    <!--<tech-detail-water :class="tabIndex !== 3 ? 'dis_none' : ''"></tech-detail-water>-->
  </div>
</template>
<script>
  import mapPollutePublicHttp from '@/https/map/mapPollutePublicHttp'
  import tdMainProduct from './techDetail/tdMainProduct.vue'
  import tdMainProductMore from './techDetail/tdMainProductMore.vue'
  import techDetailAir from './techDetail/techDetailAir.vue'
  import techDetailFuel from './techDetail/techDetailFuel.vue'
  import techDetailMaterial from './techDetail/techDetailMaterial.vue'
  import techDetailWater from './techDetail/techDetailWater.vue'
  import polluteAsourceFileHttp from '@/https/pollute/polluteAsourceFileHttp'
  import envStatisticsListOne from './techDetail/envStatisticsListOne.vue'

  export default {
    props: {
      itemData: Object
    },
    components: {
      tdMainProduct,
      tdMainProductMore,
      techDetailAir,
      techDetailFuel,
      techDetailMaterial,
      techDetailWater,
      envStatisticsListOne
    },
    created(){
      this.getSourceInfoFactorSource()
    },
    data() {
      return {
        tab: ['主要产品及产能', '原辅材料及辅料', '废气治污设施', '废气治污设施'],
        tabIndex: 0,
        showFlag: 1,
        mainProduct: [], // 主要产品及产能
        mainProductMore: [], // 主要产品及产能及补充
        techDetailMaterial: [], // 原辅材料及辅料
        techDetailFuel: [], // 燃料
        factorDataEs: {}
      }
    },
    methods: {
      getSourceInfoFactorSource(){
        let params = {
          sopId: this.itemData.id
        };
        polluteAsourceFileHttp.getSourceInfoFactorSource(params)
          .then(res => {
            let result = res.result;
            this.techDetailMaterial = result.materials;
            this.techDetailFuel = result.fuel;
            this.mainProductMore = result.replenishs;
            this.mainProduct = result.products;
          })
      },
      /* getSourceInfoFactorDataPm(){
       let params = {
       sopId: this.itemData.id
       }
       polluteAsourceFileHttp.getSourceInfoFactorDataPm(params)
       .then(res => {
       console.log('getSourceInfoFactorDataPm:', res.data)
       this.mainProduct = res.data.products
       this.mainProductMore = res.data.replenishs
       })
       },*/
    }
  }
</script>
