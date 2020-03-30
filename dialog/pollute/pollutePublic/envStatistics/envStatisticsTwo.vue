<template>
  <div class="sub-tab-content">
    <div class="table-list-wrapper">
      <table class="table small-padding table-complex table-bordered light-blue-th">
        <thead>
        <tr>
          <th style="width: 46%">指标名称</th>
          <th style="width: 18%">计量单位</th>
          <th style="width: 18%">代码</th>
          <th style="width: 18%">本年实际</th>
          <!--<th style="width: 23%">指标名称</th>-->
          <!--<th style="width: 9%">计量单位</th>-->
          <!--<th style="width: 9%">代码</th>-->
          <!--<th style="width: 9%">本年实际</th>-->
        </tr>
        <tr>
          <th>甲</th>
          <th>乙</th>
          <th>丙</th>
          <th>1</th>
          <!--<th>甲</th>-->
          <!--<th>乙</th>-->
          <!--<th>丙</th>-->
          <!--<th>1</th>-->
        </tr>
        </thead>
        <tbody>
        <tr v-if="loading&&dataList&&dataList.length==0">
          <td class="al_center" colspan="8">{{constants.no_data_text}}</td>
        </tr>
        <tr v-for="(item , index) in dataList">
          <td>{{item.elemetName == '' ? '-' : item.elemetName}}</td>
          <td>{{item.elementUnit == '' ? '-' : item.elementUnit}}</td>
          <td>{{item.code == '' ? '-' : item.code}}</td>
          <td>{{item.value == '' ? '-' : item.value}}</td>
          <!--<template v-if="item.itemOne">-->
          <!--<td>-->
          <!--<template v-if="item.itemOne.code == '23' ||-->
          <!--item.itemOne.code == '24' ||-->
          <!--item.itemOne.code == '25' ||-->
          <!--item.itemOne.code == '26' ||-->
          <!--item.itemOne.code == '27' ||-->
          <!--item.itemOne.code == '28' ">-->
          <!--<template v-if="item.itemOne.defaulName && item.itemOne.defaulName!=''">-->
          <!--{{item.itemOne.defaulName}}-->
          <!--</template>-->
          <!--<template v-else>-</template>-->
          <!--</template>-->
          <!--<template v-else>-->
          <!--{{item.itemOne.elemetName}}-->
          <!--</template>-->
          <!--</td>-->
          <!--<td class="al_center">-->
          <!--&lt;!&ndash; {{item.itemOne.elementUnit}} &ndash;&gt;-->
          <!--<template v-if="item.itemOne.code == '23' ||-->
          <!--item.itemOne.code == '24' ||-->
          <!--item.itemOne.code == '25' ||-->
          <!--item.itemOne.code == '26' ||-->
          <!--item.itemOne.code == '27' ||-->
          <!--item.itemOne.code == '28' ">-->
          <!--<template v-if="item.itemOne.defaulName && item.itemOne.defaulName!=''">-->
          <!--{{item.itemOne.elementUnit}}-->
          <!--</template>-->
          <!--<template v-else>-</template>-->
          <!--</template>-->
          <!--<template v-else>-->
          <!--{{item.itemOne.elementUnit}}-->
          <!--</template>-->
          <!--</td>-->
          <!--<td class="al_center">{{item.itemOne.code}}</td>-->
          <!--<td class="al_center">-->
          <!--&lt;!&ndash; {{item.itemOne.value}} &ndash;&gt;-->
          <!--<template v-if="item.itemOne.code == '23' ||-->
          <!--item.itemOne.code == '24' ||-->
          <!--item.itemOne.code == '25' ||-->
          <!--item.itemOne.code == '26' ||-->
          <!--item.itemOne.code == '27' ||-->
          <!--item.itemOne.code == '28' ">-->
          <!--<template v-if="item.itemOne.defaulName && item.itemOne.defaulName!=''">-->
          <!--{{item.itemOne.value}}-->
          <!--</template>-->
          <!--<template v-else>-</template>-->
          <!--</template>-->
          <!--<template v-else>-->
          <!--{{item.itemOne.value}}-->
          <!--</template>-->
          <!--</td>-->
          <!--</template>-->
          <!--<template v-else>-->
          <!--<td>&nbsp;</td>-->
          <!--<td>&nbsp;</td>-->
          <!--<td>&nbsp;</td>-->
          <!--<td>&nbsp;</td>-->
          <!--</template>-->
          <!--<template v-if="item.itemTwo">-->
          <!--<td>{{item.itemTwo.elemetName}}</td>-->
          <!--<td class="al_center">{{item.itemTwo.elementUnit}}</td>-->
          <!--<td class="al_center">{{item.itemTwo.code}}</td>-->
          <!--<td class="al_center">{{item.itemTwo.value}}</td>-->
          <!--</template>-->
          <!--<template v-else>-->
          <!--<td>&nbsp;</td>-->
          <!--<td>&nbsp;</td>-->
          <!--<td>&nbsp;</td>-->
          <!--<td>&nbsp;</td>-->
          <!--</template>-->
        </tr>

        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  import mapPolluteEpHttp from '@/https/map/mapPolluteEpStatisticsHttp'

  export default {
    data() {
      return {
        dataList: [],
        loading: false,
      }
    },
    props: {
      esSopObj: Object,
    },
    created() {
      this.queryEsStatisticsTail();
    },

    methods: {
      queryEsStatisticsTail() {
        var that = this
        mapPolluteEpHttp.esSourceInfoTail(that.esSopObj).then((result) => {
          console.log(result.result && result.result.length > 0)
          if (result.result && result.result.length > 0) {
            that.dataList = result.result[0].values
            // this.dataList = this.formatData(result.data);
            console.log('archives10101:', that.dataList)
          }
          that.loading = true;
        }).catch((error) => {
          that.loading = true;
        })
      },
      formatData(dataList) {
        let valuesOne = dataList[0].values;
        let valuesTwo = dataList[1].values;
        let tempArr = new Array();
        let length = Math.max(valuesOne.length, valuesTwo.length);
        for (let i = 0; i < length; i++) {
          let itemOne = valuesOne[i];
          let itemTwo = valuesTwo[i]
          let obj = {
            itemOne: itemOne,
            itemTwo: itemTwo
          };
          tempArr.push(obj);
        }
        return tempArr;
      }
    }
  }
</script>

<style lang="less" scoped>
  thead {
    tr {
      th {
        text-align: center;
      }
      &:first-child {
        th {
          font-weight: bold;
        }
      }
    }
  }
</style>
