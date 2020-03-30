<template>
  <!-- 输入框 -->
  <div>
    <search-input-panel ref="searchInputPanel"
                        @startSearch="handleSearch"
                        @cancelSearch="handleSearchCancel"></search-input-panel>
    <search-result-panel ref="searchResultPanel"
                         :divisionCode="curDivisionCode"
                         @showDetail="handleShowDetail"></search-result-panel>
    <search-result-return-panel ref="searchResultReturnPanel"
                                @searchBack="handleSearchBack"></search-result-return-panel>
    <nearby-search-panel ref="nearbySearchPanel"
                         :divisionCode="curDivisionCode"
                         @nearbySearchListBack="handleNearbySearchListBack"
                         @showDetail="handleNearbyShowDetail"></nearby-search-panel>
    <nearby-search-return-panel ref="nearbySearchReturnPanel"
                                @nearbySearchDetailBack="handleNearbySearchBack"></nearby-search-return-panel>
    <!-- <select-result-return-panel ref="selectResultReturnPanel"
                                @showDetail="handleSelectShowDetail"></select-result-return-panel> -->
  </div>
</template>

<script>
  import {mapMutations, mapState} from 'vuex';
  import mapUtil from '@/map/js/util/mapUtil'
  import {objectAssign} from '@/utils/util'
  import searchInputPanel from './searchInputPanel.vue'
  import searchResultPanel from './searchResultPanel.vue'
  import searchResultReturnPanel from './searchResultReturnPanel.vue'
  import nearbySearchPanel from './nearbySearchPanel.vue'
  import nearbySearchReturnPanel from './nearbySearchReturnPanel.vue'
  // import selectResultReturnPanel from '../select/selectResultReturnPanel.vue'

  export default {
    name: 'search-bar',
    components: {
      searchInputPanel,
      searchResultPanel,
      searchResultReturnPanel,
      nearbySearchPanel,
      nearbySearchReturnPanel,
      // selectResultReturnPanel
    },
    data () {
      return {
        //是否处于搜索状态
        inSearch: false,
        inNearSearch: false,
        curDivisionCode: ''
      }
    },
    //将地图引入进来
    inject: ['getMap'],
    mounted () {
      //地图事件监听
      const self = this;
      this.$mapEvtBus.$on(mapUtil.EVT_NAME.search_hideResultPanel, params => {
        self.$refs.searchResultPanel.hide();
        self.$refs.searchResultReturnPanel.hide();

        self.$refs.nearbySearchPanel.hide();
        self.$refs.nearbySearchReturnPanel.hide();
        if (self.inSearch) {
          self.$refs.searchResultReturnPanel.reshow();
        } else if (self.inNearSearch) {
          self.$refs.nearbySearchReturnPanel.reshow();
        }
      });
      this.$mapEvtBus.$on(mapUtil.EVT_NAME.search_setKeywords, params => {
        if (!self.inSearch) {
          self.$refs.searchInputPanel.keywords = params;
        }
      });
      this.$mapEvtBus.$on(mapUtil.EVT_NAME.search_nearbySearch, params => {
        self.$refs.searchResultPanel.hide();
        self.$refs.searchResultReturnPanel.hide();
        self.$mapEvtBus.$emit(mapUtil.EVT_NAME.dialog_removeDialog);
        self.$mapEvtBus.$emit(mapUtil.EVT_NAME.map_removeData);
        self.$mapEvtBus.$emit(mapUtil.EVT_NAME.dialog_removeDialog);
        self.$refs.nearbySearchPanel.show(params);
        self.inNearSearch = true;
      });
      //搜索半径更新
      this.$mapEvtBus.$on(mapUtil.EVT_NAME.search_updateRadius, params => {
      });

      //切换行政区域
      this.$mapEvtBus.$on(mapUtil.EVT_NAME.map_showDivision, params => {
        self.curDivisionCode = params.divisionCode;
      })
    },
    beforeDestroy() {
      this.$mapEvtBus.$off(mapUtil.EVT_NAME.search_hideResultPanel);
      this.$mapEvtBus.$off(mapUtil.EVT_NAME.search_setKeywords);
      this.$mapEvtBus.$off(mapUtil.EVT_NAME.search_nearbySearch);
      this.$mapEvtBus.$off(mapUtil.EVT_NAME.search_updateRadius);
    },
    methods: {
      handleSearch(params){
        this.inSearch = true;
        this.inNearSearch = false;
        this.$mapEvtBus.$emit(mapUtil.EVT_NAME.map_removeData);
        this.$refs.searchResultPanel.show(params);
        this.$refs.searchResultReturnPanel.close();
        this.$refs.nearbySearchPanel.close();
        this.$refs.nearbySearchReturnPanel.close();
        this.$mapEvtBus.$emit(mapUtil.EVT_NAME.dialog_removeDialog);
      },
      handleSearchCancel(){
        this.inSearch = false;
        this.inNearSearch = false;
        this.$mapEvtBus.$emit(mapUtil.EVT_NAME.map_removeData);
        this.$refs.searchResultPanel.close();
        this.$refs.searchResultReturnPanel.close();
        this.$refs.nearbySearchPanel.close();
        this.$refs.nearbySearchReturnPanel.close();
        this.$mapEvtBus.$emit(mapUtil.EVT_NAME.dialog_removeDialog);
      },
      handleSearchBack(){
        this.$mapEvtBus.$emit(mapUtil.EVT_NAME.dialog_removeDialog);
        if (this.inNearSearch) {
          this.$refs.searchResultPanel.show();
          this.inNearSearch = false;
        } else {
          this.$refs.searchResultPanel.reshow();
        }
      },
      handleNearbySearchListBack(params){
        this.$mapEvtBus.$emit(mapUtil.EVT_NAME.dialog_showDialog, params);
        if(this.inSearch){
          this.$refs.searchResultReturnPanel.show(params);
        }
      },
      handleNearbySearchBack(){
        this.$mapEvtBus.$emit(mapUtil.EVT_NAME.dialog_removeDialog);
        this.$refs.nearbySearchPanel.reshow();
      },
      handleNearbyShowDetail(params){
        this.$mapEvtBus.$emit(mapUtil.EVT_NAME.dialog_showDialog, params);
        this.$refs.searchResultReturnPanel.hide();
        this.$refs.nearbySearchReturnPanel.show(params);
      },
      //显示弹框
      handleShowDetail(data){
        this.$refs.searchResultReturnPanel.reshow();
        this.$refs.searchResultPanel.hide();
        const copyData = {};
        objectAssign(copyData, data);
        this.$mapEvtBus.$emit(mapUtil.EVT_NAME.dialog_showDialog, copyData);
      },
      // handleSelectShowDetail (data) {
      //   if (this.$mapEvtBus) {
      //     this.$mapEvtBus.$emit(mapUtil.EVT_NAME.dialog_removeDialog)
      //     this.$mapEvtBus.$emit(mapUtil.EVT_NAME.dialog_showDialog, data)
      //   }
      // }
    }
  }
</script>
