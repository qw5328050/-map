<template>
  <div class="add-region">
    <section class="region-input-wrapper" v-zt-clickoutside="handleCloseDropDown">
      <input type="text" ref="input" v-model="selectedLabel" placeholder="最多6个" class="form-control"
             @keyup.native="onInputChange"
             @paste.native="onInputChange"
             @focus="onInputFocus"
             @input="e => handleQueryChange(e.target.value)">
      <div class="dropdown-wrapper" v-show="showDropDown">
        <div class="widge-title-tab">
          <span class="tab-item"
                :class="{cur:'kqzd'==curType}"
                @click="handleChooseKqzd">空气站点</span>
          <span class="tab-item"
                :class="{cur:'xzqy'==curType}"
                @click="handleChooseXzqy">行政区域</span>
        </div>
        <!-- 空气站点 -->
        <div class="dropdown-content detailPanel"
             :class="{'dis_none': 'kqzd' != curType}">
          <ul v-if="kqzdList.length === 0" class="air-site">
            <li>{{loadingMsg}}</li>
          </ul>
          <ul v-else class="air-site">
            <li v-for="item in kqzdList" @click="handleSelectedKqzd(item)" :title="descName(item)">{{descName(item)}}
            </li>
          </ul>
        </div>
        <!-- 行政区域 -->
        <div class="dropdown-content detailPanel"
             :class="{'dis_none': 'xzqy' != curType}">
          <ul v-if="xzqyList.length === 0" class="air-site">
            <li>{{loadingMsg}}</li>
          </ul>
          <ul v-else class="air-site">
            <li v-for="item in xzqyList" @click="handleSelectedXzqy(item)">{{item.name}}</li>
          </ul>
        </div>
      </div>
    </section>
    <!--<a href="#"
       @click.stop.prevent="handleAdd"
       class="iconfont add-btn"
       :class="{'disabled': !selectedItem}"></a>-->
  </div>
</template>

<script type="text/jsx">
  import mapLayerHttp from '@/https/map/mapLayerHttp'
  import {getParamsByKey} from '@/utils/paramsCache'
  import {transformTreeDictDetail} from '@/components/_public/zt/dictionary/index.js'
  //趋势分析动态查询
  export default {
    props: {
      params: Object,
    },
    data(){
      let mapInfoConfig = getParamsByKey(this.constants.mapInfo);
      return {
        mapInfoConfig: mapInfoConfig,
        query: '',
        selectedLabel: '',
        curType: 'kqzd',
        showDropDown: false,
        timer: undefined,
        kqzdList: [],
        xzqyList: [],
        cacheList: [],
        selectedItem: null,
        loadingMsg: ''
      }
    },
    mounted(){
      this.handleQueryChange('');
    },
    methods: {
      descName(item){
        return `${item.name} （距离${item.distance}公里）`;
      },
      onInputFocus(){
        this.showDropDown = true;
      },
      handleChooseKqzd(){
        this.loadingMsg = '';
        this.curType = 'kqzd';
        this.kqzdList = [];
        this.handleQueryChange(this.selectedLabel);
      },
      handleChooseXzqy(){
        this.loadingMsg = '';
        this.curType = 'xzqy';
        this.xzqyList = [];
        this.handleQueryChange(this.selectedLabel);
      },
      handleSelectedKqzd(item){
        this.showDropDown = false;
        this.selectedLabel = item.name;
        this.selectedItem = item;
        this.handleAdd();
      },
      handleSelectedXzqy(item){
        this.showDropDown = false;
        this.selectedLabel = item.name;
        this.selectedItem = item;
        this.handleAdd();
      },
      handleAdd(){
        if (this.selectedItem) {
          this.$emit('input', this.selectedItem);
          this.selectedItem = null;
          this.selectedLabel = this.query;
        }
      },
      onInputChange() {
        this.handleQueryChange(this.selectedLabel);
      },
      handleQueryChange(value){
        if (this.timer) {
          window.clearTimeout(this.timer);
          this.timer = null;
        }
        this.timer = window.setTimeout(() => {
          let params = this.getParams(value);
          this.loadingMsg = '数据查找中...';
          this.query = value;
          mapLayerHttp.getContrastSearch(params).then(response => {
            this.showDropDown = true;
            let dataList = response.result;
            this.cacheList = dataList;
            let newDataList = this.excludeSelectedList(dataList);
            if (params.type === 'kqzd') {
              this.kqzdList = newDataList;
            } else {
              this.xzqyList = newDataList;
            }
            this.loadingMsg = '无符合条件的数据';
          }).catch(() => {
            this.loadingMsg = '无符合条件的数据';
          })
        }, 400);
      },
      excludeSelectedList(dataList){
        let newDataList = [];
        if (dataList) {
          let parentSelectedList = this.$parent.selectedList;
          dataList.forEach(item => {
            let flag = false;
            parentSelectedList.forEach(selectedItem => {
              if (item.name === selectedItem.name) {
                flag = true;
              }
            })
            if (!flag) {
              newDataList.push(item);
            }
          });
        }
        return newDataList;
      },
      refreshList(){
        let dataList = this.cacheList;
        if (dataList.length === 0) {
          return;
        }
        let newDataList = this.excludeSelectedList(dataList);
        if (this.curType === 'kqzd') {
          this.kqzdList = newDataList;
        } else {
          this.xzqyList = newDataList;
        }
      },
      getParams(keyWord){
        let lng = undefined;
        let lat = undefined;
        if (this.params && this.params.longitude !== undefined) {
          lng = this.params.longitude;
          lat = this.params.latitude;
        } else {
          lng = this.mapInfoConfig.center[0];
          lat = this.mapInfoConfig.center[1];
        }
        return {
          keywords: keyWord,
          longitude: lng,
          latitude: lat,
          type: this.curType,
          limit: this.mapInfoConfig.compareLimit ? this.mapInfoConfig.compareLimit : 10
        }
      },
      emitInput(item){
        this.$emit('input', item);
      },
      handleCloseDropDown(){
        this.showDropDown = false;
      }
    }
  }
</script>


<style type="text/css" scoped>
  .detailPanel {
    min-height: 160px;
    max-height: 215px;
    overflow-y: auto;
  }

</style>

