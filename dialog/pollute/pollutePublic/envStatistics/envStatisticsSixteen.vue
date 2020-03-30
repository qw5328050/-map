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
	          <dt>单位名称(公章)：</dt>
	          <dd>{{dataInfo.name}}</dd>
	        </dl>
	      </div>
	      <div class="base-info-item">
	        <dl>
	          <dt>经营许可证证书编号：</dt>
	          <dd>{{dataInfo.busilicenseCode}}</dd>
	        </dl>
	      </div>
	      <div class="base-info-item">
	        <dl>
	          <dt>表名：</dt>
	          <dd>基503表</dd>
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
	      <h3 class="form-item-name">危险废物（医疗废物）集中处理厂基本情况</h3>
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
	              <th>登记注册类型代码</th>
	              <td>{{dataInfo.registerType}}</td>
	          </tr>
	          <tr>
	              <th>企业规模</th>
	              <td>
		              	<template v-if="dataInfo.scale">
		              		<template v-for="item in (dataInfo.scale).split(',')">{{ item | dictionaryConvert(constants.es_scale) }}</template>
		              	</template>
	              </td>
	              <th>建成时间</th>
	              <td>
	              	    <template v-if="dataInfo.year">{{dataInfo.year}}年</template>
	              	    <template v-if="dataInfo.month">{{dataInfo.month}}月</template>
	              </td>
	          <tr>
	              <th>集中处理厂类型</th>
	              <td>
	              		<template v-if="dataInfo.handleType">
	              			<template v-for="(item,index) in (dataInfo.handleType).split(',')">
	              					  <template v-if="index == (dataInfo.handleType).split(',').length - 1">
	              					  	{{ item | dictionaryConvert(constants.es_handle_type) }}
	              					  </template>
	              					  <template v-else>
	              					  	{{ item | dictionaryConvert(constants.es_handle_type) }}，
	              					  </template>
	              			</template>
	              		</template>
	              </td>
	              <th>危险废物利用处置方式</th>
	              <td>
	              		<template v-if="dataInfo.handleWay">
	              			<template v-for="(item,index) in (dataInfo.handleWay).split(',')">
	              					  <template v-if="index == (dataInfo.handleWay).split(',').length - 1">
	              					  	{{ item | dictionaryConvert(constants.es_handle_way_danger) }}
	              					  </template>
	              					  <template v-else>
	              					  	{{ item | dictionaryConvert(constants.es_handle_way_danger) }}，
	              					  </template>
	              			</template>
	              		</template>
	              </td>
	          </tr>
	          <tr>
	              <th>排水去向类型</th>
	              <td>{{dataInfo.directionTypeName}}</td>
	              <th>排水去向代码</th>
	              <td>{{dataInfo.directionType}}</td>
	          </tr>
	          <tr>
	              <th>受纳水体名称</th>
	              <td>{{dataInfo.receivingWaterName}}</td>
	              <th>受纳水体代码</th>
	              <td>{{dataInfo.receivingWater}}</td>
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
			mapPolluteEpHttp.queryEsStatisticsTen(this.esSopObj.esSopId).then((result) => {
			  	if(result.data && result.data.length > 0){
					this.dataInfo = result.data[0]
				}
			}).catch((error) => {

			})
		}
	}
}

</script>

<style>

</style>
