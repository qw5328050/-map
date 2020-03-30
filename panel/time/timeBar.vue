<template>
  <!-- 时间轴 -->
  <div class="timeline-wrapper">
    <!-- 时间轴-按钮 -->
    <div class="timeline-btn-wrapper">
      <span class="timeline-btn previous"
            @click="handlePrevious"
            :class="{'disabled': playIndex === 0}"></span>
      <span class="timeline-btn pause"
            @click="handlePause"
            :class="{'dis_none':  timeUtil.timeStatus.play !== playStatus }"></span>
      <span class="timeline-btn play" @click="handlePlay"
            :class="{'dis_none':  timeUtil.timeStatus.play === playStatus }"></span>
      <span class="timeline-btn next" @click="handleNext"
            :class="{'disabled': playIndex === (timeList.length - 1)}"></span>
    </div>
    <!-- 时间轴 -->
    <div class="timeline">
      <dl>
        <time-detail v-for="item in timeList"
                     :key="item.allName" :data="item" :selectedTime="selectedTime.allName"
                     @click="handleSelect"></time-detail>
      </dl>
    </div>
  </div>
</template>

<script type="text/jsx">
  import moment from 'moment'
  import basePanel from '../basePanel'
  import mapUtil from '@/map/js/util/mapUtil'
  import timeUtil from '@/map/js/util/timeUtil'
  import timeDetail from './timeDetail.vue'

  export default {
    name: 'time-bar',
    mixins: [basePanel],
    components: {
      timeDetail
    },
    data(){
      return {
        timeUtil: timeUtil,
        dateType: mapUtil.defaultParams.airDateType,
        endTime: null,
        timeList: [],
        selectedTime: null,
        //时间轴状态
        playStatus: timeUtil.timeStatus.stop,
        playIndex: 0,
        playTimer: null,
        axisEndDate: null,
        cacheTime: null
      }
    },
    created(){
      this.$mapEvtBus.$on(mapUtil.EVT_NAME.map_updateMapSetting, this.updateDateType);
      this.$mapEvtBus.$on(mapUtil.EVT_NAME.tool_cacheLoadingFinish, this.updateCacheFinishTime);

    },
    beforeDestroy(){
      this.$mapEvtBus.$off(mapUtil.EVT_NAME.map_updateMapSetting, this.updateDateType);
      this.$mapEvtBus.$off(mapUtil.EVT_NAME.tool_cacheLoadingFinish, this.updateCacheFinishTime);
    },
    methods: {
      updateDateType({model}) {
        this.clear();
        this.dateType = model.airSetInfo.frequency;

        if (this.dateType === 'hour') {
          this.endTime = moment().format('YYYY-MM-DD HH');
          this.timeList = timeUtil.updateHourTimeList(this.endTime);
        } else {
          this.endTime = moment().format('YYYY-MM-DD');
          this.timeList = timeUtil.updateDayTimeList(this.endTime);
        }
        this.axisEndDate = this.timeList.slice(-1)[0].allName;
        this.setSelectedData();
        this.$nextTick(() => {
          this.emitEvent();
        });
      },
      updateCacheFinishTime(time){
        this.cacheTime = time;
      },

      handleSelect(timeObj){
        this.selectedTime = timeObj;
        this.updatePlayIndex();
        this.emitEvent();
        if (this.playStatus === timeUtil.timeStatus.play) {
          this.clearTimer();
          this.handlePlay();
        }
      },
      setSelectedData(){
        let nowDateStr = '';
        if (this.dateType === 'hour') {
          nowDateStr = moment().format('YYYY-MM-DD HH');
        } else {
          nowDateStr = moment().format('YYYY-MM-DD');
        }
        this.timeList.some(item => {
          if (item.allName === nowDateStr) {
            this.selectedTime = item;
            this.updatePlayIndex();
            return true;
          } else {
            return false;
          }
        })
      },
      handlePause(){
        this.playStatus = timeUtil.timeStatus.pause;
        if (this.playTimer) {
          window.clearTimeout(this.playTimer);
          this.playTimer = null;
        }
      },
      handlePlay(){
        this.playStatus = timeUtil.timeStatus.play;
        this.$mapEvtBus.$emit(mapUtil.EVT_NAME.map_timeStartPlay, {
          selectedTime: this.selectedTime,
          playStatus: this.playStatus,
          axisEndDate: this.axisEndDate
        });
        this.playTimer = window.setTimeout(() => {
          this.play();
        }, 4000);
      },
      play(){
        if (this.playIndex < this.timeList.length) {
          this.selectedTime = this.timeList[this.playIndex];
          if (this.cacheTime && !moment(this.selectedTime.allName).isAfter(this.cacheTime)) {
            //说明数据已经缓存了
            this.$mapEvtBus.$emit(mapUtil.EVT_NAME.map_timeShowData, {
              time: this.selectedTime.allName
            });
            this.playIndex++;
          }
          this.playTimer = window.setTimeout(() => {
            this.play();
          }, 2000);
        } else {
          this.playStatus = timeUtil.timeStatus.stop;
        }
      },
      handlePrevious(){
        if (this.playIndex >= 1) {
          this.selectedTime = this.timeList[this.playIndex - 1];
          this.playIndex--;
        } else {
          //TODO msg提醒需完善
          timeUtil.alert('已在队列前')
        }
      },
      handleNext(){
        if (this.playIndex < this.timeList.length - 1) {
          this.selectedTime = this.timeList[this.playIndex + 1];
          this.playIndex++;
        } else {
          //TODO msg提醒需完善
          timeUtil.alert('已到最后');
        }
      },
      updatePlayIndex(){
        this.playIndex = this.timeList.indexOf(this.selectedTime);
      },
      emitEvent(){
        this.$mapEvtBus.$emit(mapUtil.EVT_NAME.map_updateTime, {
          selectedTime: this.selectedTime,
          playStatus: this.playStatus,
          axisEndDate: this.axisEndDate
        });
        this.$store.commit('map/updateTime', this.selectedTime.allName);
        this.$store.commit('map/updateDateType', this.dateType);
      },
      clear(){
        this.clearTimer();
        this.playStatus = timeUtil.timeStatus.stop;
      },
      clearTimer(){
        if (this.playTimer) {
          window.clearTimeout(this.playTimer);
          this.playTimer = null;
        }
      }
    }
  }
</script>

<style type="text/css" scoped>
  .timeline-wrapper {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50px;
    background: rgba(255, 255, 255, .5);
  }

  .timeline-wrapper .timeline-btn-wrapper .timeline-btn.dis_none {
    display: none;
  }
</style>
