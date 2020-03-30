<template>
  <div class="sub-tab-content">
    <div class="table-list-wrapper">
      <section class="table-list content-scroll mb_15">
        <h3 class="form-item-name">废水治理与排放信息(废水排口信息)</h3>
        <zt-table :data="iewtdischargeoneList2" style="margin-top: 10px;">
          <!-- 废水排口信息 -->
          <zt-column prop="waterintake" label="取水量(立方米)" align="center"></zt-column>
          <zt-column prop="urbantapwaterintake" label="城市自来水取水量(立方米)" align="center"></zt-column>
          <zt-column prop="selfcontainwaterintake" label="自备水取水量(立方米)" align="center"></zt-column>
          <zt-column prop="irworkwaterintake" label="水利工程供水取水量(立方米)" align="center"></zt-column>
          <zt-column prop="otentwaterintake" label="其他工业企业供水取水量(立方米)" align="center"></zt-column>
          <zt-column prop="fs_zlsss" label="废水治理设施数(套)" align="center"></zt-column>
          <zt-column prop="wwtypenameorcode" label="废水类型名称/代码" align="center"></zt-column>
          <zt-column prop="faccapacity" label="设施处理能力(立方米/日)" align="center"></zt-column>
          <zt-column prop="treatmentnameorcode1" label="处理方法名称/代码1" align="center"></zt-column>
          <zt-column prop="treatmentnameorcode2" label="处理方法名称/代码2" align="center"></zt-column>
          <zt-column prop="treatmentnameorcode3" label="处理方法名称/代码3" align="center"></zt-column>
          <zt-column prop="treatmentnameorcode4" label="处理方法名称/代码4" align="center"></zt-column>
          <zt-column prop="treatmentnameorcode5" label="处理方法名称/代码5" align="center"></zt-column>
          <zt-column prop="nyxsj" label="年运行时间" align="center"></zt-column>
          <zt-column prop="yearacttreatwater" label="年实际处理水量(小时)" align="center"></zt-column>
          <zt-column prop="treatotunitusewater" label="处理其他单位水量(小时)" align="center"></zt-column>
          <zt-column prop="sealaircondit" label="加盖密闭情况" align="center"></zt-column>
          <zt-column prop="handlewwaterdir" label="处理后废水去向(废水去向)" align="center"></zt-column>
          <zt-column prop="handlewwaterdirot" label="处理后废水去向(废水去向其它)" align="center"></zt-column>
          <zt-column prop="totaleffluentout" label="废水总排放口数(个)" align="center"></zt-column>
        </zt-table>
      </section>
      <section class="table-list mb_15">
        <h3 class="form-item-name">废水治理与排放信息(废水设施信息)</h3>
        <zt-table :data="iewtdischargeoneList1" style="margin-top: 10px;">
          <!-- 废水设施信息 -->
          <zt-column prop="fs_zlsss" label="废水治理设施数(套)" align="center"></zt-column>
          <zt-column prop="wwtypenameorcode" label="废水类型名称/代码" align="center"></zt-column>
          <zt-column prop="faccapacity" label="设施处理能力(立方米/日)" align="center"></zt-column>
          <zt-column prop="treatmentnameorcode1" label="处理方法名称/代码1" align="center"></zt-column>
          <zt-column prop="treatmentnameorcode2" label="处理方法名称/代码2" align="center"></zt-column>
          <zt-column prop="treatmentnameorcode3" label="处理方法名称/代码3" align="center"></zt-column>
          <zt-column prop="treatmentnameorcode4" label="处理方法名称/代码4" align="center"></zt-column>
          <zt-column prop="treatmentnameorcode5" label="处理方法名称/代码5" align="center"></zt-column>
          <zt-column prop="nyxsj" label="年运行时间" align="center"></zt-column>
          <zt-column prop="yearacttreatwater" label="年实际处理水量(小时)" align="center"></zt-column>
          <zt-column prop="treatotunitusewater" label="处理其他单位水量(小时)" align="center"></zt-column>
          <zt-column prop="sealaircondit" label="加盖密闭情况" align="center"></zt-column>
          <zt-column prop="handlewwaterdir" label="处理后废水去向(废水去向)" align="center"></zt-column>
          <zt-column prop="handlewwaterdirot" label="处理后废水去向(废水去向其它)" align="center"></zt-column>
          <zt-column prop="totaleffluentout" label="废水总排放口数(个)" align="center"></zt-column>
        </zt-table>
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
      iewtdischargeoneList1: [], //废水设施信息
      iewtdischargeoneList2: [] //废水排口信息
    };
  },
  created() {
    this.getSurveyWaterData();
  },
  mounted() {},
  methods: {
    // 根据污染源id获取废水治理与排放信息（废水设施信息）
    getSurveyWaterFacilitiesData() {
      let params = {
        pollutionId: this.itemData.id
      };
      sopDetailHttp
        .getSurveyWaterFacilitiesData(params)
        .then(result => {
          if (result.code === 0) {
            this.iewtdischargeoneList1 = result.result.list;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 根据污染源id获取废水治理与排放信息（废水排口信息）
    getSurveyWaterDrainData() {
      let params = {
        pollutionId: this.itemData.id
      };
      sopDetailHttp
        .getSurveyWaterDrainData(params)
        .then(result => {
          if (result.code === 0) {
            this.iewtdischargeoneList2 = result.result.list;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getSurveyWaterData() {
      this.getSurveyWaterFacilitiesData();
      this.getSurveyWaterDrainData();
    }
  }
};
</script>
