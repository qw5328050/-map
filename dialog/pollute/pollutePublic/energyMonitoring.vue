<template>
  <div class="popbox-detail-content online-monitoring">
    <!-- tab页 -->
    <div class="tab-boder no-bg flex-start has-border sub-tab">
      <div class="tab-item" :class="{'cur':curReportTab=='gasMonth'}" @click="reportTabClick('gasMonth')">耗电量(月报)</div>
      <div class="tab-item" :class="{'cur':curReportTab=='gasYear'}"  @click="reportTabClick('gasYear')">耗电量(年报)</div>
    </div>
    <!-- 基本情况表 -->
    <div class="sub-tab-content" v-if = "curReportTab=='gasMonth'">
      <section class="actions">
        <!-- tab页 -->
        <div class="tab-group">
          <a href="javascript:void(0);"  v-for="(item,index) in linesData" class="tab-item tab-middle tab-border-primary radius-lg" :class="{'cur':curLineMonth==item.id}" @click="lineMonthClick(item.id)">{{item.name}}</a>
        </div>
        <!-- 下拉菜单 -->
        <div class="time-form">
          <date-picker v-model="monthModel.year" format="YYYY年" dateFormat="YYYY" type="year" placeholder="年份"
                                 style="width:100px;"></date-picker>
          <zt-select style="width:60px;margin-left:15px;" v-model="monthModel.month" placeholder="月份">
            <zt-option v-for="item in monthList"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value">
            </zt-option>
          </zt-select>
        </div>
      </section>
      <!-- 生产设备用电量-月 -->
      <section class="chart-box mb_30">
        <h3 class="form-item-name">生产设备用电量</h3>
        <produce-month-chart style="height:273px;width:100%" :dataList="produceMonthData" itemName="time" itemValue="value"></produce-month-chart>
      </section>
      <!-- 治污设备用电量-月 -->
      <section class="chart-box">
         <h3 class="form-item-name">治污设备用电量</h3>
         <pollution-month-chart style="height:273px;width:100%" :dataList="pollutionMonthData" itemName="time" itemValue="value"></pollution-month-chart>
      </section>
    </div>

    <div class="sub-tab-content" v-if = "curReportTab=='gasYear'">
      <section class="actions">
        <!-- tab页 -->
        <div class="tab-group" v-for="(item,index) in linesData">
          <a href="javascript:void(0);" class="tab-item tab-middle tab-border-primary radius-lg" :class="{'cur':curLineYear==item.id}" @click="lineYearClick(item.id)">{{item.name}}</a>
        </div>
        <!-- 下拉菜单 -->
        <div class="time-form">
          <date-picker v-model="yearModel.year" format="YYYY年" dateFormat="YYYY" type="year" placeholder="年份"
                                 style="width:100px;"></date-picker>
        </div>
      </section>
      <!-- 生产设备用电量-年 -->
      <section class="chart-box mb_30">
        <h3 class="form-item-name">生产设备用电量</h3>
        <produce-year-chart style="height:273px;width:100%" xUnit="月" :dataList="produceYearData" itemName="time" itemValue="value"></produce-year-chart>
      </section>
      <!-- 生产设备用电量-年 -->
      <section class="chart-box">
         <h3 class="form-item-name">治污设备用电量</h3>
         <pollution-year-chart style="height:273px;width:100%" xUnit="月" :dataList="pollutionYearData" itemName="time" itemValue="value" ></pollution-year-chart>
      </section>
    </div>
  </div>
