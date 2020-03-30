<template>
	<div class="sub-tab-content">
	  <div class="table-list-wrapper">
        <section class="table-list mb_15" v-for="(item,index) in distinctMapList">
        	<h3 class="form-item-name" v-if="item.childTitle">{{ item.childTitle }}</h3>
	        <table class="table small-padding table-complex table-bordered light-blue-th">
	          <thead>
	          	<tr v-if="index == 0">
	          		<th style="width:30%">指标名称</th>
	          		<th>计量单位</th>
	          		<th>代码</th>
	          		<th colspan="4" v-for="(name,index) in item.nameArr">{{ name }}</th>
	          	</tr>

	          	<tr v-if="index == 0">
	          		<th>甲</th>
	          		<th>乙</th>
	          		<th>丙</th>
	          		<th colspan="4" v-for="(name,index) in item.nameArr">{{(index+1)}}</th>
	          	</tr>
	          </thead>
	          <tbody>
	          	<tr v-if="loading&&item.dataArr&&item.dataArr.length==0">
	          		<td class="al_center" colspan="4">{{constants.no_data_text}}</td>
	          	</tr>
	          	<tr  v-for="data in item.dataArr">
	          		<td style="width:30%">{{data.elemetName}}</td>
	          		<td class="al_center">{{data.elementUnit}}</td>
	          		<td class="al_center">{{data.code}}</td>
	          		<td class="al_center" colspan="4" v-for="name in item.nameArr">{{data[name]}}</td>
	          	</tr>
	          </tbody>
	        </table>
      </section>
	  </div>
	</div>
</template>

<script>
import mapPolluteEpHttp from '@/https/map/mapPolluteEpStatisticsHttp'
export default{
	data(){
		return{
			loading:false,
			valueList: [],
			distinctMap : {dataArr:[],nameArr:[],childTitle:'',childCode:''},
			distinctMapList : []
		}
	},
	props: {
    esSopObj: Object,
  },
	created(){
		this.queryData()
	},
	methods:{
		queryData(){
			mapPolluteEpHttp.esSourceInfoTail(this.esSopObj).then((result) => {
			  	if(result.result && result.result.length > 0){
			  		for (var i = 0; i < result.result.length; i++) {
			  			let tempData = result.result[i];
						let tempMap = {};
						if(tempData){
							tempMap = this.distinct(tempData.values);
							let key1 = 'childTitle';
							let key2 = 'childCode';
							tempMap[key1] = tempData.childArchivesTitle;
							tempMap[key2] = tempData.childArchivesCode;
						}
						//this.distinctMap.dataArr = tempMap.dataArr;
						//this.distinctMap.nameArr = tempMap.nameArr;
						//console.log(this.distinctMap);
						this.distinctMapList.push(tempMap);
			  		}
			  		console.log(this.distinctMapList);
				}
			}).catch((error) => {

			})
		},
		distinct(values){
			let tmp = {},nameTemp = {};
			let tempArr = [],nameArr = [];
			for (let i = 0;  i< values.length; i++) {
				let item = values[i];
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
				for(let j = 0; j< values.length; j++){
					let item = values[j];
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
