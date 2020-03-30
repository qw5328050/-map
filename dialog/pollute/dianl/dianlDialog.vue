<template>
  <div v-if="visible && hidePlane">
    <div class="point-info-wrapper">
      <a class="close-detail-btn" @click="justClosedPlane"><span class="iconfont"
                                                                 @click="justClosedPlane">&#xe601;</span></a>
      <div class="point-info-detail">
        <!-- 头部信息 -->
        <header class="header-info">
          <h3 class="name">{{info.siteName}}</h3>
          <p>
            <span class="fr">{{info.countyName}} </span>
          </p>
        </header>
        <!-- 分类信息 -->
        <zt-scrollbar class="ps" :style="{'max-height': documentClientHeight + 'px'}">
          <div class="base-info-list">
            <ul>
              <li class="contact-info" v-if="info.linkMan || info.phone">
                <span class="contact-item" v-if="info.linkMan" title="环保联系人"><em
                  class="iconfont user">&#xe66b;</em>{{info.linkMan}}</span>
                <span class="contact-item" v-if="info.phone" title="联系电话"><em
                  class="iconfont tel">&#xe66d;</em>{{info.phone}}</span>
              </li>
            </ul>
          </div>
          <div class="classification-info">
            <!-- 分类 -->
            <div class="tab-wrapper">
              <span class="tab-item"
                    :class="{'cur': tabIndex === 1}" @click="tabIndex = 1">电量监控</span>
              <span class="tab-item" :class="{'cur': tabIndex === 4}"
                    @click="tabIndex = 4">报警</span>
            </div>
            <!-- 分类内容-实时监控 -->
            <div class="tab-content" v-if="tabIndex === 1">
              <!-- 子类标签 -->
              <zt-rolling-label :labelList="labelList"
                                :selectedItem="itemData.selectedItem"
                                @change="handleSelectedSite"></zt-rolling-label>
              <!-- 子类标签内容 -->
              <div class="sub-tab-content">
                <div v-show="scsbEmpty">
                  <h3 class="chart-title">生产设备用电量</h3>
                  <div ref="chart1" class="chart" style="height:170px;">
                  </div>
                </div>
                <div v-show="zwsbEmpty">
                  <h3 class="chart-title">治污设备用电量</h3>
                  <div ref="chart2" class="chart" style="height:180px; ">
                  </div>
                </div>
              </div>
            </div>
            <!-- 告警列表 -->
            <div class="tab-content" v-if="tabIndex === 4" style="height: 350px;">
              <qydl-alarm-list :params="alarmParams"></qydl-alarm-list>
            </div>
          </div>
        </zt-scrollbar>
      </div>
    </div>
  </div>
</template>

