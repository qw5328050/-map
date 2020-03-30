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
            <label>监测点位：</label>
            <zt-select style="width:180px" v-model="pointCode">
              <zt-option v-for="item in pointCodeList"
                         :key="item.pointCode"
                         :label="item.pointName"
                         :value="item.pointCode">
              </zt-option>
            </zt-select>
          </div>
          <button type="submit" class="btn btn-primary btn-sm" @click="handleChaxun">查询</button>
          <button type="submit" class="btn btn-default  btn-sm" @click="listExport">导出</button>
        </div>
      </div>
      <div class="panel-table">
        <zt-table :data="manualPageList" ref="table" style="width: 100%;" class="table mid-padding light-blue-th table-border-outer">
          <zt-column width="70" label="序号">
            <template slot-scope="scope">
              {{orderIndex(scope)}}
            </template>
          </zt-column>
          <zt-column prop="monitorTime" width="220" label="监测时间"  align="center"></zt-column>
          <zt-column prop="cod" width="200" label="化学需氧量（mg/L）" align="center"></zt-column>
          <zt-column prop="an" width="200" label="氨氮（mg/L）" align="center"></zt-column>
          <zt-column prop="p" width="200" label="总磷（mg/L）" align="center"></zt-column>
          <zt-column prop="n" width="200" label="总氮（mg/L）" align="center"></zt-column>
        </zt-table>
        <!-- 分页 -->
        <zt-pagination
          v-if="manualPageList && manualPageList.length > 0"
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
  import polluteAsourceFileHttp from '@/https/pollute/polluteAsourceFileHttp'
  export default {
    name: 'manual-monitoring',
    props: {
      itemData: Object
    },
    components: {
    },
    data() {
      let now = moment(new Date())
      let initPDay = now.subtract(1, 'days').format('YYYY-MM-DD')
      let initTime = '2010-01-01'
      //let initNotBeforehour = moment(initPDay).add(-1, 'day').format('YYYY-MM-DD')
      let initNotBeforehour = moment(initTime).format('YYYY-MM-DD')
      let initNotAfter = moment(initPDay).add(0, 'days').format('YYYY-MM-DD')
      return {
        beginDay: initNotBeforehour,
        notAfter: initNotAfter,
        endDay: initNotAfter,
        format: 'YYYY-MM-DD',
        pointCode: '',
        pointCodeList: [],
        manualPageList: [],
        pageSize: 10,
        pageNo: 1,
        gasWantotal: 0,
        smallpagination: false,
      }
    },
    created(){
      this.getpointCodeList()
    },
    methods: {
      // 获取工艺字典
      getpointCodeList () {
        let params = {
          sopId: this.itemData.id
        }
        polluteAsourceFileHttp.getManualPointList(params)
          .then(res => {
            this.pointCodeList = res.data
            //为了皇台电厂有数据，特意修改
            if(res.data.length>1){
              this.pointCode = res.data[1].pointCode
            }else{
              this.pointCode = res.data[0].pointCode
            }

          })
      },
      // 获取电量数据
      getManualList () {
        let params = {
          page:this.pageNo,
          size:this.pageSize,
          sopId: this.itemData.id,
          pointCode: this.pointCode,
          beginDate: this.beginDay,
          endDate: this.endDay
        }
        polluteAsourceFileHttp.getManualPageList(params)
          .then(res => {
            this.manualPageList = res.data.data
            this.gasWantotal = res.data.total
          })
      },
      // 查询
      handleChaxun () {
        this.getManualList()
      },
      listExport(){
        let params = {
          sopId: this.itemData.id,
          pointCode: this.pointCode,
          beginDate: this.beginDay,
          endDate: this.endDay
        }
        polluteAsourceFileHttp.getSopMwdManualExport(params)
          .then(response => {
            const content = response;
            const blob = new Blob([content], {type: 'application/ms-excel'});
            const fileName = '手工监测.xls';
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
      orderIndex(scope) {
        return (this.pageNo - 1) * this.pageSize + scope.$index + 1;
      },
      handlePgChange(pageNo, pageSize) {
        this.pageNo = pageNo;
        this.pageSize = pageSize
        this.getManualList()
      },
      handleBeginDayInput () {
      },
      handleEndDayInput () {
      },
    },
    watch: {
      pointCode: {
        handler (newV, oldV) {
          this.getManualList(newV)
        },
        deep: true
      }
    }
  }
</script>

<style scoped>

</style>
