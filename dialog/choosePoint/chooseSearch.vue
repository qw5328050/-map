<template>
  <div class="search-box"
       style="position: absolute;top: 60px;left: 20px;z-index: 11;box-shadow: 1px 2px 1px rgba(0, 0, 0, 0.15);background: #fff;">
    <div class="input-wrapper">
      <input type="text"
             v-model="keywords"
             placeholder="搜索地名"
             class="keywords"
             @keyup.enter="handleSearch">
      <a href="javascript:void(0);" class="iconfont keywords-del" @click="handleClose">&#xe6b2;</a>
      <a href="javascript:void(0);" class="iconfont search-btn" @click="handleSearch">&#xe6a4;</a>
    </div>
    <!-- 搜索结果列表 -->
    <div class="result-wrapper" v-if="visible">
      <zt-scrollbar class="ps" :style="{'height':documentClientHeight - 370 +'px'}">
        <ul v-if="loading">
          <li class="result-list">
            <!-- 左侧 -->
            <div class="col-l">
            </div>
            <!-- 中间 -->
            <div class="col-c">
              <h3 class="title-name">数据查询中...</h3>
            </div>
          </li>
        </ul>
        <ul v-else-if="dataList.length ===0">
          <li class="result-list">
            <!-- 左侧 -->
            <div class="col-l">
            </div>

            <!-- 中间 -->
            <div class="col-c">
              <h3 class="title-name">无符合条件的点位数据</h3>
            </div>
          </li>
        </ul>
        <ul v-else>
          <li class="result-list" v-for="(item, index) in dataList"
              @mouseenter.stop="addFocus(item)"
              @mouseleave.stop="removeFocus(item)">
            <!-- 左侧 -->
            <div class="col-l">
              <span class="map-position-icon">{{index + 1}}</span>
            </div>
            <!-- 右侧 -->
            <div class="col-r">
              <div class="col-r-item">
                <zt-button type="primary" @click="handleSelectPoint(item)">选择该点</zt-button>
              </div>
            </div>
            <!-- 中间 -->
            <div class="col-c">
              <h3 class="title-name">{{item.name}}</h3>

            </div>
          </li>
        </ul>
      </zt-scrollbar>
      <zt-pagination
        layout="total,prev, pager, next"
        :page-size="pageSize"
        :total="total"
        @change="handlePgChange">
      </zt-pagination>
    </div>
  </div>
</template>

<script>
  import mixins from '@/mixins/index'
  import ZtScrollbar from '@/components/_public/zt/scrollbar/scrollbar'
  import ZtPagination from '@/components/_public/zt/pagination/pagination'
  import mapHttp from '@/https/map/mapHttp'
  import mapUtil from '@/map/js/util/mapUtil'
  export default {
    name: 'search-result-panel',
    components: {ZtPagination, ZtScrollbar},
    mixins: [mixins],
    data () {
      let keywords = '';
     /* if (process.env.NODE_ENV !== 'production') {
        keywords = '濮阳';
      }*/
      return {
        keywords: keywords,
        visible: false,
        pageSize: 10,
        pageNo: 1,
        total: 0,
        dataList: [],
        cacheDataList: [],
        loading: true
      }
    },
    //将地图引入进来
    inject: ['getMap'],
    methods: {
      handleSearch () {
        if (!this.keywords || !this.keywords.trim()) {
          this.$ztAlert('请输入搜索关键字');
          return;
        }
        this.pageNo = 1;
        this.total = 0;
        this.getDataList()
      },
      getDataList () {
        let params = this.getSearchParams();
        this.loading = true;
        this.visible = true;
        mapUtil.getDmByKeyword(params).then(result => {
          this.cacheDataList = result;
          this.total = result.length;
          this.cutDataList();
          this.$emit('showSearchData', this.dataList);
          this.loading = false;
        });
      },
      cutDataList(){
        let startPos = (this.pageNo - 1) * this.pageSize;
        let endPos = this.pageNo * this.pageSize;
        if (endPos < this.total) {
          this.dataList = this.cacheDataList.slice(startPos, endPos);
        } else {
          this.dataList = this.cacheDataList.slice(startPos, this.total);
        }
        this.dataList.forEach((item, index) => {
          item.index = index + 1;
        })
      },
      handlePgChange (pageNo, pageSize) {
        this.pageNo = pageNo;
        this.pageSize = pageSize;
        this.cutDataList();
        this.$emit('showSearchData', this.dataList);
      },

      getSearchParams(){
        let params = {
          keyWord: this.keywords,
          size: this.pageSize,
          page: this.pageNo
        };
        let mapObj = this.getMap();
        if (mapObj) {
          let center = mapObj.getCenter();
          params.lng = center[0];
          params.lat = center[1];
        } else {
          params.lng = window.SITE_CONFIG.map.center[0];
          params.lat = window.SITE_CONFIG.map.center[1];
        }
        return params;
      },
      handleClose () {
        this.keywords = '';
        this.visible = false;
        this.$emit('clearSearchData');
      },
      addFocus(item){
        this.$emit('addFocus', item);
      },
      removeFocus(item){
        this.$emit('removeFocus', item);
      },
      handleSelectPoint(itemData){
        this.$emit('select', {
          point: [itemData.longitude, itemData.latitude],
          address: itemData.name
        });
      }
    }
  }
</script>
