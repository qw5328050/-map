<template>
  <div class="point-info-wrapper" v-if="visible && hidePlane">
    <a class="close-detail-btn" @click="justClosedPlane"><span class="iconfont" @click="justClosedPlane">&#xe601;</span></a>
    <div class="point-info-detail">
      <!-- 头部信息 -->
      <ea-base-info :id="id" :name="name"></ea-base-info>
      <!-- 分类信息 -->
      <div class="classification-info">
        <!-- 分类 -->
        <div class="tab-wrapper">
          <span class="tab-item cur">用电量监测</span>
        </div>
        <!-- 分类内容-实时监控 -->
        <div class="tab-content">
          <!-- 表格信息 -->
          <div class="panel-table-heaer">
            <div class="time-search form-inline">
              <div class="form-group">
                <label>起始日期：</label>
                <zt-date-picker style="width:120px;" v-model="startTime"
                                :not-after="notAfter" type="date"></zt-date-picker>
                至
                <zt-date-picker style="width:120px;" v-model="endTime"
                                :not-after="notAfter" type="date"></zt-date-picker>
                <zt-button type="primary" @click="handleSearch">查询</zt-button>
              </div>
            </div>
          </div>
          <!-- 子类标签 -->
          <zt-rolling-label :labelList="labelList" @change="handleSelectedFactor"></zt-rolling-label>
          <!-- 子类标签内容 -->
          <div class="sub-tab-content">
            <div ref="chart" class="chart" style="height: 330px;">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/jsx">
  import lineCharts from '@/chart/lineCharts'
  import mapDialogHttp from '@/https/map/mapDialogHttp'
  import baseDialog from '../base/baseDialog'
  import eaBaseInfo from './eaBaseInfo.vue'
  import moment from 'moment'
  export default{
    components: {
      eaBaseInfo
    },
    data(){
      return {
        //滚动条数据
        labelList: [],
        //统计图数据缓存
        chartData: [],
        startTime: '',
        endTime: '',
        notAfter: '',
        hidePlane: false
      }
    },
    created(){
      this.labelList = [];
      //统计图数据缓存
      this.chartData = [];
      this.startTime = moment().format('YYYY-MM-DD');
      this.endTime = moment().format('YYYY-MM-DD');
      this.notAfter = moment(new Date()).format('YYYY-MM-DD');
    },
    mounted(){
      this.$nextTick(() => {
        this.handleSearch();
      })
    },
    mixins: [baseDialog],
    methods: {
      justClosedPlane(){
        this.hidePlane = false
      },
      handleSearch(){
        mapDialogHttp.useEleInfo({
          entId: this.id,
          startTime: this.startTime,
          endTime: this.endTime
        }).then(result => {
          this.hidePlane = true;
          const resultData = result.data;
          if (resultData && resultData.length > 0) {
            this.labelList = [];
            resultData.forEach(item => {
              this.labelList.push({
                name: item.name
              });
            });
            this.chartData = resultData;
          }
        })
      },
      handleSelectedFactor(item){
        //更新数据
        const selectedLabel = item.name;
        this.chartData.some((currentValue) => {
          if (currentValue.name === selectedLabel) {
            if (currentValue.resultList && currentValue.resultList.length > 0) {
              const options = lineCharts.getMultiLineCharts(currentValue.resultList);
              const chartObj = this.$echarts.init(this.$refs.chart);
              chartObj.setOption(options);
            }
          }
          return currentValue.name === selectedLabel;
        });
      }
    },
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
  .iconfont{
    font-size: 12px;
    font-weight: bold;
  }
  .close-detail-btn:hover {
    background: #fff;
    border-radius: 50%;
    color: #ccc;
  }
</style>

