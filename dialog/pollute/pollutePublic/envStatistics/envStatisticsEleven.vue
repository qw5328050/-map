<template>
	<div class="sub-tab-content">
	  <div class="table-list-wrapper">
	    <h2 class="table-caption">{{title}}</h2>
	    <!-- 表格抬头信息 -->
	    <section class="table-base-info">
	      <div class="base-info-item">
	        <dl>
	          <dt>统一社会信用代码：</dt>
	          <dd>{{dataInfo.socialCreditCode}}</dd>
	        </dl>
	      </div>
	      <div class="base-info-item">
	        <dl>
	          <dt>养殖场编码：</dt>
	          <dd>{{dataInfo.code}}</dd>
	        </dl>
	      </div>
	      <div class="base-info-item">
	        <dl>
	          <dt>养殖场名称：</dt>
	          <dd>{{dataInfo.name}}</dd>
	        </dl>
	      </div>
	      <div class="base-info-item">
	        <dl>
	          <dt>曾用名：</dt>
	          <dd>{{dataInfo.usedName}}</dd>
	        </dl>
	      </div>
	      <div class="base-info-item">
	        <dl>
	          <dt>表名：</dt>
	          <dd>基201表</dd>
	        </dl>
	      </div>
	      <div class="base-info-item">
	        <dl>
	          <dt>填报人：</dt>
	          <dd>{{dataInfo.fillPerson}}</dd>
	        </dl>
	      </div>
	      <div class="base-info-item">
	        <dl>
	          <dt>填报日期：</dt>
	          <dd>{{dataInfo.fillDate | dateConvert('YYYY年MM月DD日') }}</dd>
	        </dl>
	      </div>
	    </section>
	    <!-- 表格信息 -->
	    <section class="table-list mb_15">
	      <h3 class="form-item-name">养殖场基本情况</h3>
	      <table class="table-info light-blue-th table-baseInfo">
	          <tr>
	              <th style="width: 20%">负责人</th>
	              <td style="width: 30%">{{dataInfo.manager}}</td>
	              <th style="width: 20%">联系电话</th>
	              <td style="width: 30%">{{dataInfo.managerPhone}}</td>
	          </tr>
	          <tr>
	              <th>详细地址</th>
	              <td>{{dataInfo.province}} {{dataInfo.city}} {{dataInfo.county}} {{dataInfo.street}} 							{{dataInfo.address}}</td>
	              <th>行政区划代码</th>
	              <td>{{dataInfo.countyCode}}</td>
	          </tr>
	          <tr>
	              <th>所在流域名称</th>
	              <td>{{dataInfo.basinName}}</td>
	              <th>所在流域代码</th>
	              <td>{{dataInfo.basin}}</td>
	          </tr>
	          <tr>
	              <th>受纳水体名称</th>
	              <td>{{dataInfo.receivingWaterName}}</td>
	              <th>受纳水体代码</th>
	              <td>{{dataInfo.receivingWater}}</td>
	          </tr>
	          <tr>
	              <th>排水去向类型</th>
	              <td>{{dataInfo.directionTypeName}}</td>
	              <th>排水去向代码</th>
	              <td>{{dataInfo.directionType}}</td>
	          </tr>
	          <tr>
	              <th>畜禽种类</th>
	              <td>
<!-- 		              <template v-if="dataInfo.beastsType">
				            <template v-for="item in (dataInfo.beastsType).split(',')">{{ item | dictionaryConvert(constants.es_beasts_type) }}
				            </template>
				      </template> -->
	              		<template v-if="dataInfo.beastsType">
	              			<template v-for="(item,index) in (dataInfo.beastsType).split(',')">
	              					  <template v-if="index == (dataInfo.beastsType).split(',').length - 1">
	              					  	{{ item | dictionaryConvert(constants.es_beasts_type) }}
	              					  </template>
	              					  <template v-else>
	              					  	{{ item | dictionaryConvert(constants.es_beasts_type) }}，
	              					  </template>
	              			</template>
	              		</template>
	              </td>
	              <th>清粪/养殖方式</th>
	              <td>
