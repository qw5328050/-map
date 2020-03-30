<template>
  <div class="popbox-detail-content">
    <!-- Tab页 -->
    <sub-tab
      ref="subTab"
      :tabList="surveyTabList"
      itemName="name"
      itemValue="code"
      @tabClick="childrenTabChange"
      style="margin-bottom: 15px;"
    ></sub-tab>
    <!-- 基本信息 -->
    <base-info :itemData="itemData" v-if="showModel=='base'"></base-info>
    <!-- 主要产品及生产工艺 -->
    <survey-product :itemData="itemData" v-if="showModel=='product'"></survey-product>
    <!-- 主要原辅材料使用 -->
    <survey-material :itemData="itemData" v-if="showModel=='material'"></survey-material>
    <!-- 主要能源消耗 -->
    <survey-energy :itemData="itemData" v-if="showModel=='energy'"></survey-energy>
    <!-- 废水治理与排放 -->
    <survey-water :itemData="itemData" v-if="showModel=='water'"></survey-water>
    <!-- 废气治理与排放 -->
    <survey-air :itemData="itemData" v-if="showModel=='air'"></survey-air>
    <!-- 固体危废 -->
    <survey-solid :itemData="itemData" v-if="showModel=='solid'"></survey-solid>
    <!-- 有机液体储罐、装载信息 -->
    <survey-ieoltlinfo :itemData="itemData" v-if="showModel=='ieoltlinfo'"></survey-ieoltlinfo>
    <!-- 含挥发性有机物原辅材料使用信息 -->
    <survey-ieramcvocuinfo :itemData="itemData" v-if="showModel=='ieramcvocuinfo'"></survey-ieramcvocuinfo>
    <!-- 伴生放射性矿产信息 -->
    <survey-armersmwaste :itemData="itemData" v-if="showModel=='armersmwaste'"></survey-armersmwaste>
    <!-- 环境风险信息 -->
    <survey-event :itemData="itemData" v-if="showModel=='event'"></survey-event>
    <!-- 污染源产排污系数 -->
    <survey-ieppdcainfo :itemData="itemData" v-if="showModel=='ieppdcainfo'"></survey-ieppdcainfo>
    <!-- 废水废气监测数据 -->
    <survey-waste :itemData="itemData" v-if="showModel=='waste'"></survey-waste>
  </div>
</template>

<script>
import subTab from "@/map/dialog/pollute/pollutePublic/subTab";
import baseInfo from "./pollutantSurvey/baseInfo";
import surveyProduct from "./pollutantSurvey/surveyProduct";
import surveyMaterial from "./pollutantSurvey/surveyMaterial";
import surveyEnergy from "./pollutantSurvey/surveyEnergy";
import surveyWater from "./pollutantSurvey/surveyWater";
import surveyAir from "./pollutantSurvey/surveyAir";
import surveySolid from "./pollutantSurvey/surveySolid";
import surveyIeoltlinfo from "./pollutantSurvey/surveyIeoltlinfo";
import surveyIeramcvocuinfo from "./pollutantSurvey/surveyIeramcvocuinfo";
import surveyArmersmwaste from "./pollutantSurvey/surveyArmersmwaste";
import surveyEvent from "./pollutantSurvey/surveyEvent";
import surveyIeppdcainfo from "./pollutantSurvey/surveyIeppdcainfo";
import surveyWaste from "./pollutantSurvey/surveyWaste";

export default {
  props: {
    itemData: Object
  },
  components: {
    subTab,
    baseInfo,
    surveyProduct,
    surveyMaterial,
    surveyEnergy,
    surveyWater,
    surveyAir,
    surveySolid,
    surveyIeoltlinfo,
    surveyIeramcvocuinfo,
    surveyArmersmwaste,
    surveyEvent,
    surveyIeppdcainfo,
    surveyWaste
  },
  data() {
    return {
      showModel: "base",
      surveyTabList: [
        { name: "基本信息", code: "base" },
        { name: "主要产品及生产工艺", code: "product" },
        { name: "主要原辅材料使用", code: "material" },
        { name: "主要能源消耗", code: "energy" },
        { name: "废水治理与排放", code: "water" },
        { name: "废气治理与排放", code: "air" },
        { name: "固体危废", code: "solid" },
        { name: "有机液体储罐装载信息", code: "ieoltlinfo" },
        { name: "含挥发性有机物原辅材料使用信息", code: "ieramcvocuinfo" },
        { name: "伴生放射性矿产信息", code: "armersmwaste" },
        { name: "环境风险信息", code: "event" },
        { name: "污染源产排污系数", code: "ieppdcainfo" },
        { name: "废水废气监测数据", code: "waste" }
      ]
    };
  },
  created() {},
  mounted() {},
  methods: {
    childrenTabChange(item) {
      console.log("普查：",this.surveyTabList,this.itemData);
      this.showModel = item.code;
    }
  }
};
</script>
