<template>
  <div ref="radarChart" class="panel-chart" style="height: 400px;">
  </div>
</template>

<script>
  import {deepExtend} from '@/utils/util'
  export default {
    name: 'radar-chart',
    props: {
      dataList: {
        type: Array,
        default: ()=>[]
      },
      averageValueList: {
        type: Array,
        default: ()=>[]
      },
      indicator: {
        type: Array,
        default: ()=>[]
      },
      valueList: {
        type: Array,
        default: ()=>[]
      },
      option: Object
    },
    data () {
      return {
        radarChart: ''
      }
    },
    created() {
    },
    watch: {
      dataList (newVal, oldVal) {
        this.drawChart()
      }
    },
    mounted() {
      if (window.addEventListener) {                    // 所有主流浏览器，除了 IE 8 及更早版本
        window.addEventListener('resize', this.resize)
      } else if (window.attachEvent) {                  // IE 8 及更早版本
        window.attachEvent('onresize', this.resize)
      }
      this.radarChart = this.$echarts.init(this.$refs.radarChart)
      // this.drawChart()
      console.log()
    },
    methods: {
      resize() {
        this.radarChart.resize();
      },
      drawChart(countData) {
        let that = this;
        // that.radarChart.clear()
        // let {nameArr,valueArr} = that.formatData(countData);
        let option = {
          legend: {
            data: [
              {
                name: '当前企业',
                textStyle: {
                  color: '#666'
                },
                backgroundColor: 'rgba(225, 225, 225, 1)'
              }
              // {
              //   name: '企业平均',
              //   textStyle: {
              //     color: '#666'
              //   },
              //   backgroundColor: 'rgba(225, 225, 225, 1)'
              // }
            ],
            itemWidth: 15,
            itemHeight: 10,
            icon: 'circle',
            y: 'top',
            x: 'center',
            textStyle: {
              fontSize: 14,
            }
          },
          tooltip: {
            show: false
          },
          radar: [
            {
              indicator: this.indicator,
              center: ['50%', '50%'],
              radius: 120,
              startAngle: 90,
              splitNumber: 4,
              shape: 'circle',
              name: {
                formatter:'【{value}】',
                textStyle: {
                  color: '#666'
                }
              },
              axisLine: {
                lineStyle: {
                  color: 'rgba(221, 228, 233, 1)'
                }
              },
              splitLine: {
                lineStyle: {
                  color: 'rgba(221, 228, 233, 1)'
                }
              }
            }
          ],
          series: [
            {
              name: '雷达图',
              type: 'radar',
              data: [
                {
                  value: this.valueList,
                  name: '当前企业',
                  symbol: 'rect',
                  lineStyle: {
                    normal: {
                      width: 1,
                      color: 'rgba(241, 49, 86, 1)'
                    }
                  },
                  areaStyle: {
                    normal: {
                      color: 'rgba(241, 49, 86, 0.5)'
                    }
                  },
                  itemStyle: {
                    normal: {
                      color: 'rgba(241, 49, 86, 1)'
                    }
                  }
                }
                // {
                //   value: this.averageValueList,
                //   name: '企业平均',
                //   lineStyle: {
                //     normal: {
                //       width: 1,
                //       type: 'dashed',
                //       color: 'rgba(15, 151, 246, 1)'
                //     }
                //   },
                //   areaStyle: {
                //     normal: {
                //       color: 'rgba(15, 151, 246, 0.5)'
                //     }
                //   },
                //   itemStyle: {
                //     normal: {
                //       color: 'rgba(15, 151, 246, 1)'
                //     }
                //   }
                // }
              ]
            }
          ]
        }
        if (this.option){
          option = deepExtend(option, this.option)
        }
        that.radarChart.setOption(option)
      }
    }
  }
</script>

<style scoped>

</style>