<script type="text/jsx">
  /* 地图上的弹框*/
  import moment from 'moment'
  import {objectAssign, chartsStartIndex} from '@/utils/util'
  import mapDialogHttp from '@/https/map/mapDialogHttp'
  import mapPollutePublicHttp from '@/https/map/mapPollutePublicHttp'
  import mapHttp from '@/https/map/mapHttp'
  import baseDialog from '@/map/dialog/base/baseDialog'
  import toolBtn from '@/map/dialog/_public/toolBtn.vue'
  import baseInfo from '@/map/dialog/pollute/polluteIndustry/left/baseInfo.vue'
  import GridSupervise from "@/map/dialog/gird/gridSupervise";
  import factor from '@/utils/factor'
  import hbVideoTab from '@/components/_public/hbVideoTab.vue'
  import qydlAlarmList from '@/map/dialog/_public/qydlAlarmList'

  export default{
    components: {
      baseInfo,
      toolBtn,
      GridSupervise,
      hbVideoTab,
      qydlAlarmList
    },
    mixins: [baseDialog],
    data(){
      return {
        pageSize: 10,
        pageNo: 1,
        tabIndex: 1,
        cacheData: [],
        labelList: [],
        chartData: [],
        lineCharts: null,
        time: '',
        name: '',
        techId: '',
        scsbEmpty: false,
        zwsbEmpty: false,
        noData: false,
        showVideoTab: false,
        showGridTab: false,
        showTab: false,
        listInquireDate: [],
        //是否显示详情
        showRealInfo: false,
        dataZoomColors: [
          '#333333',
          '#1396F2'
        ],
        info: {
          name: '',
          address: '',
          county: '',
          legalRepresentative: '',
          mobilPhone: ''
        },
        hidePlane: false,
        loading: true,
        alarmParams: {},
      }
    },
    created(){
      this.cacheData = [];
      this.labelList = [];
      this.chartData = [];
      this.lineCharts = null;
      this.time = '';
      this.name = '';
      this.techId = '';
      this.noData = false;
      this.showRealInfo = false;
      this.info.name = '';
      this.info.address = '';
      this.info.county = '';
      this.info.legalRepresentative = '';
      this.info.mobilPhone = '';
      this.tabIndex = 1;
      this.showVideoTab = false;
      this.showGridTab = false;
      this.loading = true;
      this.alarmParams = {
        siteCode: this.itemData.siteCode,
      }
    },
    mounted(){
      this.getBaseInfo();
      this.loading = true;
    },
    methods: {
      justClosedPlane(){
        this.hidePlane = false
      },
      getBaseInfo(){
        console.log('this.itemData:', this.itemData)
        mapHttp.siteDetail({
          siteCode: this.itemData.siteCode,
          type: this.itemData.type
        }).then(response => {
          objectAssign(this.info, response.result);
          this.hidePlane = true;
          this.getElectricCraft();
        })
      },
      getElectricCraft(){
        mapDialogHttp.qydlCraftList({
          siteCode: this.itemData.siteCode,
        }).then(response => {
          response.result.forEach(item => {
            item.type = item.code;
            item.code = item.techId;
            item.name = item.techName;
          });
          this.cacheData = response.result;
          this.updateLabelList(response.result);
        })
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
      showHisMonitor(siteInfo){
        mapDialogHttp.qydlChart({
          techId: siteInfo.code,
          siteCode: this.itemData.siteCode
        }).then(response => {
          let scsbData = [], zwsbData = [], scsbName = '', zwsbName = '';
   /*       this.scsbEmpty = false;
          this.zwsbEmpty = false;*/
          response.result.forEach(item => {
            if (item.deviceType == 0) {
              scsbData = item.values;
              scsbName = item.deviceName;
            } else if (item.deviceType == 1) {
              zwsbData = item.values;
              zwsbName = item.deviceName;
            }
          });
          if ((scsbData && scsbData.length > 0) || (zwsbData && zwsbData.length > 0)) {
            if (scsbData.length > 0 && zwsbData.length == 0) {
              this.loading = false;
              this.zwsbEmpty = false;
              this.scsbEmpty = true;
              let isScsbSlide = true;
              let options1 = this.getChartOptions(scsbData, isScsbSlide, scsbName);
              this.noData = false;
              this.$nextTick(() => {
                const emptyChart1 = this.$echarts.init(this.$refs.chart1);
                emptyChart1.clear();
                emptyChart1.setOption(options1);
              });
            } else if (scsbData.length == 0 && zwsbData.length > 0) {
              this.loading = false;
              this.scsbEmpty = false;
              this.zwsbEmpty = true;
              let isZwsbSlide = true;
              const options2 = this.getChartOptions(zwsbData, isZwsbSlide, zwsbName);
              this.noData = false;
              this.$nextTick(() => {
                const emptyChart2 = this.$echarts.init(this.$refs.chart2);
                emptyChart2.clear();
                emptyChart2.setOption(options2);
              });
            } else {
              this.loading = false;
              this.scsbEmpty = true;
              this.zwsbEmpty = true;

              let isScsbSlide = false;
              let options1 = this.getChartOptions(scsbData, isScsbSlide, scsbName);
              this.noData = false;

              this.$nextTick(() => {
                const emptyChart1 = this.$echarts.init(this.$refs.chart1);
                emptyChart1.clear();
                emptyChart1.setOption(options1);
              });
              let isZwsbSlide = true;
              const options2 = this.getChartOptions(zwsbData, isZwsbSlide, zwsbName);

              this.$nextTick(() => {
                const emptyChart2 = this.$echarts.init(this.$refs.chart2);
                emptyChart2.clear();
                emptyChart2.setOption(options2);
                this.$echarts.connect([emptyChart1, emptyChart2]);
              });
            }
          } else {
            this.loading = false;
            this.noData = true;
            this.scsbEmpty = false;
            this.zwsbEmpty = false;
          }
        });
        this.loading = true;
    /*    this.scsbEmpty = true;
        this.zwsbEmpty = true;*/
      },
      handleSelectedSite(siteInfo){
        this.cacheData.some(item => {
          if (item.code === siteInfo.code) {
            this.name = item.name;
            this.showHisMonitor(siteInfo);
            return true;
          } else {
            return false;
          }
        })
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
      // 处理颜色状态文字
      handleStatustext(status){
        if (status == 'normal') {
          return '正常'
        } else if (status == 'over') {
          return '超标'
        } else if (status == 'offLine') {
          return '离线'
        }
      },
      //趋势图
      getChartOptions(data, isSlide, name){
        const self = this;
        let legend = {
          type: 'scroll',
          top: 23,
          data: []
        };

        let xAxis = {
          type: 'category',
          boundaryGap: false,
          data: [],
          axisPointer: {
            type: 'shadow'
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          grid: {
            left: '10%',
            bottom: '35%'
          },
        };
        data.forEach(item => {
          xAxis.data.push(item.time.substr(5, 8) + '时');
        });
        let seryData = {
          name: name,
          type: 'line',
          data: [],
        };
        legend.data.push(name);
        data.forEach((item, index) => {
          seryData.data.push(item.value);
        });
        const options = {
          color: ['#f49f42', '#01c300', '#73b9bc', '#91ca8c', '#40c9e7', '#eedd78', '#7289ab', '#4472C5', '#ED7C30', '#FFB6C1', '#FFC0CB', '#DC143C', '#FF1493', '#800080', '#9400D3'],
          title: {
            left: 'center',
            textStyle: {
              fontFamily: "微软雅黑",
              fontSize: 15,
              padding: [5, 10, 5, 5]
            },

          },
          toolbox: {
            y: -30,
            show: true,
            feature: {
              mark: {show: true},
              dataZoom: {show: true},
              dataView: {show: true, readOnly: false},
              magicType: {show: true, type: ['line', 'bar']},
              restore: {show: true},
              saveAsImage: {show: true}
            }
          },
          tooltip: {
            trigger: 'axis',
            extraCssText: 'z-index:9999;'
          },

          grid: {
            width: 335,
            left: 38,
            right: 50,
            top: 70,
            bottom: 40
          },
          xAxis: xAxis,
          legend: legend,

          yAxis: {
            name: '单位(KW)',
            type: 'value',
            axisTick: {
              show: false
            },
            splitLine: {
              show: false
            },
          },
          series: seryData
        };
        return options;

      },
    }
  }
</script>

<style lang="less" type="text/css" scoped>

  .chart-title {
    text-align: center;
    padding: 6px 0;
  }

  .map-wrapper .point-info-detail .tab-content {
    padding-top: 0;

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
</style>

