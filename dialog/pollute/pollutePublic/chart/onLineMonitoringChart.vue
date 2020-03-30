
<template>
  <div ref="lineChart" class="panel-chart" >
  </div>
</template>
<script>
  import {deepExtend} from '@/utils/util'
  export default {
    name: 'lineChart',
    components: {},
    props:{
      dataList: {
        type: Array,
        default: ()=>[]
      },
      colorList: {
        type: Array,
        default: () => ['#0f97f6', '#2ecccd', '#7dcc53', '#ffb94d', '#f18731', '#fd634e', '#f13156', '#c850b3', '#a15dc0', '#665ec7', '#768dff', '#fe8463'],
      },
      xUnit: {
        type: String,
        default: ()=>'日'
      },
      option:Object,
    },
    data() {
      return {
        lineChart: '',
      }
    },
    created(){

    },
    mounted() {
      if (window.addEventListener) {                    // 所有主流浏览器，除了 IE 8 及更早版本
        window.addEventListener("resize", this.resize);
      } else if (window.attachEvent) {                  // IE 8 及更早版本
        window.attachEvent("onresize", this.resize);
      }
      this.lineChart = this.$echarts.init(this.$refs.lineChart);
    },
    methods: {
      resize() {
        this.lineChart.resize();
      },
      formatData(dataList){
        let nameArr = new Array();
        let valueArr = new Array();
        let nameList = new Array();
        let nameObj = {};
        for(let data of dataList){
          data.values = new Array();
          if(!data.stationDataList)continue;
          for(let i = 0;i< data.stationDataList.length;i++){
            let item = data.stationDataList[i];
            nameList.push(data.satateName)
            data.values.push(item.value);
            if(!nameObj[item.time]){
              nameObj[item.time] = 1;
              nameArr.push(item.time+this.xUnit);
            }
          }
          valueArr.push(data);
        }
        return {
          nameArr,
          valueArr,
          nameList
        }
      },
      drawChart(countData) {
        let that = this;
        that.lineChart.clear();
        let {nameArr,valueArr,nameList} = that.formatData(countData);
        let series= new Array();
        for(let i=0; i<valueArr.length; i++){
          let item = valueArr[i];
          series.push({
            type: 'line',
            smooth: true,
            name: item.satateName,
            itemStyle: {
              normal: {
                color: that.colorList[i],
                label: {
                  show: false,
                  position: 'inside',
                  formatter: '{c}'
                }
              }
            },
            data:item.values
          });
        }
        let option = {
          legend: {data:nameList},
          grid: {
            show: true,
            left: '0',
            top: '40',
            bottom: '0',
            right: '0',
            containLabel: true,
            borderColor: '#eaeef1'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            },
            textStyle: {
              fontFamily: "微软雅黑",
              fontSize: 12
            },
          },
          yAxis: {
            type: 'value',
            boundaryGap: [0, 0.1],
            axisTick: {show: false},
            axisLine: {
              show: false
            },
            axisLabel: {
              textStyle: {
                color: '#a1a1a1'
              }
            },
          },
          xAxis: {
            type: 'category',
            minInterval: 1,
            axisLine: {
              show: false
            },
            axisTick: {show: false},
            axisLabel: {
              show: true,
              textStyle: {
                fontFamily: "微软雅黑",
                fontSize: 10
              },
            },
            data: nameArr,
          },
          series:series
        };
        if(this.option){
          option = deepExtend(option,this.option);
        }
        that.lineChart.setOption(option);
      }
    },
    watch:{
      dataList:{
        handler (newV, oldV) {
          if(!newV)return;
          this.drawChart(newV);
        },
        deep:true
      }
    }
  }
</script>

<style scoped>

</style>


