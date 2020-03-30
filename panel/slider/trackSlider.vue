<template>
  <!-- 弹出框内容-轨迹回放 -->
  <div class="popbox popbox-size-xxsmall replayBox" v-if="show" key="uuid">
    <!-- 头部 -->
    <header class="popbox-header">
      <h3>轨迹回放
        <span style="font-size: 14px;color:red; padding: 10px;" v-if="showMsg">{{message}}</span>
      </h3>
      <a href="javascript:void(0);" class="iconfont" @click="handleClose">&#xe601;</a>
    </header>
    <!-- body -->
    <div class="popbox-body">
      <div class="inner">
        <!--时间选择区-->
        <div class="date-pick">
          <date-picker range v-model="time" style="display: inline-block"
                       type="datetime" format="YYYY-MM-DD HH:mm"
                       :shortcuts="false"
                       confirm confirmText="确定" :clearable="false"
                       :notAfter="notAfter">
          </date-picker>
          <button type="submit" v-if="status !== 'play'" class="btn btn-primary" style="height: 22px;"  @click="handlePlayCtrl">
            <span class="iconfont play" style="font-size: 14px;"></span>
          </button>
          <button type="submit" v-if="status === 'play'" class="btn btn-primary" style="height: 22px;" @click="handlePauseCtrl">
            <span class="iconfont pause" style="font-size: 14px;"></span>
          </button>
        </div>
        <!--视频控制区域-->
        <div class="controlBox">
          <!--播放进度-->
          <div class="progressBox">
            <h3>播放进度</h3>
            <span class="text">{{processIndex}}%</span>
            <zt-slider @update="handleProcessUpdate" :index="processIndex" max="100"></zt-slider>
          </div>
          <!--播放进度-->
          <div class="progressBox">
            <h3>播放速度</h3>
            <span class="text">{{speedIndex}}X</span>
            <zt-slider @update="handleSpeedUpdate" :index="speedIndex" max="8"></zt-slider>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/jsx">
  import moment from 'moment'
  import ztcHttp from '@/https/monitor/ztcHttp'
  import mapUtil from '@/map/js/util/mapUtil'
  export default {
    name: 'trackSlider',
    data(){
      let startTime = new Date(moment().format('YYYY-MM-DD') + ' 00:00:00');
      let endTime = new Date(moment().format('YYYY-MM-DD') + ' 23:59:59');
      return {
        notAfter: new Date(),
        uuid: Math.random(),
        message: '',
        show: false,
        showMsg: false,
        status: 'stop',
        time: [startTime, endTime],
        processIndex: 0,
        speedIndex: 1,
      }
    },
    methods: {
      showDialog(){
        this.$mapEvtBus.$emit(mapUtil.EVT_NAME.map_endTrack, {});
        this.$mapEvtBus.$off(mapUtil.EVT_NAME.panel_updateTrackIndex);
        this.$mapEvtBus.$off(mapUtil.EVT_NAME.panel_removeTrackDialog);
        this.closeDialog();
        document.querySelector(".map-area").appendChild(this.$mount().$el);
        this.$mapEvtBus.$on(mapUtil.EVT_NAME.panel_updateTrackIndex, this.updateIndex);
        this.$mapEvtBus.$on(mapUtil.EVT_NAME.panel_removeTrackDialog, () => {
          this.closeDialog();
        });
        this.show = true;
      },
      closeDialog(){
        let beforeDialog = document.querySelector('.popbox.popbox-size-xxsmall.replayBox');
        if (beforeDialog) {
          beforeDialog.parentNode.removeChild(beforeDialog);
        }
      },
      handlePlayCtrl(){
        this.status = 'stop';
        if (this.status === 'pause') {
          this.$mapEvtBus.$emit(mapUtil.EVT_NAME.map_updateTrackParams, {
            type: 'resume',
          });
          this.status = 'play';
        } else {
          this.getTrackData();
        }
      },
      handlePauseCtrl(){
        if (this.status !== 'play') {
          return;
        }
        this.status = 'pause';
        this.$mapEvtBus.$emit(mapUtil.EVT_NAME.map_updateTrackParams, {
          type: 'pause',
        });
      },
      updateIndex(params){
        this.processIndex = params;
        if (parseInt(this.processIndex) === 100) {
          this.status = 'stop';
        }
      },
      getTrackData(){
        this.showMsg = true;
        this.message = '轨迹数据查询中...';
        let params = this.getParams();
        ztcHttp.VehicleTrack(params).then(result => {
          if (!result.data || result.data.length === 0) {
            this.message = '该时间段内无数据';
            return;
          }
          this.showMsg = false;
          this.startTrack(result.data);
          this.status = 'play';
          this.$mapEvtBus.$emit(mapUtil.EVT_NAME.map_ztcHide, {});
        })
      },
      getParams(){
        let startTime = moment(this.time[0]).format('YYYY-MM-DD HH:mm:ss');
        let endTime = moment(this.time[1]).format('YYYY-MM-DD HH:mm:ss');
        return {
          vehicleId: this.itemData.vehicleId,
//          vehicleId: '8AB0E87502C14AE6E0530100007F445E',
          dataType: 'muckVehicle',
          startTime,
          endTime
        }
      },
      startTrack(data){
        this.$mapEvtBus.$emit(mapUtil.EVT_NAME.map_showTrack, data);
      },
      handleProcessUpdate(val){
        this.processIndex = val;
        this.$mapEvtBus.$emit(mapUtil.EVT_NAME.map_updateTrackParams, {
          type: 'process',
          value: val
        });
      },
      handleSpeedUpdate(val){
        this.speedIndex = val;
        this.$mapEvtBus.$emit(mapUtil.EVT_NAME.map_updateTrackParams, {
          type: 'speed',
          value: val
        });
      },
      handleClose(){
        this.$mapEvtBus.$emit(mapUtil.EVT_NAME.map_endTrack, {});
        this.$mapEvtBus.$emit(mapUtil.EVT_NAME.map_ztcResume, {});
        this.$mapEvtBus.$emit(mapUtil.EVT_NAME.map_ztcRightResume, {});
        this.show = false;
      }
    },
    beforeDestroy(){
      this.$mapEvtBus.$off(mapUtil.EVT_NAME.panel_updateTrackIndex);
      if (this.$el && this.$el.parentNode) {
        this.$el.parentNode.removeChild(this.$el);
      }
    }
  }
</script>
