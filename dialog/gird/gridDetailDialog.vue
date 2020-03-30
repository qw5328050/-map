<template>
  <div v-if="visible && hidePlane">
    <div class="point-info-wrapper">
      <a class="close-detail-btn" @click="justClosedPlane"><span class="iconfont"
                                                                 @click="justClosedPlane">&#xe601;</span></a>
      <div class="point-info-detail">
        <!-- 头部信息 -->
        <!--        <base-info :info="info"></base-info>-->
        <header class="header-info">
          <a v-if="info.sopId" href="#" @click.prevent="detailHandle" class="detail-btn"><em class="iconfont">&#xe672;</em>详情</a>
          <h3 class="name">{{info.gridName}}</h3>
          <p>
            <span class="fr">{{info.address}}</span>
          </p>
        </header>
        <!-- 分类信息 -->
        <zt-scrollbar class="ps" :style="{'max-height': documentClientHeight + 'px'}">
          <div class="base-info-list">
            <ul>
              <tool-btn ref="toolBtn" :params="info" @trendClick="handleTrendCompare"></tool-btn>
              <li class="text-ellipsis"
                  :title="info.address"
                  style="max-width:420px;"><em class="iconfont address">&#xe606;</em>{{info.address}}
              </li>
              <li class="contact-info">
                <span class="contact-item" title="环保联系人"><em class="iconfont user">&#xe66b;</em>{{info.personName}}</span>
                <span class="contact-item" title="联系电话"><em class="iconfont tel">&#xe66d;</em>{{info.mobile}}</span>
              </li>
            </ul>
          </div>
          <div class="classification-info">
            <!-- 分类 -->
            <div class="tab-wrapper">
              <span class="tab-item" :class="{'cur': tabIndex === 2}" @click="tabIndex = 2">网格监管</span>
            </div>
            <!-- 分类内容-网格监管 -->
            <grid-monitor :item="info"></grid-monitor>
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
  import {objectAssign} from '@/utils/util'
  import mapDialogHttp from '@/https/map/mapDialogHttp'
  import mapGridHttp from '@/https/map/mapGridHttp'
  import mapPollutePublicHttp from '@/https/map/mapPollutePublicHttp'
  import baseDialog from '@/map/dialog/base/baseDialog'
  import toolBtn from '@/map/dialog/_public/toolBtn.vue'
  import trendComparePanel from '@/map/dialog/_public/trendComparePanel.vue'
  import baseInfo from '../pollute/polluteIndustry/left/baseInfo.vue'
  import moment from 'moment'
  import hbVideoTab from '@/components/_public/hbVideoTab.vue'
  import GridMonitor from "./gridMonitor";

  export default{
    components: {
      GridMonitor,
      baseInfo,
      toolBtn,
      trendComparePanel,
      hbVideoTab
    },
    mixins: [baseDialog],
    data(){
      return {
        tabIndex: 2,
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
        showRealInfo: false,
        showVideoTab: false,
        info: {
          name: '',
          address: '',
          county: '',
          legalRepresentative: '',
          mobilPhone: ''
        },
        standardList: [],
        hidePlane: false
      }
    },
    created(){
      this.cacheData = [];
      this.realTimeList = [];
      this.labelList = [];
      this.chartData = [];
      this.lineCharts = null;
      this.time = '';
      this.name = '';
      this.status = '';
      this.noData = false;
      this.showRealInfo = false;
      this.info.name = '';
      this.info.address = '';
      this.info.county = '';
      this.info.legalRepresentative = '';
      this.info.mobilPhone = '';
      this.tabIndex = 1;
      this.showVideoTab = false;
    },
    mounted(){
      if (this.itemData.showVideo) {
        this.tabIndex = 3;
      }
      this.getGridDataInfo();
      // this.pollutionStatistics();
    },
    methods: {
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
      getGridDataInfo(){
        mapGridHttp.getGridDataInfo({
          type: this.itemData.type,
          id: this.itemData.sopId === undefined ? '' : this.itemData.sopId
        }).then(result => {
          objectAssign(this.info, result.data);
          this.info.id = this.info.sopId = this.itemData.sopId;
          this.info.fId = this.info.id;
          this.info.type = this.itemData.type;
          this.info.pollutionId = this.itemData.pollutionId
          this.hidePlane = true;
          this.justiceShowVideoTab();
          this.$nextTick(()=> {
            this.$refs.toolBtn.updateParams();
            this.$refs.trendComparePanel.initSelectedList();
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
      pollutionStatistics(){
        mapDialogHttp.pollutionStatistics({
          pollutionId: this.itemData.pollutionId,
          timeStamp: this.itemData.timeStamp,
        }).then(result => {
          this.cacheData = result.data;
          this.updateLabelList(result.data);
          this.justiceHasRealTime(result.data)
          this.time = moment().format('MM月DD日HH点');
          if (result.data && result.data.length > 0) {
            this.showRealInfo = true;
            this.getStardraLevel(result.data[0].monitorData)
          }
        })
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
      showSevenDayMonitor(siteInfo){
        mapDialogHttp.getFacilityEntHis({
          type: siteInfo.type,
          code: siteInfo.code
        }).then(result => {
          if (result.data && result.data.length > 0) {
            var dataNumb = 0
            var yAxisName = ''
            result.data.forEach(item => {
              if (item.resultList && item.resultList.length > 0) {
                dataNumb++
              }
              if (item.name == '氨氮') {
                yAxisName = '氨氮'
              } else if (item.name == '烟尘') {
                yAxisName = '烟尘'
              }
            })
            if (dataNumb > 0) {
              const options = mapDialogChart.getMapDialogLineChart(result.data, yAxisName, this.standardList);
              this.noData = false;
              const emptyChart = this.$echarts.init(this.$refs.chart)
              emptyChart.clear();
              emptyChart.setOption(options);
            } else {
              this.noData = true;
            }
          } else {
            this.noData = true;
          }
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
</style>

