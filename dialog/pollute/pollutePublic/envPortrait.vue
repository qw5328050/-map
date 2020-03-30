<template>
  <div class="popbox-detail-content">
    <div class="portrait">
      <div class="portrait-title"><h3>环保画像</h3></div>
      <div class="portrait-chart">
        <radar-chart style="height: 350px;"
                     :indicator="indicator"
                     :valueList="valueList"
                     :dataList="dataList"
        ></radar-chart>
      </div>
    </div>
    <table class="table small-padding table-complex table-bordered light-blue-th table-flex">
      <thead>
      <tr>
        <th :rowspan="1" class="al_center"></th>
        <th :rowspan="1" class="al_center">最近一年行政处罚数</th>
        <th :rowspan="1" class="al_center">企业信用得分</th>
        <th :colspan="1" class="al_center">最近一年日超标报警数</th>
        <th :rowspan="1" class="al_center">去年环统废水排放</th>
        <th :colspan="1" class="al_center">去年环统废气排放</th>
        <!--<th :colspan="nameList.length">本年实际</th>-->
      </tr>
      </thead>
      <tbody>
      <tr>
        <th class="al_center">当前企业</th>
        <td class="al_center" v-for="item in dataList">{{item.value}}</td>
      </tr>
      <tr>
        <th class="al_center">企业平均</th>
        <td class="al_center" v-for="item in dataList">{{item.valueAvg}}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  import radarChart from './chart/radarChart'
  import polluteAsourceFileHttp from '@/https/pollute/polluteAsourceFileHttp'
  export default {
    name: 'env-portrait',
    components: {
      radarChart
    },
    props: {
      itemData: Object
    },
    data (){
      return {
        averageValueList: [], // 平均值
        indicator: [], // 名字和最大值
        valueList: [],  // 数据
        dataList: []
      }
    },
    created() {
      this.getInfoPortrayRank()
      this.getInfoPortrayData()
    },
    methods: {
      getInfoPortrayData() {
        // console.log(this.item)
        let params = {
          sopId: this.itemData.id
          // sopId: '1000005'
        }
        polluteAsourceFileHttp.getInfoPortrayData(params).then((result) => {
          console.log('result.data:', result.result)
          this.dataList = result.result
        }).catch((error) => {

        })
      },
      getInfoPortrayRank() {
        // console.log(this.item)
        let params = {
          sopId: this.itemData.id
          // sopId: '1000005'
        }
        polluteAsourceFileHttp.getInfoPortrayRank(params).then((result) => {
          let indicator = []
          // let average = []
          let value = []
          result.result.forEach(function(item){
            indicator.push({text: item.name, max: item.valueMax})
            // indicator.push({text: item.name})
            // if(item.code == 'punish'){
            //   average.push(1.45)
            // } else if(item.code == 'score'){
            //   average.push(6.02)
            // } else if(item.code == 'warning') {
            //   average.push(9.95)
            // } else {
            //   average.push(item.valueAvg)
            // }
            // average.push(item.valueAvg)
            value.push(item.value)
          })
          // this.averageValueList = average
          this.indicator = indicator
          this.valueList = value
          this.getInfoPortrayData()
        }).catch((error) => {

        })
      }
    }
  }
</script>

<style scoped>
  .portrait{
    width: 100%;
  }
  .portrait-title{
    position: relative;
    padding: 0 13px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
  }
  .portrait-title h3{
    font-weight: bold;
    color: #3862d8;
    height: 16px;
    line-height: 16px;
  }
  .portrait-title h3:before{
    content: "";
    width: 3px;
    height: 16px;
    background: #3862d8;
    position: absolute;
    left: 0;
  }
  .portrait-chart{
    width: 100%;
    height: 350px;
  }
</style>
