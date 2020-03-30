<template>
  <div class="popbox-detail-content online-monitoring">
    <!-- 基本情况表 -->
    <div class="panel-wrapper">
      <div class="panel-search">
        <div class="form-inline">
          <div class="radio-group">
            <label class="radio mr_15" @click="ischeckedTab = 0;ischeckedTabName = 'hour'">
              <span class="radio__input" :class="ischeckedTab == 0 ? 'is-checked' : ''">
                  <span class="radio__inner"></span>
                  <input type="radio" class="radio__original">
              </span>
              <span class="radio__label">小时数据</span>
            </label>
            <label class="radio mr_15" @click="ischeckedTab = 1;ischeckedTabName = 'day'">
              <span class="radio__input" :class="ischeckedTab == 1 ? 'is-checked' : ''">
                  <span class="radio__inner"></span>
                  <input type="radio" class="radio__original">
              </span>
              <span class="radio__label">日数据</span>
            </label>
            <label class="radio mr_15" @click="ischeckedTab = 2;ischeckedTabName = 'month'">
              <span class="radio__input" :class="ischeckedTab == 2 ? 'is-checked' : ''">
                  <span class="radio__inner"></span>
                  <input type="radio" class="radio__original">
              </span>
              <span class="radio__label">月数据</span>
            </label>
          </div>
          <div class="form-group">
            <div class="form-group" style="display: inline-block;vertical-align: top;">
              <!--<label>时间跨度：</label>-->
              <zt-date-picker
                v-model="beginDay"
                style="width:120px;display: inline-block;vertical-align: middle;"
                :clearable="false"
                type="date"
                format="YYYY-MM-DD"
                :not-after="notAfter"
                @input="handleBeginDayInput">
              </zt-date-picker>
              至
              <zt-date-picker
                v-model="endDay"
                style="width:120px;display: inline-block;vertical-align: middle;"
                :clearable="false"
                type="date"
                format="YYYY-MM-DD"
                :not-before="beginDay"
                :not-after="notAfter"
                @input="handleEndDayInput">
              </zt-date-picker>
            </div>
          </div>
          <button type="submit" class="btn btn-primary btn-sm" @click="handleChaxun">查询</button>
          <!--<button type="submit" class="btn btn-default  btn-sm" @click="handleReset">重置</button>-->
        </div>
      </div>

      <section class="chart-box" v-if="sopJzgdList && sopJzgdList.length > 0">
        <!--<img src="../../base/images/temporary/data-map-05.png" alt="">-->
        <barChart
          :barDataList="sopJzgdList"
          item-name="monitorTime"
          item-value0="density"
          item-value1="fqpflvalue"
          :option="option1"
          style="width:100%;height:300px;"
        ></barChart>
      </section>

      <div class="panel-table">
        <div class="action">
          <button type="submit" class="btn btn-primary btn-sm" @click="listExport">导出</button>
        </div>
        <zt-table :data="sopJzgdPageList" ref="table" style="width: 100%;" class="table mid-padding light-blue-th table-border-outer">
          <zt-column width="70" label="序号">
            <template slot-scope="scope">
              {{orderIndex(scope)}}
            </template>
          </zt-column>
          <zt-column prop="monitorTime" width="200" label="监测时间"  align="center"></zt-column>
          <zt-column prop="factor" width="220" label="监测指标" align="center"></zt-column>
          <zt-column prop="density" width="180" label="浓度（ug/m3）" align="center"></zt-column>
          <zt-column prop="fqpflvalue" width="140" label="排放量（kg）" align="center"></zt-column>
        </zt-table>
        <!-- 分页 -->
        <zt-pagination
          layout="total,prev, pager, next"
          :page-size="pageSize"
          :currentPage="pageNo"
          :total="gasWantotal"
          :small="smallpagination"
          :pagerCount="5"
          @change="handlePgChange"
        ></zt-pagination>
      </div>
    </div>
  </div>
