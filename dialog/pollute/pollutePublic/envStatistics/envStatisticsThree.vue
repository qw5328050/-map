<template>
	<div class="sub-tab-content">
	  <div class="table-list-wrapper">
	    <table class="table small-padding table-complex table-bordered light-blue-th">
        <thead>
          <tr>
            <th style="width: 52%">指标名称</th>
            <th style="width: 16%">计量单位</th>
            <th style="width: 16%">代码</th>
            <th style="width: 16%">本年实际</th>
          </tr>
          <tr>
            <th>甲</th>
            <th>乙</th>
            <th>丙</th>
            <th>1</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading&&dataList&&dataList.length==0">
            <td class="al_center" colspan="4">{{constants.no_data_text}}</td>
          </tr>
         <tr v-for="(item , index) in dataList">
           	<td>{{item.elemetName}}</td>
            <td class="al_center">{{item.elementUnit}}</td>
            <td class="al_center">{{item.code}}</td>
            <td class="al_center">{{item.value}}</td>
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
					this.dataList = result.result[0].values;
				}
        this.loading = true;
			}).catch((error) => {
      	this.loading = true;
			})
		},
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
