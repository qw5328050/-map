<template>
  <div v-if="visible && hidePlane">
    <div class="point-info-wrapper">
      <a class="close-detail-btn" @click="justClosedPlane"><span class="iconfont"
                                                                 @click="justClosedPlane">&#xe601;</span></a>
      <div class="point-info-detail">
        <!-- 头部信息 -->
        <header-info :detailData="detailData"></header-info>
        <!-- 分类信息 -->
        <zt-scrollbar ref="scrollbarRef" class="ps"
                      :style="{'max-height': documentClientHeight + 'px'}"
        >
          <base-info-list :detailData="detailData"></base-info-list>
          <div class="classification-info" v-show="showRealInfo || showVideoTab">
            <!-- 分类 -->
            <div class="tab-wrapper">
              <span class="tab-item" v-if="showRealInfo"
                    :class="{'cur': tabIndex === 1}" @click="tabIndex = 1">实时监控</span>
              <span v-if="isNoneVideoDoalog" class="tab-item"
                    :class="{'cur': tabIndex === 4}" @click="tabIndex = 4">列表查询</span>
              <span v-show="showGasWan" class="tab-item" :class="{'cur': tabIndex === 5}"
                    @click="tabIndex = 5">报警</span>
            </div>

            <!-- 分类内容-实时监控 -->
            <div class="tab-content" v-show="showRealInfo && (tabIndex === 1)">
              <div>
                <!-- 子类标签 -->
                <zt-rolling-label :labelList="labelList"
                                  :selectedItem="itemData.selectedItem"
                                  @change="handleSelectedSite"></zt-rolling-label>
                <!-- 表格信息 -->
                <div class="panel-table-heaer">
                  <time>{{time}}<em class="label pollute-fine ml_5" :class="handleStatusColor(status)">{{status}}</em>
                  </time>
                </div>
                <div class="panel-table-heaer" style="display: table;width:100%;">
                  <time>
                    {{monitorTime}}
                  </time>
                  <span class="site">站点编号：{{detailData.siteCode}}</span>
                </div>
                <div class="panel-table tableNoPadding">
                  <zt-table :data="realTimeList" ref="diaTable">
                    <zt-column prop="item" width="130" label="控制指标">
                    </zt-column>
                    <zt-column prop="value" width="80" label="监测值">
                    </zt-column>
                    <zt-column prop="standard" label="标准值"></zt-column>
                    <zt-column prop="en" label="超标倍数" width="100"></zt-column>
                  </zt-table>
                </div>
                <!-- 子类标签内容 -->
                <div class="sub-tab-content">
                  <div ref="chart" class="chart" style="height:220px;width:396px;">
                  </div>
                </div>
              </div>
            </div>
            <div class="tab-content" v-if="tabIndex === 4">
              <div class="listInquireTitle">
                <div class="form-group" style="display: inline-block;vertical-align: top;">
                  <!--<label>时间跨度：</label>-->
                  <zt-date-picker
                    v-model="beginDay"
                    class="focus-dataControl"
                    style="width:120px;display: inline-block;vertical-align: middle;"
                    :clearable="false"
                    type="date"
                    format="YYYY-MM-DD"
                    :not-after="notAfter"
                    @input="handleBeginDayInput">
                  </zt-date-picker>
                  至
                  <zt-date-picker
                    ref="pickerTwo"
                    v-model="endDay"
                    class="focus-dataControl"
                    style="width:120px;display: inline-block;vertical-align: middle;"
                    :clearable="false"
                    type="date"
                    format="YYYY-MM-DD"
                    :not-before="beginDay"
                    :not-after="notAfter"
                    @input="handleEndDayInput">
                  </zt-date-picker>
                </div>
                <div class="form-group" style="display: inline-block;vertical-align: top;">
                  <zt-select v-model="dateType" style="min-width:40px;width: 60px;" @change="getListInquireDate">
                    <zt-option v-for="item in dateTypes"
                               :key="item.code"
                               :label="item.name"
                               :value="item.code"
                    >
                    </zt-option>
                  </zt-select>
                </div>
                <div class="form-group daochu" @click="exportList">导出</div>
              </div>
              <div class="panel-table">
                <zt-table :data="listInquireDate" v-if="listInquireDate.length > 0">
                  <zt-column prop="monitorTime" width="160" label="时间"></zt-column>
                  <zt-column prop="nmhc" label="非甲烷总烃" width="100" align="center"></zt-column>
                  <zt-column prop="c6h6" label="苯" width="65" align="center"></zt-column>
                  <zt-column prop="ch4o" label="甲醇" align="center" width="65"></zt-column>
                </zt-table>
              </div>
              <div class="emptyList" v-if="listInquireDate.length == 0">暂无数据</div>
              <!-- 分页 -->
              <zt-pagination
                v-if="listInquireDate.length > 0"
                layout="total,prev, pager, next"
                :page-size="pageSize"
                :currentPage="pageNo"
                :total="gasWantotal"
                :small="smallpagination"
                :pagerCount="5"
                @change="handlePgChange"
                style="height: 44px;"
              ></zt-pagination>
            </div>
            <div v-if="showGasWan" class="tab-content" v-show="tabIndex === 5">
              <alarm-list :params="alarmParams"></alarm-list>
            </div>
          </div>
        </zt-scrollbar>
      </div>
    </div>
    <trend-compare-panel ref="trendComparePanel" :params="info"></trend-compare-panel>
  </div>