</template>
<script>
  import moment from 'moment'
  import barChart from '@/views/modules/pollute/echart/barChart.vue'
  import mapPollutePublicHttp from '@/https/map/mapPollutePublicHttp'
  import polluteAsourceFileHttp from '@/https/pollute/polluteAsourceFileHttp'
  import {deepExtend} from '@/utils/util'
  import {getDictListByKey} from '@/components/_public/zt/dictionary/index'
  export default {
    components: {
      barChart
    },
    props: {
      itemData: Object
    },
    data() {
      let now = moment(new Date())
//      let hour = now.hours()
//      let initPDay = hour >= 20 ? now.format('YYYY-MM-DD') : now.subtract(1, 'days').format('YYYY-MM-DD')
      let initPDay = now.subtract(1, 'days').format('YYYY-MM-DD')
      let initNotBefore = moment(initPDay).add(-1095, 'days').format('YYYY-MM-DD')
      let initNotAfter = moment(initPDay).add(1, 'days').format('YYYY-MM-DD')
      return {
        curReportTab: 'gasMonth',
        monthList:[{name:'1月',value:'01'},{name:'2月',value:'02'},{name:'3月',value:'03'},{name:'4月',value:'04'},{name:'5月',value:'05'},{name:'6月',value:'06'},{name:'7月',value:'07'},{name:'8月',value:'08'},{name:'9月',value:'09'},{name:'10月',value:'10'},{name:'11月',value:'11'},{name:'12月',value:'12'}],

        pageSize: 10,
        pageNo: 1,
        gasWantotal: 0,
        smallpagination: false,
        beginDay: initNotBefore,
        notAfter: initNotAfter,
        endDay: initNotAfter,
        ischeckedTab: 0,
        ischeckedTabName: 'hour',
        dataList: [],
        hasPageListFlag: false,
        sopJzgdList: [],
        sopJzgdPageList: [],
        option1: {
          legend: {
            data: ['PM₁₀', 'PM₂.₅']
          },
          series: [
            {
              name: 'PM₁₀',
              itemStyle: {
                normal: {
                  color: "#0f97f6"
                }
              }
            },
            {
              name: 'PM₂.₅',
              itemStyle: {
                normal: {
                  color: "#ffb94d"
                }
              }
            }
          ]
        }
      }
    },
    created() {
      this.init()
    },
    methods: {
      init(){
        this.getSopJzgdList()
        this.getSopJzgdPageList()
      },
      orderIndex(scope) {
        return (this.pageNo - 1) * this.pageSize + scope.$index + 1;
      },
      getSopJzgdList(){
        let params = {
          monitorDateFrom: this.beginDay,
          monitorDateTo: this.endDay,
          dataType: this.ischeckedTabName,
          sopId: this.itemData.id
        }
        polluteAsourceFileHttp.getSopJzgdList(params)
          .then(res => {
            console.log('sopJzgdList:', res.data)
            this.sopJzgdList = res.data
          }).catch((error) => {
          })
      },
      getSopJzgdPageList(){
        let params = {
          monitorDateFrom: this.beginDay,
          monitorDateTo: this.endDay,
          dataType: this.ischeckedTabName,
          sopId: this.itemData.id,
          page: this.pageNo,
          limit: this.pageSize
        }
        polluteAsourceFileHttp.getSopJzgdPageList(params)
          .then(res => {
            console.log('getSopJzgdPageList:', res.data)
            this.sopJzgdPageList = res.data
          }).catch((error) => {
        })
      },
      handleChaxun(){
        this.getSopJzgdList()
        this.getSopJzgdPageList()
      },
      listExport(){
        let params = {
          monitorDateFrom: this.beginDay,
          monitorDateTo: this.endDay,
          dataType: this.ischeckedTabName,
          sopId: this.itemData.id
        }
        polluteAsourceFileHttp.getSopJzgdExport(params)
          .then(response => {
            const content = response;
            const blob = new Blob([content], {type: 'application/ms-excel'});
            const fileName = '扬尘监测.xls';
            if ('download' in document.createElement('a')) { // 非IE下载
              const elink = document.createElement('a');
              elink.download = fileName;
              elink.style.display = 'none';
              elink.href = URL.createObjectURL(blob);
              document.body.appendChild(elink);
              elink.click();
              URL.revokeObjectURL(elink.href); // 释放URL 对象
              document.body.removeChild(elink);
            } else { // IE10+下载
              navigator.msSaveBlob(blob, fileName);
            }
          })
      },
      handlePgChange(pageNo, pageSize) {
        this.pageNo = pageNo;
        this.pageSize = pageSize;
        this.getSopJzgdPageList()
      },
      // 开始日期
      handleBeginDayInput(){
      },
      // 结束日期
      handleEndDayInput(){
      },

    },
    watch: {
      gasMonthModel: {
        handler(newV, oldV) {
          this.getWasteGasMonthReport(this.gasPolluteObj[this.curGasMonthPollute]);
        },
        deep: true
      },
      gasYearModel: {
        handler(newV, oldV) {
          this.getWasteGasYearReport(this.gasPolluteObj[this.curGasYearPollute]);
        },
        deep: true
      },
      waterMonthModel: {
        handler(newV, oldV) {
          this.getWasteWaterMonthReport(this.waterPolluteObj[this.curWaterMonthPollute]);
        },
        deep: true
      },
      waterYearModel: {
        handler(newV, oldV) {
          this.getWasteWaterYearReport(this.waterPolluteObj[this.curWaterYearPollute]);
        },
        deep: true
      }
    }
  };
</script>
<style>

</style>
