<template>
  <div class="point-info-wrapper" v-if="visible && hidePlane">
    <a class="close-detail-btn" @click="justClosedPlane">
      <span class="iconfont" @click="justClosedPlane">&#xe601;</span>
    </a>
    <div class="point-info-detail">
      <!-- 头部信息 -->
      <header-info :detailData="detailData"></header-info>
      <!-- 分类信息 -->
      <zt-scrollbar
        ref="scrollBar"
        class="ps"
        :style="{'height': documentClientHeight  + 'px'}"
      >
        <base-info-list :detailData="detailData"></base-info-list>
        <div class="classification-info">
          <!-- 分类 -->
          <div class="tab-wrapper">
            <span class="tab-item" :class="{'cur': tabIndex === 1}" @click="tabIndex = 1">实时监控</span>
            <span class="tab-item" v-if="itemData.type === 'hldm' || itemData.type === 'yysy' || itemData.type === 'hlsgcy'"
                  :class="{'cur': tabIndex === 4}" @click="tabIndex = 4">列表查询</span>
            <span
              v-show="showGasWan"
              class="tab-item"
              :class="{'cur': tabIndex === 3}"
              @click="tabIndex = 3"
            >报警</span>
          </div>
          <!-- 分类内容-实时监控 -->
          <div class="tab-content" v-show="tabIndex === 1">
            <div>
              <div class="panel-table-heaer" style="display: table;width:100%;">
                <time>{{monitorTime}}</time>
                <span class="site">站点编号：{{detailData.siteCode}}</span>
              </div>
              <div class="panel-table tableNoPadding">
                <zt-table :data="realTimeList" ref="diaTable">
                  <zt-column prop="item" width="130" label="控制指标"></zt-column>
                  <zt-column prop="value" width="80" label="监测值"></zt-column>
                  <zt-column prop="standard" label="标准值"></zt-column>
                  <zt-column prop="en" label="超标倍数" width="100"></zt-column>
                </zt-table>
              </div>
              <!-- 子类标签内容 -->
              <div class="sub-tab-content">
                <div ref="chart" class="chart" style="height:260px;width: 396px;"></div>
              </div>
            </div>
          </div>
          <div class="tab-content" v-show="tabIndex === 3">
            <alarm-list :params="alarmParams"></alarm-list>
          </div>
          <div  v-show="tabIndex === 4"  v-if="itemData.type === 'hldm' || itemData.type === 'yysy' || itemData.type === 'hlsgcy'">
            <history-data-list :params="alarmParams"></history-data-list>
          </div>
        </div>
      </zt-scrollbar>
    </div>
    <trend-compare-panel ref="trendComparePanel" :params="detailData"></trend-compare-panel>
    <trend-analysis-panel ref="trendAnalysisPanel" :params="detailData"></trend-analysis-panel>
  </div>
</template>

