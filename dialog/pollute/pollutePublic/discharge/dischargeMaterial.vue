<template>
  <div class="sub-tab-content">
    <div class="table-list-wrapper">
      <tech-detail-material :techDetailMaterial="materialList"></tech-detail-material>
      <tech-detail-fuel :techDetailFuel="fuelListL"></tech-detail-fuel>
    </div>
  </div>
</template>
<script>
  import mapPollutePublicHttp from '@/https/map/mapPollutePublicHttp'
  import techDetailMaterial from '../techDetail/techDetailMaterial.vue'
  import techDetailFuel from '../techDetail/techDetailFuel.vue'
  export default {
    components: {
      techDetailMaterial,
      techDetailFuel
    },
    data() {
      return {
        materialList: [],
        fuelListL: []
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
        this.getMaterialList();
        this.getFuelListL();
      },
      changeInit(id) {
        this.permitId = id
        this.init();
      },
      getMaterialList() {
        mapPollutePublicHttp.getMaterialList(this.permitId).then(result => {
          console.log('result:', result)
          if (result.code === 0) {
            this.materialList = result.result
          }
        }).catch(error => {
          console.log(error)
        })
      },
      getFuelListL() {
        mapPollutePublicHttp.getFuelListL(this.permitId).then(result => {
          if (result.code === 0) {
            this.fuelListL = result.result
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
