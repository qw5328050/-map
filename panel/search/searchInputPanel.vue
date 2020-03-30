<template>
  <!-- 输入框 -->
  <div class="input-wrapper">
    <input
      type="text"
      v-model="keywords"
      placeholder="搜索空气站点、污染源"
      class="keywords"
      @keyup.enter="search"
    />
    <a href="javascript:void(0);" class="iconfont keywords-del" @click="emitMapPanelClose">&#xe6b2;</a>
    <a href="javascript:void(0);" class="iconfont search-btn" @click="search">&#xe6a4;</a>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import {getParamsByKey} from "@/utils/paramsCache";

export default {
  name: "search-bar",
  data() {
    return {
      keywords: "",
      lng: "",
      lat: ""
    };
  },
  methods: {
    search() {
      let mapInfo = getParamsByKey('mapInfo');
      // 点击查询
      if (!this.keywords) return;
      this.$nextTick(() => {
        let params = {
          keywords: this.keywords,
          lng:115.0214,
          lat: 35.7789
        /*  lng: mapInfo.center[0],
          lat: mapInfo.center[1]*/
        };
        this.$emit("startSearch", params);
      });
    },
    emitMapPanelClose() {
      this.keywords = "";
      this.$emit("cancelSearch");
    }
  }
};
</script>
