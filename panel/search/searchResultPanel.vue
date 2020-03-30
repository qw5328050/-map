<template>
  <div>
    <!-- 搜索结果列表 -->
    <div class="result-wrapper" v-if="visible">
      <form class="form-inline">
      <div class="form-group">
<!--        <zt-dict-select-->
<!--          :itemCode="constants.search_site_type"-->
<!--          v-model="searchType"-->
<!--          @change="handleSearchTypeChange">-->
<!--        </zt-dict-select>-->
        <zt-select class="ml_10 w_120" v-model="searchBigType" @change="handleBigChange">
          <zt-option
            v-for="item in dictBigList"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          ></zt-option>
        </zt-select>
      </div>
      <div class="form-group">
        <!--        <zt-dict-select-->
        <!--          :itemCode="constants.search_site_type"-->
        <!--          v-model="searchType"-->
        <!--          @change="handleSearchTypeChange">-->
        <!--        </zt-dict-select>-->
        <zt-select class="ml_10 w_120" v-model="searchSmallType" @change="handleSearchTypeChange">
          <zt-option
            v-for="item in dictSmallList"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          ></zt-option>
        </zt-select>
      </div>
      </form>
      <zt-scrollbar class="ps" :style="{'maxHeight':  documentClientHeight - 280 + 'px'}">
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
              <h3 class="title-name">{{item.siteName}}</h3>
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
</template>

<script>
  import basePanel from '../basePanel'
  import mixins from '@/mixins/index'
  import ZtScrollbar from '@/components/_public/zt/scrollbar/scrollbar'
  import ZtPagination from '@/components/_public/zt/pagination/pagination'
  import mapHttp from '@/https/map/mapHttp'
  import mapUtil from '@/map/js/util/mapUtil'
  import dictHttp from '@/https/sys/dictHttp';

  export default {
    name: 'search-result-panel',
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
        searchBigType: '',
        searchSmallType: '',
        dataList: [],
        dictBigList:[],
        dictSmallList:[],
        dictResult: []

      }
    },
    //将地图引入进来
    inject: ['getMap'],
    mounted(){
      this.getSearchDict();
    },
    methods: {
      init () {
        this.dictBigList = [];
        this.dictSmallList = [];
        this.searchType = '';
        this.getSearchDict();
        this.handleBigChange('');
      },
      handleSearchTypeChange (val, label) {
        this.searchSmallType = val;
        this.pageSize = 10;
        this.pageNo = 1;
        this.getDataList()
      },
      handleBigChange (val, label) {
        // this.searchBigType = val;
        console.log('当前vai:',val);
        console.log('this.dictResult:',this.dictResult)
        let tempDict = []
        this.dictResult.forEach(item => {
          if(item.code === val){
            this.dictSmallList =[]
            this.dictSmallList = item.children
            this.searchSmallType= this.dictSmallList[0].name
          }else if(val === ''){
            this.searchSmallType=''
            item.children.forEach(childItem => {
              tempDict.push(childItem)
            })
            this.dictSmallList = [{code:'',name:'全部'}].concat(tempDict)
            // this.dictSmallList = tempDict
          }
        })
       if(val === ''){
          this.getDataList()
        }
      },
      getDataList () {
        let params = {
          keyWord: this.obj.keywords,
          longitude: this.obj.lng,
          latitude: this.obj.lat,
          type: this.searchSmallType,
          countyCode: this.divisionCode,
          size: this.pageSize,
          page: this.pageNo
        };
        mapHttp.search(params).then((result) => {
          this.dataList = result.result.data;
          this.total = result.result.total;
           this.$mapEvtBus.$emit(mapUtil.EVT_NAME.map_showData, this.dataList);
        })
      },
      getSearchDict () {
        let params = {
          itemCode: 'SITE_TYPE',
          name: '',
        };
        dictHttp.getDetail(params).then((result) => {
          this.dictResult = result.result;
          let dictSearch = result.result;

          dictSearch.forEach(item => {
            // item.children.forEach(item => {
            //   this.dictList.push(item)
            // })
            this.dictBigList.push({
              name:item.name,
              code:item.code
            })
          })
          this.dictBigList = [{code:'',name:'全部'}].concat(this.dictBigList)
          // console.log(this.dictList)
        })
      },
      handlePgChange (pageNo, pageSize) {
        this.pageNo = pageNo;
        this.pageSize = pageSize;
        this.getDataList()
      },
      showStationDetail (item) {
        this.$emit('showDetail', item);
      },
      close () {
        this.visible = false;
        this.$mapEvtBus.$emit(mapUtil.EVT_NAME.map_removeData);
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
