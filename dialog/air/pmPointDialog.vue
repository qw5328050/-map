<template>
  <div v-if="visible && hidePlane">
    <div class="point-info-wrapper">
      <a class="close-detail-btn" @click="closedPlaneAndEndRelated"><span class="iconfont" @click="closedPlaneAndEndRelated">&#xe601;</span></a>
      <div class="point-info-detail">
        <!-- 头部信息 -->
        <header class="header-info">
          <!--<a href="javascript:void(0)" class="detail-btn"><em class="iconfont">&#xe672;</em>详情</a>-->
          <h3 class="name">{{info.carNo}}</h3>
          <p>
            <span class="fr" v-if="info.speed">{{info.speed}}千米/小时</span>
          </p>
        </header>
        <div class="base-info-list">
          <ul>
            <li class="text-ellipsis width380" :title="info.address"><em
              class="iconfont address">&#xe606;</em>{{info.address}}
            </li>
          </ul>
        </div>
        <!-- 分类信息 -->
        <div class="classification-info">
          <!-- 分类 -->
          <div class="tab-wrapper">
            <span class="tab-item" :class="{'cur': tabIndex === 1}" @click="tabIndex = 1">监控数据</span>
          </div>
          <!-- 分类内容-实时监控 -->
          <div class="tab-content" v-show="tabIndex === 1" key="1">
            <!-- 表格信息 -->
            <div class="panel-table-heaer">
              <time>{{info.time}}</time>
            </div>

            <!-- 其他监测数据 -->
            <div class="monitoring-data">
              <!-- 污染物 -->
              <div class="pollutant">
                <div class="pollutant-item" style="width: 48%;">
                  <label>PM₁₀：</label>
                  <div class="num">
                    <strong class="red">{{info.pm10}}</strong>
                    <span class="sup">μg/m³&nbsp;&nbsp;</span>
                  </div>
                  <!--<color-label factor="pm10" :value="info.pm10"></color-label>-->
                </div>
                <div class="pollutant-item" style="width: 48%;">
                  <label>PM₂.₅：</label>
                  <div class="num">
                    <strong class="red">{{info.pm25}}</strong>
                    <span class="sup">μg/m³&nbsp;&nbsp;</span>
                  </div>
                  <!--<color-label factor="pm25" :value="info.pm25"></color-label>-->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="loading-bg" v-if="loading"><span class="spinner-loader">Loading</span></div>
    </div>
  </div>
</template>

<script type="text/jsx">
  import mapDialogHttp from '@/https/map/mapDialogHttp'
  import baseDialog from '../base/baseDialog'
  import moment from 'moment'
  import { objectAssign } from '@/utils/util'
  import mapUtil from '@/map/js/util/mapUtil'

  export default{
    name: 'pmPointDialog',
    data(){
      return {
        info: {
          address: '',
          pm25: '',
          lng: '',
          carNo: '',
          pm10: '',
          time: '',
          lat: '',
          speed: '',
          direction: ''
        },
        tabIndex: 1,
        hidePlane: true,
        loading: true
      }
    },
    created(){
      this.info = {
        address: '',
        pm25: '',
        lng: '',
        carNo: '',
        pm10: '',
        time: '',
        lat: '',
        speed: '',
        direction: ''
      };
      this.loading = true;
      this.tabIndex = 1;
    },
    mixins: [baseDialog],
    mounted(){
      this.$nextTick(() => {
        this.loading = true;
        this.showPmDetail();
      })
    },
    methods: {
      justClosedPlane(){
        this.hidePlane = false
      },
      showPmDetail(){
        mapDialogHttp.getPointDetail({
          id: this.id,
          dateType: this.dateType
        }).then(result => {
          result.data.speed = Math.round(result.data.speed);
          result.data.pm10 = Math.round(result.data.pm10);
          result.data.pm25 = Math.round(result.data.pm25);
          this.info = result.data;
          this.loading = false;
        });
      },
      closedPlaneAndEndRelated () {
        this.hidePlane = false
      },
    }
  }
</script>
<style>
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

