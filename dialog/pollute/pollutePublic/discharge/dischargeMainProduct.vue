<template>
  <div class="sub-tab-content">
    <div class="table-list-wrapper">
      <td-main-product :mainProduct="productList"></td-main-product>
      <td-main-product-more :mainProductMore="replenishList"></td-main-product-more>
    </div>
  </div>
</template>
<script>
  import mapPollutePublicHttp from '@/https/map/mapPollutePublicHttp'
  import tdMainProduct from '../techDetail/tdMainProduct.vue'
  import tdMainProductMore from '../techDetail/tdMainProductMore.vue'
  export default {
    components: {
      tdMainProduct,
      tdMainProductMore
    },
    data() {
      return {
        productList: [],
        replenishList: []
      }
    },
    props: {
      permitId: String,
    },
    created() {

    },
    mounted() {
      this.init();
    },
    methods: {
      init() {
        this.getProductList();
        this.getReplenishList();
      },
      changeInit(id) {
        this.permitId = id
        this.init();
      },
      getProductList() {
        mapPollutePublicHttp.getProductList(this.permitId).then(result => {
          if (result.code === 0) {
            console.log('result.result:', result.result)
            this.productList = result.result
          }
        }).catch(error => {
          console.log(error)
        })
      },
      getReplenishList() {
        mapPollutePublicHttp.getReplenishList(this.permitId).then(result => {
          if (result.code === 0) {
            this.replenishList = result.result
          }
        }).catch(error => {
          console.log(error)
        })
      },
    },
  }
</script>

<style>
  .popbox-wrapper .popbox-pollute-detail .popbox-detail-content.content-scroll {
    margin-left: 0;
  }
</style>
