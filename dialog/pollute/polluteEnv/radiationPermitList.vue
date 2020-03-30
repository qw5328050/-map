<template>
  <div class="panel-table" style="width: 100%;">
    <div class="panel-title"><h3>辐射许可证</h3></div>
    <zt-table :data="dataList" ref="table" style="width: 100%;">
      <zt-column width="70" type="index" label="序号"></zt-column>
      <zt-column prop="permitCode" width="140" label="许可证编号" align="center"></zt-column>
      <zt-column prop="actinogenTypeScope" width="140" label="种类和范围" align="center"></zt-column>
      <zt-column prop="endTime" width="180" label="有效期至" align="center"></zt-column>
      <zt-column prop="startTime" width="140" label="发证日期" align="center"></zt-column>
      <zt-column prop="licenceIssuingAuthority" label="发证机关" align="center"></zt-column>
    </zt-table>
    <!-- 分页 -->
    <zt-pagination
      :page-size="pageSize"
      :currentPage="pageNo"
      :total="total"
      :pagerCount="5"
      @change="handlePgChange"
    ></zt-pagination>
  </div>
</template>

<script type="text/jsx">
  import polluteEnvHttp from '@/https/pollute/polluteEnvHttp'
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
    created() {
      this.dataList = [];
      this.getPunishBySopId()
    },
    mounted() {

    },
    methods: {
      handlePgChange(pageNo, pageSize) {
        this.pageNo = pageNo;
        this.pageSize = pageSize;
        this.getPunishBySopId();
      },
      getPunishBySopId() {
        let params = {
          sopId: this.itemData.id,
          pageNo: this.pageNo,
          pageSize: this.pageSize
        }
        polluteEnvHttp.permitPageList(params).then((result) => {
          this.dataList = result.data.data;
          this.total = result.data.total
        }).catch((error) => {

        })
      },
    },
  }
</script>
<style scoped>
  .panel-title {
    position: relative;
    border-bottom: 1px solid #d8dde3;
    padding: 0 13px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
  }

  .panel-title > h3:before {
    content: "";
    width: 3px;
    height: 16px;
    background: #0f97f6;
    position: absolute;
    left: 0;
  }

  .panel-title > h3 {
    height: 20px;
  }

  .panel-title h3 {
    font-weight: bold;
  }
</style>
