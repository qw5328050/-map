<template>
  <div class="popbox-detail-content online-monitoring">
    <!-- 基本情况表 -->
    <div class="panel-wrapper">
      <div class="panel-search">
        <div class="form-inline">
          <div class="radio-group">
            <label class="radio mr_15"
                   @click="ischeckedTab = 0;ischeckedTabName = 'hour';beginDay = beginHourDate;format = 'YYYY-MM-DD'">
              <span class="radio__input" :class="ischeckedTab == 0 ? 'is-checked' : ''">
                  <span class="radio__inner"></span>
                  <input type="radio" class="radio__original">
              </span>
              <span class="radio__label">小时均值</span>
            </label>
            <label class="radio mr_15"
                   @click="ischeckedTab = 1;ischeckedTabName = 'day';beginDay = beginDayDate;format = 'YYYY-MM-DD'">
              <span class="radio__input" :class="ischeckedTab == 1 ? 'is-checked' : ''">
                  <span class="radio__inner"></span>
                  <input type="radio" class="radio__original">
              </span>
              <span class="radio__label">日均值</span>
            </label>
            <label class="radio mr_15"
                   @click="ischeckedTab = 2;ischeckedTabName = 'month';beginDay = beginMonthDate;format = 'YYYY-MM'">
              <span class="radio__input" :class="ischeckedTab == 2 ? 'is-checked' : ''">
                  <span class="radio__inner"></span>
                  <input type="radio" class="radio__original">
              </span>
              <span class="radio__label">月均值</span>
            </label>
          </div>
          <div class="form-group">
            <div class="form-group" style="display: inline-block;vertical-align: top;">
              <!--<label>时间跨度：</label>-->
              <zt-date-picker
                v-model="beginDay"
                style="width:120px;display: inline-block;vertical-align: middle;"
                :clearable="false"
                type="date"
                :format="format"
                :not-after="notAfter"
                @input="handleBeginDayInput">
              </zt-date-picker>
              至
              <zt-date-picker
                ref="pickerTwo"
                v-model="endDay"
                style="width:120px;display: inline-block;vertical-align: middle;"
                :clearable="false"
                type="date"
                :format="format"
                :not-before="beginDay"
                :not-after="notAfter"
                @input="handleEndDayInput">
              </zt-date-picker>
            </div>
          </div>
          <button type="submit" class="btn btn-primary btn-sm" @click="handleChaxun">查询</button>
          <!--<button type="submit" class="btn btn-default  btn-sm" @click="handleReset">重置</button>-->
        </div>
        <div class="form-inline" style="margin-top: 5px;margin-bottom: 5px;margin-right: 30px;">
          <div class="form-flex" v-if="stationIdFeisFlag">
            <label class="label-title" style="line-height: 14px;">废水：</label>
            <div class="radio-group" v-for="(item, index) in factorWaterList">
              <label class="radio mr_15" @click="factorWaterChange(index)">
                <span class="radio__input" :class="factorWater == index ? 'is-checked': ''">
                    <span class="radio__inner"></span>
                    <input type="radio" class="radio__original">
                </span>
                <span class="radio__label">{{item.name}}</span>
              </label>
            </div>
          </div>
          <div class="form-flex" v-if="stationIdFeiqFlag">
            <label class="label-title" style="line-height: 14px;">废气：</label>
            <div class="radio-group" v-for="(item, index) in factorAirList">
              <label class="radio mr_15" @click="factorAirChange(index)">
                <span class="radio__input" :class="factorAir == index ? 'is-checked': ''">
                    <span class="radio__inner"></span>
                    <input type="radio" class="radio__original">
                </span>
                <span class="radio__label">{{item.name}}</span>
              </label>
            </div>
          </div>
          <div class="form-group ml_15" v-if="stationIdListFeiq.length > 0">
            <zt-select style="width:130px" v-model="stationId">
              <zt-option v-for="item in stationIdListFeiq"
                         :key="item.siteCode"
                         :label="item.siteName"
                         :value="item.siteCode">
              </zt-option>
            </zt-select>
          </div>
        </div>
      </div>
      <section class="chart-box mb_30">
        <!--<img src="../../base/images/temporary/data-map-05.png" alt="">-->
        <barChart
          ref="barChart"
          :barDataList="getSopMwdList"
          item-name="monitorTime"
          item-value0="fspflvalue"
          item-value0-uint="fspflvalueUint"
          item-value1="density"
          item-value1-unit="densityUnit"
          :option="option1"
          style="width:100%;height:300px;"
        ></barChart>
      </section>

      <div class="panel-table" v-if="hasPageListFlag">
        <div class="action" style="margin-bottom: 5px;">
          <button type="submit" class="btn btn-primary btn-sm" @click="listExport">导出</button>
        </div>
        <zt-table :data="getSopMwdPageList" ref="table" style="width: 100%;"
                  class="table mid-padding light-blue-th table-border-outer">
          <zt-column width="100" label="序号">
            <template slot-scope="scope">
              {{orderIndex(scope)}}
            </template>
          </zt-column>
          <zt-column prop="monitorTime" width="220" label="监测时间" align="center"></zt-column>
          <zt-column prop="factor" width="240" label="监测指标" align="center"></zt-column>
          <zt-column prop="density" width="220" :label="`浓度(${densityUnit})`" align="center"></zt-column>
          <zt-column prop="fqpflvalue" :label="`排放量(${fqpflvalueUint})`" align="center"></zt-column>
        </zt-table>
        <!-- 分页 -->
        <zt-pagination
          v-if="getSopMwdPageList && getSopMwdPageList.length > 0"
          layout="total,prev, pager, next"
          :page-size="pageSize"
          :currentPage="pageNo"
          :total="gasWantotal"
          :small="smallpagination"
          :pagerCount="5"
          @change="handlePgChange"
        ></zt-pagination>
      </div>
    </div>
  </div>
