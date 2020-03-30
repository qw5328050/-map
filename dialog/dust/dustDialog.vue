<template>
  <div v-if="visible && hidePlane">
    <div class="point-info-wrapper">
      <a class="close-detail-btn" @click="justClosedPlane"><span class="iconfont"
                                                                 @click="justClosedPlane">&#xe601;</span></a>
      <div class="point-info-detail">
        <!-- 头部信息 -->
        <header class="header-info">
          <h3 class="name">{{info.name}}</h3>
          <p>
            <span class="fr">{{info.divName}}</span>
          </p>
        </header>
        <zt-scrollbar class="ps" :style="{'max-height': documentClientHeight + 'px'}">
          <!-- 基础信息 -->
          <div class="base-info-list">
            <ul>
              <tool-btn ref="toolBtn" :params="info" @trendClick="handleTrendCompare"></tool-btn>
            </ul>
          </div>
          <!-- 分类信息 -->
          <div class="classification-info">
            <!-- 分类 -->
            <div class="tab-wrapper">
              <span class="tab-item" v-if="showRealInfo"
                    :class="{'cur': tabIndex === 1}" @click="tabIndex = 1">实时监控</span>
              <span v-show="showVideoTab" class="tab-item" :class="{'cur': tabIndex === 3}"
                    @click="tabIndex = 3">视频</span>
              <!--<span v-show="showGridTab" class="tab-item" :class="{'cur': tabIndex === 2}"-->
              <!--@click="tabIndex = 2">网格监管</span>-->
            </div>
            <!-- 分类内容-实时监控 -->
            <div class="tab-content" v-show="showRealInfo && (tabIndex === 1)">
              <!-- 表格信息 -->
              <div class="panel-table-heaer">
                <time>时间：{{info.time}}<em class="label pollute-fine ml_5"
                  :class="handleStatusColor(info.status)">{{handleStatustext(info.status)}}</em>
                </time>
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
                  <div class="pollutant-item" v-if="info.type !== 'cgj-zgd'" style="width: 48%;">
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
              <div class="sub-tab-content" v-show="showChartFlag">
                <div ref="chart" class="chart" style="height: 330px;width:390px;">
                </div>
              </div>
            </div>
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
  import lineCharts from '@/chart/lineCharts'
  import mapDialogHttp from '@/https/map/mapDialogHttp'
  import baseDialog from '../base/baseDialog'
  import moment from 'moment'
  import colorLabel from '@/map/dialog/_public/colorLabel.vue'
  import {objectAssign} from '@/utils/util'
  import chart from '@/chart/pmLineCharts'
  import toolBtn from '@/map/dialog/_public/toolBtn.vue'
  import trendComparePanel from '@/map/dialog/_public/trendComparePanel.vue'
  import mapUtil from '@/map/js/util/mapUtil'
  import hbVideoTab from '@/components/_public/hbVideoTab.vue'

  export default{
    name: 'dustDialog',
    components: {
      toolBtn,
      trendComparePanel,
      colorLabel,
      hbVideoTab
    },
    data(){
      return {
        info: {
          code: '',
          divCode: '',
          divName: '',
          type: '',
          pm25: '',
          pm25Iaqi: '',
          pm10: '',
          pm10Iaqi: '',
          time: '',
          name: '',
          status: ''
        },
        showChartFlag: false,
        echartsObj: null,
        hidePlane: false,
        tabIndex: 1,
        showRealInfo: true,
        showVideoTab: false,
      }
    },
    created(){
      this.info = {
        code: this.itemData.code,
        type: this.itemData.type,
        divCode: '',
        divName: '',
        pm25: '',
        pm25Iaqi: '',
        pm10: '',
        pm10Iaqi: '',
        time: '',
        name: '',
        status: ''
      };
      this.showRealInfo = true;
      this.showChartFlag = false;
    },
    mixins: [baseDialog],
    mounted(){
      this.$nextTick(() => {
        this.showDetail();
        this.getRealTimeData();
        this.showChart();
      })
    },
    methods: {
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
      justiceShowVideoTab(){
        if (this.itemData.showVideo) {
          this.tabIndex = 3;
          this.showVideoTab = true
        }
      },
      handleChangeVideoData(flag){
        this.showVideoTab = flag;
      },
      justClosedPlane(){
        this.hidePlane = false
      },
      showDetail(){
        mapDialogHttp.getSopDetail({
          type: this.itemData.type,
          code: this.itemData.code,
          id: this.itemData.sopId === undefined ? '' : this.itemData.sopId
        }).then(result => {
          objectAssign(this.info, result.data);
          this.info.id = this.info.sopId = this.itemData.sopId;
          this.info.divCode = this.info.countyCode;
          this.info.type = this.itemData.type;
          this.hidePlane = true;
          this.$nextTick(() => {
            this.justiceShowVideoTab();
            this.$refs.toolBtn.updateParams();
            if (this.info.tabType.indexOf(mapUtil.tabType.qsdb) >= 0) {
              this.$refs.trendComparePanel.initSelectedList();
            }
          })

        })
      },
      getRealTimeData(){

        mapDialogHttp.getProjectDetailByCode({
          code: this.itemData.code,
          type: this.itemData.type
        }).then(result => {
          this.info.pm10 = result.data.pm10;
          this.info.pm25 = result.data.pm25;
          this.info.time = result.data.time;
          this.info.status = result.data.status;
//          objectAssign(this.info, result.data);
        })
      },
      showChart(){
        mapDialogHttp.getProjectHis({
          code: this.itemData.code,
          type: this.itemData.type
        }).then(result => {
          if (result.data.length > 0) {
            this.showChartFlag = true;
          } else {
            this.showChartFlag = false;
            return;
          }
          //道路扬尘曲线图，因为其只有pm10
           const chartData = [];
           const dataItem = {
                name: 'PM₁₀',
                resultList: []
              };
            result.data.forEach(item => {
                  dataItem.resultList.push({
                    time: item.time,
                    value: item.pm10
                  })
            });
          chartData.push(dataItem);
          if (!this.echartsObj) {
            //console.log(this.$refs.chart)
            this.echartsObj = this.$echarts.init(this.$refs.chart);
          }
          this.echartsObj.clear();

        let type = this.itemData.type;
        if(type == 'cgj-zgd'){
         const options = lineCharts.getLineCharts(chartData);
         this.echartsObj.setOption(options);
        }else{
        const options = chart.getPmLineCharts({
            data: result.data,
            dateType: ''
          });
          this.echartsObj.setOption(options);
      }
       })
      },
      //处理趋势对比
      handleTrendCompare () {
        this.$refs.trendComparePanel.show();
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

