<template>
  <div class="point-info-wrapper" v-if="visible && hidePlane">
    <a class="close-detail-btn" @click="justClosedPlane">
      <span class="iconfont" @click="justClosedPlane">&#xe601;</span>
    </a>
    <div class="point-info-detail">
      <!-- 头部信息 -->
      <header class="header-info">
        <h3 class="name">{{detailData.name}}</h3>
      </header>
      <!-- 分类信息 -->
      <zt-scrollbar class="ps" :style="{'max-height': documentClientHeight + 'px'}">
        <base-info-list :detailData="detailData"></base-info-list>
        <div class="classification-info">
          <div class="tab-wrapper">
            <span class="tab-item" :class="{'cur': tabIndex === 1}" @click="tabIndex = 1">辐射污染物</span>
          </div>
          <div class="tab-content">
            <div class="panel-table">
              <zt-table ref="multiTable" :data="fsyList">
                <zt-column prop="radioactiveCode" width="100" label="编码"></zt-column>
                <zt-column prop="nuclideName" width="100" label="核素名称"></zt-column>
                <zt-column prop="productionDate" width="90" label="出厂日期"></zt-column>
                <zt-column prop="factoryActivity" width="100" label="出厂活度"></zt-column>
                <zt-column prop="category" width="100" label="类别"></zt-column>
              </zt-table>
            </div>
          </div>
        </div>
      </zt-scrollbar>
    </div>
  </div>
</template>
<script>
import fsyHttp from "@/https/monitor/fsyHttp";
import baseDialog from "@/map/dialog/base/baseDialog";
import baseInfoList from "@/map/dialog/_public/baseInfoList.vue";
import mapUtil from "@/map/js/util/mapUtil";
import headerInfo from "@/map/dialog/_public/headerInfo.vue";
import mapHttp from "@/https/map/mapHttp";

export default {
  name: "fsyDialog",
  mixins: [baseDialog],
  components: {
    headerInfo,
    baseInfoList
  },
  data() {
    return {
      hidePlane: false,
      tabIndex: 1,
      info: {},
      fsyList: [],
      detailData: {}
    };
  },
  methods: {
    justClosedPlane() {
      this.hidePlane = false;
    },
    showDetail() {
      fsyHttp
        .getDetail({
          site_code: this.itemData.siteCode
        })
        .then(response => {
          this.fsyList = response.result.radios;
          this.detailData = response.result;
          this.detailData.type = this.itemData.type;
          this.detailData.linkMan = this.detailData.contact;
          this.detailData.phone = this.detailData.contactPhone;
          this.hidePlane = true;
        })
        .catch(error => {
          console.error(error);
        });
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.info = this.itemData;
      this.showDetail();
    });
  }
};
</script>
<style>
</style>
