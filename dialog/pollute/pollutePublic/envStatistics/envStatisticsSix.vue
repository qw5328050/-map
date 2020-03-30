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
	          <dt>表号：</dt>
	          <dd></dd>
	        </dl>
	      </div>
	      <div class="base-info-item">
	        <dl>
	          <dt>填表人：</dt>
	          <dd></dd>
	        </dl>
	      </div>
	      <div class="base-info-item">
	        <dl>
	          <dt>填表日期：</dt>
	          <dd>2018年11月29日</dd>
	        </dl>
	      </div>
	    </section>
	    <!-- 表格信息 -->
	    <section class="table-list mb_15">
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
		            <!-- <th>机组1</th>
		            <th>机组2</th>
		            <th>机组3</th>
		            <th>机组4</th>
		            <th>机组5</th>
		            <th>机组6</th>
		            <th>机组7</th> -->
								<th v-for="name in nameList">{{name}}</th>
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
								<td class="al_center"  v-for="name in nameList">{{item[name]}}</td>
					<!-- 			<td class="al_center">{{item['机组2']}}</td>
								<td class="al_center">{{item['机组3']}}</td>
								<td class="al_center">{{item['机组4']}}</td>
								<td class="al_center">{{item['机组5']}}</td>
								<td class="al_center">{{item['机组6']}}</td>
								<td class="al_center">{{item['机组7']}}</td> -->
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
			dataList:[],
			nameList:[],
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
			mapPolluteEpHttp.queryEsStatisticsTwo(this.esSopObj).then((result) => {
				if(result.result && result.result.length > 0){
						let data = result.result[0];
						if(data.childs&&data.childs.length>0){
							let child = data.childs[0];
							let {dataArr,nameArr} = this.formatData(child.values);
							this.dataList = dataArr;
							this.nameList = nameArr;
						}
						this.dataInfo = data;
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
