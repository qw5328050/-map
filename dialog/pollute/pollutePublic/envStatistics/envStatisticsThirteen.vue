<template>
	<div class="sub-tab-content">
	  <div class="table-list-wrapper">
		<section class="table-list mb_15">
		    <table class="table small-padding table-complex table-bordered light-blue-th ">
	          <thead>
		          <tr>
		            <th style="width: 23%" class="al_center">指标名称</th>
		            <th style="width: 9%" class="al_center">计量单位</th>
		            <th style="width: 9%" class="al_center">代码</th>
		            <th style="width: 9%" class="al_center">本年实际</th>
		            <th style="width: 23%" class="al_center">指标名称</th>
		            <th style="width: 9%" class="al_center">计量单位</th>
		            <th style="width: 9%" class="al_center">代码</th>
		            <th style="width: 9%" class="al_center">本年实际</th>
		          </tr>
		          <tr>
		            <th class="al_center">甲</th>
		            <th class="al_center">乙</th>
		            <th class="al_center">丙</th>
		            <th class="al_center">1</th>
		            <th class="al_center">甲</th>
		            <th class="al_center">乙</th>
		            <th class="al_center">丙</th>
		            <th class="al_center">1</th>
		          </tr>
	          </thead>
  	          <tbody>
<!--   	          	<tr v-if="loading&&dataInfo&&dataInfo.data.length==0">
  	          		<td class="al_center" colspan="8">{{constants.no_data_text}}</td>
  	          	</tr>  -->
	            <tr v-for="(item , index) in valueList">
	            	<template v-if="item.itemOne">
	            		<td>{{item.itemOne.elemetName}}</td>
	            		<td class="al_center">{{item.itemOne.elementUnit}}</td>
	            		<td class="al_center">{{item.itemOne.code}}</td>
	            		<td class="al_center">{{item.itemOne.value}}</td>
	            	</template>
	            	<template v-else>
	            		<td>&nbsp;</td>
	            		<td>&nbsp;</td>
	            		<td>&nbsp;</td>
	            		<td>&nbsp;</td>
	            	</template>
	             	<template v-if="item.itemTwo">
	            		<td>{{item.itemTwo.elemetName}}</td>
	            		<td class="al_center">{{item.itemTwo.elementUnit}}</td>
	            		<td class="al_center">{{item.itemTwo.code}}</td>
	            		<td class="al_center">{{item.itemTwo.value}}</td>
	            	</template>
	            	<template v-else>
	            		<td>&nbsp;</td>
	            		<td>&nbsp;</td>
	            		<td>&nbsp;</td>
	            		<td>&nbsp;</td>
	            	</template>
	            </tr>

          	</tbody>
        </table>
		</section>
        <section class="table-list mb_15">
	        <table class="table small-padding table-complex table-bordered light-blue-th">
	          <thead>
	          	<tr>
	          		<th style="width:30%">指标名称</th>
	          		<th>计量单位</th>
	          		<th>代码</th>
	          		<th v-for="item in distinctMap.nameArr">{{ item }}</th>
	          	</tr>

	          	<tr>
	          		<th>甲</th>
	          		<th>乙</th>
	          		<th>丙</th>
	          		<th v-for="(item,index) in distinctMap.nameArr">{{(index+1)}}</th>
	          	</tr>
	          </thead>
	          <tbody>
	          	<tr v-if="loading&&distinctMap.dataArr&&distinctMap.dataArr.length==0">
	          		<td class="al_center" colspan="4">{{constants.no_data_text}}</td>
	          	</tr>
	          	<tr  v-for="data in distinctMap.dataArr">
	          		<td>{{data.elemetName}}</td>
	          		<td class="al_center">{{data.elementUnit}}</td>
	          		<td class="al_center">{{data.code}}</td>
	          		<td class="al_center" v-for="name in distinctMap.nameArr">{{data[name]}}</td>
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
			child1: {},
			child2: {},
			child3: {},
			num: 0,
			numDistinct : 0,
			valueList: [],
			distinctMap : {dataArr:[],nameArr:[]}
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
					//this.dataInfo = result.data[0];
					//console.log(result.data);
					if(result.result[0]){
						this.child1 = result.result[0];
						if(this.child1.values.length > this.num){
							this.num = this.child1.values.length;
						}
					}
					if(result.result[1]){
						this.child2 = result.result[1];
						if(this.child2.values.length > this.num){
							this.num = this.child2.values.length;
						}
					}
					//console.log(this.num);
					this.valueList = this.merge(this.child1,this.child2);
					//console.log(this.valueList);
					let tempMap = {};

					if(result.result[2]){

						this.child3 = result.result[2];
						tempMap = this.distinct(this.child3.values);

					}

					this.distinctMap.dataArr = tempMap.dataArr;
					this.distinctMap.nameArr = tempMap.nameArr;
					console.log(this.distinctMap);
				}

			}).catch((error) => {

			})
		},

		merge(child1,child2){
			let valuesOne = child1.values;
			let valuesTwo = child2.values;
			let tempArr = new Array();
			let length = Math.max(valuesOne.length,valuesTwo.length);
			for(let i = 0; i< length; i++){
				let itemOne = {};
				let itemTwo = {};
				if(valuesOne[i]){
					itemOne = valuesOne[i];
				}
				if(valuesTwo[i]){
					itemTwo = valuesTwo[i];
				}
				let obj = {
					itemOne:itemOne,
					itemTwo:itemTwo
				};
				tempArr.push(obj);
			}
			return tempArr;
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
			if(nameArr.length > this.num){
				this.numDistinct = nameArr.length;
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
