<template>
  <em class="label ml_5" :class="aqiColor.ztAirColorClass(factor, value)">
    {{aqiColor.ztAirLabelValue(factor, value)}}
  </em>
</template>
<script type="text/jsx">
  /*颜色标签*/
  import aqiColor from '@/utils/aqiColor'
  export default {
    name: 'colorLabel',
    props: {
      factor: {
        type: String
      },
      value: {
        type: [Number, String]
      }
    },
    data(){
      return {
        aqiColor
      }
    }
  }
</script>

