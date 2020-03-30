<template>


  <div v-if="visible && hidePlane">
    <div class="point-info-wrapper">
      <a class="close-detail-btn" @click="closedPlaneAndEndRelated">
        <span class="iconfont" @click="closedPlaneAndEndRelated">&#xe601;</span>
      </a>
      <div class="point-info-detail">
        <!-- 头部信息 -->
        <header class="header-info">
          <h3 class="name">{{itemData.vehicleNumber}}</h3>
        </header>
        <div class="base-info-list">
          <ul>
            <li class="contact-info">
              <span>车辆类型：{{info.typeDesc}}</span>
            </li>
            <li class="contact-info">
              <span>速度：{{info.speed}}(千米/小时)</span>
            </li>
            <li class="contact-info">
              <span>经度：{{info.longitude}}</span>
            </li>
            <li class="contact-info">
              <span>纬度：{{info.latitude}}</span>
            </li>
            <li class="contact-info">
              <span>位置：{{info.position}}</span>
            </li>
            <li class="contact-info">
              <span>定位时间：{{info.gTime}}</span>
            </li>

          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/jsx">
  import ztcHttp from '@/https/monitor/ztcHttp'
  import baseDialog from '@/map/dialog/base/baseDialog'
  import moment from 'moment'
  import { objectAssign } from '@/utils/util'
  import mapUtil from '@/map/js/util/mapUtil'

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
        },
        hidePlane: false
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
      showDetail(){
        ztcHttp.VehicleInfo({
          vehicleId: this.itemData.vehicleId,
        }).then(result => {
          objectAssign(this.info, result.result);
          this.hidePlane = true;
        })
      },
      closedPlaneAndEndRelated(){
        let parentId = this.$el.parentNode.id
        if ('primary' === parentId) {
          this.$mapEvtBus.$emit(mapUtil.EVT_NAME.map_endAnalysis, {})
        }
        this.hidePlane = false
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

