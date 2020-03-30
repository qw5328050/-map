<template>
  <!-- 国控、省控、市控  街镇类型站点监控信息 -->
  <div v-if="visible && hidePlane">
    <div class="point-info-wrapper">
      <a class="close-detail-btn" @click="justClosedPlane">
        <span class="iconfont" @click="justClosedPlane">&#xe601;</span>
      </a>
      <div class="point-info-detail">
        <!-- 头部信息 -->
        <header class="header-info">
          <h3 class="name">{{detailData.name}}</h3>
          <p>
             <span class="fl">
                 <zt-dictionary :itemCode="constants.recognitionType"
                                :code="itemData.recognitionType"></zt-dictionary>
            </span>
            <span class="fr">{{detailData.countyName}} </span>
          </p>
        </header>
        <zt-scrollbar class="ps" :style="{'max-height': documentClientHeight + 'px'}" ref="scrollBar">
          <!-- 基础信息 -->
          <div class="base-info-list">
            <ul>
              <li v-if="itemData.siteName" class="text-ellipsis width380"><em
                class="iconfont address">&#xe606;</em>{{itemData.siteName}}
              </li>
            </ul>
          </div>
          <!-- 分类信息 -->
          <div class="classification-info">
            <!-- 分类 -->
            <div class="tab-wrapper">
              <span v-show="showVideoTab" class="tab-item" :class="{'cur': tabIndex === 2}"
                    @click="tabIndex = 2">视频</span>
              <span v-show="showGasWan" class="tab-item" :class="{'cur': tabIndex === 3}"
                    @click="tabIndex = 3">报警</span>
            </div>
            <!-- 分类内容-视频 -->
            <div class="tab-content" v-show="tabIndex === 2">
              <video-tab v-show="showVideoTab"
                         :playNewVideoList="videoList"></video-tab>
            </div>
            <!--分类内容-实时报警-->
            <div class="tab-content" v-show="tabIndex === 3">
              <video-alarm-list :params="alarmParams"></video-alarm-list>
            </div>
          </div>
        </zt-scrollbar>
      </div>
    </div>
  </div>
</template>
<script>
  import moment from 'moment'
  import store from '@/store'
  import videoAlarmMapHttp from '@/https/video/videoAlarmMapHttp'
  import baseDialog from '@/map/dialog/base/baseDialog'
  import trendComparePanel from '@/map/dialog/_public/trendComparePanel.vue'
  import {objectAssign} from '@/utils/util'
  import videoTab from './videoTab.vue'
  import videoAlarmList from './videoAlarmList'
  export default {
    name: 'station-monitor-panel',
    components: {
      videoTab, videoAlarmList
    },
    mixins: [baseDialog],
    data () {
      return {
        tabIndex: 3,
        detailData: {},
        alarmParams: {},
        hidePlane: false,
        showGasWan: true,
        showVideoTab: true,
        params: {},
        videoList: []
      }
    },
    created(){
      let data = this.itemData;
      this.params = {
        fId: this.itemData.id,
        code: this.itemData.id,
        type: 'video',
        siteType: this.itemData.siteType
      };
      this.alarmParams = data;
      this.getData();
    },
    methods: {
      getData(){
        videoAlarmMapHttp.getDetailByDeviceId({
          deviceId: this.itemData.id
        }).then(response => {
          this.hidePlane = true;
          this.detailData = response.result;
          this.videoList.push({
            id: this.detailData.deviceId,
            na: this.detailData.name,
            status: this.detailData.status,
            showMaskFlag: true
          })
        })
      },
      justClosedPlane(){
        this.hidePlane = false
      },
    },
    watch: {
      tabIndex(){
        this.$nextTick(() => {
          this.$refs.scrollBar && this.$refs.scrollBar.update();
        })
      },
    }
  }
</script>
<style scoped>
  .tab-item {
    position: relative;
  }

  .tab-item a {
    font-size: 36px;
    font-weight: bold;
    color: #f40;
    position: absolute;
    top: -7px;
    left: -4px;
  }

  .close-detail-btn {
    position: absolute;
    right: 2px;
    top: 2px;
    color: #fff;
    width: 23px;
    height: 23px;
    text-align: center;
    line-height: 22px;
    z-index: 99;
  }

  .iconfont {
    font-size: 12px;
    font-weight: bold;
  }

  .close-detail-btn:hover {
    background: #fff;
    border-radius: 50%;
    color: #ccc;
  }

  .pagination {
    padding-left: 0;
    padding-right: 0;
    text-align: center;
  }

  .pagination button.btn-prev {
    margin-right: 5px;
  }

  .pagination button.btn-next {
    margin-left: 5px;
  }
</style>
