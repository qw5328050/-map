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
	          <dt>组织机构代码：</dt>
	          <dd>{{dataInfo.organizationCode}}</dd>
	        </dl>
	      </div>
	      <div class="base-info-item">
	        <dl>
	          <dt>填报单位详细名称(公章)：</dt>
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
	          <dd>基101表</dd>
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
	      <h3 class="form-item-name">工业企业基本信息</h3>
	      <table class="table-info light-blue-th table-baseInfo">
	          <tr>
	              <th style="width: 20%">法定代表人</th>
	              <td style="width: 30%">{{dataInfo.legalRepresentative}}</td>
	              <th style="width: 20%">行政区划代码</th>
	              <td style="width: 30%">{{dataInfo.countyCode}}</td>
	          </tr>
	          <tr>
	              <th>详细地址</th>
	              <td>{{dataInfo.province}} {{dataInfo.city}} {{dataInfo.county}} {{dataInfo.street}} 							{{dataInfo.address}}</td>
	              <th>企业地理位置</th>
	              <td>
	              	<span>
	              		中心经度：
	              		{{dataInfo.lngDegree}}°{{dataInfo.lngPoints}}′{{dataInfo.lngSeconds}}″
	              	</span>
	              	<span class="ml_10">
	              		中心纬度：
	              		{{dataInfo.latDegree}}°{{dataInfo.latPoints}}′{{dataInfo.latSeconds}}″
	              	</span>
	              </td>
	          </tr>
	          <tr>
	              <th>联系人</th>
	              <td>{{dataInfo.manager}}</td>
	              <th>电话号码</th>
	              <td>{{dataInfo.managerFixphone}}</td>
	          </tr>
	          <tr>
	              <th>传真号码</th>
	              <td>{{dataInfo.faxNumber}}</td>
	              <th>邮政编码</th>
	              <td>{{dataInfo.postalCode}}</td>
	          </tr>
	          <tr>
	              <th>登记注册类型</th>
	              <td>
		              	<template v-if="dataInfo.registerType">
		              		<template v-for="item in (dataInfo.registerType).split(',')">{{ item | dictionaryConvert(constants.es_register_type) }}</template>
		              	</template>
	              </td>
	              <th>企业规模</th>
	              <td>
		              	<template v-if="dataInfo.scale">
		              		<template v-for="item in (dataInfo.scale).split(',')">{{ item | dictionaryConvert(constants.es_scale) }}</template>
		              	</template>
	              </td>
	          </tr>
	          <tr>
	              <th>行业类别</th>
	              <td>{{dataInfo.industryCategoryName}}</td>
	              <th>开业时间</th>
	              <!-- <td>{{dataInfo.businessTime}}</td>  -->
	              <td>{{dataInfo.businessTime | dateConvert('YYYY年MM月') }}</td>
	          </tr>
	          <tr>
	              <th>所在流域名称</th>
	              <td>{{dataInfo.basinName}}</td>
	              <th>排水去向类型</th>
	              <td>{{dataInfo.directionTypeName}}</td>
	          </tr>
	          <tr>
	              <th>排入的污水处理厂</th>
	              <td>{{dataInfo.treatmentPlantName}}</td>
	              <th>受纳水体</th>
	              <td>{{dataInfo.receivingWaterName}}</td>
	          </tr>
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
			dataInfo: {},
      title: ''
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
	  console.log('this.evnTitle:', this.evnTitle)
	  this.title = this.evnTitle[0].title
  },
	methods:{
		queryData(){
			mapPolluteEpHttp.queryEsStatisticsOne(this.esSopObj.esSopId).then((result) => {
			  	if(result.result && result.result.length > 0){
					this.dataInfo = result.result[0]
          console.log('this.dataInfo:', result.result)
				}
			}).catch((error) => {

			})
		}
	}
}

</script>

<style>

</style>
