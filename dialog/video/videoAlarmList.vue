<template>
  <div class="panel-table">
    <zt-table :data="dataList">
      <zt-column prop="recognitionLateTime" width="150" label="识别时间">
      </zt-column>
      <zt-column prop="recognitionDesc" showOverflowTip width="90" label="识别说明">
      </zt-column>
      <zt-column prop="handleStatus" width="90" label="处理状态">
        <template slot-scope="scope">未处理</template>
      </zt-column>
      <zt-column label="操作" width="65">
        <template slot-scope="scope">
          <div class="list-action">
            <zt-action-button type="detail"
                              @click="detailHandle(scope.row)">详情
            </zt-action-button>
          </div>
        </template>
      </zt-column>
    </zt-table>
  </div>
</template>

<script type="text/jsx">
  import moment from 'moment'
  import videoAlarmMapHttp from '@/https/video/videoAlarmMapHttp'
  import {getParamsByKey} from '@/utils/paramsCache'
  import {objectAssign} from '@/utils/util'
  import { router } from "@/main.js";

  let routeConfig = {
    '1': 'mudCover',
    '2': 'mudWash',
    '3': 'plate',
    '4': 'largeVehicle',
    '5': 'dustStack',
    '6': 'sewageDischarge',
    '7': 'stationInvade',
    '8': 'chimneyDischarge',
    '9': 'strawBurning',
  };
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
      detailHandle(itemData){
        let obj = {};
        objectAssign(obj, this.params);
        obj.recognitionLateTime = itemData.recognitionLateTime;
        let routeName = this.pubToString(this.params.recognitionType);
        router.push({name: routeConfig[routeName], params: obj});
      },
      getWarnDataList(){
        videoAlarmMapHttp.list({
          deviceId: this.params.deviceId,
        }).then(response => {
          this.dataList = response.result;
        })
      }
    }
  }
</script>
