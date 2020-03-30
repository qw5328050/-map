
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
      nameList: {
        type: Array,
        default: ()=>[]
      },
      color:{
        type: [String,Array],
        default: ()=>'#fab560'
      },
      xUnit: {
        type: String,
        default: ()=>'日'
      },
      option:Object,
      itemName:String,
      itemValue:[String,Array],
      unit:String,
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
        let nameArr = [];
        let valueArr = [];
        for (let i=0;i<dataList.length;i++) {
          let item = dataList[i];
          nameArr.push(item[this.itemName]+this.xUnit)
          valueArr.push(item[this.itemValue]);
        }
        return {
          nameArr,
          valueArr
        }
      },
      drawChart(countData) {
        let that = this;
        that.lineChart.clear();
        let {nameArr,valueArr} = that.formatData(countData);
        let option = {
          grid: {
            show: true,
            left: '0',
            top: '25',
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
            name:that.unit,
            axisTick: {show: false},
            axisLine: {
              show: false
            },
            splitArea: {
              show: true,
              areaStyle: {
                color: ['#f8f8f8', '#fff']
              }
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
          series:{
            type: 'line',
            smooth: false,
            itemStyle: {
              normal: {
                color: that.color,
                label: {
                  show: false,
                  position: 'inside',
                  formatter: '{c}'
                }
              }
            },
            data:valueArr
          }
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
          this.drawChart(newV);
        },
        deep:true
      }
    }
  }
</script>

<style scoped>

</style>


