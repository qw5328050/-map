<template>
  <div class="sub-tab-content">
    <div class="table-list-wrapper">
      <section class="table-list mb_15">
        <h3 class="form-item-name">有组织排放许可限值</h3>
        <table class="table small-padding table-complex table-bordered light-blue-th">
          <thead>
          <tr>
            <th rowspan="2" class="al_center w_30">序号</th>
            <th rowspan="2">排放口编号</th>
            <th rowspan="2">排放口名称</th>
            <th rowspan="2">污染物种类</th>
            <th rowspan="2">许可排放浓度限值(mg/m³)</th>
            <th rowspan="2">许可排放速率限值(kg/h)</th>
            <th colspan="5" class="al_center">许可年排放量限值</th>
            <th rowspan="2">其它信息</th>
          </tr>
          <tr>
            <th>第一年</th>
            <th>第二年</th>
            <th>第三年</th>
            <th>第四年</th>
            <th>第五年</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <th colspan="12" class="al_center">主要排放口</th>
          </tr>
          <tr v-if="loadingOne&&gasMainList&&gasMainList.length==0"><td class="al_center" colspan="12">{{constants.no_data_text}}</td></tr>
          <tr v-for="(item,index) in gasMainList">
            <td class="al_center">{{index+1}}</td>
            <td>{{item.xkdraincode}}</td>
            <td>{{item.drainname}}</td>
            <td>{{item.wrwname}}</td>
            <td>{{item.emissioncon}}</td>
            <td>{{item.emissionspeed}}</td>
            <td>{{item.sqoneyear}}</td>
            <td>{{item.sqtwoyear}}</td>
            <td>{{item.sqthreeyear}}</td>
            <td>{{item.sqfouryear}}</td>
            <td>{{item.sqfiveyear}}</td>
            <td>{{item.othercontent}}</td>
          </tr>
          <tr v-if="loadingTwo&&gasMainCountList&&gasMainCountList.length==0">
            <th colspan="2">主要排放口合计</th>
            <td class="al_center" colspan="10">{{constants.no_data_text}}</td>
          </tr>
          <tr  v-for="(item,index) in gasMainCountList">
            <th v-if="index==0" colspan="2" :rowspan="gasMainCountList.length">主要排放口合计</th>
            <td colspan="4" class="al_center">{{item.wrwname}}</td>
            <td>{{item.sqoneyear}}</td>
            <td>{{item.sqtwoyear}}</td>
            <td>{{item.sqthreeyear}}</td>
            <td>{{item.sqfouryear}}</td>
            <td>{{item.sqfiveyear}}</td>
            <td></td>
          </tr>
          <tr>
            <th colspan="12" class="al_center">一般排放口</th>
          </tr>
          <tr v-if="loadingThree&&gasComList&&gasComList.length==0"><td class="al_center" colspan="12">{{constants.no_data_text}}</td></tr>
          <tr v-for="(item,index) in gasComList">
            <td class="al_center">{{index+1}}</td>
            <td>{{item.xkdraincode}}</td>
            <td>{{item.drainname}}</td>
            <td>{{item.wrwname}}</td>
            <td>{{item.emissioncon}}</td>
            <td>{{item.emissionspeed}}</td>
            <td>{{item.sqoneyear}}</td>
            <td>{{item.sqtwoyear}}</td>
            <td>{{item.sqthreeyear}}</td>
            <td>{{item.sqfouryear}}</td>
            <td>{{item.sqfiveyear}}</td>
            <td>{{item.othercontent}}</td>
          </tr>
          <tr v-if="loadingFour&&gasComCountList&&gasComCountList.length==0">
            <th colspan="2">一般排放口合计</th>
            <td class="al_center" colspan="10">{{constants.no_data_text}}</td>
          </tr>
          <tr  v-for="(item,index) in gasComCountList">
            <th v-if="index==0" colspan="2" :rowspan="gasComCountList.length">一般排放口合计</th>
            <td colspan="4" class="al_center">{{item.wrwname}}</td>
            <td>{{item.sqoneyear}}</td>
            <td>{{item.sqtwoyear}}</td>
            <td>{{item.sqthreeyear}}</td>
            <td>{{item.sqfouryear}}</td>
            <td>{{item.sqfiveyear}}</td>
            <td></td>
          </tr>
          <tr>
            <th colspan="12" class="al_center">全厂有组织排放总计</th>
          </tr>
          <tr v-if="loadingFive&&gasWholeCountList&&gasWholeCountList.length==0">
            <th colspan="2">全厂有组织排放合计</th>
            <td class="al_center" colspan="10">{{constants.no_data_text}}</td>
          </tr>
          <tr  v-for="(item,index) in gasWholeCountList">
            <th v-if="index==0" colspan="2" :rowspan="gasWholeCountList.length">全厂有组织排放合计</th>
            <td colspan="4" class="al_center">{{item.wrwname}}</td>
            <td>{{item.sqoneyear}}</td>
            <td>{{item.sqtwoyear}}</td>
            <td>{{item.sqthreeyear}}</td>
            <td>{{item.sqfouryear}}</td>
            <td>{{item.sqfiveyear}}</td>
            <td></td>
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
        loadingOne:false,
        loadingTwo:false,
        loadingThree:false,
        loadingFour:false,
        loadingFive:false,
        gasMainList: [],
        gasMainCountList: [],
        gasComList: [],
        gasComCountList: [],
        gasWholeCountList: [],
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
        this.getDischargeGasMainList();
        this.getDischargeGasMainCountList();
        this.getDischargeGasComList();
        this.getDischargeGasComCountList();
        this.getDischargeGasWholeCountList();
      },
      changeInit(id) {
        this.permitId = id
        this.init();
      },
      getDischargeGasMainList() {
        mapPollutePublicHttp.getDischargeGasMainList(this.permitId).then((result) => {
          if (result.result && result.result.length > 0) {
            this.gasMainList = result.result;
          }
          this.loadingOne = true;
        }).catch((error) => {
          this.loadingOne = true;
        })
      },
      getDischargeGasMainCountList() {
        mapPollutePublicHttp.getDischargeGasMainCountList(this.permitId).then((result) => {
          if (result.result && result.result.length > 0) {
            this.gasMainCountList = result.result;
          }
          this.loadingTwo = true;
        }).catch((error) => {
          this.loadingTwo = true;
        })
      },
      getDischargeGasComList() {
        mapPollutePublicHttp.getDischargeGasComList(this.permitId).then((result) => {
          if (result.result && result.result.length > 0) {
            this.gasComList = result.result;
          }
          this.loadingThree = true;
        }).catch((error) => {
          this.loadingThree = true;
        })
      },
      getDischargeGasComCountList() {
        mapPollutePublicHttp.getDischargeGasComCountList(this.permitId).then((result) => {
          if (result.result && result.result.length > 0) {
            this.gasComCountList = result.result;
          }
          this.loadingFour = true;
        }).catch((error) => {
          this.loadingFour = true;
        })
      },
      getDischargeGasWholeCountList() {
        mapPollutePublicHttp.getDischargeGasWholeCountList(this.permitId).then((result) => {
          if (result.result && result.result.length > 0) {
            this.gasWholeCountList = result.result;
          }
          this.loadingFive = true;
        }).catch((error) => {
          this.loadingFive = true;
        })
      },
    },
    computed: {}
  }
</script>
