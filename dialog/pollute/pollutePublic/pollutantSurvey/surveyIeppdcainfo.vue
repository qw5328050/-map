<template>
  <div class="sub-tab-content">
    <div class="table-list-wrapper">
      <section class="table-list mb_15">
        <zt-table :data="ieppdcainfoList" style="margin-top: 10px;">
          <zt-column prop="censustablenum" label="对应的普查表号" align="center"></zt-column>
          <zt-column prop="emissionportnamecode" label="对应的排放口名称/编号" align="center"></zt-column>
          <zt-column prop="accountlinkname" label="核算环节名称" align="center"></zt-column>
          <zt-column prop="fluename" label="原料名称" align="center"></zt-column>
          <zt-column prop="productname" label="产品名称" align="center"></zt-column>
          <zt-column prop="technicsname" label="工艺名称" align="center"></zt-column>
          <zt-column prop="productscalegrade" label="生产规模等级" align="center"></zt-column>
          <zt-column prop="productsoutput" label="产品产量" align="center"></zt-column>
          <zt-column prop="materialfuelconsum" label="原料/燃料用量" align="center"></zt-column>
          <zt-column prop="wrwname" label="污染物名称" align="center"></zt-column>
          <zt-column prop="pcpollutant" label="污染物产污系数" align="center"></zt-column>
          <zt-column prop="sopippcopollutant" label="污染物产污系数中参数取值" align="center"></zt-column>
          <zt-column prop="pollutantproduct" label="污染物产生量" align="center"></zt-column>
          <zt-column prop="noptprocess" label="污染物处理工艺名称" align="center"></zt-column>
          <zt-column prop="reopollutant" label="污染物去除效率" align="center"></zt-column>
          <zt-column prop="aopopcfname1" label="污染治理设施实际运行参数一名称" align="center"></zt-column>
          <zt-column prop="aopopcfval1" label="污染治理设施实际运行参数一数值" align="center"></zt-column>
          <zt-column prop="aopopcfname2" label="污染治理设施实际运行参数二名称" align="center"></zt-column>
          <zt-column prop="aopopcfval2" label="污染治理设施实际运行参数二数值" align="center"></zt-column>
          <zt-column prop="aopopcfname3" label="污染治理设施实际运行参数三名称" align="center"></zt-column>
          <zt-column prop="aopopcfval3" label="污染治理设施实际运行参数三数值" align="center"></zt-column>
          <zt-column prop="pdlevel" label="污染物排放量" align="center"></zt-column>
          <zt-column prop="dpereport" label="排污许可证执行报告排放量" align="center"></zt-column>
          <zt-column prop="unitheader" label="单位负责人" align="center"></zt-column>
          <zt-column prop="statisticalofficerauditor" label="统计负责人(审核人)" align="center"></zt-column>
          <zt-column prop="fillingperson" label="填表人" align="center"></zt-column>
          <zt-column prop="issuedate" label="报出日期" align="center"></zt-column>
        </zt-table>
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
      ieppdcainfoList: [], //污染源产排污系数
    };
  },
  created() {
    this.getIeppdcainfoData();
  },
  mounted() {},
  methods: {
    //污染源产排污系数
    getIeppdcainfoData() {
      let params = {
        pollutionId: this.itemData.id
      };
      sopDetailHttp
        .getIeppdcainfoData(params)
        .then(result => {
          if (result.code === 0) {
            this.ieppdcainfoList = result.result.list;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
  }
};
</script>