</template>

<script type="text/jsx">
  /* 地图上的弹框*/
  import store from '@/store'
  import mapDialogChart from '@/chart/mapDialogChart'
  import {objectAssign, getStartEndTime} from '@/utils/util'
  import baseInfoList from '@/map/dialog/_public/baseInfoList.vue'
  import headerInfo from '@/map/dialog/_public/headerInfo.vue'
  import mapDialogHttp from '@/https/map/mapDialogHttp'
  import mapPollutePublicHttp from '@/https/map/mapPollutePublicHttp'
  import baseDialog from '@/map/dialog/base/baseDialog'
  import toolBtn from '@/map/dialog/_public/toolBtn.vue'
  import trendComparePanel from '@/map/dialog/_public/trendComparePanel.vue'
  import baseInfo from '../../_public/baseInfoList.vue'
  import moment from 'moment'
  import hbVideoTab from '@/components/_public/hbVideoTab.vue'
  import {getParamsByKey} from '@/utils/paramsCache'
  import mapHttp from '@/https/map/mapHttp'
  import {getFactorByType} from '@/utils/index'
  import alarmList from '@/map/dialog/_public/alarmList.vue'
  import vocsHttp from '@/https/monitor/vocsHttp'

  export default{
    components: {
      baseInfo,
      toolBtn,
      trendComparePanel,
      hbVideoTab,
      headerInfo,
      baseInfoList,
      alarmList
    },
    mixins: [baseDialog],
    data(){
      let monitoringConfig = getParamsByKey(this.constants.monitoringConfig);
      let now = moment(new Date())
//      let hour = now.hours()
//      let initPDay = hour >= 20 ? now.format('YYYY-MM-DD') : now.subtract(1, 'days').format('YYYY-MM-DD')
      let initPDay = now.subtract(1, 'days').format('YYYY-MM-DD')
      let initNotBefore = moment(initPDay).add(-28, 'days').format('YYYY-MM-DD')
      let initNotBefore2 = moment(initPDay).add(-1, 'days').format('YYYY-MM-DD')
      let initNotAfter = moment(initPDay).add(1, 'days').format('YYYY-MM-DD');
      return {
        monitoringConfig: monitoringConfig,
        detailData: {},
        pageSize: 10,
        pageNo: 1,
        gasWantotal: 0,
        initPDayTime: initPDay,
        smallpagination: false,
        tabIndex: 1,
        cacheData: [],
        realTimeList: [],
        labelList: [],
        chartData: [],
        lineCharts: null,
        time: '',
        name: '',
        status: '',
        noData: false,
        //是否显示详情
        showRealInfo: true,
        showVideoTab: false,
        info: {
          name: '',
          address: '',
          county: '',
          legalRepresentative: '',
          mobilPhone: '',
          conLevel: ''
        },
        monitorTime: '',
        standardList: [],
        hidePlane: false,
        dateTypes: [{name: '时', code: 'hour'}, {name: '日', code: 'day'}],
        dateType: 'hour',
        beginDay: initNotBefore2,
        notBefore: initNotBefore2,
        notAfter: initNotAfter,
        endDay: initNotAfter,
        hoursOfDay: [
          {name: '00时', code: '00'}, {name: '01时', code: '01'}, {name: '02时', code: '02'}, {
            name: '03时',
            code: '03'
          }, {name: '04时', code: '04'}, {name: '05时', code: '05'},
          {name: '06时', code: '06'}, {name: '07时', code: '07'}, {name: '08时', code: '08'}, {
            name: '09时',
            code: '09'
          }, {name: '10时', code: '10'}, {name: '11时', code: '11'},
          {name: '12时', code: '12'}, {name: '13时', code: '13'}, {name: '14时', code: '14'}, {
            name: '15时',
            code: '15'
          }, {name: '16时', code: '16'}, {name: '17时', code: '17'},
          {name: '18时', code: '18'}, {name: '19时', code: '19'}, {name: '20时', code: '20'}, {
            name: '21时',
            code: '21'
          }, {name: '22时', code: '22'}, {name: '23时', code: '23'},
        ],
        beginHour: '00',
        endHour: '23',
        listInquireDate: [],
        isNoneVideoDoalog: true,
        siteInfoType: '',
        factorList: [],
        showGasWan: true,
        alarmParams: {}
      }
    },
    created(){
      this.factorList = getFactorByType(this.itemData.type);
      this.cacheData = [];
      this.realTimeList = [];
      this.labelList = [];
      this.chartData = [];
      this.lineCharts = null;
      this.time = '';
      this.name = '';
      this.status = '';
      this.noData = false;
      this.showRealInfo = true;
      this.info.name = '';
      this.info.address = '';
      this.info.county = '';
      this.info.legalRepresentative = '';
      this.info.mobilPhone = '';
      this.info.conLevel = '';
      this.tabIndex = 1;
      this.showVideoTab = false;
      this.getListInquireDate()
      this.siteInfoCode = this.itemData.code
      this.siteInfoType = this.itemData.type;
      this.alarmParams = {
        siteCode: this.itemData.siteCode,
        type: this.itemData.type
      }
      if (this.itemData.showWarnTab) {
        this.showGasWan = true;
        this.tabIndex = 5;
      }
    },
    mounted(){
      if (this.itemData.showVideo) {
        this.tabIndex = 3;
      }
      this.itemData.selectedItem = {
        code: this.itemData.siteCode
      };
      if (this.itemData.device_id) {
        this.isNoneVideoDoalog = false
        console.log('this.isNoneVideoDoalog:', this.isNoneVideoDoalog)
      }
      console.log('this.itemData:', this.itemData)
      this.getBaseInfo();
      this.getLabelList();
      this.getRealTimeList();
//      this.showSevenDayMonitor();
    },
    methods: {
      handlePgChange(pageNo, pageSize) {
        this.pageNo = pageNo;
        this.pageSize = pageSize;
        this.getListInquireDate(this.siteInfoCode, this.siteInfoType)
      },
      justClosedPlane(){
        this.hidePlane = false
      },
      justiceShowVideoTab(){
        if (this.itemData.showVideo) {
          this.tabIndex = 3;
          this.showVideoTab = true
        }
      },
      update(){

      },
      getBaseInfo(){
        mapHttp.siteDetail({
          siteCode: this.itemData.siteCode,
          type: this.itemData.type
        }).then(response => {
          this.detailData = response.result;
          this.hidePlane = true;
          this.$nextTick(() => {
            this.showSevenDayMonitor();
//            this.$refs.trendComparePanel.initSelectedList();
          })
        })
      },
      justiceHasRealTime(data){
        if (!this.itemData.showVideo) {
          if (data && data.length > 0) {
            this.showRealInfo = true;
            this.tabIndex = 1;
          } else {
            this.tabIndex = 3;
          }
        }
      },

      getRealTimeList(){
        mapDialogHttp.siteReal({
          siteCode: this.itemData.siteCode,
          type: this.itemData.type,
          dateType: this.itemData.dateType,
        }).then(response => {
          this.showRealTimeList(response.result);
          this.monitorTime = moment(response.result.monitorTime).format('MM月DD日HH点')
        })
      },
      showRealTimeList(result){
        let list = [];
        this.factorList.forEach(factorItem => {
          list.push({
            item: factorItem.name,
            value: this.formatData(result[factorItem.code]),
            standard: this.formatData(result[factorItem.code + 'Standard']),
            en: this.formatData(result[factorItem.code + 'En']),
          })
        });
        this.realTimeList = list;
      },
      formatData(value){
        if (value === null || value === '' || value === undefined) {
          return '--';
        } else {
          return value;
        }
      },
      // 查询标准值
      getStardraLevel(list){
        var getStardraLevel = []
        list.forEach(item => {
          var standardItem = {
            name: item.item,
            standard: item.standard
          }
          getStardraLevel.push(standardItem)
        })
        this.standardList = getStardraLevel
      },
      updateLabelList(data){
        data.forEach(item => {
          this.labelList.push({
            type: item.type,
            code: item.code,
            name: item.name
          })
        });
      },
      getLabelList(){
        vocsHttp.getSiteList({
          siteCode: this.itemData.siteCode
        }).then(response => {
          response.result.forEach(item => {
            item.code = item.siteCode;
            item.name = item.siteName;
          });
          this.labelList = response.result;
        })
      },
      startEndTime(){
        if (this.dateType === 'hour') {
          return getStartEndTime(this.monitoringConfig.hourInterval);
        } else {
          return getStartEndTime(this.monitoringConfig.dayInterval);
        }
      },
      showSevenDayMonitor(){
        let timeInterval = this.startEndTime();
        vocsHttp.trend({
          siteCode: this.itemData.siteCode,
          dateType: this.itemData.dateType,
          startTime: timeInterval.startTime,
          endTime: timeInterval.endTime,
          type: this.itemData.type
        }).then(response => {
          const options = mapDialogChart.drawChart(response.result, this.factorList, this.itemData.dateType);
          const eCharts = this.$echarts.init(this.$refs.chart);
          eCharts.clear();
          eCharts.setOption(options);
        })
      },
      handleSelectedSite(siteInfo){
        this.cacheData.some(item => {
          if (item.code === siteInfo.code) {
            this.realTimeList = item.monitorData;
            this.status = item.status;
            this.time = item.time.substr(0, 13) + '时';
            this.name = item.name;
            this.showSevenDayMonitor(siteInfo);
            // console.log('getRealTimeList:', this.realTimeList)
            this.getStardraLevel(this.realTimeList)
            this.siteInfoCode = siteInfo.code
            this.siteInfoType = siteInfo.type
            this.getListInquireDate(siteInfo.code, siteInfo.type)
            return true;
          } else {
            return false;
          }
        })
      },
      //处理趋势对比
      handleTrendCompare () {
        this.$refs.trendComparePanel.show();
      },
      // 处理状态颜色
      handleStatusColor(status){
        if (status == '正常') {
          return 'normal'
        } else if (status == '超标') {
          return 'over'
        } else if (status == '离线') {
          return 'offline'
        }
      },
      handleChangeVideoData(flag){
        this.showVideoTab = flag;
      },
      toFixedFn(item){
        if (item.item == "二氧化硫(mg/m³)") {
          if (item.value == '--') {
            return item.value
          } else {
            return (parseInt(item.value * 100) / 100).toFixed(1)
          }
        } else if (item.item == "氮氧化物(mg/m³)") {
          if (item.value == '--') {
            return item.value
          } else {
            return (parseInt(item.value * 100) / 100).toFixed(1)
          }
        } else if (item.item == "烟尘(mg/m³)") {
          if (item.value == '--') {
            return item.value
          } else {
            return (parseInt(item.value * 100) / 100).toFixed(2)
          }
        } else if (item.item == "排放量(m³)") {
          if (item.value == '--') {
            return item.value
          } else {
            return (parseInt(item.value * 100) / 100).toFixed(1)
          }
        } else if (item.item == "化学需氧量(mg/L)") {
          if (item.value == '--') {
            return item.value
          } else {
            return (parseInt(item.value * 100) / 100).toFixed(1)
          }
        } else if (item.item == "氨氮(mg/L)") {
          if (item.value == '--') {
            return item.value
          } else {
            return (parseInt(item.value * 100) / 100).toFixed(2)
          }
        } else if (item.item == "总磷(mg/L)") {
          if (item.value == '--') {
            return item.value
          } else {
            return (parseInt(item.value * 100) / 100).toFixed(2)
          }
        } else if (item.item == "总氮(mg/L)") {
          if (item.value == '--') {
            return item.value
          } else {
            return (parseInt(item.value * 100) / 100).toFixed(2)
          }
        }
      },
      // 开始日期
      handleBeginDayInput(){
        this.getListInquireDate();
      },
      // 结束日期
      handleEndDayInput(){
        this.getListInquireDate();
      },
      // 获取列表查询数据
      getListInquireDate(){
        let code = this.siteInfoCode;
        this.listInquireDate = []
        let siteId = ''
        if (code) {
          siteId = code
        } else {
          siteId = this.itemData.siteCode
        }

        let params = {
          page: this.pageNo,
          limit: this.pageSize,
          dateType: this.dateType,
          startTime: this.beginDay + ' 00:00:00',
          endTime: moment(this.endDay).add(1, 'days').format('YYYY-MM-DD') + ' 00:00:00',
          siteCode: siteId,
          type: 'vocs'
        };
        vocsHttp.trendPage(params)
          .then(res => {
            this.listInquireDate = res.result.list
            this.gasWantotal = res.result.totalCount
          })
      },// 导出数据
      exportList(){
        let params = {
          dateType: this.dateType,
          startTime: this.beginDay + ' 00:00:00',
          endTime: moment(this.endDay).add(1, 'days').format('YYYY-MM-DD') + ' 00:00:00',
          siteCode: this.siteInfoCode ? this.siteInfoCode : this.itemData.siteCode,
          type: 'vocs'
        };
        vocsHttp.export(params)
          .then(response => {
            const content = response;
            const blob = new Blob([content], {type: 'application/ms-excel'});
            const fileName = 'VOCs列表查询数据.xls';
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
      }
    },
    watch: {
      dateType(newVal, oldVal){
        console.log('newVal:', newVal)
        if (newVal == 'hour') {
          this.notBefore = moment(this.initPDayTime).add(-1, 'days').format('YYYY-MM-DD')
          this.beginDay = moment(this.initPDayTime).add(-1, 'days').format('YYYY-MM-DD')
        }
        if (newVal == 'day') {
          this.notBefore = moment(this.initPDayTime).add(-28, 'days').format('YYYY-MM-DD')
          this.beginDay = moment(this.initPDayTime).add(-28, 'days').format('YYYY-MM-DD')
        }

      },
      tabIndex(){
        this.$nextTick(() => {
          this.$refs.scrollbarRef && this.$refs.scrollbarRef.update();
        })
      },
      beginDay(newVal, oldVal){
        this.getListInquireDate(this.siteInfoCode, this.siteInfoType)
      },
      endDay(newVal, oldVal){
        this.getListInquireDate(this.siteInfoCode, this.siteInfoType)
      }
    }
  }
</script>

<style lang="less" type="text/css" scoped>
  .map-wrapper .point-info-detail .tab-content {
    padding-top: 0;

  }

  .normal {
    background: #4bdb57;
  }

  .over {
    background: #f43b29;
  }

  .offline {
    background: #bdb5cd;
  }

  .close-detail-btn {
    position: absolute;
    right: 2px;
    top: 2px;
    color: #fff;
    width: 23px;
    height: 23px;
    text-align: center;
    line-height: 22px;
    z-index: 99;
  }

  .iconfont {
    font-size: 12px;
    font-weight: bold;
  }

  .close-detail-btn:hover {
    background: #fff;
    border-radius: 50%;
    color: #ccc;
  }

  .listInquireTitle {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding-top: 10px;
  }

  .emptyList {
    width: 100%;
    height: 100%;
    text-align: center;
    line-height: 3;
    color: #999;
  }

  .daochu {
    display: inline-block;
    vertical-align: top;
    width: 50px;
    height: 30px;
    border: 1px solid #dddee1;
    border-radius: 4px;
    text-align: center;
    line-height: 32px;
    color: #555;
    font-size: 12px;
    cursor: pointer;
  }

  .overhide {
    overflow: visible !important;
  }
</style>