<!-- 		              <template v-if="dataInfo.breedType">
				            <template v-for="item in (dataInfo.breedType).split(',')">{{ item | dictionaryConvert(constants.es_breed_type) }}
				            </template>
				      </template> -->
	              		<template v-if="dataInfo.breedType">
	              			<template v-for="(item,index) in (dataInfo.breedType).split(',')">
	              					  <template v-if="index == (dataInfo.breedType).split(',').length - 1">
	              					  	{{ item | dictionaryConvert(constants.es_breed_type) }}
	              					  </template>
	              					  <template v-else>
	              					  	{{ item | dictionaryConvert(constants.es_breed_type) }}，
	              					  </template>
	              			</template>
	              		</template>
	              </td>
	          </tr>
	          <tr>
	              <th>是否有排污口</th>
	              <td>
	              <!-- {{dataInfo.hasOutlet}} -->
					  <template v-if="dataInfo.hasOutlet && dataInfo.hasOutlet == '1'">是</template>
					  <template v-if="dataInfo.hasOutlet && dataInfo.hasOutlet == '0'">否</template>
	              </td>
	          </tr>
	      </table>
	    </section>
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
  	          	<tr v-if="loading&&dataInfo&&dataInfo.data.length==0">
  	          		<td class="al_center" colspan="8">{{constants.no_data_text}}</td>
  	          	</tr>
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
	            	<template v-if="item.itemTwo && item.itemTwo.code == '8'">
	            		<td>{{item.itemTwo.elemetName}}</td>
	            		<td class="al_center">{{item.itemTwo.elementUnit}}</td>
	            		<td class="al_center">{{item.itemTwo.code}}</td>
	            		<td class="al_center">
	            			<template v-if="item.itemTwo.value"
	            					  v-for="valueA in (item.itemTwo.value).split('+')">{{ valueA | dictionaryConvert(constants.es_use_fertilizer_solid) }}
	            			</template>
	            		</td>
	            	</template>
	            	<template v-else-if="item.itemTwo && item.itemTwo.code == '13'">
	            		<td>{{item.itemTwo.elemetName}}</td>
	            		<td class="al_center">{{item.itemTwo.elementUnit}}</td>
	            		<td class="al_center">{{item.itemTwo.code}}</td>
	            		<td class="al_center">
	            			<template v-if="item.itemTwo.value"
	            					  v-for="valueB in (item.itemTwo.value).split('+')">{{ valueB | dictionaryConvert(constants.es_use_fertilizer_liquid) }}
	            			</template>
	            		</td>
	            	</template>
	             	<template v-else-if="!item.itemTwo">
	            		<td>&nbsp;</td>
	            		<td>&nbsp;</td>
	            		<td>&nbsp;</td>
	            		<td>&nbsp;</td>
	            	</template>
	            	<template v-else>
	            		<td>{{item.itemTwo.elemetName}}</td>
	            		<td class="al_center">{{item.itemTwo.elementUnit}}</td>
	            		<td class="al_center">{{item.itemTwo.code}}</td>
	            		<td class="al_center">{{item.itemTwo.value}}</td>
	            	</template>
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
			dataInfo: {},
			child1: {},
			child2: {},
			num: 0,
			valueList: []
		}
	},
	props: {
    esSopObj: Object,
    evnTitle: Array
  },
	created(){
		this.queryData()
	},
  mounted(){
    console.log()
    this.title = this.evnTitle[0].title
  },
	methods:{
		queryData(){
			mapPolluteEpHttp.queryEsStatisticsSeven(this.esSopObj).then((result) => {
			  	if(result.data && result.data.length > 0){
					this.dataInfo = result.data[0];
					if(this.dataInfo.childs[1]){
						this.child1 = this.dataInfo.childs[1];
						if(this.child1.values.length > this.num){
							this.num = this.child1.values.length;
						}
					}
					if(this.dataInfo.childs[2]){
						this.child2 = this.dataInfo.childs[2];
						if(this.child2.values.length > this.num){
							this.num = this.child2.values.length;
						}
					}
					//console.log(this.num);
					this.valueList = this.merge(this.child1,this.child2);
					//console.log(this.valueList);
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
