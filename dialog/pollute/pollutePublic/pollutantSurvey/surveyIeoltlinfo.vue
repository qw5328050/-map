<template>
  <div class="sub-tab-content">
    <div class="table-list-wrapper">
      <section class="table-list mb_15">
        <zt-table :data="resultList" style="margin-top: 10px;">
          <zt-column prop="materialname" label="物料名称" align="center"></zt-column>
          <zt-column prop="materialcode" label="物料代码" align="center"></zt-column>
          <zt-column prop="tanktype" label="储罐类型" align="center"></zt-column>
          <zt-column prop="tankvolume" label="储罐容积(立方米)" align="center"></zt-column>
          <zt-column prop="storagetemp" label="储存温度(℃)" align="center"></zt-column>
          <zt-column prop="xtlxrjwddcggs" label="相同类型、容积、温度的储罐个数(个)" align="center"></zt-column>
          <zt-column prop="materialyearturnover" label="物料年周转量(吨)" align="center"></zt-column>
          <zt-column prop="tankinfovoctreatpro" label="储罐信息-挥发性有机物处理工艺" align="center"></zt-column>
          <zt-column prop="yearloadcapacity" label="年装载量(吨/年)" align="center"></zt-column>
          <zt-column prop="cartrainload" label="汽车/火车装载量(吨/年)" align="center"></zt-column>
          <zt-column prop="cartrainloadtype" label="汽车/火车装载方式" align="center"></zt-column>
          <zt-column prop="shipload" label="船舶装载量(吨/年)" align="center"></zt-column>
          <zt-column prop="shiploadtype" label="船舶装载方式" align="center"></zt-column>
          <zt-column prop="loadinfovoctreatpro" label="装载信息-挥发性有机物处理工艺" align="center"></zt-column>
          <zt-column prop="hfxyjwcslqk" label="挥发性有机物产生量（千克）" align="center"></zt-column>
          <zt-column prop="ffxyjwpflqk" label="挥发性有机物排放量（千克）" align="center"></zt-column>
          <zt-column prop="hfxyjwcslqkhs" label="挥发性有机物产生量(千克)(核算结果)" align="center"></zt-column>
          <zt-column prop="ffxyjwpflqkhs" label="挥发性有机物排放量(千克)(核算结果)" align="center"></zt-column>
          <zt-column prop="unitheader" label="单位负责人" align="center"></zt-column>
          <zt-column prop="statisticalofficerauditor" label="统计负责人(审核人)" align="center"></zt-column>
          <zt-column prop="fillingperson" label="填表人" align="center"></zt-column>
          <zt-column prop="issuedate" label="报出日期" align="center"></zt-column>
        </zt-table>
        <div class="pagination">
          <zt-pagination :page-size="pageSize" :total="total" @change="handlePgChange"></zt-pagination>
        </div>
      </section>
    </div>
  </div>
</template>
<script>
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
    this.getIeoltlinfoData();
  },
  mounted() {},
  methods: {
    getIeoltlinfoData() {
      let params = {
        pollutionId: this.itemData.id
      };
      sopDetailHttp
        .getIeoltlinfoData(params)
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
      this.getIeoltlinfoData();
    }
  }
};
</script>
