<template>
  <!-- 分类内容-网格监管 -->
  <div class="tab-content" v-if="!noData">
    <!-- 表格信息 -->
    <div class="panel-table-heaer">
      <time>{{detailData.time ? moment(new Date(detailData.time)).format('MM月DD日HH点') : ''}}<em class="label pollute-fine ml_5">{{detailData.processType}}</em></time>
      <span class="site">{{detailData.status}}</span>
    </div>
    <!-- 处理信息 -->
    <div class="process-info-wrapper">
      <div class="process-content">
        <div class="operator">
          <h3>{{detailData.personName}}<span class="job">{{detailData.personType ? `(${detailData.personType})` : ''}}</span></h3>
          <p>{{detailData.gridName}}</p>
        </div>
        <div class="process-info">
          <h3>{{detailData.type}}</h3>
          <p>{{detailData.description}}</p>
        </div>
      </div>
      <template>
        <div class="process-img" v-if="detailData.attachment && detailData.attachment.length > 0">
          <img :src="detailData.attachment[0].fileUrl" alt="">
        </div>
        <div class="no-img" v-else>
          <span class="no-img-tips">暂无图片</span>
        </div>
      </template>
    </div>
    <!-- 子类标签 -->
    <div class="sub-tab" style="padding-left: 0;">
      <span class="sub-tab-item cur" @click="testClick">网格监管趋势图</span>
    </div>
    <!-- 子类标签内容 -->
    <div class="sub-tab-content">
      <div ref="chart" class="chart" style="width: 390px;height: 254px;" v-zt-empty-chart="noChartData"></div>
    </div>

    <task-list ref="taskListDailog"></task-list>
  </div>
  <div v-else v-zt-empty-chart="noData" class="chart" style="height:320px;">
  </div>
</template>

