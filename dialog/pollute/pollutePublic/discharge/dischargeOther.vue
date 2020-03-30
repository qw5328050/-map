<template>
  <div class="sub-tab-content">
    <div class="table-list-wrapper">
      <section class="table-list mb_15">
        <h3 class="form-item-name">固体废物排放信息</h3>
        <table class="table small-padding table-complex table-bordered light-blue-th">
          <thead>
          <tr>
            <th>行业类别</th>
            <th>固体废物来源</th>
            <th>固体废物名称</th>
            <th>固体废物种类</th>
            <th>固体废物类别</th>
            <th>固体废物描述</th>
            <th>固体废物生产量(t/a)</th>
            <th>固体废物处理方式</th>
            <th>固体废物综合利用处理量(t/a)</th>
            <th>固体废物处置量(t/a)</th>
            <th>固体贮存量(t/a)</th>
            <th>固体废物排放量(t/a)</th>
            <th>备注</th>
          </tr>
          </thead>
          <tbody>
            <tr v-if="loadingOne&&solidWasteList&&solidWasteList.length==0">
              <td class="al_center" colspan="13">{{constants.no_data_text}}</td>
            </tr>
            <tr v-for="(item,index) in solidWasteList">
              <td>{{item.sector}}</td>
              <td>{{item.solidwasteSources}}</td>
              <td>{{item.solidwasteName}}</td>
              <td>{{item.solidwasteType}}</td>
              <td>{{item.solidwasteCategory}}</td>
              <td>{{item.solidwasteDesc}}</td>
              <td>{{item.solidwasteYield}}</td>
              <td>{{item.solidwasteTreatment}}</td>
              <td>{{item.solidwasteCompositeUtilize}}</td>
              <td>{{item.solidwasteDisposal}}</td>
              <td>{{item.solidwasteStorage}}</td>
              <td>{{item.solidwasteDischarge}}</td>
              <td>{{item.remark}}</td>
            </tr>
          </tbody>
        </table>
      </section>
      <section class="table-list mb_15">
        <h3 class="form-item-name">噪声排放信息</h3>
        <table class="table small-padding table-complex table-bordered light-blue-th">
          <thead>
            <tr>
              <th rowspan="2">噪声类别</th>
              <th colspan="2" class="al_center">生产时段</th>
              <th rowspan="2">执行排放标准名称</th>
              <th colspan="2" class="al_center">厂界噪声排放限制</th>
              <th rowspan="2">备注</th>
            </tr>
            <tr>
              <th>昼间</th>
              <th>夜间</th>
              <th>昼间,dB(A)</th>
              <th>夜间,dB(A)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loadingTwo&&soundList&&soundList.length==0">
              <td class="al_center" colspan="7">{{constants.no_data_text}}</td>
            </tr>
            <tr v-for="(item,index) in soundList">
              <td>{{item.noiseCategory}}</td>
              <td>{{item.productionTimeDay}}</td>
              <td>{{item.productionTimeNight}}</td>
              <td>{{item.dischargeCompliance}}</td>
              <td>{{item.noiseEmissionLimitDay}}</td>
              <td>{{item.noiseEmissionLimitNight}}</td>
              <td>{{item.remark}}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  </div>
</template>
<script>
  import mapPollutePublicHttp from '@/https/map/mapPollutePublicHttp'
  export default {
    data() {
      return {
        loadingOne: false,
        loadingTwo: false,
        solidWasteList:[],
        soundList:[],
      }
    },
    props: {
      permitId: String,
    },
    created() {

    },
    mounted() {
      this.init()
    },
    methods: {
      init () {
        this.getDischargeSolidWasteList();
        this.getDischargeSoundList();
      },
      changeInit(id) {
        this.permitId = id
        this.init();
      },
      getDischargeSolidWasteList(){
        mapPollutePublicHttp.getDischargeSolidWasteList(this.permitId).then((result) => {
          if(result.result&&result.result.length>0){
            this.solidWasteList = result.result;
          }
          this.loadingOne = true;
        }).catch((error) => {
          this.loadingOne = true;
        })
      },
      getDischargeSoundList(){
        mapPollutePublicHttp.getDischargeSoundList(this.permitId).then((result) => {
          if(result.result&&result.result.length>0){
            this.soundList = result.result;
          }
          this.loadingTwo = true;
        }).catch((error) => {
          this.loadingTwo = true;
        })
      }
    },
    computed:{

    }
  }
</script>
<style type="text/css">
</style>
