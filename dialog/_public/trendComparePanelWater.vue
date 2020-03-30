<template>
  <!-- 趋势对比 -->
  <div v-zt-dialog-drag>
    <div class="comparison zt-drag-dialog"
         style="">
      <!-- 选择对比对象 -->
      <div class="select-region" v-show="showChoosePanel">
        <!-- 头部区域 -->
        <header style="cursor: move;"
                class="zt-drag-dialog-header">选择对比对象
          <a href="#" @click.stop.prevent="handleClose"
             class="iconfont close-comparison">&#xe601;</a>
        </header>
        <div class="comparison-content" style="padding:4px">
          <div class="time-pick">
            <div class="form-inline">
              <zt-date-picker style="width:120px;" :clearable="false" v-model="endDay"
                              :not-after="notAfter" type="date"></zt-date-picker>
              <zt-dict-select :itemCode="constants.trend_time_frequency"
                              v-model="dateType"></zt-dict-select>
            </div>
          </div>
          <dl v-for="item in selectedList" class="comparison-list">
            <dt>{{item.name}}</dt>
            <dd>
              <a href="#" class="iconfont del-comparison"
                 v-if="!item.notDelete"
                 @click.stop.prevent="handleDelete(item)">&#xe601;</a>
            </dd>
          </dl>
          <!--<dl v-for="item in selectedList" class="comparison-list">-->
          <!--<dt>{{item.name}}</dt>-->
          <!--<dd>-->
          <!--<zt-date-picker style="width:120px;" :clearable="false" v-model="item.time"-->
          <!--:not-after="notAfter" type="date"></zt-date-picker>-->
          <!--<a href="#" class="iconfont del-comparison"-->
          <!--v-if="!item.notDelete"-->
          <!--@click.stop.prevent="handleDelete(item)">&#xe604;</a>-->
          <!--</dd>-->
          <!--</dl>-->
          <trend-search-input ref="searchInput" v-show="searchInput" :params="params"
                              @input="handleAdd"></trend-search-input>
          <div class="btn-wrapper">
            <a href="#" @click.stop.prevent="showChart" class="btn btn-warning">开始对比</a>
            <a href="#" @click.stop.prevent="handleClearSelected" class="btn btn-default btn-sm empty-btn">清空</a>
          </div>
        </div>
      </div>
      <!-- 趋势对比 -->
      <div class="comparison-trend" v-show="showChartPanel"
           :style="{width: comparisonTrendPanelWidth}">
        <!-- 头部区域 -->
        <header style="cursor: move;"
                class="zt-drag-dialog-header">趋势对比<a href="#"
                                                     @click.stop.prevent="handleClose"
                                                     class="iconfont close-comparison">&#xe601;</a>
        </header>
        <trend-tab :dataList="tabList" @change="handleFactorChange"></trend-tab>
        <div class="comparison-content">
          <section class="form-inline">
            <!--<div class="form-group">-->
            <!--<label>数据频率：</label>-->
            <!--<zt-dict-select :itemCode="constants.trend_time_frequency"-->
            <!--v-model="dateType"-->
            <!--@change="showChart"></zt-dict-select>-->
            <!--</div>-->
          </section>
          <!-- 对比图 -->
          <div ref="parentChart" class="chart">
            <div ref="chart" style="width: 100%;height: 294px;"></div>
          </div>
          <div class="loading-bg" v-if="loading"><span class="spinner-loader">Loading</span></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/jsx">
  import moment from 'moment'
  import {getDictListByKey} from '@/components/_public/zt//dictionary/index'
  import trendTab from './trendTab.vue'
  import trendSearchInput from './trendSearchInputWater.vue'
  import mapLayerHttp from '@/https/map/mapLayerHttp'
  import factor from '@/utils/factor'
  import {
    objectAssign,
    chartsStartIndex, formatUnit, ztGetYMaxData,
    formatYMax100, chartsNoDataHtml, getMax, getStartEndTime
  } from '@/utils/util'

  export default {
    components: {
      trendTab,
      trendSearchInput
    },
    props: {
      params: Object
    },
    data(){
      let now = moment(new Date())
//      let hour = now.hours()
//      let initPDay = hour >= 20 ? now.format('YYYY-MM-DD') : now.subtract(1, 'days').format('YYYY-MM-DD')
      let initPDay = now.subtract(1, 'days').format('YYYY-MM-DD')
      let initPDayTime = now.subtract(1, 'days').format('YYYY-MM-DD HH:mm:ss')
      let initNotAfter = moment(initPDay).add(1, 'days').format('YYYY-MM-DD')
      return {
        showChoosePanel: false,
        showChartPanel: false,
        tabList: [],
        selectedList: [],
        notAfterTime: initPDayTime,
        notAfter: initNotAfter,
        endDay: initNotAfter,
        //数据频率
        dateType: '',
        factorName: '',
        factorLabel: '',
        searchInput: true,
        chart: null,
        loading: true,
        time: moment(new Date()).format('YYYY-MM-DD'),
        stationType: '',
        stationTypeObj: {
          air: ['guok', 'shengk', 'shik'],
          water: ['hldm'],
        },
        stationFacotrObj: {
          air: [{type: 'aqi', name: 'AQI'}, {type: 'pm10', name: 'PM₁₀'}, {type: 'pm25', name: 'PM₂.₅'},
            {type: 'so2', name: 'SO₂'}, {type: 'no2', name: 'NO₂'}, {type: 'co', name: 'CO'}, {
              type: 'o3',
              name: 'O₃'
            },],
          water: [{type: 'codCr', name: '化学需氧量'}, {type: 'nh3', name: '氨氮'},
            {type: 'tp', name: '总磷'}, {type: 'waterTemp', name: '温度'},
            {type: 'cond', name: '电导率'}, {type: 'turb', name: '浊度'},
            {type: 'o2', name: '溶解氧'}, {type: 'ph', name: 'PH'},],
        },
        comparisonTrendPanelWidth: 0,
      }
    },
    mounted(){
      let dateTypeList = getDictListByKey(this.constants.trend_time_frequency);
      if (dateTypeList && dateTypeList.length > 0) {
        this.dateType = dateTypeList[0].code;
      }
      this.getType();
    },
    methods: {
      getType(){
        this.stationType = this.params.type;
        let matchedKey = '';
        for (let key in this.stationTypeObj) {
          for (let factorKey of this.stationTypeObj[key]) {
            if (this.stationType === factorKey) {
              matchedKey = key;
              break;
            }
          }
        }
        this.tabList = this.stationFacotrObj[matchedKey];
        this.factorName = this.tabList[0].type;
        this.factorLabel = this.tabList[0].name;
        this.computePanelWidth(this.tabList);
      },
      // 根据因子字数多少决定页面元素宽度
      computePanelWidth(tabList){
        let SINGLE_CHAR_WIDTH = 25;
        console.log('SINGLE_CHAR_WIDTH', SINGLE_CHAR_WIDTH);
        let charNum = 0;
        if (tabList && tabList.length) {
          tabList.map(item => {
            charNum += item.name.length;
          });
        }
        this.comparisonTrendPanelWidth = (charNum * SINGLE_CHAR_WIDTH) + 'px';
      },
      initSelectedList(){
        let selfItem = {
          code: this.params.siteCode,
          name: this.params.siteName,
          type: this.params.type.split(',')[0]
        };
        selfItem.time = moment().subtract(7, 'days').format('YYYY-MM-DD');
        selfItem.notDelete = true;
        this.selectedList.push(selfItem);
      },
      show(){
        this.showChoosePanel = true;
        this.showChartPanel = false;
      },
      handleClose(){
        this.showChoosePanel = false;
        this.showChartPanel = false;
      },
      //切换因子
      handleFactorChange(item){
        this.factorName = item.type;
        this.factorLabel = item.name;
        this.showChart();
      },
      //显示统计图
      showChart(){
        if (this.selectedList.length <= 1) {
          this.$ztAlert('请至少选择一条对比对象');
          return;
        }
        this.showChoosePanel = false;
        this.showChartPanel = true;
        const params = this.getChartParams();
        mapLayerHttp.getContrastResult(params).then(response => {
          if (!this.chart) {
            this.chart = this.$echarts.init(this.$refs.chart);
          }
          this.chart.clear();
          this.loading = false;
          if (response.result && response.result.length > 0) {
            let options = this.getChartOptions(response.result);
            this.chart.setOption(options);
          } else {
            this.$refs.chart.html(`<div ref="chart" style="width: 437px;height: 244px;">无统计数据</div>`);
            this.chart = null;
          }
        }).catch(reason => {
          this.loading = false
        });
        this.loading = true
      },
      getChartParams(){
        const params = {
          factorCode: this.factorName,
          dateType: this.dateType,
          contrastList: []
        };

        var searchTime
        var time
        if (this.dateType === 'hour') {
          searchTime = 7
          time = moment(this.endDay).subtract(searchTime, 'days').add(1, 'days').format('YYYY-MM-DD')
        } else if (this.dateType === 'day') {
          searchTime = 30
          time = moment(this.endDay).subtract(searchTime, 'days').format('YYYY-MM-DD')
        }else if(this.dateType === 'month'){
          searchTime = 6
          time = moment(this.endDay).subtract(searchTime, 'months').format('YYYY-MM-DD')
        }``
        params.time = this.endDay;
        let typeText = '';
        for (let key in this.stationTypeObj) {
          let stationTypeList = this.stationTypeObj[key];
          if (stationTypeList.indexOf(this.stationType) > -1) {
            typeText = stationTypeList.join(',');
          }
        }

        this.selectedList.forEach(item => {
          params.contrastList.push({
            code: item.code,
            name: item.name,
            time: time,
            type: typeText
          });
        });
        return params;
      },
      //加入选择内容
      handleAdd(item){
        if (this.selectedList.length >= 6) {
          this.$ztAlert('比较不能超过6个');
          return;
        }
        // item.time = this.notAfter
        this.selectedList.push(item);
        if (this.selectedList.length === 6) {
          this.searchInput = false;
        }
      },
      handleDelete(item){
        let index = this.selectedList.indexOf(item);
        this.selectedList.splice(index, 1);
        if (this.selectedList.length < 6) {
          this.searchInput = true;
        }
      },
      handleClearSelected(){
        this.selectedList.splice(1, this.selectedList.length - 1);
        this.searchInput = true;
      },
      getChartOptions(data){
        const dataZoomColors = [
          '#333333',
          '#1396F2'
        ]
        const self = this;
        let legend = {
          top: 0,
          data: []
        };

        let xAxis = {
          type: 'category',
          boundaryGap: false,
          data: [],
          axisPointer: {
            type: 'shadow'
          },
          axisLabel: {
            textStyle: {
              color: '#78a9d5'
            },
            interval: 'auto'
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
        };
        data[0].resultList.forEach(item => {
          xAxis.data.push(this.getDateFormat(item.time));

        });
        var start = 50
        let series = [];
        data.forEach((item, index) => {
          legend.data.push(item.name);
          let seryData = {
            name: item.name,
            type: 'line',
            data: [],
            index: index
          };
          series.push(seryData);
          item.resultList.forEach((valueItem, i) => {
            seryData.data.push(valueItem[this.factorName]);
          })
        });
        let colors = ['#f49f42', '#01c300', '#73b9bc', '#91ca8c', '#40c9e7', '#eedd78', '#7289ab'];
        const options = {
          color: colors,
          title: {
            left: 'center',
          },
          tooltip: {
            trigger: 'axis',
            formatter: function (params) {
              let dataArray = [];
              if (params.length === 0) {
                return '<div></div>';
              }
              let dataIndex = params[0].dataIndex;
              params.forEach((item, index) => {
                let tooltipValue = item.value;
                if (tooltipValue === 'undefined') {
                  tooltipValue = '无数据';
                }
                let time = data[index]['resultList'][dataIndex].time;
                let formatTime = self.getDateFormat(time);
                let str = `<span style="display:inline-block;margin-right:5px;
                  border-radius:10px;width:9px;background-color:${item.color};
                  height:9px;"></span>${ item.seriesName} : (${formatTime}) ${tooltipValue}`;
                if (index !== (params.length - 1)) {
                  str += '<br/>';
                }
                dataArray.push(str);
              });
              return dataArray.join('');
            }
          },
          grid: {
            left: 50,
            right: 20,
            top: 70,
            bottom: 50
          },
          xAxis: xAxis,
          legend: legend,
          dataZoom: [
            {
              type: 'slider',
              show: true,
              height: 10,
              handleSize: 8,
              bottom: 5,
              textStyle: {
                color: dataZoomColors[0]
              },
              handleColor: dataZoomColors[1],
              fillerColor: dataZoomColors[1],
              handleIcon: 'M-292,322.2c-3.2,0-6.4-0.6-9.3-1.9c-2.9-1.2-5.4-2.9-7.6-5.1s-3.9-4.8-5.1-7.6c-1.3-3-1.9-6.1-1.9-9.3c0-3.2,0.6-6.4,1.9-9.3c1.2-2.9,2.9-5.4,5.1-7.6s4.8-3.9,7.6-5.1c3-1.3,6.1-1.9,9.3-1.9c3.2,0,6.4,0.6,9.3,1.9c2.9,1.2,5.4,2.9,7.6,5.1s3.9,4.8,5.1,7.6c1.3,3,1.9,6.1,1.9,9.3c0,3.2-0.6,6.4-1.9,9.3c-1.2,2.9-2.9,5.4-5.1,7.6s-4.8,3.9-7.6,5.1C-285.6,321.5-288.8,322.2-292,322.2z',
              start: start,
              end: 100
            },
            {
              type: 'inside',
              start: start,
              end: 100
            }
          ],
          yAxis: {
            type: 'value',
            name: this.factorLabel,
            nameTextStyle: {
              color: colors[0]
            },
            nameLocation: 'end',
            splitLine: {
              show: false
            },
            min: 0,
            position: 'left',
            axisLabel: {
              textStyle: {
                color: colors[0]
              }
            },
            axisTick: {
              show: false
            },
            // 坐标文本标签
            axisLine: {
              lineStyle: {
                color: colors[0]
              }
            }
          },
          series: series
        };
        return options;

      },
      getDateFormat(time){
        if (this.dateType === 'hour') {
          return time.substr(0, 13) + '时';
        } else if (this.dateType === 'day') {
          return time.substr(0, 10);
        } else {
          return time;
        }
      }
    },
    watch: {
      selectedList(){
        this.$refs.searchInput.refreshList();
      }
    }
  }
</script>
<style type="text/css" scoped>
  .comparison.zt-drag-dialog {
    top: 124px;
    left: 665px;
    position: fixed;
  }

  .comparison .comparison-list .del-comparison {
    color: #5578de;
    font-size: 14px;
  }

  .comparison {
    -webkit-box-shadow: none;
    box-shadow: none;
    border: 1px #eee solid;
  }
</style>

