<template>
  <div class="sub-tab-content">
    <div class="table-list-wrapper">
      <section class="table-list mb_15">
        <h3 class="form-item-name">废气监测数据</h3>
        <zt-table :data="maacIndustryentList" style="margin-top: 10px;">
          <zt-column prop="censustablenum" label="对应的普查表号" align="center"></zt-column>
          <zt-column prop="emissionportnamecode" label="对应的排放口名称/编号" align="center"></zt-column>
          <zt-column prop="avgflow" label="平均流量(立方米/小时)" align="center"></zt-column>
          <zt-column prop="aetime" label="年排放时间(小时)" align="center"></zt-column>
          <zt-column prop="jk_so2" label="二氧化硫进口浓度(毫克/立方米)" align="center"></zt-column>
          <zt-column prop="ck_so2" label="二氧化硫出口浓度(毫克/立方米)" align="center"></zt-column>
          <zt-column prop="jk_dyhw" label="氮氧化物进口浓度(毫克/立方米)" align="center"></zt-column>
          <zt-column prop="ck_dyhw" label="氮氧化物出口浓度(毫克/立方米)" align="center"></zt-column>
          <zt-column prop="jk_klw" label="颗粒物进口浓度(毫克/立方米)" align="center"></zt-column>
          <zt-column prop="ck_klw" label="颗粒物出口浓度(毫克/立方米)" align="center"></zt-column>
          <zt-column prop="jk_hfxyjw" label="挥发性有机物进口浓度(毫克/立方米)" align="center"></zt-column>
          <zt-column prop="ck_hfxyjw" label="挥发性有机物出口浓度(毫克/立方米)" align="center"></zt-column>
          <zt-column prop="jk_a" label="氨进口浓度(毫克/立方米)" align="center"></zt-column>
          <zt-column prop="ck_a" label="氨出口浓度(毫克/立方米)" align="center"></zt-column>
          <zt-column prop="jk_sjqhhw" label="砷及其化合物进口浓度(毫克/立方米)" align="center"></zt-column>
          <zt-column prop="ck_sjqhhw" label="砷及其化合物出口浓度(毫克/立方米)" align="center"></zt-column>
          <zt-column prop="jk_qjqhhw" label="铅及其化合物进口浓度(毫克/立方米)" align="center"></zt-column>
          <zt-column prop="ck_qjqhhw" label="铅及其化合物出口浓度(毫克/立方米)" align="center"></zt-column>
          <zt-column prop="jk_gejqhhw" label="镉及其化合物进口浓度(毫克/立方米)" align="center"></zt-column>
          <zt-column prop="ck_gejqhhw" label="镉及其化合物出口浓度(毫克/立方米)" align="center"></zt-column>
          <zt-column prop="jk_gjqhhw" label="铬及其化合物进口浓度(毫克/立方米)" align="center"></zt-column>
          <zt-column prop="ck_gjqhhw" label="铬及其化合物出口浓度(毫克/立方米)" align="center"></zt-column>
          <zt-column prop="jk_gongjqhhw" label="汞及其化合物进口浓度(毫克/立方米)" align="center"></zt-column>
          <zt-column prop="ck_gongjqhhw" label="汞及其化合物出口浓度(毫克/立方米)" align="center"></zt-column>
          <zt-column prop="unitheader" label="单位负责人" align="center"></zt-column>
          <zt-column prop="statisticalofficerauditor" label="统计负责人(审核人)" align="center"></zt-column>
          <zt-column prop="fillingperson" label="填表人" align="center"></zt-column>
          <zt-column prop="issuedate" label="报出日期" align="center"></zt-column>
        </zt-table>
        <div class="pagination">
          <zt-pagination :page-size="pageSizeAir" :total="totalAir" @change="handlePgChangeAir"></zt-pagination>
        </div>
      </section>
      <section class="table-list mb_15">
        <h3 class="form-item-name">废水监测数据</h3>
        <zt-table :data="mwacIndustryentList" style="margin-top: 10px;">
          <zt-column prop="censustablenum" label="对应的普查表号" align="center"></zt-column>
          <zt-column prop="emissionportnamecode" label="对应的排放口名称/编号" align="center"></zt-column>
          <zt-column prop="iwvolume" label="进口水量(立方米)" align="center"></zt-column>
          <zt-column prop="ewvolume" label="出口水量(立方米)" align="center"></zt-column>
          <zt-column prop="wdttoutlet" label="经总排放口排放的水量(立方米)" align="center"></zt-column>
          <zt-column prop="jk_hxxyl" label="化学需氧量进口浓度_毫克_升" align="center"></zt-column>
          <zt-column prop="hxxyljkndjcfs" label="化学需氧量进口浓度-监测方式" align="center"></zt-column>
          <zt-column prop="ck_hxxyl" label="化学需氧量出口浓度_毫克_升" align="center"></zt-column>
          <zt-column prop="hxxylckndjcfs" label="化学需氧量出口浓度-监测方式" align="center"></zt-column>
          <zt-column prop="jk_ad" label="氨氮进口浓度_毫克_升" align="center"></zt-column>
          <zt-column prop="adjkndjcfs" label="氨氮进口浓度-监测方式" align="center"></zt-column>
          <zt-column prop="ck_ad" label="氨氮出口浓度_毫克_升" align="center"></zt-column>
          <zt-column prop="adckndjcfs" label="氨氮出口浓度-监测方式" align="center"></zt-column>
          <zt-column prop="jk_zd" label="总氮进口浓度_毫克_升" align="center"></zt-column>
          <zt-column prop="zdjkndjcfs" label="总氮进口浓度-监测方式" align="center"></zt-column>
          <zt-column prop="ck_zd" label="总氮出口浓度_毫克_升" align="center"></zt-column>
          <zt-column prop="zdckndjcfs" label="总氮出口浓度-监测方式" align="center"></zt-column>
          <zt-column prop="jk_zl" label="总磷进口浓度_毫克_升" align="center"></zt-column>
          <zt-column prop="zljkndjcfs" label="总磷进口浓度-监测方式" align="center"></zt-column>
          <zt-column prop="ck_zl" label="总磷出口浓度_毫克_升" align="center"></zt-column>
          <zt-column prop="zlckndjcfs" label="总磷出口浓度-监测方式" align="center"></zt-column>
          <zt-column prop="jk_sy" label="石油类进口浓度_毫克_升" align="center"></zt-column>
          <zt-column prop="syljkndjcfs" label="石油类进口浓度-监测方式" align="center"></zt-column>
          <zt-column prop="ck_sy" label="石油类出口浓度_毫克_升" align="center"></zt-column>
          <zt-column prop="sylckndjcfs" label="石油类出口浓度-监测方式" align="center"></zt-column>
          <zt-column prop="jk_hff" label="挥发酚进口浓度_毫克_升" align="center"></zt-column>
          <zt-column prop="hffjkndjcfs" label="挥发酚进口浓度-监测方式" align="center"></zt-column>
          <zt-column prop="ck_hff" label="挥发酚出口浓度_毫克_升" align="center"></zt-column>
          <zt-column prop="hffckndjcfs" label="挥发酚出口浓度-监测方式" align="center"></zt-column>
          <zt-column prop="jk_qhw" label="氰化物进口浓度_毫克_升" align="center"></zt-column>
          <zt-column prop="qhwjkndjcfs" label="氰化物进口浓度-监测方式" align="center"></zt-column>
          <zt-column prop="ck_qhw" label="氰化物出口浓度_毫克_升" align="center"></zt-column>
          <zt-column prop="qhwckndjcfs" label="氰化物出口浓度-监测方式" align="center"></zt-column>
          <zt-column prop="jk_zs" label="总砷进口浓度-指标值(毫克/升)" align="center"></zt-column>
          <zt-column prop="zsjkndjcfs" label="总砷进口浓度-监测方式" align="center"></zt-column>
          <zt-column prop="ck_zs" label="总砷出口浓度-指标值(毫克/升)" align="center"></zt-column>
          <zt-column prop="zsckndjcfs" label="总砷出口浓度-监测方式" align="center"></zt-column>
          <zt-column prop="jk_zq" label="总铅进口浓度-指标值(毫克/升)" align="center"></zt-column>
          <zt-column prop="zqjkndjcfs" label="总铅进口浓度-监测方式" align="center"></zt-column>
          <zt-column prop="ck_zq" label="总铅出口浓度-指标值(毫克/升)" align="center"></zt-column>
          <zt-column prop="zqckndjcfs" label="总铅出口浓度-监测方式" align="center"></zt-column>
          <zt-column prop="jk_zge" label="总镉进口浓度-指标值(毫克/升)" align="center"></zt-column>
          <zt-column prop="zgejkndjcfs" label="总镉进口浓度-监测方式" align="center"></zt-column>
          <zt-column prop="ck_zge" label="总镉出口浓度-指标值(毫克/升)" align="center"></zt-column>
          <zt-column prop="zgeckndjcfs" label="总镉出口浓度-监测方式" align="center"></zt-column>
          <zt-column prop="jk_zg" label="总铬进口浓度_毫克_升" align="center"></zt-column>
          <zt-column prop="zgjkndjcfs" label="总铬进口浓度-监测方式" align="center"></zt-column>
          <zt-column prop="ck_zg" label="总铬出口浓度_毫克_升" align="center"></zt-column>
          <zt-column prop="zgckndjcfs" label="总铬出口浓度-监测方式" align="center"></zt-column>
          <zt-column prop="jk_ljg" label="六价铬进口浓度_毫克_升" align="center"></zt-column>
          <zt-column prop="ljgjkndjcfs" label="六价铬进口浓度-监测方式" align="center"></zt-column>
          <zt-column prop="ck_ljg" label="六价铬出口浓度_毫克_升" align="center"></zt-column>
          <zt-column prop="ljgckndjcfs" label="六价铬出口浓度-监测方式" align="center"></zt-column>
          <zt-column prop="jk_zgong" label="总汞进口浓度-指标值(毫克/升)" align="center"></zt-column>
          <zt-column prop="zgongjkndjcfs" label="总汞进口浓度-监测方式" align="center"></zt-column>
          <zt-column prop="ck_zgong" label="总汞出口浓度-指标值(毫克/升)" align="center"></zt-column>
          <zt-column prop="zgongckndjcfs" label="总汞出口浓度-监测方式" align="center"></zt-column>
          <zt-column prop="unitheader" label="单位负责人" align="center"></zt-column>
          <zt-column prop="statisticalofficerauditor" label="统计负责人(审核人)" align="center"></zt-column>
          <zt-column prop="fillingperson" label="填表人" align="center"></zt-column>
          <zt-column prop="issuedate" label="报出日期" align="center"></zt-column>
        </zt-table>
        <div class="pagination">
          <zt-pagination :page-size="pageSizeWater" :total="totalWater" @change="handlePgChangeWater"></zt-pagination>
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
      maacIndustryentList: [], //废气监测数据
      pageSizeAir: 10,
      pageNoAir: 1,
      totalAir: 0,
      mwacIndustryentList: [], //废水监测数据
      pageSizeWater: 10,
      pageNoWater: 1,
      totalWater: 0
    };
  },
  created() {
    this.getMwacIndustryentData();
    this.getMaacIndustryentData();
  },
  mounted() {},
  methods: {
    //废气监测数据
    getMaacIndustryentData() {
      let params = {
        pollutionId: this.itemData.id
      };
      sopDetailHttp
        .getMaacIndustryentData(params)
        .then(result => {
          if (result.code === 0) {
            this.maacIndustryentList = result.result.list;
            this.pageSizeAir = result.result.pageSize;
            this.totalAir = result.result.totalCount;
            this.pageNoAir = result.result.currPage;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    handlePgChangeAir(pageNoAir, pageSizeAir) {
      this.pageNoAir = pageNoAir;
      this.pageSizeAir = pageSizeAir;
      this.getMaacIndustryentData();
    },
    //废水监测数据
    getMwacIndustryentData() {
      let params = {
        pollutionId: this.itemData.id
      };
      sopDetailHttp
        .getMwacIndustryentData(params)
        .then(result => {
          if (result.code === 0) {
            this.mwacIndustryentList = result.result.list;
            this.pageSizeWater = result.result.pageSize;
            this.totalWater = result.result.totalCount;
            this.pageNoWater = result.result.currPage;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    handlePgChangeWater(pageNoWater, pageSizeWater) {
      this.pageNoWater = pageNoWater;
      this.pageSizeWater = pageSizeWater;
      this.getMwacIndustryentData();
    }
  }
};
</script>
