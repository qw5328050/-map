<template>
  <div class="sub-tab-content">
    <div class="table-list-wrapper">
      <section class="table-list mb_15">
        <zt-table :data="resultList" style="margin-top: 10px;">
          <zt-column prop="mainstuffEname" style="width:12.5%" label="主要能源消耗-原辅材料/能源名称" align="center"></zt-column>
          <zt-column prop="mainstuffEcode" style="width:12.5%" label="主要能源消耗-原辅材料/能源代码" align="center"></zt-column>
          <zt-column prop="mainstuffUse" style="width:12.5%" label="主要能源消耗-使用量" align="center"></zt-column>
          <zt-column prop="mainenergyStuffuse" style="width:12.5%" label="主要能源消耗-用作原辅材料量" align="center"></zt-column>
          <zt-column prop="unitheader" style="width:12.5%" label="单位负责人" align="center"></zt-column>
          <zt-column prop="statisticalofficerauditor" style="width:12.5%" label="统计负责人(审核人)" align="center"></zt-column>
          <zt-column prop="fillingperson" style="width:12.5%" label="填表人" align="center"></zt-column>
          <zt-column prop="issuedate" style="width:12.5%" label="报出日期" align="center"></zt-column>
        </zt-table>
        <div class="pagination">
          <zt-pagination :page-size="pageSize" :total="total" @change="handlePgChange"></zt-pagination>
        </div>
      </section>
    </div>
  </div>
</template>
<script>
import moment from "moment";
import mixins from "@/mixins";
import sopDetailHttp from "@/https/monitor/sopDetailHttp.js";
export default {
  props: {
    itemData: Object
  },
  data() {
    return {
      resultList: [],
      pageSize: 10,
      pageNo: 1,
      total: 0
    };
  },
  created() {
    this.getSurveyEnergyData();
  },
  mounted() {},
  methods: {
    getSurveyEnergyData() {
      let params = {
        pollutionId: this.itemData.id
      };
      sopDetailHttp
        .getSurveyEnergyData(params)
        .then(result => {
          if (result.code === 0) {
            this.resultList = result.result.list;
            this.pageSize = result.result.pageSize;
            this.total = result.result.totalCount;
            this.pageNo = result.result.currPage;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    handlePgChange(pageNo, pageSize) {
      this.pageNo = pageNo;
      this.pageSize = pageSize;
      this.getSurveyEnergyData();
    }
  }
};
</script>
