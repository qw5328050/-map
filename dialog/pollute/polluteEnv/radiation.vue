<template>
  <div class="popbox-detail-content">
    <div class="panel-table" style="width: 100%;">
      <radiation-permit-list :itemData="itemData"></radiation-permit-list>
      <div style="height:50px;width:100%"></div>
      <radiation-pollute-list :itemData="itemData"></radiation-pollute-list>
    </div>

  </div>
</template>

<script type="text/jsx">
  import radiationPermitList from './radiationPermitList.vue'
  import radiationPolluteList from './radiationPolluteList.vue'
  export default {
    props: {
      itemData: Object
    },
    components: {
      radiationPermitList,
      radiationPolluteList
    }
  }
</script>
