<template>
  <div>
    <!-- 时间筛选 -->
    <div class="time-filter">
      <div class="form-inline">
        <section class="mb_10">
          <div class="form-group">
            <zt-select v-model="rankModel.type" placeholder="类型"
                       @change="handleTypeChange">
              <zt-option v-for="item in typeList"
                         :key="item.detailCode"
                         :label="item.detailName"
                         :value="item.detailCode">
              </zt-option>
            </zt-select>
          </div>
          <div class="form-group">
            <zt-select v-model="rankModel.factorName" placeholder="指标">
              <zt-option v-for="item in indexList"
                         :key="item.detailCode"
                         :label="item.detailName"
                         :value="item.detailCode">
              </zt-option>
            </zt-select>
          </div>
          <div class="form-group">
            <zt-select v-model="rankModel.dateType" placeholder="周期"
                       @change="handleDateTypeChange">
              <zt-option v-for="item in dateTypeList"
                         :key="item.detailCode"
                         :label="item.detailName"
                         :value="item.detailCode">
              </zt-option>
            </zt-select>
          </div>
        </section>
        <section>
          <div class="form-flex">
            <label>{{rankMonitorPeriodLabel}}&nbsp;</label>
            <zt-date-picker
              v-if="rankModel.dateType=== 'day'"
              v-model="rankModel.monitorTime"
              type="date"
              format="YYYY-MM-DD"
              :placeholder="rankMonitorPeriodPlaceHolder"
              confirm
              confirmText="确定"
              :minuteStep="2"
              :not-after="notAfter">
            </zt-date-picker>
            <zt-date-picker
              v-if="rankModel.dateType=== 'hour'"
              v-model="rankModel.monitorTimeHour"
              type="datetime"
              format="YYYY-MM-DD HH"
              :placeholder="rankMonitorPeriodPlaceHolder"
              confirm
              confirmText="确定"
              :minuteStep="2"
              :not-after="notAfter">
            </zt-date-picker>
          </div>
        </section>
      </div>
    </div>
    <!-- 表格数据 -->
    <div class="panel-wrapper">
      <zt-table
        width="370"
        :data="rankData"
        ref="table"
        bodyHeight
        @click="emitPickCb"
        class="zt-tr-pointer"
        height="330"
        autoToTop>
        <zt-column type="index" label="排名" width="60"></zt-column>
        <zt-column prop="name" label="站点名" width="120"></zt-column>
        <zt-column prop="divName" label="区域" width="100"></zt-column>
        <zt-column prop="value" label="指标" width="90">
          <template slot-scope="scope">
            <span class="label-val zt-ranking-label-val" :class="factorNameClass(scope.row)">{{scope.row.value}}</span>
          </template>
        </zt-column>
      </zt-table>
      <zt-pagination :page-size="pageSize" :total="total" :pagerCount="3"
                     layout="total,prev,pager,next"
                     @change="handlePgChange"></zt-pagination>
    </div>
  </div>
</template>

<script type="text/jsx">
  import aqiColor from '@/utils/aqiColor'
  import mapHttp from '@/https/map/mapHttp'
  import monitorHttp from '@/https/monitor/monitorHttp'
  import ZtDictSelect from '@/components/_public/zt/select/dict-select'
  import ZtDatePicker from '@/components/_public/zt/date/datePicker'
  import ZtScrollbar from '@/components/_public/zt/scrollbar/scrollbar'
  import moment from 'moment'
  import {objectAssign, removeNullKey} from '@/utils/util'
  import mixins from '@/mixins'
  import mapUtil from '@/map/js/util/mapUtil'
  import {getDictListByKey} from '@/components/_public/zt/dictionary/index'

  export default {
    name: 'ranking-panel',
    components: {ZtScrollbar, ZtDatePicker, ZtDictSelect},
    data () {
      return {
        notAfter: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        rankMonitorPeriodLabel: '时间点',
        rankmonitorPeriodFormat: 'YYYY-MM-DD HH',
        rankmonitorPeriodType: 'datetime',
        pageSize: 10,
        pageNo: 1,
        total: 0,
        timer: null,
        typeList: [{detailCode: 'guok', detailName: '国控'},
          {detailCode: 'shengk', detailName: '省控'},
          {detailCode: 'shik', detailName: '市控'},
          {detailCode: 'jiez', detailName: '街镇'},
          {detailCode: 'weiz', detailName: '微站'},
          {detailCode: 'zhgc', detailName: '走航'}],
        dateTypeList: [{detailCode: 'hour', detailName: '小时'},
          {detailCode: 'day', detailName: '日均'}],
        rankModel: {
          type: 'guok',
          factorName: 'aqi',
          dateType: 'hour', // 默认小时
          monitorTime: moment().format('YYYY-MM-DD HH:mm:ss'),
          monitorTimeHour: moment().format('YYYY-MM-DD HH'),
        },
        indexList: getDictListByKey(this.constants.air_quality_index),
        rankData: []
      }
    },
    mixins: [mixins],
    computed: {
      rankMonitorPeriodPlaceHolder () {
        return '请选择' + this.rankMonitorPeriodLabel
      }
    },
    watch: {
      rankModel: {
        handler (newVal) {
          this.getRankData();
        },
        deep: true
      }
    },
    mounted(){
      this.$nextTick(() => {
        this.getRankData()
      });
    },
    methods: {
      getRankData () {
        if (this.timer) {
          window.clearTimeout(this.timer);
        }
        this.timer = window.setTimeout(() => {
          this.timer = null;
          this._getRankData();
        }, 10);
      },
      _getRankData(){
        let params = {
          size: this.pageSize,
          page: this.pageNo,
          dateType: this.rankModel.dateType,
          type: this.rankModel.type,
          factorName: this.rankModel.factorName
        };
        if (params.dateType === 'hour') {
          params.time = this.rankModel.monitorTimeHour + ':00:00';
        } else {
          params.time = this.rankModel.monitorTime;
        }
        monitorHttp.getAirMonitorList(params).then((result) => {
          let data = result.data;
          this.total = data.total;
          this.rankData = data.data;
          this.rankData.forEach(item => {
            item.id = item.code;
            item.longitude = item.lng;
            item.latitude = item.lat;
            item.factorName = this.rankModel.factorName;
          });
          /*   this.$mapEvtBus.$emit(mapUtil.EVT_NAME.map_showRankData, {
           type: this.rankModel.factorName,
           data: data.data
           })*/
        })
      },
      handleTypeChange (val, label) {
        if (val !== 'weiz' && val !== 'zhgc') {
          this.indexList = getDictListByKey(this.constants.air_quality_index);
        } else {
          this.indexList = getDictListByKey(this.constants.air_quality_s2_factor);
          if (this.rankModel.factorName !== 'pm10' && this.rankModel.factorName !== 'pm25') {
            this.rankModel.factorName = 'pm10';
          }
        }
      },
      handlePgChange (pageNo, pageSize) {
        this.pageNo = pageNo
        this.pageSize = pageSize
        this.getRankData()
      },
      handleDateTypeChange (val, label) {
        switch (val) {
          case 'hour':
            this.rankMonitorPeriodLabel = '时间点'
            break
          case 'day':
            this.rankMonitorPeriodLabel = '日期'
            break
          default:
            break
        }
      },
      factorNameClass(row){
        return aqiColor.ztAirColorClass(row.factorName, row.value)
      },
      emitPickCb (item) {
        let obj = {};
        objectAssign(obj, item);
        this.$mapEvtBus.$emit(mapUtil.EVT_NAME.dialog_showDialog, obj)
      },
      emitClose () {
        this.$emit('close')
      },
    }
  }

</script>

