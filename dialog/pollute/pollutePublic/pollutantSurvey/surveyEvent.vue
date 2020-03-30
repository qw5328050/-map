<template>
  <div class="sub-tab-content">
    <div class="table-list-wrapper">
      <section class="table-list mb_15">
        <h3 class="form-item-name">风险工艺</h3>
        <zt-table :data="ieeeriskinfotwoList" style="margin-top: 10px;">
          <zt-column prop="rptoeprocesstypename" label="突发环境事件风险生产工艺-工艺类型名称" align="center"></zt-column>
          <zt-column prop="rptoenestnum" label="突发环境事件风险生产工艺-套数(套)" align="center"></zt-column>
          <zt-column prop="mewmftgleakage" label="毒性气体泄漏监控预警措施" align="center"></zt-column>
          <zt-column prop="closuremeasure" label="截流措施情况" align="center"></zt-column>
          <zt-column prop="awcmeasure" label="事故废水收集措施" align="center"></zt-column>
          <zt-column prop="rpacmfwcsys" label="清净废水系统风险防控措施" align="center"></zt-column>
          <zt-column prop="rpacmordsys" label="雨水排水系统风险防控措施" align="center"></zt-column>
          <zt-column prop="rpacmopwtsys" label="生产废水处理系统风险防控措施" align="center"></zt-column>
          <zt-column prop="isyfhqwsprpsgwxk" label="是否依法获取污水排入排水管网许可" align="center"></zt-column>
          <zt-column prop="emohwiplant" label="厂内危险废物环境管理" align="center"></zt-column>
          <zt-column prop="isbztfhjsjyjya" label="是否编制突发环境事件应急预案" align="center"></zt-column>
          <zt-column prop="isjxtfhjsjyjyaba" label="是否进行突发环境事件应急预案备案" align="center"></zt-column>
          <zt-column prop="rnoepfeeevent" label="突发环境事件应急预案备案编号" align="center"></zt-column>
          <zt-column prop="eerisklevel" label="企业环境风险等级" align="center"></zt-column>
          <zt-column prop="yoercfenterprise" label="企业环境风险等级划定年份" align="center"></zt-column>
          <zt-column prop="unitheader" label="单位负责人" align="center"></zt-column>
          <zt-column prop="statisticalofficerauditor" label="统计负责人(审核人)" align="center"></zt-column>
          <zt-column prop="fillingperson" label="填表人" align="center"></zt-column>
          <zt-column prop="issuedate" label="报出日期" align="center"></zt-column>
        </zt-table>
      </section>
      <section class="table-list mb_15">
        <h3 class="form-item-name">风险物质</h3>
        <zt-table :data="ieeeriskinfoList" style="margin-top: 10px;">
          <zt-column prop="rsfename" label="突发环境事件风险物质-名称" align="center"></zt-column>
          <zt-column prop="rsfecasno" label="突发环境事件风险物质-CAS号" align="center"></zt-column>
          <zt-column prop="rsfeacttype" label="突发环境事件风险物质-活动类型" align="center"></zt-column>
          <zt-column prop="rsfeexistence" label="突发环境事件风险物质-存在量(吨)" align="center"></zt-column>
          <zt-column prop="mewmftgleakage" label="毒性气体泄漏监控预警措施" align="center"></zt-column>
          <zt-column prop="closuremeasure" label="截流措施情况" align="center"></zt-column>
          <zt-column prop="awcmeasure" label="事故废水收集措施" align="center"></zt-column>
          <zt-column prop="rpacmfwcsys" label="清净废水系统风险防控措施" align="center"></zt-column>
          <zt-column prop="rpacmordsys" label="雨水排水系统风险防控措施" align="center"></zt-column>
          <zt-column prop="rpacmopwtsys" label="生产废水处理系统风险防控措施" align="center"></zt-column>
          <zt-column prop="isyfhqwsprpsgwxk" label="是否依法获取污水排入排水管网许可" align="center"></zt-column>
          <zt-column prop="emohwiplant" label="厂内危险废物环境管理" align="center"></zt-column>
          <zt-column prop="isbztfhjsjyjya" label="是否编制突发环境事件应急预案" align="center"></zt-column>
          <zt-column prop="isjxtfhjsjyjyaba" label="是否进行突发环境事件应急预案备案" align="center"></zt-column>
          <zt-column prop="rnoepfeeevent" label="突发环境事件应急预案备案编号" align="center"></zt-column>
          <zt-column prop="eerisklevel" label="企业环境风险等级" align="center"></zt-column>
          <zt-column prop="yoercfenterprise" label="企业环境风险等级划定年份" align="center"></zt-column>
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
      ieeeriskinfotwoList: [], //风险工艺
      ieeeriskinfoList:[],//风险物质
    };
  },
  created() {
    this.getIeeeriskinfotwoData();
    this.getIeeeriskinfoData();
  },
  mounted() {},
  methods: {
    //环境风险信息
    getIeeeriskinfotwoData() {
      let params = {
        pollutionId: this.itemData.id
      };
      sopDetailHttp
        .getIeeeriskinfotwoData(params)
        .then(result => {
          if (result.code === 0) {
            this.ieeeriskinfotwoList = result.result.list;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //风险物质
    getIeeeriskinfoData() {
      let params = {
        pollutionId: this.itemData.id
      };
      sopDetailHttp
        .getIeeeriskinfoData(params)
        .then(result => {
          if (result.code === 0) {
            this.ieeeriskinfoList = result.result.list;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
  }
};
</script>
