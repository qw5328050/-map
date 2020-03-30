<template>

</template>

<script type="text/jsx">
  import mapUtil from '@/map/js/util/mapUtil'
  import {objectAssign} from '@/utils/util'
  export default {
    props: {
      params: null,
    },
    methods: {
      handleNearbySearch(){
        if (this.params) {
          let obj = {};
          objectAssign(obj, this.params);
          obj.divisionCode = obj.divCode;
          this.$mapEvtBus.$emit(mapUtil.EVT_NAME.search_nearbySearch, obj);
        }
      }
    }
  }
</script>

