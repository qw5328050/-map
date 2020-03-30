<template>
  <div class="panel-table">
    <zt-table :data="dataList">
      <zt-column prop="deviceName" showOverflowTip width="66" label="告警设备">
      </zt-column>
      <zt-column prop="startTime" width="90" label="开始时间">
      </zt-column>
      <zt-column prop="last" width="66" showOverflowTip label="持续时长">
      </zt-column>
      <zt-column prop="content" width="173" label="告警描述"></zt-column>
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
        mapDialogHttp.siteWarnElectric({
          siteCode: this.params.siteCode,
        }).then(response => {
          this.dataList = response.result;
        })
      }
    }
  }
</script>
