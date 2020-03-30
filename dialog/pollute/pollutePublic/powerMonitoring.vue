<template>
  <div class="popbox-detail-content online-monitoring">
    <!-- 基本情况表 -->
    <div class="panel-wrapper">
      <div class="panel-search">
        <div class="form-inline">
          <div class="form-group">
            <div class="form-group" style="display: inline-block;vertical-align: top;">
              <label>时间范围：</label>
              <zt-date-picker
                v-model="beginDay"
                style="width:120px;display: inline-block;vertical-align: middle;"
                :clearable="false"
                type="date"
                :format="format"
                :not-after="notAfter"
                @input="handleBeginDayInput">
              </zt-date-picker>
              至
              <zt-date-picker
                ref="pickerTwo"
                v-model="endDay"
                style="width:120px;display: inline-block;vertical-align: middle;"
                :clearable="false"
                type="date"
                :format="format"
                :not-before="beginDay"
                :not-after="notAfter"
                @input="handleEndDayInput">
              </zt-date-picker>
            </div>
          </div>
          <div class="form-group ml_15">
            <label>工艺名称：</label>
            <zt-select style="width:180px" v-model="techId">
              <zt-option v-for="item in techIdList"
                         :key="item.techId"
                         :label="item.techName"
                         :value="item.techId">
              </zt-option>
            </zt-select>
          </div>
          <button type="submit" class="btn btn-primary btn-sm" @click="handleChaxun">查询</button>
          <!--<button type="submit" class="btn btn-default  btn-sm" @click="handleReset">重置</button>-->
        </div>

      </div>
      <section class="chart-box mb_30">
        <line-chart2 style="height: 400px;"
                     :option="option1"
                     :dataList="dataList1"
        ></line-chart2>
      </section>
      <section class="chart-box mb_30">
        <line-chart2 style="height: 400px;"
                     :option="option2"
                     :dataList="dataList2"
        ></line-chart2>
      </section>
    </div>
  </div>
</template>

<script>
  import moment from 'moment'
  import polluteAsourceFileHttp from '@/https/pollute/polluteAsourceFileHttp'
  import lineChart2 from './chart/lineChart2'
  export default {
    name: 'power-monitoring',
    props: {
      itemData: Object
    },
    components: {
      lineChart2
    },
    data() {
      let now = moment(new Date())
      let initPDay = now.subtract(1, 'days').format('YYYY-MM-DD')
      let initNotBeforehour = moment(initPDay).add(-1, 'day').format('YYYY-MM-DD')
      let initNotAfter = moment(initPDay).add(0, 'days').format('YYYY-MM-DD')
      return {
        beginDay: initNotBeforehour,
        notAfter: initNotAfter,
        endDay: initNotAfter,
        format: 'YYYY-MM-DD',
        techId: '',
        techIdList: [],
        option1: {
          title: {
            text: '治污设备用电量',
            left: 'center'
          }
        },
        dataList1: [],
        option2: {
          title: {
            text: '生产设备用电量',
            left: 'center'
          },
          legend: {
            top: '8%',
            left: '10%',
            right: '10%'
          }
        },
        dataList2: [],
        timeFlag: true
      }
    },
    created(){
      this.getTechIdList()
    },
    methods: {
      // 获取工艺字典
      getTechIdList () {
        let params = {
          sopId: this.itemData.id
        }
        polluteAsourceFileHttp.getTechIdList(params)
          .then(res => {
            this.techIdList = res.data
            this.techId = res.data[0].techId
          })
      },
      // 获取电量数据
      getPowerList () {
        this.time()
        if(!this.timeFlag) {
          this.$ztAlert('查询时间范围不能超过三天')
          return
        }
        let params = {
          sopId: this.itemData.id,
          techId: this.techId,
          beginDate: this.beginDay,
          endDate: this.endDay
        }
        polluteAsourceFileHttp.getPowerList(params)
          .then(res => {
            this.dataList1 = res.data.scsb
            this.dataList2 = res.data.zwsb
          })
      },
      // 查询
      handleChaxun () {
        this.getPowerList()
      },
      time(){
        let stime = Date.parse(new Date(this.beginDay))
        let etime = Date.parse(new Date(this.endDay))
        let usedTime = etime - stime
        if(usedTime < 259200000){
          this.timeFlag = true
        } else {
          this.timeFlag = false
        }
      },
      handleBeginDayInput () {
      },
      handleEndDayInput () {
      },
    },
    watch: {
      techId: {
        handler (newV, oldV) {
          this.getPowerList(newV)
        },
        deep: true
      }
    }
  }
</script>

<style scoped>

</style>
