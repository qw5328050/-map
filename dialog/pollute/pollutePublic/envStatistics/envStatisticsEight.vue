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
            <dd>基104表</dd>
          </dl>
        </div>
        <div class="base-info-item">
          <dl>
            <dt>填表人：</dt>
            <dd>{{dataInfo.fillPerson}}</dd>
          </dl>
        </div>
        <div class="base-info-item">
          <dl>
            <dt>填表日期：</dt>
            <dd>{{dataInfo.fillDate | dateConvert('YYYY年MM月DD日') }}</dd>
          </dl>
        </div>
      </section>
      <!-- 表格信息-表一 -->
       <section class="table-list mb_15" v-for="(item,index) in dataList">
        <table class="table small-padding table-complex table-bordered light-blue-th">
          <thead>
            <tr>
              <th style="width:30%">指标名称</th>
              <th>计量单位</th>
              <th>代码</th>
              <th  :colspan="num">本年实际</th>
            </tr>

            <tr v-if="item.nameArr&&item.nameArr.length>0">
              <th>甲</th>
              <th>乙</th>
              <th>丙</th>
              <th  v-if="index==0"
                   v-bind:colspan="item.nameArr.length == 1 ? num : 1"
                   v-for="name in item.nameArr">1</th>
              <th  v-if="index==1"
                   v-bind:colspan="item.nameArr.length == 1 ? num : 1"
                   v-for="name in item.nameArr">{{name}}</th>
              <!-- <th>1#</th>
              <th>2#</th>
              <th>3#</th>
              <th>4#</th>
              <th>5#</th>
              <th>6#</th> -->
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading&&item.dataArr&&item.dataArr.length==0">
              <td class="al_center" colspan="4">{{constants.no_data_text}}</td>
            </tr>
            <tr  v-for="data in item.dataArr">
              <td>{{data.elemetName}}</td>
              <td class="al_center">{{data.elementUnit}}</td>
              <td class="al_center">{{data.code}}</td>
              <!-- <td class="al_center"  v-for="name in item.nameArr">{{data[name]}}</td> -->
              <td class="al_center" v-if="index==0"
                                    v-bind:colspan="num"
                                    v-for="name in item.nameArr">{{data[name]}}</td>
               <td class="al_center" v-if="index!=0"
                                    v-for="name in item.nameArr">{{data[name]}}</td>
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
      num:1
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
			mapPolluteEpHttp.queryEsStatisticsFour(this.esSopObj).then((result) => {
				if(result.data && result.data.length > 0){
						let data = result.data[0];
            let tempArr = new Array();
						if(data.childs&&data.childs.length>0){
              for(let child of data.childs){
                tempArr.push(this.formatData(child.values));
              }
						}
						this.dataInfo = data;
            this.dataList = tempArr;
				}
				this.loading = true;
        //console.log(this.dataList);
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
      if(nameArr.length > this.num){
        this.num = nameArr.length;
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
