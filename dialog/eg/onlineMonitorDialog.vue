<template>
  <div class="point-info-wrapper" v-if="visible && hidePlane">
    <a class="close-detail-btn" @click="justClosedPlane"><span class="iconfont" @click="justClosedPlane">&#xe601;</span></a>
    <div class="point-info-detail">
      <!-- 头部信息 -->
      <ea-base-info :id="id" :name="name"></ea-base-info>
      <!-- 分类信息 -->
      <div v-show="showData" class="classification-info">
        <!-- 分类 -->
        <div class="tab-wrapper">
          <span class="tab-item cur">实时监控</span>
        </div>
        <!-- 分类内容-实时监控 -->
        <div class="tab-content">
          <!-- 子类标签 -->
          <zt-rolling-label :labelList="labelList" @change="handleSelectedSite"></zt-rolling-label>
          <!-- 表格信息 -->
          <div class="panel-table-heaer">
            <time>{{monitorTime}}<em class="label pollute-fine ml_5">{{operateStatus}}</em></time>
          </div>
          <div class="panel-table">
            <zt-table :data="realTimeList" ref="diaTable">
              <zt-column prop="item" width="100" label="控制指标">
              </zt-column>
              <zt-column prop="density" width="90" label="监测值">
                <template slot-scope="scope">
                  <span class="label" style="color: black">{{scope.row.density}}</span>
                </template>
              </zt-column>
              <zt-column prop="standard" label="标准值"></zt-column>
              <zt-column prop="en" label="超标倍数" width="100"></zt-column>
            </zt-table>
          </div>
          <!-- 子类标签内容 -->
          <div class="sub-tab-content">
            <div ref="chart" class="chart" style="height:210px;">
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
        cacheData: [],
        realTimeList: [],
        labelList: [],
        chartData: [],
        lineCharts: null,
        monitorTime: '',
        siteName: '',
        operateStatus: '',
        hidePlane: false,
        showData: false
      }
    },
    created(){
      this.cacheData = [];
      this.realTimeList = [];
      this.labelList = [];
      this.chartData = [];
      this.lineCharts = null;
      this.monitorTime = '';
      this.siteName = '';
      this.operateStatus = '';
    },
    mixins: [baseDialog],
    mounted(){
      this.getRealTimeList();
      this.showSevenDayMonitor();
    },
    methods: {
      justClosedPlane(){
        this.hidePlane = false
      },
      handleClick(){
        alert('弹框中的事件');
      },
      getRealTimeList(){
        mapDialogHttp.realTimeMonitor({
          entId: this.id
        }).then(result => {
          if(result.data.length > 0){
            this.showData = true
         }
          this.hidePlane = true;
          this.cacheData = result.data;
          this.updateLabelList(result.data);
          this.monitorTime = moment(response.result.monitorTime).format('MM月DD日HH点')
        })
      },
      updateLabelList(data){
        this.labelList = [];
        data.forEach(item => {
          this.labelList.push({
            siteId: item.siteId,
            code: item.siteId,
            name: item.siteName
          })
        })
      },
      showSevenDayMonitor(siteId){
        mapDialogHttp.sevenDayMonitor({
          entId: this.id,
          siteId: siteId
        }).then(result => {
          if (result.data && result.data.length > 0) {
            const chartData = [];
            result.data.forEach(item => {
              const dataItem = {
                name: item.name,
                resultList: []
              };
              item.resultList.forEach(detailItem => {
                if (detailItem.monitorTime) {
                  dataItem.resultList.push({
                    time: detailItem.monitorTime.substr(0, 13) + '时',
                    value: detailItem.monitorData
                  })
                }
              });
              chartData.push(dataItem);
            });
            const options = lineCharts.getLineCharts(chartData);
            options.grid = {
              left: 50,
              right: 30,
              top: 50,
              bottom: 30
            }
            const eCharts = this.$echarts.init(this.$refs.chart);
            eCharts.setOption(options);
          }
        })
      },
      handleSelectedSite(siteInfo){
        this.cacheData.some(item => {
          if (item.siteId === siteInfo.siteId) {
            item.monitorData.forEach(item2=>{
              item2.item = item2.item.split('(')[0];
            });
            this.realTimeList = item.monitorData;
            if(item.operateStatus === 'normal'){
              this.operateStatus = '正常';
            }else if(item.operateStatus === 'offLine'){
              this.operateStatus = '离线';
            }else{
              this.operateStatus = '超标';
            }
            this.monitorTime = item.monitorTime.substr(0, 13) + '时';
            this.siteName = item.siteName;
            this.showSevenDayMonitor(siteInfo.siteId);
            return true;
          } else {
            return false;
          }
        })
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

