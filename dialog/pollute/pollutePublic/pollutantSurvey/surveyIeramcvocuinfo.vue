<template>
  <div class="sub-tab-content">
    <div class="table-list-wrapper">
      <section class="table-list mb_15">
        <zt-table :data="resultList" style="margin-top: 10px;">
          <zt-column prop="vocmaterialtype" label="含挥发性有机物的原辅材料类别" align="center"></zt-column>
          <zt-column prop="vocmaterialtypeot" label="含挥发性有机物的原辅材料类别其他" align="center"></zt-column>
          <zt-column prop="vocmaterialname" label="含挥发性有机物的原辅材料名称" align="center"></zt-column>
          <zt-column prop="vocmaterialcode" label="含挥发性有机物的原辅材料代码" align="center"></zt-column>
          <zt-column prop="vocmaterialbrand" label="含挥发性有机物的原辅材料品牌" align="center"></zt-column>
          <zt-column prop="vocmaterialbrandcode" label="含挥发性有机物的原辅材料品牌代码" align="center"></zt-column>
          <zt-column prop="vocmaterialuse" label="含挥发性有机物的原辅材料使用量(吨)" align="center"></zt-column>
          <zt-column prop="voctreatement" label="挥发性有机物处理工艺" align="center"></zt-column>
          <zt-column prop="voccollecttype" label="挥发性有机物收集方式" align="center"></zt-column>
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
    this.getIeramcvocuinfoData();
  },
  mounted() {},
  methods: {
    getIeramcvocuinfoData() {
      let params = {
        pollutionId: this.itemData.id
      };
      sopDetailHttp
        .getIeramcvocuinfoData(params)
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
      this.getIeramcvocuinfoData();
    }
  }
};
</script>
