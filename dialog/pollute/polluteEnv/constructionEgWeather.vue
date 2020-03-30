<template>
  <div class="popbox-detail-content">
    <div class="panel-table" style="width: 100%;">
      <zt-table :data="dataList" ref="table" class="reduceTable" width="1800" :height="constants.polluteDialogHeight">
        <zt-column prop="name" width="200" align="left" label="扬尘源名称">
        </zt-column>
        <zt-column prop="address" width="300" align="left" label="详细地址">
        </zt-column>
        <zt-column prop="lng" width="100" label="经度">
        </zt-column>
        <zt-column prop="lat" width="100" label="纬度">
        </zt-column>
        <zt-column prop="area" width="180" label="占地面积（㎡）">
        </zt-column>
        <zt-column prop="dischargedust" width="300" label="主要污染物排放量（千克/天）_烟粉尘">
        </zt-column>
        <zt-column prop="measures1" width="300" label="红色预警_控制措施">
        </zt-column>
        <zt-column prop="dust1" width="200" label="红色预警_估算减排量（千克/天）_扬尘">
        </zt-column>
        <zt-column prop="measures2" width="300" label="橙色预警_控制措施">
        </zt-column>
        <zt-column prop="dust2" width="200" label="橙色预警_估算减排量（千克/天）_扬尘">
        </zt-column>
        <zt-column prop="measures3" width="300" label="黄色预警_控制措施">
        </zt-column>
        <zt-column prop="dust3" width="200" label="黄色预警_估算减排量（千克/天）_扬尘">
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
        };
        emergencyReduceHttp.reduceConstructionList(params).then(result => {
          this.dataList = result.data.data;
          this.total = result.data.total;
        })
      },
    }

  }
</script>
