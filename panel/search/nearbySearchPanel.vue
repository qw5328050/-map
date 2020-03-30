<template>
  <div>
    <!-- 附近查询 -->
    <div class="nearby" v-if="visible">
      <div class="return-btn-box text-ellipsis" @click="emitBack"
           :title="'返回'+ name+'的详情'">
        <a href="javascript:void(0);"><span class="iconfont">&#xe882;</span>返回"{{name}}"的详情</a>
      </div>
      <div class="result-wrapper">
        <div class="form-group">
          <zt-dict-select
            :itemCode="constants.search_site_type"
            v-model="searchType"
            @change="handleSearchTypeChange">
          </zt-dict-select>
        </div>

        <zt-scrollbar class="ps"  :style="{'maxHeight':  documentClientHeight - 280 + 'px'}">
          <ul>
            <li class="result-list" v-for="(item, index) in dataList"
                @mouseenter.stop="addFocus(item)"
                @mouseleave.stop="removeFocus(item)"
                @click="showStationDetail(item)">
              <!-- 左侧 -->
              <div class="col-l">
                <span class="map-position-icon">{{index+1}}</span>
              </div>
              <!-- 右侧 -->
              <div class="col-r">
                <div class="col-r-item">{{item.distance}}公里</div>
                <div class="col-r-item">{{item.typeDetail}}</div>
              </div>
              <!-- 中间 -->
              <div class="col-c">
                <h3 class="title-name">{{item.name}}</h3>
                <div class="contact">
                  <p>{{item.address}}</p>
                  <p v-show="item.phone">电话：{{item.phone}}</p>
                </div>
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
  </div>
</template>

<script>
  import basePanel from '../basePanel'
  import ZtScrollbar from '@/components/_public/zt/scrollbar/scrollbar'
  import ZtPagination from '@/components/_public/zt/pagination/pagination'
  import mapHttp from '@/https/map/mapHttp'
  import mapUtil from '@/map/js/util/mapUtil'
  import mixins from '@/mixins'

  export default {
    name: 'nearby-search-panel',
    components: {ZtPagination, ZtScrollbar},
    mixins: [basePanel, mixins],
    props: {
      divisionCode: [String, Number]
    },
    data () {
      return {
        pageSize: 10,
        pageNo: 1,
        total: 0,
        keywords: '',
        searchType: '',
        name: '',
        dataList: []
      }
    },
    //将地图引入进来
    inject: ['getMap'],
    methods: {
      init () {
        this.searchType = ''
        this.name = this.obj.name
        this.$nextTick(() => {
          this.getDataList()
        })
      },
      getDataList () {
        let params = {
          keyWord: this.keywords,
          lng: this.obj.lng,
          lat: this.obj.lat,
          type: this.searchType,
          divisionCode: this.divisionCode,
          size: this.pageSize,
          page: this.pageNo
        };
        mapHttp.search(params).then((result) => {
          this.dataList = result.data.data
          this.dataList.forEach(item => {
            item.type = item.searchType;
          });
          this.total = result.data.total
          this.$mapEvtBus.$emit(mapUtil.EVT_NAME.map_showData, this.dataList);

        })
      },
      handleSearchTypeChange (val, label) {
        this.searchType = val
        this.pageSize = 10
        this.pageNo = 1
        this.getDataList()
      },
      handlePgChange (pageNo, pageSize) {
        this.pageNo = pageNo
        this.pageSize = pageSize
        this.getDataList()
      },
      showStationDetail (item) {
        this.$emit('showDetail', item);
      },
      emitBack () {
        this.close()
        this.$emit('nearbySearchListBack', this.obj)
      },
      close () {
        this.visible = false;
//        this.$mapEvtBus.$emit(mapUtil.EVT_NAME.map_removeData);
      },
      addFocus(item){
        this.$mapEvtBus.$emit(mapUtil.EVT_NAME.map_showFocus, item);
      },
      removeFocus(item){
        this.$mapEvtBus.$emit(mapUtil.EVT_NAME.map_removeFocus, item);
      }
    }
  }
</script>
<style lang="less" scoped>
  .nearby {

  .result-wrapper {
    width: 400px;
  }

  }
</style>
