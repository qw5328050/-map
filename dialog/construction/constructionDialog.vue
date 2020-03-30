<template>
  <div v-if="visible && hidePlane">
    <div class="point-info-wrapper">
      <a class="close-detail-btn" @click="closedPlaneAndEndRelated"><span class="iconfont"
                                                                 @click="closedPlaneAndEndRelated">&#xe601;</span></a>
      <div class="point-info-detail">
        <!-- 头部信息 -->
        <base-info :info="info"></base-info>
        <!-- 分类信息 -->
        <zt-scrollbar class="ps" :style="{'max-height': documentClientHeight + 'px'}">
          <div class="base-info-list">
            <ul>
              <tool-btn ref="toolBtn" :params="info" @trendClick="handleTrendCompare"></tool-btn>
              <li class="contact-info text-ellipsis"
                  :title="info.address"
                  style="max-width:420px;">
                <span class="iconfont"><em class="iconfont address">&#xe606;</em>{{info.address}}</span>
              </li>
              <li class="contact-info">
                <span class="contact-item" title="环保联系人"><em class="iconfont user">&#xe66b;</em>{{info.linkMan}}</span>
                <span class="contact-item" title="联系电话"><em class="iconfont tel">&#xe66d;</em>{{info.phone}}</span>
              </li>
            </ul>
          </div>
          <div class="classification-info">
            <!-- 分类 -->
            <div class="tab-wrapper" style="margin-bottom: 20px;">
              <span class="tab-item" v-if="showRealInfo"
                    :class="{'cur': tabIndex === 1}" @click="tabIndex = 1">实时监控</span>
              <span v-show="showVideoTab" class="tab-item" :class="{'cur': tabIndex === 3}"
                    @click="tabIndex = 3">视频</span>
              <!--<span v-show="showGridTab" class="tab-item" :class="{'cur': tabIndex === 2}"-->
              <!--@click="tabIndex = 2">网格监管</span>-->
            </div>
            <!-- 分类内容-实时监控 -->
            <div class="tab-content" v-if="showRealInfo && (tabIndex === 1)">
              <!-- 子类标签 -->
              <zt-rolling-label :labelList="labelList"
                                :selectedItem="itemData.selectedItem"
                                @change="handleSelectedSite"></zt-rolling-label>
              <!-- 表格信息 -->
              <div class="panel-table-heaer">
                <time>{{time}}<em class="label pollute-fine ml_5" :class="handleStatusColor(status)">{{handleStatustext(status)}}</em>
                </time>
              </div>
              <div class="panel-table">
                <zt-table :data="realTimeList" ref="diaTable">
                  <zt-column prop="item" width="210" label="控制指标">
                  </zt-column>
                  <zt-column prop="density" label="监测值">
                    <template slot-scope="scope">
                      <span class="label" style="color: black">{{scope.row.value}}</span>
                    </template>
                  </zt-column>
                </zt-table>
              </div>
              <!-- 子类标签内容 -->
              <div class="sub-tab-content">
                <div ref="chart" v-zt-empty-chart="noData" class="chart" style="height:220px;">
                </div>
              </div>
            </div>
            <!-- 分类内容-网格监管 -->
            <grid-supervise v-show="showGridTab && tabIndex === 2"
                            @changeGridData="handleChangeGridData"
                            :id="itemData.sopId"></grid-supervise>
            <!-- 分类内容-视频 -->
            <div class="tab-content" v-show="tabIndex === 3" key="3">
              <hb-video-tab v-show="showVideoTab"
                            @changeVideoData="handleChangeVideoData"
                            :fId="info.fId" :type="itemData.type" :code="itemData.code"></hb-video-tab>
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
  import moment from 'moment'
  import mapDialogChart from '@/chart/mapDialogChart'
  import {objectAssign} from '@/utils/util'
  import mapDialogHttp from '@/https/map/mapDialogHttp'
  import mapPollutePublicHttp from '@/https/map/mapPollutePublicHttp'
  import baseDialog from '@/map/dialog/base/baseDialog'
  import toolBtn from '@/map/dialog/_public/toolBtn.vue'
  import trendComparePanel from '@/map/dialog/_public/trendComparePanel.vue'
  import baseInfo from '@/map/dialog/pollute/polluteIndustry/left/baseInfo.vue'
  import GridSupervise from "@/map/dialog/gird/gridSupervise";
  import factor from '@/utils/factor'
  import hbVideoTab from '@/components/_public/hbVideoTab.vue'
  import aqiColor from '@/utils/aqiColor'
  import mapUtil from '@/map/js/util/mapUtil'

  export default{
    components: {
      baseInfo,
      toolBtn,
      trendComparePanel,
      GridSupervise,
      hbVideoTab,
      moment,
      aqiColor
    },
    mixins: [baseDialog],
    data(){
      return {
        tabIndex: 1,
        cacheData: [],
        realTimeList: [],
        labelList: [],
        chartData: [],
        lineCharts: null,
        time: '',
        name: '',
        noData: false,
        //是否显示详情
        showRealInfo: true,
        showVideoTab: false,
        showGridTab: false,
        info: {
          name: '',
          address: '',
          county: '',
          legalRepresentative: '',
          mobilPhone: ''
        },
        hidePlane: false,
        status: ''
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
      this.noData = false;
      this.showRealInfo = true;
      this.info.name = '';
      this.info.address = '';
      this.info.county = '';
      this.info.legalRepresentative = '';
      this.info.mobilPhone = '';
    },
    mounted(){
    //当地图点击时，给code赋值
       if(this.itemData.f_station_code){
          this.itemData.code = this.itemData.f_station_code
      }
      if (this.itemData.showVideo) {
        this.tabIndex = 0;
      }
      this.getBaseInfo();
      this.getRealTimeList();
    },
    methods: {
      justClosedPlane(){
        this.hidePlane = false
      },
      closedPlaneAndEndRelated () {
        // console.log(this.$el.parentNode.id)
        let parentId = this.$el.parentNode.id
        if ('primary' === parentId) {
          this.$mapEvtBus.$emit(mapUtil.EVT_NAME.map_endAnalysis, {})
        }
        this.hidePlane = false
      },
      justiceShowVideoTab(){
        if (this.itemData.showVideo) {
          this.tabIndex = 3;
          this.showVideoTab = true
        }
      },
      getBaseInfo(){
        console.log('getSopDetail:', this.itemData)
        let id = this.itemData.sopId === undefined ? '' : this.itemData.sopId
        //if(this.itemData.type == "gongd") {
          //id = ''
        //}
        mapDialogHttp.getSopDetail({
          type: this.itemData.type,
          code: this.itemData.code,
          id: id
        }).then(result => {
          objectAssign(this.info, result.data);
          this.info.id = this.info.sopId = this.itemData.sopId;
          this.info.fId = this.info.id;
          this.info.divCode = this.info.countyCode;
          this.info.type = this.itemData.type;
          this.hidePlane = true;
          this.$nextTick(() => {
            this.justiceShowVideoTab();
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
            this.tabIndex = 2;
          }
        }
      },
      getRealTimeList(){
        mapDialogHttp.getJzgdReal({
          id: this.itemData.sopId,
          type: this.itemData.type,
          code: this.itemData.code
        }).then(result => {
          this.cacheData = result.data;
          this.updateLabelList(result.data);
          this.justiceHasRealTime(result.data)
          this.time = moment().format('MM月DD日HH点');
          if (result.data.length === 0) {

          }
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
      showSevenDayMonitor(siteInfo){
        mapDialogHttp.getJzgdHis({
          type: siteInfo.type,
          code: siteInfo.code
        }).then(result => {
          if (result.data && result.data.length > 0) {
            result.data.forEach(item => {
              item.name = factor.getFactorLabel(item.name);
            });
            const options = mapDialogChart.getMapDialogLineChart(result.data, 'PM₁₀');
            this.noData = false;
            const emptyChart = this.$echarts.init(this.$refs.chart);
            emptyChart.clear();
            emptyChart.setOption(options);
          } else {
            this.noData = true;
          }
        })
      },
      handleSelectedSite(siteInfo){
        this.cacheData.some(item => {
          if (item.code === siteInfo.code) {
            this.setRealTimeList(item);
            this.status = item.status;
            if(item.time){
            this.time = item.time.substr(0, 13) + '时';
          }

            this.name = item.name;
            this.showSevenDayMonitor(siteInfo);
            return true;
          } else {
            return false;
          }
        })
      },
      setRealTimeList(data){
        let arr = [];
        arr.push({
          item: 'PM₁₀',
          value: data.pm10,
          time: data.time
        });
        arr.push({
          item: 'PM₂.₅',
          value: data.pm25,
          time: data.time
        });
        this.realTimeList = arr;
      },
      //处理趋势对比
      handleTrendCompare () {
        this.$refs.trendComparePanel.show();
      },
      handleChangeVideoData(flag){
        this.showVideoTab = flag;
      },
      handleChangeGridData(flag){
        this.showGridTab = flag;
      },
      // 处理状态颜色
      handleStatusColor(status){
        if (status == 'normal') {
          return 'normal'
        } else if (status == 'over') {
          return 'over'
        } else if (status == 'offLine') {
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
    }
  }
</script>

<style lang="less" type="text/css" scoped>
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

