<template>
  <div v-if="visible && hidePlane">
    <div class="point-info-wrapper">
      <a class="close-detail-btn" @click="closedPlaneAndEndRelated"><span class="iconfont"
                                                                 @click="closedPlaneAndEndRelated">&#xe601;</span></a>
      <div class="point-info-detail">
        <!-- 头部信息 -->
        <header class="header-info">
          <span class="fr" style="margin-top:8px;">{{'路段号：' + info.code}}</span>
          <h3 class="name">{{info.name}}</h3>
          <p>
            <span class="fl">{{info.roadType}}</span>
            <span class="fr">{{info.region}}</span>
          </p>
        </header>
        <zt-scrollbar class="ps" :style="{'height': documentClientHeight + 'px'}">
          <!-- 基础信息 -->
          <div class="base-info-list">
            <ul>
              <li>
              <tool-btn ref="toolBtn" :params="info" @trendClick="handleTrendCompare"></tool-btn>
              </li>
              <li><em class="iconfont address">&#xe606;</em>{{'起点：' + info.startPoint}}</li>
              <li><em class="iconfont address">&#xe606;</em>{{'终点：' + info.endPoint}}</li>
              <li>{{'长度：' + info.length/1000 + '公里'}}</li>
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
                <time>{{info.time}}</time>
              </div>

              <!-- 其他监测数据 -->
              <div class="monitoring-data">
                <!-- 污染物 -->
                <div class="pollutant">
                  <div class="pollutant-item" style="width: 48%;">
                    <label>PM₁₀：</label>
                    <div class="num">
                      <strong class="red">{{info.pm10}}</strong>
                      <span class="sup">μg/m³&nbsp;&nbsp;</span>
                    </div>
                    <color-label factor="pm10" :value="info.pm10"></color-label>
                  </div>
                  <div class="pollutant-item" style="width: 48%;">
                    <label>PM₂.₅：</label>
                    <div class="num">
                      <strong class="red">{{info.pm25}}</strong>
                      <span class="sup">μg/m³&nbsp;&nbsp;</span>
                    </div>
                    <color-label factor="pm25" :value="info.pm25"></color-label>
                  </div>
                </div>
              </div>
              <!-- 子类标签内容 -->
              <div class="sub-tab-content">
                <div v-zt-empty-chart="emptyChart" ref="chart" class="chart" style="height: 300px;">
                </div>
              </div>
            </div>
            <div class="tab-content" v-show="tabIndex === 2" key="2">
              <hb-video-tab v-show="showVideoTab"
                            @changeVideoData="handleChangeVideoData"
                            :fId="info.fId" :type="type"></hb-video-tab>
            </div>
          </div>
        </zt-scrollbar>
      </div>
    </div>
    <trend-compare-panel ref="trendComparePanel" :params="info"></trend-compare-panel>
  </div>
</template>

<script type="text/jsx">
  import lineCharts from '@/chart/lineCharts'
  import mapDialogHttp from '@/https/map/mapDialogHttp'
  import baseDialog from '../base/baseDialog'
  import moment from 'moment'
  import {objectAssign} from '@/utils/util'
  import chart from '@/chart/pmLineCharts'
  import toolBtn from '@/map/dialog/_public/toolBtn.vue'
  import colorLabel from '@/map/dialog/_public/colorLabel.vue'
  import trendComparePanel from '@/map/dialog/_public/trendComparePanel.vue'
  import hbVideoTab from '@/components/_public/hbVideoTab.vue'
  import mapUtil from '@/map/js/util/mapUtil'

  export default{
    name: 'roadDialog',
    components: {
      colorLabel,
      trendComparePanel,
      toolBtn,
      hbVideoTab
    },
    data(){
      return {
        info: {
          code: '',
          type: '',
          roadType: '',
          pm25: '',
          startPoint: '',
          endPoint: '',
          length: '',
          pm10: '',
          time: '',
          region: '',
          name: ''
        },
        tabIndex: 1,
        emptyChart: false,
        echartsObj: null,
        showVideoTab: false,
        hidePlane: false
      }
    },
    created(){
      this.info = {
        code: this.code,
        type: this.type,
        dateType: this.dateType,
        roadType: '',
        pm25: '',
        startPoint: '',
        endPoint: '',
        length: '',
        pm10: '',
        time: '',
        region: '',
        name: ''
      };
      this.emptyChart = false;
      this.tabIndex = 1;
      this.showVideoTab = false;
    },
    mixins: [baseDialog],
    mounted(){
      this.$nextTick(() => {
        this.showRoadDetail();
        this.showChart();
      })
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
      showRoadDetail(){
        mapDialogHttp.getRoadDetail({
          code: this.code,
          dateType: this.dateType
        }).then(result => {
          objectAssign(this.info, result.data);
          this.hidePlane = true;
          this.$nextTick(() => {
            this.$refs.toolBtn.updateParams();
            this.$refs.trendComparePanel.initSelectedList();
          })

        })
      },
      showChart(){
        mapDialogHttp.getRoadHis({
          dateType: this.dateType,
          code: this.code
        }).then(result => {
          if (!this.echartsObj) {
            this.echartsObj = this.$echarts.init(this.$refs.chart);
          }
          this.echartsObj.clear();
          if (result.data.length === 0) {
            this.emptyChart = true;
            return;
          }
          const options = chart.getPmLineCharts({
            data: result.data,
            dateType: this.dateType
          });
          options.grid = {
              x: 40,
              x2: 40, // 200
              y: 50,
              y2: 50
          }
          this.echartsObj.setOption(options);
        })
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