<script type="text/jsx">
  import moment from "moment";
  import mapDialogChart from "@/chart/mapDialogChart";
  import waterDialogChart from "@/chart/waterDialogChart";
  import baseInfo from "@/map/dialog/pollute/polluteIndustry/left/baseInfo.vue";
  import baseInfoList from "../_public/baseInfoList.vue";
  import headerInfo from "../_public/headerInfo.vue";
  import {getFactorByType} from "@/utils/index";
  import historyDataList from './historyDataList.vue'
  import {
    objectAssign,
    chartsStartIndex,
    formatUnit,
    ztGetYMaxData,
    formatYMax100,
    chartsNoDataHtml,
    getMax,
    getStartEndTime
  } from "@/utils/util";
  import mapDialogHttp from "@/https/map/mapDialogHttp";
  import mapPollutePublicHttp from "@/https/map/mapPollutePublicHttp";
  import baseDialog from "@/map/dialog/base/baseDialog";
  import toolBtn from "@/map/dialog/_public/toolBtn.vue";
  import trendComparePanel from "@/map/dialog/_public/trendComparePanelWater.vue";
  import trendAnalysisPanel from "@/map/dialog/_public/trendAnalysisPanelWater.vue";
  import GridSupervise from "@/map/dialog/gird/gridSupervise";
  import factor from "@/utils/factor";
  import lineCharts from "@/chart/lineCharts";
  import hbVideoTab from "@/components/_public/hbVideoTab.vue";
  import {getParamsByKey} from "@/utils/paramsCache";
  import mapHttp from "@/https/map/mapHttp";
  import alarmList from "@/map/dialog/_public/alarmList";
  export default {
    components: {
      hbVideoTab,
      toolBtn,
      trendComparePanel,
      trendAnalysisPanel,
      GridSupervise,
      headerInfo,
      baseInfo,
      baseInfoList,
      alarmList,
      historyDataList
    },
    mixins: [baseDialog],
    data() {
      let monitoringConfig = getParamsByKey(this.constants.monitoringConfig);
      let now = moment(new Date());
      let initPDay = now.subtract(1, "days").format("YYYY-MM-DD");
      let initNotBefore = moment(initPDay)
        .add(-28, "days")
        .format("YYYY-MM-DD");
      let initNotBefore2 = moment(initPDay)
        .add(-1, "days")
        .format("YYYY-MM-DD");
      let initNotAfter = moment(initPDay)
        .add(1, "days")
        .format("YYYY-MM-DD");
      return {
        moment,
        monitoringConfig: monitoringConfig,
        detailData: {},
        pageSize: 10,
        pageNo: 1,
        gasWantotal: 0,
        initPDayTime: initPDay,
        smallpagination: false,
        cacheData: [],
        realTimeList: [],
        labelList: [],
        selectedItem: {},
        chartData: [],
        lineCharts: null,
        monitorTime: "",
        siteName: "",
        showVideoTab: false,
        operateStatus: "",
        tabIndex: 1,
        info: {
          name: "",
          address: "",
          county: "",
          legalRepresentative: "",
          phone: ""
        },
        hidePlane: false,
        dateTypes: [{name: "时", code: "hour"}, {name: "日", code: "day"}],
        dateType: "hour",
        beginDay: initNotBefore2,
        notBefore: initNotBefore2,
        notAfter: initNotAfter,
        endDay: initNotAfter,
        beginHour: "00",
        endHour: "23",
        listInquireDate: [],
        standardList: [],
        resultChartData: {},
        siteInfoCode: "",
        siteInfoType: "",
        headleData: "",
        factorList: [],
        alarmParams: {},
        showGasWan: true
      };
    },
    created() {
      this.cacheData = [];
      this.realTimeList = [];
      this.labelList = [];
      this.chartData = [];
      this.lineCharts = null;
      this.monitorTime = "";
      this.siteName = "";
      this.operateStatus = "";
      this.detailData = {};
      this.info.name = "";
      this.info.address = "";
      this.info.county = "";
      this.info.legalRepresentative = "";
      this.info.phone = "";
      this.siteInfoCode = this.itemData.code;
      this.siteInfoType = this.itemData.type;
      this.factorList = getFactorByType(this.itemData.type);
      this.alarmParams = {
        siteCode: this.itemData.code !== undefined
          ? this.itemData.code
          : this.itemData.siteCode,
        type: this.itemData.type
      };
      if (this.itemData.showWarnTab) {
        this.showGasWan = true;
        this.tabIndex = 3;
      }
    },
    mounted() {
      this.getBaseInfo();
      this.getRealTimeList();
    },
    methods: {
      startEndTime() {
        if (this.dateType === "hour") {
          return getStartEndTime(this.monitoringConfig.hourInterval);
        } else {
          return getStartEndTime(this.monitoringConfig.dayInterval);
        }
      },
      handlePgChange(pageNo, pageSize) {
        this.pageNo = pageNo;
        this.pageSize = pageSize;
      },
      justClosedPlane() {
        this.hidePlane = false;
      },
      getBaseInfo() {
        mapHttp
          .siteDetail({
            siteCode: this.itemData.siteCode,
            type: this.itemData.type
          })
          .then(response => {
            this.detailData = response.result;
            this.hidePlane = true;
            this.showSevenDayMonitor();
            this.$nextTick(() => {
              this.$refs.trendComparePanel && this.$refs.trendComparePanel.initSelectedList();
              this.$refs.trendAnalysisPanel && this.$refs.trendAnalysisPanel.initSelectedList();
            });
          });
      },

      getRealTimeList() {
        mapDialogHttp
          .siteReal({
            siteCode: this.itemData.siteCode,
            type: this.itemData.type,
            dateType: this.itemData.dateType,
          }).then(response => {
          this.showRealTimeList(response.result); //2000886056
          // this.monitorTime = moment(response.result.monitorTime).format("MM月DD日HH点");
        });
      },
      showRealTimeList(result) {
        let list = [];
        this.factorList.forEach(factorItem => {
          list.push({
            item: factorItem.name,
            value: result[factorItem.code] ? result[factorItem.code] : '--',
            standard: result[factorItem.code + "Standard"] ? result[factorItem.code + "Standard"] : '--',
            en: result[factorItem.code + "En"] ? result[factorItem.code + "En"] : '--'
          });
        });
        this.realTimeList = list;
        if (result.monitorTime != null && result.monitorTime != undefined) {
          this.monitorTime = moment(result.monitorTime).format('MM月DD日HH点')
        } else {
          this.monitorTime = moment().format('MM月DD日HH点')
        }
      },
      // 查询标准值
      getStardraLevel(list) {
        var getStardraLevel = [];
        list.forEach(item => {
          var standardItem = {
            name: item.item,
            standard: item.standard
          };
          getStardraLevel.push(standardItem);
        });
        this.standardList = getStardraLevel;
      },
      showSevenDayMonitor() {
        let timeInterval = this.startEndTime();
        mapDialogHttp
          .siteTrend({
            siteCode: this.itemData.siteCode,
            dateType: this.itemData.dateType,
            startTime: timeInterval.startTime,
            endTime: timeInterval.endTime,
            type: this.itemData.type
          })
          .then(response => {
            let result = response.result;
            if (result && result.length) {
              result.map(item => {
                for (let key in item) {
                  if (key !== 'monitorTime' && !item[key]) {
                    item[key] = '无数据';
                  }
                }
              });
            }
            let options = {};
            if (this.itemData.type === 'hldm') {
              options = waterDialogChart.drawChart(
                result,
                this.factorList,
                this.itemData.dateType,
                waterDialogChart.getHldmYAxis(this.factorList)
              );
            } else {
              options = mapDialogChart.drawChart(
                result,
                this.factorList,
                this.itemData.dateType
              );
            }
            // 图例过多调整图表主内容位置避免主内容与图例重叠
            options.grid.y = options.grid.y + 25;
            const eCharts = this.$echarts.init(this.$refs.chart);
            eCharts.clear();
            eCharts.setOption(options);
          });
      },
      //处理趋势对比
      handleTrendCompare() {
        this.$refs.trendComparePanel.show();
      },
      // 处理趋势分析
      handleTrendAnalysis(){
        this.$refs.trendAnalysisPanel.show();
      },
      // 处理状态颜色
      handleStatusColor(status) {
        if (status == "正常") {
          return "normal";
        } else if (status == "超标") {
          return "over";
        } else if (status == "离线") {
          return "offline";
        }
      },
      handleChangeVideoData() {
      },
      // 开始日期
      handleBeginDayInput() {
      },
      // 结束日期
      handleEndDayInput() {
      },
      //污水处理设计规格
      getWsclHeadle() {
        mapDialogHttp
          .getWsclHeadle({
            sopId: this.itemData.sopId === undefined ? "" : this.itemData.sopId
          })
          .then(result => {
            if (result.data && result.data.designpc != undefined) {
              this.headleData = result.data.designpc;
            }
          });
      }
    },
    watch: {
      dateType(newVal, oldVal) {
        console.log("newVal:", newVal);
        if (newVal == "hour") {
          this.notBefore = moment(this.initPDayTime)
            .add(-1, "days")
            .format("YYYY-MM-DD");
          this.beginDay = moment(this.initPDayTime)
            .add(-1, "days")
            .format("YYYY-MM-DD");
        }
        if (newVal == "day") {
          this.notBefore = moment(this.initPDayTime)
            .add(-28, "days")
            .format("YYYY-MM-DD");
          this.beginDay = moment(this.initPDayTime)
            .add(-28, "days")
            .format("YYYY-MM-DD");
        }
      },
      tabIndex() {
        this.$nextTick(() => {
          this.$refs.scrollBar && this.$refs.scrollBar.update();
        });
      },
      beginDay(newVal, oldVal) {
        this.getListInquireDate(this.siteInfoCode, this.siteInfoType);
      },
      endDay(newVal, oldVal) {
        this.getListInquireDate(this.siteInfoCode, this.siteInfoType);
      }
    }
  };
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

  .mx-input {
    padding: 6px 10px !important;
  }

  .mx-input-append {
    display: none !important;
  }

  .select-mock .select-list,
  .select-link-mock .select-list,
  .select-btn-mock .select-list {
    min-width: 40px !important;
  }

  .mx-datepicker .pickerTwo .mx-datepicker-popup {
    left: -130px !important;
  }

  .listInquireTitle {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding-top: 10px;
  }

  .dispNone {
    display: none;
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

 /* .overhide {
    overflow: visible !important;
  }*/
</style>


