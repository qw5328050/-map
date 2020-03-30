<template>
  <div class="tab-content">
    <div class="listInquireTitle">
      <div class="form-group" style="display: inline-block;vertical-align: top;">
        <zt-date-picker
          v-model="beginDay"
          class="focus-dataControl"
          style="width:120px;display: inline-block;vertical-align: middle;"
          :clearable="false"
          type="date"
          format="YYYY-MM-DD"
          :not-after="notAfter"
          @input="handleBeginDayInput">
        </zt-date-picker>
        至
        <zt-date-picker
          ref="pickerTwo"
          v-model="endDay"
          class="focus-dataControl"
          style="width:120px;display: inline-block;vertical-align: middle;"
          :clearable="false"
          type="date"
          format="YYYY-MM-DD"
          :not-before="beginDay"
          :not-after="notAfter"
          @input="handleEndDayInput">
        </zt-date-picker>
      </div>
      <div class="form-group" style="display: inline-block;vertical-align: top;">
        <zt-select v-model="dateType" style="min-width:40px;width: 60px;"
                   @change="getListInquireDate">
          <zt-option v-for="item in dateTypes"
                     :key="item.code"
                     :label="item.name"
                     :value="item.code"
          >
          </zt-option>
        </zt-select>
      </div>
      <div class="form-group daochu" @click="exportList">导出</div>
    </div>
    <div class="panel-table">
      <zt-table :data="dataList">
        <zt-column prop="monitorTime" label="时间"></zt-column>
        <zt-column v-if="params.type === 'hldm'" width="75"
                   prop="qualityLevel" label="水质级别"></zt-column>
        <zt-column v-for="(item, index) in columnList" :key="index"
                   :prop="item.code" :label="item.name"
                   :width="columnWidth" align="center"></zt-column>
      </zt-table>
      <zt-pagination
        v-if="dataList.length > 0"
        layout="total,prev, pager, next"
        :page-size="pageSize"
        :currentPage="pageNo"
        :total="total"
        :small="smallPagination"
        :pagerCount="5"
        @change="handlePgChange"
        style="height: 44px;"
      ></zt-pagination>
    </div>
  </div>
</template>

<script type="text/jsx">
  import mapDialogHttp from "@/https/map/mapDialogHttp";
  import moment from 'moment'
  import columnConfig from '@/views/modules/monitor/common/rightPanel/columnConfig'
  import baseDialog from '@/map/dialog/base/baseDialog'
  import {objectAssign} from '@/utils/util'
  let columnWidthConfig = {
    hldm: 70,
    yysy: 110,
    hlsgcy: 70,
  };

  let exportNameConfig = {
    hldm: '河流断面',
    yysy: '饮用水源',
    hlsgcy: '河流手工采样'
  }

  let routeConfig = {
    '1': 'mudCover',
    '2': 'mudWash',
    '3': 'plate',
    '4': 'largeVehicle',
    '5': 'dustStack',
    '6': 'sewageDischarge',
    '7': 'stationInvade',
    '8': 'chimneyDischarge',
    '9': 'strawBurning',
  };

  export default {
    props: {
      params: Object
    },
    mixins: [baseDialog],
    data(){
      let now = moment(new Date());
      let initPDay = now.subtract(1, 'days').format('YYYY-MM-DD')
      let initNotBefore2 = moment(initPDay).add(-1, 'days').format('YYYY-MM-DD')
      let initNotAfter = moment(initPDay).add(1, 'days').format('YYYY-MM-DD');
      return {
        columnList: columnConfig.getColumnConfig()[this.params.type],
        columnWidth: columnWidthConfig[this.params.type],
        dateTypes: [{name: '时', code: 'hour'}, {name: '日', code: 'day'}],
        dateType: 'hour',
        beginDay: initNotBefore2,
        notBefore: initNotBefore2,
        notAfter: initNotAfter,
        endDay: initNotAfter,

        dataList: [],
        total: 0,
        pageSize: 10,
        pageNo: 1,
        smallPagination: false,
      }
    },
    mounted(){
      this.getListInquireDate();
    },
    methods: {
      getListInquireDate(){
        let params = {
          dateType: this.dateType,
          startTime: this.beginDay + ' 00:00:00',
          endTime: moment(this.endDay).add(1, 'days').format('YYYY-MM-DD') + ' 00:00:00',
          siteCode: this.params.siteCode,
          type: this.params.type,
          page: this.pageNo,
          limit: this.pageSize
        };
        mapDialogHttp.getWaterHisTrend(params).then(response => {
          this.dataList = response.result.list;
          this.total = response.result.totalCount;
        })
      },
      exportList(){
        let params = {
          dateType: this.dateType,
          startTime: this.beginDay + ' 00:00:00',
          endTime: moment(this.endDay).add(1, 'days').format('YYYY-MM-DD') + ' 00:00:00',
          siteCode: this.params.siteCode,
          type: this.params.type,
        };
        mapDialogHttp.getWaterExport(params)
          .then(response => {
            const content = response;
            const blob = new Blob([content], {type: 'application/ms-excel'});
            const fileName = exportNameConfig[this.params.type] + '列表查询数据.xls';
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
      // 开始日期
      handleBeginDayInput(){
        this.getListInquireDate();
      },
      // 结束日期
      handleEndDayInput(){
        this.getListInquireDate();
      },
      handlePgChange(pageNo, pageSize) {
        this.pageNo = pageNo;
        this.pageSize = pageSize;
        this.getListInquireDate()
      },
    }
  }
</script>
<style type="text/css" scoped>
  .listInquireTitle {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding-top: 10px;
  }

  .daochu {
    display: inline-block;
    vertical-align: top;
    width: 50px;
    height: 30px;
    border: 1px solid #dddee1;
    border-radius: 4px;
    text-align: center;
    line-height: 32px;
    color: #555;
    font-size: 12px;
    cursor: pointer;
  }
</style>