</template>
<script>
  import mapPollutePublicHttp from '@/https/map/mapPollutePublicHttp'
  import {deepExtend} from '@/utils/util'
  import singleLineChart from './chart/lineChart.vue'
  import multiLineChart from './chart/onLineMonitoringChart.vue'
  export default {
    components: {
      produceMonthChart:singleLineChart,
      pollutionMonthChart:singleLineChart,
      produceYearChart:singleLineChart,
      pollutionYearChart:singleLineChart,
    },
    props: {
      itemData: Object
    },
    data() {
      return {
        linesData:[],
        curLineMonth:'',
        curLineYear:'',
        produceMonthData:[],
        produceYearData:[],
        pollutionMonthData:[],
        pollutionYearData:[],
        monthModel:{
          year:'',
          month:'',
        },  
        yearModel:{
          year:'',
        },                
//*********************************************
        curReportTab: 'gasMonth',
        monthList:[{name:'1月',value:'01'},{name:'2月',value:'02'},{name:'3月',value:'03'},{name:'4月',value:'04'},{name:'5月',value:'05'},{name:'6月',value:'06'},{name:'7月',value:'07'},{name:'8月',value:'08'},{name:'9月',value:'09'},{name:'10月',value:'10'},{name:'11月',value:'11'},{name:'12月',value:'12'}],
      };
    },
    created() {
      this.getProductLine();
      var date = new Date;
      var currentYear = date.getFullYear(); 
      var currentMonth = date.getMonth()+1;
      currentMonth =(currentMonth<10 ? "0"+ currentMonth : currentMonth); 
      this.monthModel.year = currentYear + '';
      this.monthModel.month = currentMonth + '';
      this.yearModel.year = currentYear + '';
    },
    methods: {
      getProductLine(){
        let sopId = this.itemData.id;
        mapPollutePublicHttp.getProductLine(sopId).then((result) => {
          if(result.data && result.data.length > 0){
            this.linesData = result.data;
            this.curLineMonth = result.data[0].id;
            this.curLineYear = result.data[0].id;
            this.getElectricityMonth();
            this.getElectricityYear();
          }
        }).catch((error) => {

        })
      },
      lineMonthClick(lineId){
        if(this.curLineMonth == lineId)return;
        this.curLineMonth = lineId;
        this.getElectricityMonth();
      },
      lineYearClick(lineId){
        if(this.curLineYear == lineId)return;
        this.curLineYear = lineId;
        this.getElectricityYear();
      },      
      getElectricityMonth(){
        let year = new Date(this.monthModel.year).getFullYear() + '';
        let month = this.monthModel.month;
        let paramsProduce = {
          lineId:  this.curLineMonth,
          time: year + '-' + month,
          itemType: '0'
        }
        let paramsPollution = {
          lineId:  this.curLineMonth,
          time: year + '-' + month,
          itemType: '1'
        }    
        if(this.curLineMonth){
          mapPollutePublicHttp.getElectricityMonth(paramsProduce).then((result) => {
            if(result.data && result.data.length > 0){
              this.produceMonthData = result.data;
            }else{
              this.produceMonthData = [];
            }
          }).catch((error) => {

          })   
          mapPollutePublicHttp.getElectricityMonth(paramsPollution).then((result) => {
            if(result.data && result.data.length > 0){
              this.pollutionMonthData = result.data;
            }else{
              this.pollutionMonthData = [];
            }
          }).catch((error) => {

          })            
        }    
                     
      },
      getElectricityYear(){
        let year = new Date(this.yearModel.year).getFullYear() + '';
        let paramsProduce = {
          lineId:  this.curLineYear,
          time: year,
          itemType: '0'
        }
        let paramsPollution = {
          lineId:  this.curLineYear,
          time: year,
          itemType: '1'
        } 
        if(this.curLineYear){
          mapPollutePublicHttp.getElectricityYear(paramsProduce).then((result) => {
            if(result.data && result.data.length > 0){
              this.produceYearData = result.data;
            }else{
              this.produceYearData = [];
            }
          }).catch((error) => {

          }) 

          mapPollutePublicHttp.getElectricityYear(paramsPollution).then((result) => {
            if(result.data && result.data.length > 0){
              this.pollutionYearData = result.data;
            }else{
              this.pollutionYearData = [];
            }
          }).catch((error) => {

          })            
        }
      },      
      reportTabClick(type){
        if(this.curReportTab == type)return;
        this.curReportTab = type;
      },
    },
    watch: {
      monthModel:{
        handler(newV, oldV) {
            this.getElectricityMonth();
        },
        deep: true
      },
      yearModel:{
        handler(newV, oldV) {
            this.getElectricityYear();
        },
        deep: true
      },      
//***********************************************************
    }
  };
</script>
<style>

</style>
