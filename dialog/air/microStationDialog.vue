<template>
  <!-- 微站站点监控信息 -->
  <div v-if="visible && hidePlane">
    <div class="point-info-wrapper">
      <a class="close-detail-btn" @click="closedPlaneAndEndRelated"><span class="iconfont"
                                                                 @click="closedPlaneAndEndRelated">&#xe601;</span></a>
      <div class="point-info-detail">
        <!-- 头部信息 -->
        <header class="header-info">
          <!--<a href="javascript:void(0)" class="detail-btn"><em class="iconfont">&#xe672;</em>详情</a>-->
          <h3 class="name">{{detailData.siteName}}</h3>
          <p>
            <span class="fl">{{detailData.conLevel}}站点</span>
            <span class="fr">{{detailData.divName}} {{detailData.streetName}}</span>
          </p>
        </header>
        <!-- 基础信息 -->
        <zt-scrollbar class="ps" :style="{'max-height': documentClientHeight + 'px'}">
          <div class="base-info-list">
            <ul>
              <tool-btn ref="toolBtn" :params="params" @trendClick="handleTrendCompare"></tool-btn>
              <li v-if="detailData.address" class="text-ellipsis width380"><em class="iconfont address">&#xe606;</em>{{detailData.address}}
              </li>
              <li class="contact-info" v-if="detailData.linkMan || detailData.phone">
                <span class="contact-item" v-if="detailData.linkMan" title="环保联系人"><em class="iconfont user">&#xe66b;</em>{{detailData.linkMan}}</span>
                <span class="contact-item" v-if="detailData.phone" title="联系电话"><em class="iconfont tel">&#xe66d;</em>{{detailData.phone}}</span>
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
            </div>
            <!-- 分类内容-实时监控 -->
            <div class="tab-content" v-show="tabIndex === 1" key="1">
              <!-- 表格信息 -->
              <div class="panel-table-heaer">
                <time>
                  {{detailData.time ? moment(new Date(detailData.time.replace(/-/g, '/'))).format('MM月DD日HH点') : ''}}
                  <em class="label ml_5" :class="aqiColor.ztAirColorClass('pm10', detailData.pm10)">
                    {{aqiColor.ztAirLabelValue('pm10', detailData.pm10)}}
                  </em>
                </time>
                <span class="site">站点编号：{{detailData.code}}</span>
              </div>
              <!-- 其他监测数据 -->
              <div class="monitoring-data">
                <!-- 污染物 -->
                <div class="pollutant">
                  <div class="pollutant-item">
                    <label>PM₁₀：</label>
                    <div class="num">
                      <strong class="red">{{detailData.pm10}}</strong>
                      <span class="sup">μg/m³&nbsp;&nbsp;</span>
                    </div>
                  </div>
                  <div class="pollutant-item">
                    <label>PM₂.₅：</label>
                    <div class="num">
                      <strong class="red">{{detailData.pm25}}</strong>
                      <span class="sup">μg/m³&nbsp;&nbsp;</span>
                    </div>
                    <!-- <p>首要污染物:PM10</p> -->
                  </div>

                </div>
                <!-- 数据 -->
                <div class="data-list">
                  <table class="table-info gray-th" v-if="isAllZero">
                    <tbody>
                    <tr>
                      <th width="25%;" class="th">气压(kPa)</th>
                      <td width="25%;">{{ !isNaN(detailData.airPressure) && detailData.airPressure !== 0 ? detailData.airPressure / 1000 : '--'}}</td>
                      <th width="25%;" class="th">温度(℃)</th>
                      <td width="25%;">{{detailData.temperature !== 0 ? detailData.temperature : '--'}}</td>
                    </tr>
                    <tr>
                      <th class="th">湿度</th>
                      <td>{{detailData.humidity !== 0 ? detailData.humidity + '%' : '--'}}</td>
                      <th class="th">风速</th>
                      <td>{{detailData.windSpeed !== 0 ? detailData.windSpeed + '级' : '--'}}</td>
                    </tr>
                    <tr>
                      <th class="th">风向</th>
                      <td colspan="3">{{detailData.windDirection !== 0 ? detailData.windDirection : '--'}}</td>
                    </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <pm-chart :code="code" :dateType="dateType" style="width: 390px;height: 254px;"></pm-chart>
            </div>
            <!-- 分类内容-视频 -->
            <div class="tab-content" v-show="tabIndex === 2" key="2">
              <hb-video-tab v-show="showVideoTab"
                            @changeVideoData="handleChangeVideoData" :fId="params.fId"
                            :type="params.type"></hb-video-tab>
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
  import mapHttp from '@/https/map/mapHttp'
  import baseDialog from '@/map/dialog/base/baseDialog'
  import aqiColor from '@/utils/aqiColor'
  import PmChart from '@/components/_public/zt/chart/pmChart'
  import toolBtn from '@/map/dialog/_public/toolBtn.vue'
  import trendComparePanel from '@/map/dialog/_public/trendComparePanel.vue'
  import {objectAssign} from '@/utils/util'
  import hbVideoTab from '@/components/_public/hbVideoTab.vue'
  import mapUtil from '@/map/js/util/mapUtil'

  export default {
    name: 'micro-station-monitor-panel',
    components: {PmChart, toolBtn, trendComparePanel, hbVideoTab},
    mixins: [baseDialog],
    data () {
      return {
        moment,
        aqiColor,
        tabIndex: 1,
        detailData: {},
        dateType: 'hour',
        params: {},
        showVideoTab: false,
        hidePlane: false,
        videoType: mapUtil.videoType.weiz
      }
    },
    created () {
      this.tabIndex = 1;
      this.showVideoTab = false;
      this.params = {
        code: this.code,
        type: this.type
      };
      this.getData();
      if (this.showVideo) {
        this.tabIndex = 0;
      }
    },
    computed: {
      isAllZero () {
        if (this.detailData.airPressure == 0 && this.detailData.temperature == 0 && this.detailData.humidity == 0 && this.detailData.windSpeed == 0 && this.detailData.windDirection == 0) {
          return false
        } else {
          return true
        }
      }
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
        if (this.showVideo) {
          this.tabIndex = 2;
          this.showVideoTab = true
        }
      },
      getData () {
        const params = {
          code: this.code,
          dateType: this.dateType
        };
        mapHttp.getMicroStationDetail(params).then((res) => {
          if(!res.result){
            return;
          }
          this.detailData = res.result;
          objectAssign(this.params, this.detailData);
          this.hidePlane = true;
          this.justiceShowVideoTab();
          this.$nextTick(() => {
            this.$refs.toolBtn.updateParams();
            this.$refs.trendComparePanel.initSelectedList();
          })
        })
      },
      emitNearbySearch () {
        let obj = {
          lng: this.detailData.lng,
          lat: this.detailData.lat,
          name: this.detailData.name,
          divisionCode: this.detailData.divCode
        }
        this.$eventHub.$emit(this.constants.event_name.show_nearby_search_panel, obj)
      },
      emitRelateSearch () {
        let obj = {}
        this.$eventHub.$emit(this.constants.event_name.show_relate_search_panel, obj)
      },
      //处理趋势对比
      handleTrendCompare () {
        this.$refs.trendComparePanel.show();
      },
      handleChangeVideoData(flag){
        this.showVideoTab = flag;
      }
    }
  }
</script>
<style>
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
