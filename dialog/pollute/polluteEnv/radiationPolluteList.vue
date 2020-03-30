<template>
  <div class="panel-table" style="width: 100%;">
    <div class="panel-title"><h3>辐射污染物</h3></div>
    <zt-table :data="dataList" ref="table" style="width: 100%;">
      <zt-column width="70" type="index" label="序号"></zt-column>
      <zt-column prop="radSourceCode" width="140" label="放射源编码" align="center"></zt-column>
      <zt-column prop="nuclideName" width="130" label="核素名称" align="center"></zt-column>
      <zt-column prop="productionDate" width="140" label="出厂日期" align="center"></zt-column>
      <zt-column prop="factoryActivity" width="140" label="出厂活度" align="center"></zt-column>
      <zt-column prop="category" width="120" label="类别" align="center"></zt-column>
      <zt-column prop="radSafelicense" width="140" label="辐射安全许可证" align="center"></zt-column>
      <zt-column prop="sflrjgxt" width="160" label="是否录入监管系统" align="center"></zt-column>
      <zt-column prop="remarks" width="120" label="备注" align="center"></zt-column>
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
        polluteEnvHttp.pollutantPageList(params).then((result) => {
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

  .panel-title > h3 {
    font-weight: bold;
  }
</style>
