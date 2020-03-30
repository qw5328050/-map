<template>
  <!-- 废气治污设施 -->
  <div class="popbox-detail-content">
    <!--<h3 class="form-item-name">废气治污设施</h3>-->
    <table class="table table-bordered light-gray-th">
      <thead>
      <tr>
        <th rowspan="2" colspan="1" class="al_center">污染物类型</th>
        <th rowspan="2" colspan="1" class="al_center">统计指标</th>
        <th colspan="3" class="al_center" v-for="item in dataList">{{item.year}}</th>
      </tr>
      <tr>
        <template v-for="item in dataList">
          <th class="al_center">许可</th>
          <th class="al_center">环统</th>
          <th class="al_center">污普</th>
        </template>
      </tr>
      </thead>
      <tbody>
      <tr v-if="formtDataList&&formtDataList.length==0">
        <td class="al_center" colspan="10">{{constants.no_data_text}}</td>
      </tr>
      <tr v-for="(item , index) in formtDataList">

        <template>
          <td class="al_center" :rowspan="airNumb" v-if="index == 0">废气</td>
          <td class="al_center" :rowspan="waterNumb" v-if="index == airNumb">废水</td>
          <td class="al_center" :rowspan="solidNumb" v-if="index == (waterNumb + airNumb)">固体废物</td>
        </template>
        <td class="al_center" width="100">{{keyValueList[keyList[index]]}}</td>
        <template v-for="(t,i) in dataList">
          <td class="al_center">{{item[`permit${i}`]}}</td>
          <td class="al_center">{{item[`emissionsHt${i}`]}}</td>
          <td class="al_center">{{item[`emissionsWp${i}`]}}</td>
        </template>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script type="text/jsx">
  import sopDetailHttp from '@/https/monitor/sopDetailHttp'

  export default {
    data() {
      return {
        loading: true,
        dataList: [],
        keyList: [],
        formtDataList: [],
        keyValueList: {
          airAmount: '废气排放量',
          airDust: '烟（粉）尘',
          airNox: '氮氧化物',
          airSo2: '二氧化硫',
          airVocs: '挥发性有机物',
          waterAmount: '废水排放量',
          waterAn: '氨氮',
          waterCod: '化学需氧量',
          waterN: '总氮',
          waterP: '总磷',
          solidAmount: '产生量',
          solidDisposal: '处置量',
          solidStorage: '贮存量',
          solidUse: '综合利用量'
        },
        airNumb: 0,
        waterNumb: 0,
        solidNumb: 0
      }
    },
    props: {
      itemData: Object
    },
    mounted() {
      this.getDataList()
    },
    methods: {
      getDataList() {
        let that = this
        let params = {
          sopId: this.itemData.id
        };
        sopDetailHttp.getPermitEmission(params)
          .then(res => {
            // this.loading = false;
            if (res.result && res.result.length > 0) {
              that.dataList = res.result
              that.formtDataList = that.formatterDataList(res.result)
              console.log('res:', that.dataList)
            }
          })
      },
      formatterDataList(list) {
        let that = this
        let formatterList = []
        let keyList = []
        for (var key in this.keyValueList) {
          keyList.push(key)
        }
        console.log('keyList:', keyList)
        keyList.forEach(function (item) {
          if(item.substring(0, 1).indexOf('a') > -1) {
            that.airNumb++
          } else if(item.substring(0, 1).indexOf('w') > -1) {
            that.waterNumb++
          } else if(item.substring(0, 1).indexOf('s') > -1) {
            that.solidNumb++
          }
        })
        that.keyList = keyList
        for (var i = 0; i < 14; i++) {
          let listItem = {}
          list.forEach(function (item, index) {
            listItem[`emissionsHt${index}`] = list[index].emissionsHt[keyList[i]]
            listItem[`emissionsWp${index}`] = list[index].emissionsWp[keyList[i]]
            listItem[`permit${index}`] = list[index].permit[keyList[i]]
          })
          formatterList.push(listItem)
        }
        return formatterList
      }
    }
  }
</script>
