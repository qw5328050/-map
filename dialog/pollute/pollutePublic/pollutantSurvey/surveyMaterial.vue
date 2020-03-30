<template>
  <div class="sub-tab-content">
    <div class="table-list-wrapper">
      <section class="table-list mb_15">
        <!-- <table class="table mid-padding table-bordered light-blue-th table-flex">
          <tbody>
            <tr>
                <th>主要原辅材料使用-原辅材料/能源名称</th>
                <th>主要原辅材料使用-原辅材料/能源代码</th>
                <th>主要原辅材料使用-使用量</th>
                <th>单位负责人</th>
                <th>统计负责人(审核人)</th>
                <th>填表人</th>
                <th>报出日期</th>
            </tr>
            <tr>
                <td>金属工件</td>
                <td>33XX11B009</td>
                <td>1吨<br></td>
                <td>郭庆彬<br></td>
                <td>郭庆彬</td>
                <td>郭庆彬</td>
                <td>2019-04-28</td>
            </tr>
            <tr>
                <td>金属工件</td>
                <td>33XX11B009</td>
                <td>5吨<br></td>
                <td>刘衍波<br></td>
                <td>孙玉卿</td>
                <td>林娜娜</td>
                <td>2018-12-10</td>
            </tr>
          </tbody>
        </table>-->
        <zt-table :data="resultList" style="margin-top: 10px;">
          <zt-column prop="mainstuffEname" style="width:14%" label="主要原辅材料使用-原辅材料/能源名称" align="center"></zt-column>
          <zt-column prop="mainstuffEcode" style="width:14%" label="主要原辅材料使用-原辅材料/能源代码" align="center"></zt-column>
          <zt-column prop="mainstuffUse" style="width:14%" label="主要原辅材料使用-使用量" align="center"></zt-column>
          <zt-column prop="unitheader" style="width:14%" label="单位负责人" align="center"></zt-column>
          <zt-column prop="statisticalofficerauditor" style="width:14%" label="统计负责人(审核人)" align="center"></zt-column>
          <zt-column prop="fillingperson" style="width:14%" label="填表人" align="center"></zt-column>
          <zt-column prop="issuedate" style="width:14%" label="报出日期" align="center"></zt-column>
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
    this.getSurveyMaterialData();
  },
  mounted() {},
  methods: {
    getSurveyMaterialData() {
      let params = {
        pollutionId: this.itemData.id
      };
      sopDetailHttp
        .getSurveyMaterialData(params)
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
      this.getSurveyMaterialData();
    }
  }
};
</script>