<script>
  import mapGridHttp from '@/https/map/mapGridHttp'
  import TaskList from './taskListDialog'
  import {chartsStartIndex} from '@/utils/util'
  import moment from 'moment'

  export default {
    name: 'gridSupervise',
    components: {TaskList},
    props: {
      id: String
    },
    data () {
      return {
        moment,
        dateType: 'hour',
        colorList: ['#0f97f6', '#2ecccd', '#7dcc53', '#ffb94d', '#f18731', '#fd634e', '#f13156', '#c850b3', '#a15dc0', '#665ec7', '#768dff', '#fe8463'],
        fontColor: '#ff654b',
        dataZoomColors: ['#333333', '#1396F2'],
        noData: false,
        noChartData: false,
        detailData: {},
        chartDataList: []
      }
    },
    created () {
      this.getData()
    },
    mounted () {
      if (window.addEventListener) {                    // 所有主流浏览器，除了 IE 8 及更早版本
        window.addEventListener('resize', this.resize)
      } else if (window.attachEvent) {                  // IE 8 及更早版本
        window.attachEvent('onresize', this.resize)
      }
      this.chart = this.$echarts.init(this.$refs['chart'])
      this.chart.on('click', chartParams => {
        let time = this.chartDataList[chartParams.dataIndex].time
        let params = {
          pollutionId: this.id,
          timeStamp: time
        }
        this.$refs.taskListDailog.init(params)
      })
      this.getChartData()
    },
    methods: {
      getData () {
        const params = {
          pollutionId: this.id || ''
        }
        mapGridHttp.getGridDataInfo(params).then((result) => {
          this.detailData = result.data
          if (!this.detailData || JSON.stringify(this.detailData) === '{}') {
            this.noData = true
          } else {
            this.noData = false
          }
          this.$emit('changeGridData', this.noData);
        }).catch(() => {
          this.noData = true
          this.$emit('changeGridData', this.noData);
        })
      },
      getChartData () {
        const params = {
          pollutionId: this.id || ''
        }
        mapGridHttp.getPollutionStatistics(params).then((result) => {
          if (result.data) {
            if (result.data.length > 0) {
              this.noChartData = false
              this.chartDataList = result.data
              const data = this.formatData({result: result.data, dateType: this.dateType})
              this.drawChart(data)
            } else {
              this.noChartData = true
            }
          }
        })
      },
      resize () {
        this.chart.resize()
      },
      drawChart (data) {
        var colors = this.colorList
        var dataZoomColors = this.dataZoomColors
        var fontColor = this.fontColor
        var start = chartsStartIndex(data.xAxisArray.length)
        var series = []
        var yAxisType = [
          {
            yAxisName: '网格员巡查',
            yAxisType: 'bar',
            barMaxWidth: 15,
            yAxisColor: colors[0],
            yAxisData: data.wgxcArray
          },
          {
            yAxisName: '监督员监管',
            yAxisType: 'bar',
            barMaxWidth: 15,
            yAxisColor: colors[1],
            yAxisData: data.jdjgArray
          },
          {
            yAxisName: '任务',
            yAxisType: 'bar',
            barMaxWidth: 15,
            yAxisColor: colors[2],
            yAxisData: data.taskArray
          },
          {
            yAxisName: '问题',
            yAxisType: 'bar',
            barMaxWidth: 15,
            yAxisColor: colors[3],
            yAxisData: data.eventArray
          }
        ]
        for (var i = 0; i < yAxisType.length; i++) {
          series.push({
            name: yAxisType[i].yAxisName,
            type: yAxisType[i].yAxisType,
            yAxisIndex: yAxisType[i].yAxisIndex,
            barMaxWidth: yAxisType[i].barMaxWidth,
            stack: '网格监管',
            itemStyle: {
              normal: {
                color: yAxisType[i].yAxisColor
              }
            },
            data: yAxisType[i].yAxisData
          })
        }
        let option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            },
            textStyle: {
              fontFamily: '微软雅黑',
              fontSize: 12
            }
          },
          grid: {
            x: 50,
            x2: 30, // 200
            y: 50,
            y2: 50
          },
          legend: {
            y: 'top',
            x: 'center',
            textStyle: {
              fontSize: 14
            }
          },
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
          xAxis: [
            {
              type: 'category',
              boundaryGap: true,
              axisPointer: {
                type: 'shadow'
              },
              splitLine: {
                show: false
              },
              axisLabel: {
                textStyle: {
                  color: fontColor
                }
              },
              axisLine: {
                lineStyle: {
                  color: fontColor,
                  width: 2
                }
              },
              axisTick: {
                show: false
              },
              data: data.xAxisArray
            }
          ],
          yAxis: {
            type: 'value',
            boundaryGap: [0, 0.6],
            minInterval: 1,
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
            }
          },
          series: series
        }
        this.chart.setOption(option)
      },
      formatData: function (params) {
        var dataList = params.result
        var dateType = params.dateType
        var timeFormat = ''
        if (dateType === 'hour') {
          timeFormat = 'DD日HH点'
        } else {
          timeFormat = 'MM月DD日'
        }
        var xAxisArray = []
        var wgxcArray = []
        var jdjgArray = []
        var eventArray = []
        var taskArray = []
        for (var i = 0; i < dataList.length; i++) {
          var item = dataList[i]
          xAxisArray.push(moment(item.time).format(timeFormat))
          var wgxcVal = Math.round(item.gridOperatorPatrolCount) || 0
          var jdjgVal = Math.round(item.supervisorPatrolCount) || 0
          var taskVal = Math.round(item.missionCount) || 0
          var eventVal = Math.round(item.caseEventCount) || 0
          wgxcArray.push(wgxcVal)
          jdjgArray.push(jdjgVal)
          taskArray.push(taskVal)
          eventArray.push(eventVal)
        }
        var data = {
          xAxisArray: xAxisArray,
          wgxcArray: wgxcArray,
          jdjgArray: jdjgArray,
          eventArray: eventArray,
          taskArray: taskArray
        }
        return data
      },
      testClick () {
        this.$refs.taskList.init()
      }
    }
  }
</script>

<style scoped>

  .map-wrapper .point-info-detail .tab-content {
    padding-top: 15px;
  }

</style>
