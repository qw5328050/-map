<template>
	<div class="sub-tab-content">
	  <div class="table-list-wrapper">
	    <table class="table small-padding table-complex table-bordered light-blue-th">
        <thead>
          <tr>
            <th style="width:30%">指标名称</th>
            <th>计量单位</th>
            <th>代码</th>
            <th :colspan="nameList.length">本年实际</th>
          </tr>
          <tr v-if="nameList&&nameList.length>0">
            <th>甲</th>
            <th>乙</th>
            <th>丙</th>
           <!--  <th>合计</th>
            <th>1#</th>
            <th>2#</th>
            <th>3#</th>
            <th>4#</th>
            <th>5#</th> -->
            <th v-for="name in nameList">{{name}}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="dataList&&dataList.length==0">
            <td class="al_center" colspan="4">{{constants.no_data_text}}</td>
          </tr>
         <tr v-for="(item , index) in dataList">
            <td>{{item.elemetName}}</td>
            <td class="al_center">{{item.elementUnit}}</td>
            <td class="al_center">{{item.code}}</td>
            <td class="al_center"  v-for="name in nameList">{{item[name]}}</td>
           <!--  <td class="al_center">{{item['合计']}}</td>
            <td class="al_center">{{item['1#']}}</td>
            <td class="al_center">{{item['2#']}}</td>
            <td class="al_center">{{item['3#']}}</td>
            <td class="al_center">{{item['4#']}}</td>
            <td class="al_center">{{item['5#']}}</td> -->
          </tr>
        </tbody>
      </table>
	  </div>
	</div>
</template>

<script>
import mapPolluteEpHttp from '@/https/map/mapPolluteEpStatisticsHttp'
export default{
	data(){
		return{
			dataList:[],
      nameList:[],
      loading:false,
		}
	},
	props: {
      esSopObj: Object,
    },
    created(){
    	this.queryEsStatisticsTail();
    },

	methods:{
		queryEsStatisticsTail(){
			mapPolluteEpHttp.esSourceInfoTail(this.esSopObj).then((result) => {
			  if(result.result && result.result.length > 0){
					let {dataArr,nameArr} = this.formatData(result.result[0].values);
          this.dataList = dataArr;
          this.nameList = nameArr;
				}
        this.loading = true;
			}).catch((error) => {
        this.loading = true;
			})
		},
   	formatData(dataList){
		  let tmp = {},nameTemp = {};
      let tempArr = [],nameArr = [];
      for (let i = 0;  i< dataList.length; i++) {
        let item = dataList[i];
        if (!tmp[item.elementId]) {
          tmp[item.elementId] = 1;
          tempArr.push({
            elementId:item.elementId,
            elemetName:item.elemetName,
            elementUnit:item.elementUnit,
            code:item.code
          });
        }
				if(!nameTemp[item.name]){
					nameArr.push(item.name);
					nameTemp[item.name] = 1;
				}
      }
      let dataArr = new Array();
      for(let i = 0; i<tempArr.length; i++){
        let temp = tempArr[i];
        for(let j = 0; j< dataList.length; j++){
          let item = dataList[j];
          if(temp.elementId == item.elementId){
            temp[item.name] = item.value;
          }
        }
        dataArr.push(temp);
      }
      return {dataArr,nameArr};
		}
	}
}
</script>

<style lang="less" scoped>
  thead{
    tr{
      th{
        text-align: center;
      }
      &:first-child{
        th{
          font-weight: bold;
        }
      }
    }
  }
</style>