</template>
<script>
  import moment from 'moment'
  import barChart from '@/views/modules/pollute/echart/barChartOnline.vue'
  import mapPollutePublicHttp from '@/https/map/mapPollutePublicHttp'
  import polluteAsourceFileHttp from '@/https/pollute/polluteAsourceFileHttp'
  import {deepExtend} from '@/utils/util'
  import singleLineChart from './chart/lineChart.vue'
  import multiLineChart from './chart/onLineMonitoringChart.vue'
  import {getDictListByKey} from '@/components/_public/zt/dictionary/index'
  export default {
    components: {
      gasMonthDischargeChart: singleLineChart,
      gasMonthConcentrationChart: multiLineChart,
      gasYearDischargeChart: singleLineChart,
      gasYearConcentrationChart: multiLineChart,
      waterMonthDischargeChart: singleLineChart,
      waterMonthConcentrationChart: multiLineChart,
      waterYearDischargeChart: singleLineChart,
      waterYearConcentrationChart: multiLineChart,
      barChart
    },
    props: {
      itemData: Object
    },
    data() {
      let now = moment(new Date())
//      let hour = now.hours()
//      let initPDay = hour >= 20 ? now.format('YYYY-MM-DD') : now.subtract(1, 'days').format('YYYY-MM-DD')
      let initPDay = now.subtract(1, 'days').format('YYYY-MM-DD')
      let initNotBeforehour = moment(initPDay).add(0, 'day').format('YYYY-MM-DD')
      let initNotBeforeDay = moment(initPDay).add(-30, 'day').format('YYYY-MM-DD')
      let initNotBeforeMonth = moment(initPDay).add(-365, 'day').format('YYYY-MM-DD')
      let initNotAfter = moment(initPDay).add(1, 'days').format('YYYY-MM-DD')
      return {
        curReportTab: 'gasMonth',
        monthList: [{name: '1月', value: '01'}, {name: '2月', value: '02'}, {name: '3月', value: '03'}, {
          name: '4月',
          value: '04'
        }, {name: '5月', value: '05'}, {name: '6月', value: '06'}, {name: '7月', value: '07'}, {
          name: '8月',
          value: '08'
        }, {name: '9月', value: '09'}, {name: '10月', value: '10'}, {name: '11月', value: '11'}, {
          name: '12月',
          value: '12'
        }],
        gasPolluteObj: {
          so2: ['F_SD_FQPFLVALUE', 'F_SD_DENSITY'],
          no: ['F_NO_FQPFLVALUE', 'F_NO_DENSITY'],
          dust: ['F_DUST_FQPFLVALUE', 'F_DUST_DENSITY'],
        },
        //气体污染物月报
        gasMonthModel: {
          year: '',
          month: '',
        },
        curGasMonthPollute: 'so2',
        gasMonthDischargeData: [],
        gasMonthConcentrationData: [],

        //气体污染物年报
        gasYearModel: {
          year: '',
        },
        curGasYearPollute: 'so2',
        gasYearDischargeData: [],
        gasYearConcentrationData: [],

        waterPolluteObj: {
          cod: ['F_COD_FQPFLVALUE', 'F_COD_DENSITY'],
          am: ['F_AM_N_FQPFLVALUE', 'F_AM_N_DENSITY'],
        },
        //水污染物月报
        waterMonthModel: {
          year: '',
          month: '',
        },
        curWaterMonthPollute: 'cod',
        waterMonthDischargeData: [],
        waterMonthConcentrationData: [],
        //水污染物年报
        waterYearModel: {
          year: '',
        },
        curWaterYearPollute: 'cod',
        waterYearDischargeData: [],
        waterYearConcentrationData: [],
        pageSize: 10,
        pageNo: 1,
        gasWantotal: 0,
        smallpagination: false,
        beginDay: initNotBeforehour,
        beginHourDate: initNotBeforehour,
        beginDayDate: initNotBeforeDay,
        beginMonthDate: initNotBeforeMonth,
        notAfter: initNotAfter,
        endDay: initNotAfter,
        ischeckedTab: 0,
        ischeckedTabName: 'hour',
        dataList: [],
        factorAirList: [],
        factorWaterList: [],
        factorAir: -1,
        factorWater: 0,
        stationIdListFeiq: [],
        stationId: '',
        stationIdFeis: '',
        facilityType: 'feis',
        factor: '',
        stationIdOnly: '',
        getSopMwdPageList: [],
        getSopMwdList: [],
        stationIdFeisFlag: true,
        stationIdFeiqFlag: true,
        hasPageListFlag: true,
        fqpflvalueUint: '',
        densityUnit: '',
        format: 'YYYY-MM-DD',
        option1: {
          legend: {
            data: ['排放量', '浓度']
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            },
            textStyle: {
              fontFamily: "微软雅黑",
              fontSize: 12
            }
          },
          series: [
            {
              name: '排放量',
              itemStyle: {
                normal: {
                  color: "#0f97f6"
                }
              }
            },
            {
              name: '浓度',
              itemStyle: {
                normal: {
                  color: "#ffb94d"
                }
              }
            }
          ]
        }
      }
    },
    created() {
      // var date = new Date;
      // var currentYear = date.getFullYear();
      // var currentMonth = date.getMonth()+1;
      // currentMonth =(currentMonth<10 ? "0"+ currentMonth : currentMonth);
      // this.gasMonthModel.year = currentYear + '';
      // this.gasMonthModel.month = currentMonth + '';
      // this.gasYearModel.year = currentYear + '';
      // this.getWasteGasMonthReport(this.gasPolluteObj['so2']);
      // this.getWasteGasYearReport(this.gasPolluteObj['so2']);
      //
      // this.waterMonthModel.year = currentYear + '';
      // this.waterMonthModel.month = currentMonth + '';
      // this.waterYearModel.year = currentYear + '';
      // this.getWasteWaterMonthReport(this.waterPolluteObj['cod']);
      // this.getWasteWaterYearReport(this.waterPolluteObj['cod']);
    },
    mounted() {
      this.init()
    },
    methods: {
      init(){
        //this.getMetaCalogPollutionFactorAir()
        this.factorAirList = getDictListByKey(this.constants.wastegas_factors);
        this.factorWaterList = getDictListByKey(this.constants.wastewater_factors);
        this.factor = this.factorWaterList[0].code
        this.facilityType = 'feis'
        // this.getMetaCalogPollutionFactorWater()
        // this.getStationListFeiq()
        this.getStationListFeis()
      },
      orderIndex(scope) {
        return (this.pageNo - 1) * this.pageSize + scope.$index + 1;
      },
      getStationListFeiq(){
        let params = {
          sopId: this.itemData.id,
          type: 'feiq'
        };
        polluteAsourceFileHttp.getStationList(params)
          .then(res => {
            if (res.result.length == 0) {
              this.stationIdFeiqFlag = false;
              this.$refs.barChart.showEmptyTip();
              this.getSopMwdPageList = [];
            } else {
              this.stationIdListFeiq = res.result
              this.stationId = res.result[0].siteCode
            }
            if (!this.stationIdFeisFlag) {
              this.facilityType = 'feiq'
              this.stationIdOnly = res.result[0].siteCode
            }
            this.getSopMwdListList()
            this.getSopMwdPageListList()
          })
      },
      getStationListFeis(){
        let params = {
          sopId: this.itemData.id,
          type: 'feis'
        }
        polluteAsourceFileHttp.getStationList(params)
          .then(res => {
            if (res.result.length == 0) {
              this.stationIdFeisFlag = false
              this.factorAir = 0
              this.factorWater = -1;
            } else {
              this.facilityType = 'feis'
              this.stationIdFeis = res.result[0].siteCode
              this.stationIdOnly = res.result[0].siteCode
            }
            this.getStationListFeiq()
          })
      },
      getSopMwdListList(){
        let params = {
          monitorDateFrom: this.beginDay,
          monitorDateTo: this.endDay,
          dataType: this.ischeckedTabName,
          factor: this.factor,
          type: this.facilityType,
          siteCode: this.stationIdOnly
        }
        polluteAsourceFileHttp.getSopMwdList(params)
          .then(res => {
            console.log('getSopMwdList:', res)
            this.getSopMwdList = res.result
          })
      },
      getSopMwdPageListList(){
        let params = {
          monitorDateFrom: this.beginDay,
          monitorDateTo: this.endDay,
          dataType: this.ischeckedTabName,
          factor: this.factor,
          type: this.facilityType,
          siteCode: this.stationIdOnly,
          page: this.pageNo,
          size: this.pageSize
        };

        polluteAsourceFileHttp.getSopMwdPageList(params)
          .then(res => {
            if (res.code == '500') {
              this.$ztAlert('该企业未关联站点')
              this.hasPageListFlag = false
            } else {
              this.hasPageListFlag = true
            }
            let result = res.result;
            this.getSopMwdPageList = result.list;
            if(params.type === 'feiq'){
              this.fqpflvalueUint = this.getSopMwdPageList[0].fqpflvalueUint;
            }else{
              this.fqpflvalueUint = this.getSopMwdPageList[0].fspflvalueUint;
              this.getSopMwdPageList.forEach(item=>{
                  item.fqpflvalue = item.fspflvalue;
              });
            }
            this.densityUnit = this.getSopMwdPageList[0].densityUnit
            this.gasWantotal = result.totalCount
          })
      },
      listExport(){
        let params = {
          monitorDateFrom: this.beginDay,
          monitorDateTo: this.endDay,
          dataType: this.ischeckedTabName,
          factor: this.factor,
          type: this.facilityType,
          siteCode: this.stationIdOnly
        }

        polluteAsourceFileHttp.getSopMwdExport(params)
          .then(response => {
            const content = response;
            const blob = new Blob([content], {type: 'application/ms-excel'});
            const fileName = '在线监测.xls';
            if ('download' in document.createElement('a')) { // 非IE下载
              const elink = document.createElement('a');
              elink.download = fileName;
              elink.style.display = 'none';
              elink.href = URL.createObjectURL(blob);
              document.body.appendChild(elink);
              elink.click();
              URL.revokeObjectURL(elink.href); // 释放URL 对象
              document.body.removeChild(elink);
            } else { // IE10+下载
              navigator.msSaveBlob(blob, fileName);
            }
          })
      },
      handleChaxun(){
        this.pageNo = 1
        this.getSopMwdListList()
        this.getSopMwdPageListList()
      },
      handleReset(){
        this.ischeckedTab = 0
        this.ischeckedTabName = 'hour'
        this.factorAir = -1
        this.factorWater = 0,
          this.init()
      },
      factorWaterChange(index){
        var that = this
        that.factorWater = index
        that.factorAir = -1
        that.facilityType = 'feis'
        that.stationIdOnly = this.stationIdFeis
        that.factorWaterList.forEach(function (item, ind) {
          if (ind == index) {
            that.factor = item.code
          }
        })
        // console.log('this.facilityType:', that.factor)
      },
      factorAirChange(index){
        var that = this
        that.factorAir = index
        that.factorWater = -1
        that.facilityType = 'feiq'
        that.stationIdOnly = this.stationId
        that.factorAirList.forEach(function (item, ind) {
          if (ind == index) {
            that.factor = item.code
          }
        })
        // console.log('this.facilityType:', that.factor)
      },
      handlePgChange(pageNo, pageSize) {
        this.pageNo = pageNo;
        this.pageSize = pageSize;
        this.getSopMwdPageListList()
      },
      reportTabClick(type){
        if (this.curReportTab == type)return;
        this.curReportTab = type;
      },
      getWasteGasMonthReport(pollutes){
        let params = {
          year: new Date(this.gasMonthModel.year).getFullYear() + '',
          month: this.gasMonthModel.month,
          sopId: this.itemData.id
        }
        this.gasMonthDischargeData = []
        this.gasMonthConcentrationData = []
        mapPollutePublicHttp.getWasteGasMonthReportD(deepExtend({pollutant: pollutes[0]}, params)).then((res) => {
          if (res.result && res.result.length > 0) {
            this.gasMonthDischargeData = res.result;
          }
        }).catch(() => {

        })
        mapPollutePublicHttp.getWasteGasMonthReport(deepExtend({pollutant: pollutes[1]}, params)).then((res) => {
          if (res.result && res.result.length > 0) {
            this.gasMonthConcentrationData = res.result;
          }

        }).catch(() => {

        })
      },
      gasMonthPolluteClick(type){
        if (this.curGasMonthPollute == type)return;
        this.curGasMonthPollute = type;
        this.getWasteGasMonthReport(this.gasPolluteObj[type]);
      },

      getWasteGasYearReport(pollutes){
        let params = {
          year: new Date(this.gasYearModel.year).getFullYear() + '',
          sopId: this.itemData.id
        }
        this.gasYearDischargeData = []
        this.gasYearConcentrationData = []
        mapPollutePublicHttp.getWasteGasYearReportD(deepExtend({pollutant: pollutes[0]}, params)).then((res) => {
          if (res.result && res.result.length > 0) {
            this.gasYearDischargeData = res.result;
          }
        }).catch(() => {

        })
        mapPollutePublicHttp.getWasteGasYearReport(deepExtend({pollutant: pollutes[1]}, params)).then((res) => {
          if (res.result && res.result.length > 0) {
            this.gasYearConcentrationData = res.result;
          }
        }).catch(() => {

        })
      },
      gasYearPolluteClick(type){
        if (this.curGasYearPollute == type)return;
        this.curGasYearPollute = type;
        this.getWasteGasYearReport(this.gasPolluteObj[type]);
      },

      getWasteWaterMonthReport(pollutes){
        let params = {
          year: new Date(this.waterMonthModel.year).getFullYear() + '',
          month: this.waterMonthModel.month,
          sopId: this.itemData.id
        }
        this.waterMonthDischargeData = []
        this.waterMonthConcentrationData = []
        mapPollutePublicHttp.getWasteWaterMonthReportD(deepExtend({pollutant: pollutes[0]}, params)).then((res) => {
          if (res.result && res.result.length > 0) {
            this.waterMonthDischargeData = res.result;
          }
        }).catch(() => {

        })
        mapPollutePublicHttp.getWasteWaterMonthReport(deepExtend({pollutant: pollutes[1]}, params)).then((res) => {
          if (res.result && res.result.length > 0) {
            this.waterMonthConcentrationData = res.result;
          }

        }).catch(() => {

        })
      },
      waterMonthPolluteClick(type){
        if (this.curWaterMonthPollute == type)return;
        this.curWaterMonthPollute = type;
        this.getWasteWaterMonthReport(this.waterPolluteObj[type]);
      },

      getWasteWaterYearReport(pollutes){
        let params = {
          year: new Date(this.waterYearModel.year).getFullYear() + '',
          sopId: this.itemData.id
        }
        this.waterYearDischargeData = []
        this.waterYearConcentrationData = []
        mapPollutePublicHttp.getWasteWaterYearReportD(deepExtend({pollutant: pollutes[0]}, params)).then((res) => {
          if (res.result && res.result.length > 0) {
            this.waterYearDischargeData = res.result;
          }
        }).catch(() => {

        })
        mapPollutePublicHttp.getWasteWaterYearReport(deepExtend({pollutant: pollutes[1]}, params)).then((res) => {
          if (res.result && res.result.length > 0) {
            this.waterYearConcentrationData = res.result;
          }
        }).catch(() => {

        })
      },
      waterYearPolluteClick(type){
        if (this.curWaterYearPollute == type)return;
        this.curWaterYearPollute = type;
        this.getWasteWaterYearReport(this.waterPolluteObj[type]);
      },
      // 开始日期
      handleBeginDayInput(){
      },
      // 结束日期
      handleEndDayInput(){
      },

    },
    watch: {
      gasMonthModel: {
        handler(newV, oldV) {
          this.getWasteGasMonthReport(this.gasPolluteObj[this.curGasMonthPollute]);
        },
        deep: true
      },
      gasYearModel: {
        handler(newV, oldV) {
          this.getWasteGasYearReport(this.gasPolluteObj[this.curGasYearPollute]);
        },
        deep: true
      },
      waterMonthModel: {
        handler(newV, oldV) {
          this.getWasteWaterMonthReport(this.waterPolluteObj[this.curWaterMonthPollute]);
        },
        deep: true
      },
      waterYearModel: {
        handler(newV, oldV) {
          this.getWasteWaterYearReport(this.waterPolluteObj[this.curWaterYearPollute]);
        },
        deep: true
      },
      stationId(newVal, oldVal){
        if (oldVal == '') {
          return
        } else {
          this.factorAir = 0
          this.factorWater = -1
          this.facilityType = 'feiq'
          this.stationIdOnly = this.stationId
        }

      }
    }
  };
</script>
<style>

</style>
