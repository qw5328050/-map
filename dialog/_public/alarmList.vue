<template>
  <div class="panel-table">
    <zt-table :data="dataList">
      <zt-column prop="time" width="90" label="告警时间">
      </zt-column>
      <zt-column prop="monitorValue" showOverflowTip width="66" label="监测值">
      </zt-column>
      <zt-column prop="standardValue" width="66" showOverflowTip label="标准值">
      </zt-column>
      <zt-column prop="description" width="168" label="告警描述"></zt-column>
    </zt-table>
  </div>
</template>

<script type="text/jsx">
  import moment from 'moment'
  import mapDialogHttp from '@/https/map/mapDialogHttp'
  import {getParamsByKey} from '@/utils/paramsCache'
  export default {
    props: {
      params: Object
    },
    data(){
      return {
        dataList: [],
      }
    },
    mounted(){
      this.getWarnDataList();
    },
    methods: {
      getWarnDataList(){
        mapDialogHttp.siteWarning({
          siteCode: this.params.siteCode,
          siteType: this.params.type,
        }).then(response => {
          this.dataList = response.result;
        })
      }
    }
  }
</script>
