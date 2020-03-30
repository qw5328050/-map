<template>
  <div ref="lineChart2" class="panel-chart" style="height: 400px;padding: 0;">
  </div>
</template>

<script>
  import {deepExtend} from '@/utils/util'
  export default {
    name: 'line-chart2',
    components: {},
    props:{
      dataList: {
        type: Array,
        default: ()=>[]
      },
      option: Object
    },
    data() {
      return {
        lineChart2: '',
        colors: ['#0f97f6', '#f49f42', '#01c300', '#73b9bc', '#91ca8c', '#40c9e7', '#eedd78', '#7289ab', '#9EE035', '#b60064']
      }
    },
    created(){
    },
    mounted() {
      if (window.addEventListener) {                    // 所有主流浏览器，除了 IE 8 及更早版本
        window.addEventListener('resize', this.resize)
      } else if (window.attachEvent) {                  // IE 8 及更早版本
        window.attachEvent('onresize', this.resize)
      }
      this.lineChart2 = this.$echarts.init(this.$refs.lineChart2)
    },
    methods: {
      resize() {
        this.lineChart2.resize();
      },
      formatterData(list){
        let that = this
        let legendData = []
        let xAxisData = []
        let seriesData = []
        list.forEach(function (item) {
          legendData.push(item.name)
        })
        list.forEach(function (item, index) {
          let childItem = []
          let itemObject = {
            name: item.name,
            type: 'line',
            stack: item.name,
            data: [],
            itemStyle: {
              normal: {
                color: that.colors[index]
              }
            }
          }
          item.resultList.forEach(function (i) {
            childItem.push(i.value)
          })
          itemObject.data = childItem
          seriesData.push(itemObject)
        })
        list[0].resultList.forEach(function (item) {
          xAxisData.push(item.time.substr(5, 11))
        })
        return {
          legendData,
          xAxisData,
          seriesData
        }
      },
      drawChart (list) {
        let that = this
        that.lineChart2.clear()
        let {legendData, xAxisData, seriesData} = that.formatterData(list)
        console.log(seriesData)
        let option = {
          title: {
            left: 'center'
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: legendData,
            top: '10%'
          },
          grid: {
            top: '23%',
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          toolbox: {
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: xAxisData
          },
          yAxis: {
            type: 'value'
          },
          series: seriesData
        }
        if(this.option){
          option = deepExtend(option, this.option)
        }
        this.lineChart2.setOption(option)
      }
    },
    watch: {
      dataList: {
        handler (newV, oldV) {
          console.log('newV:', newV)
          this.drawChart(newV)
        },
        deep: true
      }
    }
  }
</script>

<style scoped>

</style>
