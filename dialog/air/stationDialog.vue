<template>
  <!-- 国控、省控、市控  街镇类型站点监控信息 -->
  <div v-if="visible && hidePlane">
    <div class="point-info-wrapper">
      <a class="close-detail-btn" @click="justClosedPlane">
        <span class="iconfont" @click="justClosedPlane">&#xe601;</span>
      </a>
      <div class="point-info-detail">
        <!-- 头部信息 -->
        <header class="header-info">
          <h3 class="name">{{detailData.siteName}}</h3>
          <p>
            <span class="fl">
              <zt-dictionary itemCode="SITE_FACTOR"
                             :code="detailData.type"></zt-dictionary>
            </span>
            <span class="fr">{{detailData.countyName}} </span>
          </p>
        </header>
        <zt-scrollbar class="ps" :style="{'max-height': documentClientHeight+ 'px'}" ref="scrollBar">
          <!-- 基础信息 -->
          <div class="base-info-list">
            <ul>
              <tool-btn ref="toolBtn" :params="detailData" @trendClick="handleTrendCompare"></tool-btn>
              <li v-if="detailData.address" class="text-ellipsis width380"><em
                class="iconfont address">&#xe606;</em>{{detailData.address}}
              </li>
              <li class="contact-info" v-if="detailData.linkMan || detailData.phone">
                <span class="contact-item" v-if="detailData.linkMan" title="环保联系人"><em
                  class="iconfont user">&#xe66b;</em>{{detailData.linkMan}}</span>
                <span class="contact-item" v-if="detailData.phone" title="联系电话"><em
                  class="iconfont tel">&#xe66d;</em>{{detailData.phone}}</span>
              </li>
            </ul>
          </div>
          <!-- 分类信息 -->
          <div class="classification-info">
            <!-- 分类 -->
            <div class="tab-wrapper">
              <span class="tab-item" :class="{'cur': tabIndex === 1}" @click="tabIndex = 1">实时监控</span>
              <span v-show="showVideoTab" class="tab-item" :class="{'cur': tabIndex === 2}"
                    @click="tabIndex = 2">视频</span>
              <span v-show="showGasWan" class="tab-item" :class="{'cur': tabIndex === 3}"
                    @click="tabIndex = 3">报警</span>
            </div>
            <!-- 分类内容-实时监控 -->
            <div class="tab-content" v-if="tabIndex === 1">
              <!-- 表格信息 -->
              <div class="panel-table-heaer">
                <time>
                  {{factorData.monitorTime ? moment(new Date(factorData.monitorTime.replace(/-/g, '/'))).format('MM月DD日HH点') : ''}}
                  <em class="label ml_5" :class="aqiColor.ztAqiColorClass(factorData.aqi)">
                    {{factorData.iaqiType}}
                  </em>
                </time>
                <span class="site">站点编号：{{factorData.siteCode}}</span>
              </div>
              <div class="panel-index">
                <!-- 污染物 -->
                <div class="index-l">
                  <ul>
                    <li><label>AQI：</label><strong>{{factorData.aqi}}</strong></li>
                    <li><label>首要污染物：</label>{{formatSubscript(factorData.primaryPollutant, true)}}</li>
                    <li><label>单位：</label>μg/m³</li>
                  </ul>
                </div>
                <!-- 污染因子 -->
                <div class="index-r">
                  <div class="index-item">
                    <dl class="mb_10">
                      <dt>PM₂.₅</dt>
                      <dd>
                        <h3><em class="num">{{factorData.pm25}}</em></h3>
                        <div class="rateBox">
                          <p class="rate"
                             :class="aqiColor.ztAirColorClass('pm25', factorData.pm25)"
                             :style="{'width': aqiColor.ztAirWeight('pm25', factorData.pm25) * 100 + '%'}">
                          </p>
                        </div>
                      </dd>
                    </dl>
                    <dl>
                      <dt>SO₂</dt>
                      <dd>
                        <h3><em class="num">{{factorData.so2}}</em></h3>
                        <div class="rateBox">
                          <p class="rate"
                             :class="aqiColor.ztAirColorClass('so2', factorData.so2)"
                             :style="{'width': aqiColor.ztAirWeight('so2', factorData.so2) * 100 + '%'}">
                          </p>
                        </div>
                      </dd>
                    </dl>
                  </div>
                  <div class="index-item">
                    <dl class="mb_10">
                      <dt>PM₁₀</dt>
                      <dd>
                        <h3><em class="num">{{factorData.pm10}}</em></h3>
                        <div class="rateBox">
                          <p class="rate"
                             :class="aqiColor.ztAirColorClass('pm10', factorData.pm10)"
                             :style="{'width': aqiColor.ztAirWeight('pm10', factorData.pm10) * 100 + '%'}">
                          </p>
                        </div>
                      </dd>
                    </dl>
                    <dl>
                      <dt>O₃</dt>
                      <dd>
                        <h3><em class="num">{{factorData.o3}}</em></h3>
                        <div class="rateBox">
                          <p class="rate"
                             :class="aqiColor.ztAirColorClass('o3', factorData.o3)"
                             :style="{'width': aqiColor.ztAirWeight('o3', factorData.o3) * 100 + '%'}">
                          </p>
                        </div>
                      </dd>
                    </dl>
                  </div>
                  <div class="index-item">
                    <dl class="mb_10">
                      <dt>CO(mg/m³)</dt>
                      <dd>
                        <h3><em class="num">{{factorData.co}}</em></h3>
                        <div class="rateBox">
                          <p class="rate"
                             :class="aqiColor.ztAirColorClass('co', factorData.co)"
                             :style="{'width': aqiColor.ztAirWeight('co', factorData.co) * 100 + '%'}">
                          </p>
                        </div>
                      </dd>
                    </dl>
                    <dl>
                      <dt>NO₂</dt>
                      <dd>
                        <h3><em class="num">{{factorData.no2}}</em></h3>
                        <div class="rateBox">
                          <p class="rate"
                             :class="aqiColor.ztAirColorClass('no2', factorData.no2)"
                             :style="{'width': aqiColor.ztAirWeight('no2', factorData.no2) * 100 + '%'}">
                          </p>
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <!-- 子类标签 -->
              <div class="sub-tab" style="padding-left: 0;">
                <span class="sub-tab-item" :class="{'cur' : chartType === '1'}" @click="chartType = '1'">气态物趋势图</span>
                <span class="sub-tab-item" :class="{'cur' : chartType === '2'}" @click="chartType = '2'">颗粒物趋势图</span>
              </div>
              <!-- 子类标签内容 -->
              <div class="sub-tab-content">
                <gas-air-chart :siteCode="siteCode" :dateType="dateType" style="width: 390px;height: 254px;"
                               v-if="chartType === '1'"
                               :type="type"
                               showTwoYAxisType="CO"
                ></gas-air-chart>
                <pm-air-chart :siteCode="siteCode" :dateType="dateType" style="width: 390px;height: 254px;"
                              showTwoYAxisType="CO"
                              :type="type"
                              v-if="chartType === '2'"></pm-air-chart>
              </div>
            </div>
            <!-- 分类内容-视频 -->
            <div class="tab-content" v-show="tabIndex === 2">
              <hb-video-tab v-show="showVideoTab"
                            @changeVideoData="handleChangeVideoData" :fId="params.fId" :code="params.code"
                            :type="params.type" :siteType="params.siteType"></hb-video-tab>
            </div>
            <!--分类内容-实时报警-->
            <div class="tab-content" v-show="tabIndex === 3">
              <alarm-list :params="alarmParams"></alarm-list>
            </div>
          </div>
        </zt-scrollbar>
      </div>
    </div>
    <trend-compare-panel ref="trendComparePanel" :params="params"></trend-compare-panel>
  </div>
