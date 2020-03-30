/**
 * Created by fp on 2018/12/30.
 */
import moment from 'moment'
import mapUtil from '@/map/js/util/mapUtil'
export default {
  //时间轴状态
  timeStatus: {
    stop: 'stop',
    play: 'play',
    pause: 'pause'
  },
  updateHourTimeList(endTime){
    let todayStr = moment().format('MM月DD日');
    let yesterdayStr = moment().subtract(1, 'days').format('MM月DD日');
    let tmpTimeList = [];
    let date = moment(moment(endTime).subtract(6, 'days').endOf('days').format('YYYY-MM-DD')).subtract(1, 'hours');
    let endDate = moment(endTime);
    while (date < endDate) {
      const timeObj = {};
      let temDate = date.add(1, 'hours');
      if (temDate > endDate) {
        break;
      }
      timeObj.time = temDate;
      timeObj.allName = temDate.format('YYYY-MM-DD HH');
      let dateStr = date.format('HH');
      if (dateStr === '00') {//为整天，即level为level1
        timeObj.level = mapUtil.staticParams.level1;

        timeObj.name = temDate.format('MM月DD日');
        if (timeObj.name === todayStr) {
          timeObj.label = '今天';
        } else if (timeObj.name === yesterdayStr) {
          timeObj.label = '昨天';
        } else {
          timeObj.label = timeObj.name;
        }
      } else {
        timeObj.level = mapUtil.staticParams.level2;
        timeObj.label = timeObj.name = temDate.format('HH:mm');
      }
      tmpTimeList.push(timeObj);
    }
    return tmpTimeList;
  },
  updateDayTimeList(endTime){
    let nowMonthStr = moment().format('MM月');
    let lastMonthStr = moment().subtract(1, 'months').format('MM月');
    let tmpTimeList = [];
    let startDate = moment(endTime).subtract(5, 'months').endOf('month');
    let endDate = moment(endTime);
    while (startDate <= endDate) {
      const timeObj = {};
      startDate.add(1, 'days');
      timeObj.time = startDate;
      timeObj.allName = startDate.format('YYYY-MM-DD');
      let dateStr = startDate.format('DD');
      if (dateStr === '01') {
        timeObj.level = mapUtil.staticParams.level1;
        timeObj.name = parseInt(startDate.format('MM')) + '月1日';
        if (timeObj.name === nowMonthStr) {
          timeObj.label = '本月';
        } else if (timeObj.name === lastMonthStr) {
          timeObj.label = '上月';
        } else {
          timeObj.label = parseInt(startDate.format('MM')) + '月';
        }
      } else {
        timeObj.level = mapUtil.staticParams.level2;
        timeObj.label = timeObj.name = parseInt(startDate.format('DD')) + '日';
      }
      tmpTimeList.push(timeObj);
    }
    return tmpTimeList;
  },
  alert(msg){
    console.log(msg);
  }
}
