<template>
  <div v-if="visible&&hidePlane">
    <!-- 遮照层 -->
   <div class="modal"></div>
   <div class="popbox-wrapper popbox-drag"  v-zt-dialog-drag="true" style="padding-top: 5vh;">
    <div class="popbox popbox-size-small zt-drag-dialog">
        <!-- 头部 -->
        <header class="popbox-header zt-drag-dialog-header">
          <h3>车辆信息</h3>
          <a href="javascript:void(0);" class="iconfont" @click.stop.prevent="close">&#xe601;</a>
        </header>
        <!-- body -->
        <div class="popbox-body">
          <div class="grids-supervise">
            <table class="table table-bordered small-padding light-blue-th">
              <tbody>
              <tr>
                <th style="width: 17%;">车牌号</th>
                <td style="width: 33%;">{{itemData.vehicleNumber}}</td>
                <th style="width: 17%;">车辆类型</th>
                <td style="width: 33%;">{{info.typeDesc}}</td>
              </tr>
              <tr>
                <th>速度</th>
                <td>{{info.speed}}(km/h)</td>
                <th>方向描述</th>
                <td>{{info.wayDesc}}</td>
              </tr>
              <tr>
                <th>纬度</th>
                <td>{{info.latitude}}</td>
                <th>经度</th>
                <td>{{info.longitude}}</td>
              </tr>
              <tr>
                <th>位置</th>
                <td colspan="3">{{address}}</td>
              </tr>
              <tr>
                <th>定位时间</th>
                <td>{{info.gTime}}</td>
                <th>在线情况</th>
                <td>{{getStatus(info.onlineStatus)}}</td>
              </tr>
              </tbody>
            </table>
            <div class="mt_20 al_right">
              <zt-button type="primary" @click="handlePlayTrack">轨迹回放</zt-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/jsx">
  import Vue from 'vue'
  import ztcHttp from '@/https/monitor/ztcHttp'
  import publicHttp from '@/https/_public/publicHttp'
  import baseDialog from '@/map/dialog/base/baseDialog'
  import moment from 'moment'
  import {objectAssign} from '@/utils/util'
  import mapUtil from '@/map/js/util/mapUtil'
  import trackSlider from '@/map/panel/slider/trackSlider.vue'

  export default{
    name: 'ztcDialog',
    data(){
      return {
        info: {
          vehicleNumber: '',
          typeDesc: '',
          speed: '',
          wayDesc: '',
          latitude: '',
          longitude: '',
          gTime: '',
          position: '',
          wayDesc: '',
        },
        hidePlane: false,
        address: ''
      }
    },
    created(){
      this.info = {
        vehicleNumber: '',
        typeDesc: '',
        speed: '',
        wayDesc: '',
        latitude: '',
        longitude: '',
        gTime: '',
        position: '',
        wayDesc: '',
      };
    },
    mixins: [baseDialog],
    mounted(){
      this.$nextTick(() => {
        this.showDetail();
      })
    },
    methods: {
      justClosedPlane(){
        this.hidePlane = false
      },
      getStatus(status){
        if (status == 1) {
          return '在线';
        } else {
          return '离线';
        }
      },
      showDetail(){
        ztcHttp.VehicleInfo({
          vehicleId: this.itemData.vehicleId,
        }).then(result => {
          if(result.result.longitude && result.result.latitude) {
            this.getRoadAddress(result.result.longitude, result.result.latitude);
          }
          objectAssign(this.info, result.result);
          this.hidePlane = true;
        })
      },
      getRoadAddress(lng, lat){
        publicHttp.getRoadAddress({
          lng: lng,
          lat: lat,
        }).then(result => {
         this.address = result.data.address
        })
      },
      closedPlaneAndEndRelated(){
        let parentId = this.$el.parentNode.id
        if ('primary' === parentId) {
          this.$mapEvtBus.$emit(mapUtil.EVT_NAME.map_endAnalysis, {})
        }
        this.hidePlane = false
      },
      show() {
        document.querySelector("body").appendChild(this.$mount().$el);
        this.visible = true;
      },
      close() {
        this.visible = false;
      },
      handlePlayTrack(){
      this.$mapEvtBus.$emit(mapUtil.EVT_NAME.map_ztcRightHide, {})
        let dialogObj = Vue.extend(trackSlider);
        let obj = new dialogObj({
          data: {
            itemData: this.itemData
          }
        });
        obj.showDialog();
        this.visible = false;
      }
    }
  }
</script>
<style lang="less" type="text/css" scoped>
  .map-wrapper .point-info-detail .tab-content {
    padding-top: 0;

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
</style>

