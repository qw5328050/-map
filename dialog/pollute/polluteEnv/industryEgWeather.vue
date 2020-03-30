<template>
  <div class="popbox-detail-content">
    <div class="panel-table" style="width: 100%;">
      <zt-table :data="dataList" ref="table" class="reduceTable" width="1800" :height="constants.polluteDialogHeight">
        <zt-column prop="lineName" width="180" label="生产线名称">
        </zt-column>
        <zt-column prop="lineCode" width="200" label="生产线编码">
        </zt-column>
        <zt-column prop="streetName" width="200" label="所属街道">
        </zt-column>
        <zt-column label="采暖季">
          <zt-column prop="measuresY1" width="200" align="left" label="红色预警_限停产措施"></zt-column>
          <zt-column prop="measuresY2" width="200" align="left" label="橙色预警_限停产措施"></zt-column>
          <zt-column prop="measuresY3" width="200" align="left" label="黄色预警_限停产措施"></zt-column>
        </zt-column>
        <zt-column label="非采暖季">
          <zt-column prop="measuresN1" width="200" align="left" label="红色预警_限停产措施"></zt-column>
          <zt-column prop="measuresN2" width="200" align="left" label="橙色预警_限停产措施"></zt-column>
          <zt-column prop="measuresN3" width="200" align="left" label="黄色预警_限停产措施"></zt-column>
        </zt-column>
      </zt-table>
      <zt-pagination :page-size="pageSize" :total="total"
                     @change="handlePgChange"></zt-pagination>
    </div>
  </div>
</template>

<script type="text/jsx">
  import emergencyReduceHttp from '@/https/emergency/emergencyReduceHttp'
  export default {
    data() {
      return {
        dataList: [],
        pageSize: 10,
        pageNo: 1,
        total: 0,
      }
    },
    props: {
      itemData: Object
    },
    created(){
      this.pageNo = 1;
      this.pageSize = 10;
      this.getDataList();
    },
    methods: {
      handlePgChange(pageNo, pageSize) {
        this.pageNo = pageNo;
        this.pageSize = pageSize;
        this.getDataList();
      },
      getDataList() {
        let params = {
          sopId: this.itemData.id,
          page: this.pageNo,
          limit: this.pageSize,
        }
        emergencyReduceHttp.reduceIndustryList(params).then(result => {
          this.dataList = result.data.data;
          this.total = result.data.total;
        })
      },
    }

  }
</script>