</template>
<script>
  import moment from 'moment'
  import store from '@/store'
  import mapHttp from '@/https/map/mapHttp'
  import baseDialog from '@/map/dialog/base/baseDialog'
  import trendComparePanel from '@/map/dialog/_public/trendComparePanel.vue'
  import toolBtn from '@/map/dialog/_public/toolBtn.vue'
  import GasAirChart from '@/components/_public/zt/chart/gasAirChart'
  import PmAirChart from '@/components/_public/zt/chart/pmAirChart'
  import {formatSubscript} from '@/utils/util'
  import aqiColor from '@/utils/aqiColor'
  import {objectAssign} from '@/utils/util'
  import hbVideoTab from '@/components/_public/hbVideoTab.vue'
  import mapUtil from '@/map/js/util/mapUtil'
  import alarmList from '@/map/dialog/_public/alarmList'
  export default {
    name: 'station-monitor-panel',
    components: {
      PmAirChart, GasAirChart, trendComparePanel, toolBtn, hbVideoTab, alarmList
    },
    mixins: [baseDialog],
    data () {
      return {
        moment,
        formatSubscript,
        aqiColor,
        tabIndex: 1,
        dateType: 'hour',
        detailData: {},
        factorData: {},
        chartType: '1', // 1: 气态 2:颗粒物
        params: {},
        trendCompareVisible: false,
        showVideoTab: false,
        typeVideo: 't_maw_airmonitoring_info.fid',
        hidePlane: false,
        smallpagination: false,
        alarmParams: {},
        showGasWan: true,
        videoType: mapUtil.videoType.bzz
      }
    },
    created(){
      this.alarmParams = {
        siteCode: this.siteCode,
        type: this.type,
      }
    },
    mounted(){
      this.tabIndex = 1;
      this.showVideoTab = false
      this.params = {
        code: this.siteCode,
        type: this.type,
        siteType: this.siteType
      };
      this.getData();
      if (this.showVideo) {
        this.tabIndex = 2;
      }
      if (this.showWarnTab) {
        this.tabIndex = 3;
      }
    },
    methods: {
      justiceShowVideoTab(){
        if (this.showVideo) {
          this.tabIndex = 2;
          this.showVideoTab = true
        }
      },
      justClosedPlane(){
        this.hidePlane = false
      },
      closedPlaneAndEndRelated () {
        let parentId = this.$el.parentNode.id
        if ('primary' === parentId) {
          this.$mapEvtBus.$emit(mapUtil.EVT_NAME.map_endAnalysis, {})
        }
        this.hidePlane = false
      },
      getData () {
        const params = {
          siteCode: this.siteCode,
          type: this.type,
          dateType: this.dateType
        };
        Promise.all([mapHttp.siteDetail({
          siteCode: this.siteCode,
          type: this.type
        }), mapHttp.getStationDetail(params)]).then(responses => {
          this.detailData = responses[0].result;
          objectAssign(this.params, this.detailData);
          this.hidePlane = true;
          this.justiceShowVideoTab();
          this.$nextTick(() => {
            this.$refs.toolBtn.updateParams();
            this.$refs.trendComparePanel.initSelectedList();
          });
          this.factorData = responses[1].result;
        })
      },
      // 处理趋势对比
      handleTrendCompare () {
        this.$refs.trendComparePanel.show();
      },
      handleChangeVideoData(flag){
        this.showVideoTab = flag;


      },
    },
    watch: {
      tabIndex(){
        this.$nextTick(() => {
          this.$refs.scrollBar && this.$refs.scrollBar.update();
        })
      },
    }
  }
</script>
<style scoped>
  .tab-item {
    position: relative;
  }

  .tab-item a {
    font-size: 36px;
    font-weight: bold;
    color: #f40;
    position: absolute;
    top: -7px;
    left: -4px;
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

  .pagination {
    padding-left: 0;
    padding-right: 0;
    text-align: center;
  }

  .pagination button.btn-prev {
    margin-right: 5px;
  }

  .pagination button.btn-next {
    margin-left: 5px;
  }
</style>
