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
  import timeBar from './timeBar.vue'
  import basePanel from '../basePanel'
  import mapUtil from '@/map/js/util/mapUtil'
  import timeUtil from '@/map/js/util/timeUtil'
  import timeDetail from './timeDetail.vue'

  export default {
    name: 'monitorTimeBar',
    mixins: [basePanel],
    extends: timeBar,
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
      this.$mapEvtBus.$on(mapUtil.EVT_NAME.map_updateMonitorDateType, this.updateDateType);
      this.$mapEvtBus.$on(mapUtil.EVT_NAME.tool_cacheLoadingFinish, this.updateCacheFinishTime);

    },
    beforeDestroy(){
      this.$mapEvtBus.$off(mapUtil.EVT_NAME.map_updateMonitorDateType, this.updateDateType);
      this.$mapEvtBus.$off(mapUtil.EVT_NAME.tool_cacheLoadingFinish, this.updateCacheFinishTime);
    },
    methods: {
      updateDateType(dateType) {
        this.clear();
        this.dateType = dateType;

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
