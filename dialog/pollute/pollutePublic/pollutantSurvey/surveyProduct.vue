<template>
  <div class="sub-tab-content">
    <div class="table-list-wrapper">
      <section class="table-list mb_15">
        <!-- <table class="table mid-padding table-bordered light-blue-th table-flex">
          <tbody>
            <tr>
              <th>产品名称</th>
              <th>产品代码</th>
              <th>生产工艺名称</th>
              <th>生产工艺代码</th>
              <th>生产能力</th>
              <th>实际产量</th>
            </tr>
            <tr>
              <td>热水</td>
              <td>4430A002</td>
              <td>
                燃气锅炉-室燃炉
                <br />
              </td>
              <td>
                RQ01
                <br />
              </td>
              <td>500000吨</td>
              <td>483840吨</td>
            </tr>
            <tr>
              <td>机械产品</td>
              <td>33XX13A001</td>
              <td>
                装配
                <br />
              </td>
              <td>
                33XX13C002
                <br />
              </td>
              <td>12台套</td>
              <td>0台套</td>
            </tr>
          </tbody>
        </table> -->
        <!-- 
            :height="documentClientHeight - 350"
        -->
        <zt-table :data="resultList" style="margin-top: 10px;">
          <zt-column prop="productname" style="width:16.5%" label="产品名称" align="center"></zt-column>
          <zt-column prop="productcode" style="width:16.5%" label="产品代码" align="center"></zt-column>
          <zt-column prop="technicname" style="width:16.5%" label="生产工艺名称" align="center"></zt-column>
          <zt-column prop="techniccode" style="width:16.5%" label="生产工艺代码" align="center"></zt-column>
          <zt-column prop="capacity" style="width:16.5%" label="生产能力" align="center"></zt-column>
          <zt-column prop="actoutput" style="width:16.5%" label="实际产量" align="center"></zt-column>
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
    this.getSurveyProductData();
  },
  mounted() {},
  methods: {
    getSurveyProductData() {
      let params = {
        pollutionId: this.itemData.id
      };
      sopDetailHttp
        .getSurveyProductData(params)
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
      this.getSurveyProductData();
    }
  }
};
</script>
