<template>
  <div class="sub-tab-content">
    <div class="table-list-wrapper">
      <section class="table-list mb_15">
        <h3 class="form-item-name">大气排放口基本情况表</h3>
        <table class="table small-padding table-complex table-bordered light-blue-th">
          <thead>
          <tr>
            <th rowspan="2" class="al_center w_30">序号</th>
            <th rowspan="2">排放口编号</th>
            <th rowspan="2">排放口名称</th>
            <th rowspan="2">污染物种类</th>
            <th colspan="2" class="al_center">排放口地理坐标</th>
            <th rowspan="2">排气筒高度(m)</th>
            <th rowspan="2">排气筒出口内径(m)</th>
            <th rowspan="2">其它信息</th>
            <th rowspan="2">排放口二维码</th>
          </tr>
          <tr>
            <th>经度</th>
            <th>纬度</th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="loadingOne&&gasList&&gasList.length==0">
            <td class="al_center" colspan="10">{{constants.no_data_text}}</td>
          </tr>
          <tr v-for="(item, index) in gasList">
            <td class="al_center">{{index+1}}</td>
            <td>{{item.xkdraincode}}</td>
            <td>{{item.drainname}}</td>
            <td>{{item.wrwname}}</td>
            <td>{{item.longitude}}</td>
            <td>{{item.latitude}}</td>
            <td>{{item.exhaustheight}}</td>
            <td>{{item.exhaustbore}}</td>
            <td>{{item.othercontent}}</td>
            <td><img class="pop-code-sm" :src="`http://www.jneep.net/gridres${item.qrCode}`" alt=""></td>
          </tr>
          </tbody>
        </table>
      </section>
      <section class="table-list mb_15">
        <h3 class="form-item-name">废气污染物执行标准信息表</h3>
        <table class="table small-padding table-complex table-bordered light-blue-th">
          <thead>
          <tr>
            <th rowspan="2" class="al_center w_30">序号</th>
            <th rowspan="2">排放口编号</th>
            <th rowspan="2">排放口名称</th>
            <th rowspan="2">污染物种类</th>
            <th colspan="3" class="al_center">国家或地方污染物排放标准</th>
            <th rowspan="2">环境影响评价批复要求</th>
            <th rowspan="2">承诺更加严格排放限值</th>
            <th rowspan="2">其他信息</th>
          </tr>
          <tr>
            <th>名称</th>
            <th>浓度限值</th>
            <th>速率限值</th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="loadingTwo&&gasStandList&&gasStandList.length==0">
            <td class="al_center" colspan="10">{{constants.no_data_text}}</td>
          </tr>
          <tr v-for="(item, index) in gasStandList">
            <td class="al_center">{{index+1}}</td>
            <td>{{item.xkdraincode}}</td>
            <td>{{item.drainname}}</td>
            <td>{{item.wrwname}}</td>
            <td>{{item.emissionname}}</td>
            <td>{{item.emissioncon}}</td>
            <td>{{item.emissionspeed}}</td>
            <td>{{item.askname}}</td>
            <td>{{item.offername}}</td>
            <td>{{item.othercontent}}</td>
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
        gasList: [],
        gasStandList: []
      }
    },
    props: {
      permitId: String
    },
    created() {

    },
    mounted() {
      this.init()
    },
    methods: {
      init() {
        this.getDischargeGasList();
        this.getDischargeGasStandList();
      },
      changeInit(id) {
        this.permitId = id
        this.init();
      },
      getDischargeGasList() {
        mapPollutePublicHttp.getDischargeGasList(this.permitId).then((result) => {
          if (result.result && result.result.length > 0) {
            this.gasList = result.result;
          }
          this.loadingOne = true;
        }).catch((error) => {
          this.loadingOne = true;
        })
      },
      getDischargeGasStandList() {
        mapPollutePublicHttp.getDischargeGasStandList(this.permitId).then((result) => {
          if (result.result && result.result.length > 0) {
            this.gasStandList = result.result;
          }
          this.loadingTwo = true;
        }).catch((error) => {
          this.loadingTwo = true;
        })
      },
    },
    computed: {},
    watch: {
      permitId(val) {
        console.log(val)
      }
    }
  }
</script>
