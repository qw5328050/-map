<template>
  <div class="sub-tab-content">
    <div class="table-list-wrapper">
      <!-- 废水主要排放口 -->
      <section class="table-list mb_15">
        <h3 class="form-item-name">废水主要排放口</h3>
        <table class="table small-padding table-complex table-bordered light-blue-th">
          <thead>
          <tr>
            <th rowspan="2">排放口编号</th>
            <th rowspan="2">排放口名称</th>
            <th rowspan="2">污染物种类</th>
            <th rowspan="2">申请排放浓度限值(mg/L)</th>
            <th colspan="5" class="al_center">申请年排放量限值(t/a)</th>
            <th rowspan="2">申请特殊时段排放量限值</th>
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
            <tr v-if="loadingOne&&waterMainList&&waterMainList.length==0">
              <td class="al_center" colspan="10">{{constants.no_data_text}}</td>
            </tr>
            <tr v-for="(item,index) in waterMainList">
              <td>{{item.xkdraincode}}</td>
              <td>{{item.drainname}}</td>
              <td>{{item.wrwname}}</td>
              <td>{{item.sqemissioncon}}</td>
              <td>{{item.sqoneyear}}</td>
              <td>{{item.sqtwoyear}}</td>
              <td>{{item.sqthreeyear}}</td>
              <td>{{item.sqfouryear}}</td>
              <td>{{item.sqfiveyear}}</td>
              <td>{{item.sqemissiontslimit}}</td>
            </tr>
            <!--<tr v-for="(item, index) in waterMainCountList">-->
              <!--<th v-if="index==0" :rowspan="waterMainCountList.length" colspan="3">主要排放口合计</th>-->
              <!--<td>{{item.sqemissioncon}}</td>-->
              <!--<td>{{item.sqoneyear}}</td>-->
              <!--<td>{{item.sqtwoyear}}</td>-->
              <!--<td>{{item.sqthreeyear}}</td>-->
              <!--<td>{{item.sqfouryear}}</td>-->
              <!--<td>{{item.sqfiveyear}}</td>-->
              <!--<td>{{item.sqemissiontslimit}}</td>-->
            <!--</tr>-->
            <!-- <tr>
              <th colspan="10" class="al_center">一般排放口</th>
            </tr>
            <tr>
              <td>COCDcr</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>COCDcr</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td rowspan="2" colspan="3">一般排放口合计</td>
              <td>COCDcr</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>01</td>
              <td>DA001</td>
              <td>1#烟气脱硫排放口</td>
              <td>贡及其化合物，烟尘，林格曼黑度</td>
              <td>117°26'</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <th colspan="10" class="al_center">全厂排放口总计</th>
            </tr>
            <tr>
              <td rowspan="2" colspan="3">全厂排放口总计</td>
              <td>COCDcr</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>01</td>
              <td>DA001</td>
              <td>1#烟气脱硫排放口</td>
              <td>贡及其化合物，烟尘，林格曼黑度</td>
              <td>117°26'</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr> -->
          </tbody>
        </table>
      </section>
      <!-- 一般排放口 -->
      <section class="table-list mb_15">
        <h3 class="form-item-name">一般排放口</h3>
        <table class="table small-padding table-complex table-bordered light-blue-th">
          <thead>
          <tr>
            <th rowspan="2">排放口编号</th>
            <th rowspan="2">排放口名称</th>
            <th rowspan="2">污染物种类</th>
            <th rowspan="2">申请排放浓度限值(mg/L)</th>
            <th colspan="5" class="al_center">申请年排放量限值(t/a)</th>
            <th rowspan="2">申请特殊时段排放量限值</th>
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
            <tr v-if="loadingTwo&&waterComList&&waterComList.length==0">
              <td class="al_center" colspan="10">{{constants.no_data_text}}</td>
            </tr>
            <tr v-for="(item,index) in waterComList">
              <td>{{item.xkdraincode}}</td>
              <td>{{item.drainname}}</td>
              <td>{{item.wrwname}}</td>
              <td>{{item.sqemissioncon}}</td>
              <td>{{item.sqoneyear}}</td>
              <td>{{item.sqtwoyear}}</td>
              <td>{{item.sqthreeyear}}</td>
              <td>{{item.sqfouryear}}</td>
              <td>{{item.sqfiveyear}}</td>
              <td>{{item.sqemissiontslimit}}</td>
            </tr>
          </tbody>
        </table>
      </section>
      <!-- 全厂排放口总计 -->
      <section class="table-list mb_15">
        <h3 class="form-item-name">全厂排放口总计</h3>
        <table class="table small-padding table-complex table-bordered light-blue-th table-flex">
          <thead>
          <tr>
            <th rowspan="2">污染物种类</th>
            <th colspan="5" class="al_center">申请年排放量限值(t/a)</th>
            <th rowspan="2">申请特殊时段排放量限值</th>
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
            <tr v-if="loadingThree&&waterWholeCountList&&waterWholeCountList.length==0">
              <td class="al_center" colspan="7">{{constants.no_data_text}}</td>
            </tr>
            <tr v-for="(item,index) in waterWholeCountList">
              <td>{{item.waterwrwname}}</td>
              <td>{{item.sqoneyear}}</td>
              <td>{{item.sqtwoyear}}</td>
              <td>{{item.sqthreeyear}}</td>
              <td>{{item.sqfouryear}}</td>
              <td>{{item.sqfiveyear}}</td>
              <td>{{item.sqemissiontslimit}}</td>
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
        waterMainList: [],
        waterMainCountList: [],
        waterComList: [],
        waterWholeCountList: [],
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
        this.getDischargeWaterMainList();
        // this.getDischargeWaterMainCountList();
        this.getDischargeWaterComList();
        this.getDischargeWaterWholeCountList();
      },
      changeInit(id) {
        this.permitId = id
        this.init();
      },
      getDischargeWaterMainList() {
        mapPollutePublicHttp.getDischargeWaterMainList(this.permitId).then((result) => {
          if (result.result && result.result.length > 0) {
            this.waterMainList = result.result;
          }
          this.loadingOne = true;
        }).catch((error) => {
          this.loadingOne = true;
        })
      },
      getDischargeWaterMainCountList() {
        mapPollutePublicHttp.getDischargeWaterMainCountList(this.permitId).then((result) => {
          if (result.data && result.data.length > 0) {
            this.waterMainCountList = result.data;
          }

        }).catch((error) => {

        })
      },
      getDischargeWaterComList() {
        mapPollutePublicHttp.getDischargeWaterComList(this.permitId).then((result) => {
          if (result.result && result.result.length > 0) {
            this.waterComList = result.result;
          }
          this.loadingTwo = true;
        }).catch((error) => {
          this.loadingTwo = true;
        })
      },
      getDischargeWaterWholeCountList(){
        mapPollutePublicHttp.getDischargeWaterWholeCountList(this.permitId).then((result) => {
          if (result.result && result.result.length > 0) {
            this.waterWholeCountList = result.result;
          }
          this.loadingThree = true;
        }).catch((error) => {
          this.loadingThree = true;
        })
      }
    },
    computed: {}
  }
</script>
