<template>
  <div class="sub-tab-content">
    <div class="table-list-wrapper">
      <section class="table-list mb_15">
        <h3 class="form-item-name">固体物料及废物情况</h3>
        <zt-table :data="armersmwasteList" style="margin-top: 10px;">
          <zt-column prop="rmnamecode" label="原矿名称及代码" align="center"></zt-column>
          <zt-column prop="rmncotremark" label="原矿名称及代码其他备注" align="center"></zt-column>
          <zt-column prop="rmproduction" label="原矿产生量(吨)" align="center"></zt-column>
          <zt-column prop="cnamecode" label="精矿名称及代码" align="center"></zt-column>
          <zt-column prop="cncotremark" label="精矿名称及代码其他备注" align="center"></zt-column>
          <zt-column prop="cproduction" label="精矿产生量(吨)" align="center"></zt-column>
          <zt-column prop="gfnameandcode" label="一般工业固体废物名称及代码" align="center"></zt-column>
          <zt-column prop="swncotremark" label="固体废物名称及代码其他备注" align="center"></zt-column>
          <zt-column prop="gf_csl" label="一般工业固体废物产生量(吨)" align="center"></zt-column>
          <zt-column prop="gf_zhlyl" label="一般工业固体废物综合利用量(吨)" align="center"></zt-column>
          <zt-column prop="gfzhlylnbzhlyl" label="固体废物综合利用量_内部综合利用量(吨)" align="center"></zt-column>
          <zt-column prop="gfzhlylswbzhlyl" label="固体废物综合利用量_送外部综合利用量(吨)" align="center"></zt-column>
          <zt-column prop="gfzhlyljswlgfzhlyl" label="固体废物综合利用量_接收外来固体废物综合利用量(吨)" align="center"></zt-column>
          <zt-column prop="gfclfsmcdm" label="固体废物处理处置方式名称/代码" align="center"></zt-column>
          <zt-column prop="gfclfsmcdmqtbz" label="固体废物处理处置方式名称/代码其他备注" align="center"></zt-column>
          <zt-column prop="gf_czl" label="一般工业固体废物处置量(吨)" align="center"></zt-column>
          <zt-column prop="gfclgfnbclczl" label="固体废物处理处置量_固体废物内部处理处置量(吨)" align="center"></zt-column>
          <zt-column prop="gfclgfswbcll" label="固体废物处理处置量_固体废物送外部处理处置量(吨)" align="center"></zt-column>
          <zt-column prop="gfclgfsjswlgfcll" label="固体废物处理处置量_接收外来固体废物处理处置量(吨)" align="center"></zt-column>
          <zt-column prop="gf_zcl" label="一般工业固体废物贮存量(吨)" align="center"></zt-column>
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
      armersmwasteList: [], //固体物料及废物情况
    };
  },
  created() {
    this.getArmersmwasteData();
  },
  mounted() {},
  methods: {
    //固体物料及废物情况
    getArmersmwasteData() {
      let params = {
        pollutionId: this.itemData.id
      };
      sopDetailHttp
        .getArmersmwasteData(params)
        .then(result => {
          if (result.code === 0) {
            this.armersmwasteList = result.result.list;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
  }
};
</script>
