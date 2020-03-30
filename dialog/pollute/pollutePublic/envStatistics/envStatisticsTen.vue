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
            <dd>{{dataInfo.fillDate | dateConvert('YYYY年MM月DD日')}}</dd>
          </dl>
        </div>
      </section>
      <!-- 表格信息-表一 -->
      <!-- 表格信息-表一 -->
      <section class="table-list mb_15" v-for="(item,index) in dataList">
        <table v-if="item.length>0" class="table small-padding table-complex table-bordered light-blue-th">
          <thead>
            <tr>
              <th v-for="o in item[0]">{{o.name}}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="data in item">
                <td v-for="o in data" class="al_center">{{o.value}}</td>
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
    console.log()
    this.title = this.evnTitle[0].title
  },
	methods:{
		queryData(){
			mapPolluteEpHttp.queryEsStatisticsSix(this.esSopObj).then((result) => {
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
			}).catch((error) => {
				this.loading = true;
			})
		},
		formatData(list){
      let tempArr = new Array();
      let o = setObj(list);
      while(hasProp(o)){
        tempArr.push(o);
        o = setObj(list);
      }
      function setObj(dataList){
        let tmp = {},obj = {};
        let tempArr = [];
        for (let i = 0;  i< dataList.length; i++) {
          let item = dataList[i];
          if (item.elementId&&!tmp[item.elementId]) {
            tmp[item.elementId] = 1;
            obj[item.elementId] = {
              name:item.elemetName,
              value:item.value
            };
            dataList[i] = {};
          }
        }
        return obj;
      }
      function hasProp(obj){
        let hasProp = false;
        for (let prop in obj){
          hasProp = true;
          break;
        }
        return hasProp;
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
