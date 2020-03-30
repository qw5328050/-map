<template>
  <div class="sub-tab-content">
    <div class="table-list-wrapper">
      <section class="table-list mb_15">
        <h3 class="form-item-name">废水直接排放口</h3>
        <table class="table small-padding table-complex table-bordered light-blue-th">
          <thead>
          <tr>
            <th rowspan="2">排放口编号</th>
            <th rowspan="2">排放口名称</th>
            <th colspan="2" class="al_center">排放口地理位置</th>
            <th rowspan="2">排水去向</th>
            <th rowspan="2">排放规律</th>
            <th rowspan="2">间歇式排放时段</th>
            <th colspan="2" class="al_center">受纳自然水体信息</th>
            <th colspan="2" class="al_center">汇入受纳自然水体处地理坐标</th>
            <th rowspan="2">其它信息</th>
            <th rowspan="2">二维码</th>
          </tr>
          <tr>
            <th>经度</th>
            <th>纬度</th>
            <th>名称</th>
            <th>受纳水体功能目标</th>
            <th>经度</th>
            <th>纬度</th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="loadingOne&&waterDirectList&&waterDirectList.length==0">
            <td class="al_center" colspan="13">{{constants.no_data_text}}</td>
          </tr>
          <tr v-for="(item,index) in waterDirectList">
            <td>{{item.xkdraincode}}</td>
            <td>{{item.drainname}}</td>
            <td>{{item.longitude}}</td>
            <td>{{item.latitude}}</td>
            <td>{{item.pfqxname}}</td>
            <td>{{item.pffsname}}</td>
            <td>{{item.emissiontime}}</td>
            <td>{{item.sewagename}}</td>
            <td>{{item.functionname}}</td>
            <td>{{item.naturelongitude}}</td>
            <td>{{item.naturelatitude}}</td>
            <td>{{item.remarks}}</td>
            <td><img class="pop-code-sm" style="width:100%;" :src="`http://www.jneep.net/gridres${item.qrCode}`" alt="">
            </td>
          </tr>
          </tbody>
        </table>
      </section>
      <section class="table-list mb_15">
        <h3 class="form-item-name">入河排污口</h3>
        <table class="table small-padding table-complex table-bordered light-blue-th">
          <thead>
          <tr>
            <th rowspan="2">排放口编号</th>
            <th rowspan="2">排放口名称</th>
            <th colspan="3" class="al_center">入河排污口</th>
            <th rowspan="2">其它信息</th>
            <th rowspan="2">二维码</th>
          </tr>
          <tr>
            <th>名称</th>
            <th>编号</th>
            <th>批复文号</th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="loadingTwo&&waterRiverList&&waterRiverList.length==0">
            <td class="al_center" colspan="7">{{constants.no_data_text}}</td>
          </tr>
          <tr v-for="(item,index) in waterRiverList">
            <td>{{item.xkdraincode}}</td>
            <td>{{item.drainname}}</td>
            <td>{{item.drainnameRiver}}</td>
            <td>{{item.xkdraincodeRiver}}</td>
            <td>{{item.approvalRiver}}</td>
            <td>{{item.remarks}}</td>
            <td class="al_center"><img class="pop-code-sm" style="height:50px;"
                                       :src="`http://www.jneep.net/gridres${item.qrCode}`" alt=""></td>
          </tr>
          </tbody>
        </table>
      </section>
      <section class="table-list mb_15">
        <h3 class="form-item-name">雨水排放口</h3>
        <table class="table small-padding table-complex table-bordered light-blue-th">
          <thead>
          <tr>
            <th rowspan="2">排放口编号</th>
            <th rowspan="2">排放口名称</th>
            <th colspan="2" class="al_center">排放口地理位置</th>
            <th rowspan="2">排水去向</th>
            <th rowspan="2">排放规律</th>
            <th rowspan="2">间歇式排放时段</th>
            <th colspan="2" class="al_center">受纳自然水体信息</th>
            <th colspan="2" class="al_center">汇入受纳自然水体处地理坐标</th>
            <th rowspan="2">其它信息</th>
            <th rowspan="2">二维码</th>
          </tr>
          <tr>
            <th>经度</th>
            <th>纬度</th>
            <th>名称</th>
            <th>受纳水体功能目标</th>
            <th>经度</th>
            <th>纬度</th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="loadingThree&&waterRainList&&waterRainList.length==0">
            <td class="al_center" colspan="13">{{constants.no_data_text}}</td>
          </tr>
          <tr v-for="(item,index) in waterRainList">
            <td>{{item.xkdraincode}}</td>
            <td>{{item.drainname}}</td>
            <td>{{item.longitude}}</td>
            <td>{{item.latitude}}</td>
            <td>{{item.pfqxname}}</td>
            <td>{{item.pffsname}}</td>
            <td>{{item.emissiontime}}</td>
            <td>{{item.sewagename}}</td>
            <td>{{item.functionname}}</td>
            <td>{{item.naturelongitude}}</td>
            <td>{{item.naturelatitude}}</td>
            <td>{{item.remarks}}</td>
            <td><img class="pop-code-sm" style="width:100%;" :src="`http://www.jneep.net/gridres${item.qrCode}`" alt="">
            </td>
          </tr>
          </tbody>
        </table>
      </section>
      <section class="table-list mb_15">
        <h3 class="form-item-name">废水间接排放口</h3>
        <table class="table small-padding table-complex table-bordered light-blue-th">
          <thead>
          <tr>
            <th rowspan="2">排放口编号</th>
            <th rowspan="2">排放口名称</th>
            <th colspan="2" class="al_center">排放口地理位置</th>
            <th rowspan="2">排水去向</th>
            <th rowspan="2">排放规律</th>
            <th rowspan="2">间歇式排放时段</th>
            <th colspan="4" class="al_center">受纳污水处理厂信息</th>
            <th rowspan="2">二维码</th>
          </tr>
          <tr>
            <th>经度</th>
            <th>纬度</th>
            <th>名称</th>
            <th>污染物种类</th>
            <th>排污协议规定的浓度限值(ml/L)(如有)</th>
            <th>国家或地方污染物排放标准浓度限值(ml/L)</th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="loadingFour&&waterInDirectList&&waterInDirectList.length==0">
            <td class="al_center" colspan="12">{{constants.no_data_text}}</td>
          </tr>
          <tr v-for="(item,index) in waterInDirectList">
            <td>{{item.xkdraincode}}</td>
            <td>{{item.drainname}}</td>
            <td>{{item.longitude}}</td>
            <td>{{item.latitude}}</td>
            <td>{{item.pfqxname}}</td>
            <td>{{item.pffsname}}</td>
            <td>{{item.emissiontime}}</td>
            <td>{{item.sewagename}}</td>
            <td>{{item.functionname}}</td>
            <td>{{item.emissionconProtocol}}</td>
            <td>{{item.emissionconStand}}</td>
            <td><img class="pop-code-sm" style="width:100%;" :src="`http://www.jneep.net/gridres${item.qrCode}`" alt="">
            </td>
          </tr>
          </tbody>
        </table>
      </section>
      <section class="table-list mb_15">
        <h3 class="form-item-name">废水污染物排放执行标准表</h3>
        <table class="table small-padding table-complex table-bordered light-blue-th">
          <thead>
          <tr>
            <th rowspan="2">排放口编号</th>
            <th rowspan="2">排放口名称</th>
            <th rowspan="2">污染物种类</th>
            <th colspan="2" class="al_center">国家或地方污染物排放标准</th>
            <th rowspan="2">排污协议规定的浓度限值(如有)</th>
            <th rowspan="2">环境影响评价审批意见要求</th>
            <th rowspan="2">承诺更加严格排放限值</th>
            <th rowspan="2">其他信息</th>
          </tr>
          <tr>
            <th>名称</th>
            <th>浓度限值(ml/L)</th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="loadingFive&&waterCriterionList&&waterCriterionList.length==0">
            <td class="al_center" colspan="9">{{constants.no_data_text}}</td>
          </tr>
          <tr v-for="(item,index) in waterCriterionList">
            <td>{{item.xkdraincode}}</td>
            <td>{{item.drainname}}</td>
            <td>{{item.wrwname}}</td>
            <td>{{item.nameEmissionconStand}}</td>
            <td>{{item.emissionconStand}}</td>
            <td>{{item.emissionconProtocol}}</td>
            <td>{{item.approvalRule}}</td>
            <td>{{item.highLimit}}</td>
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
        loadingThree: false,
        loadingFour: false,
        loadingFive: false,
        waterDirectList: [],
        waterRiverList: [],
        waterRainList: [],
        waterInDirectList: [],
        waterCriterionList: [],
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
      init() {
        this.getDischargeWaterDirectList();
        this.getDischargeWaterRiverList();
        this.getDischargeWaterRainList();
        this.getDischargeWaterInDirectList();
        this.getDischargeWaterCriterionList();
      },
      // changeInit(id) {
      //   this.permitId = id
      //   this.init();
      // },
      getDischargeWaterDirectList() {
        mapPollutePublicHttp.getDischargeWaterDirectList(this.permitId).then((result) => {
          if (result.result && result.result.length > 0) {
            this.waterDirectList = result.result;
          }
          this.loadingOne = true;
        }).catch((error) => {
          this.loadingOne = true;
        })
      },
      getDischargeWaterRiverList() {
        mapPollutePublicHttp.getDischargeWaterRiverList(this.permitId).then((result) => {
          if (result.result && result.result.length > 0) {
            this.waterRiverList = result.result;
          }
          this.loadingTwo = true;
        }).catch((error) => {
          this.loadingTwo = true;
        })
      },
      getDischargeWaterRainList() {
        mapPollutePublicHttp.getDischargeWaterRainList(this.permitId).then((result) => {
          if (result.result && result.result.length > 0) {
            this.waterRainList = result.result;
          }
          this.loadingThree = true;
        }).catch((error) => {
          this.loadingThree = true;
        })
      },
      getDischargeWaterInDirectList() {
        mapPollutePublicHttp.getDischargeWaterInDirectList(this.permitId).then((result) => {
          if (result.result && result.result.length > 0) {
            this.waterInDirectList = result.result;
          }
          this.loadingFour = true;
        }).catch((error) => {
          this.loadingFour = true;
        })
      },
      getDischargeWaterCriterionList() {
        mapPollutePublicHttp.getDischargeWaterCriterionList(this.permitId).then((result) => {
          if (result.result && result.result.length > 0) {
            this.waterCriterionList = result.result;
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
<style type="text/css">
</style>
