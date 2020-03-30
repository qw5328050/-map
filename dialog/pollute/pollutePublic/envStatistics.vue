<template>
  <div class="popbox-detail-content">
    <div class="form-group">
      <zt-select style="width: 120px" v-model="year">
        <zt-option v-for="item in yearsList"
                   :key="item"
                   :label="item"
                   :value="item">
        </zt-option>
      </zt-select>
    </div>
    <!-- tab页 -->
    <sub-tab :tabList="dataList" itemName="name" itemValue="code"  @tabClick="handleTabClick" style="margin-bottom:15px;"></sub-tab>
    <!-- 基101表 -->
    <env-statistics-one v-if="showModel=='archives10100'" :esSopObj="esSopObj['archives10100']" :evnTitle="dataList"></env-statistics-one>
    <!-- 基101表续表(一) -->
    <env-statistics-two v-if="showModel=='archives10101'" :esSopObj="esSopObj['archives10101']"></env-statistics-two>
    <env-statistics-two-water v-if="showModel=='archives10105'" :esSopObj="esSopObj['archives10105']"></env-statistics-two-water>
    <!-- 基101表续表(二) -->
    <env-statistics-three v-if="showModel=='archives10102'"
                          :esSopObj="esSopObj['archives10102']"></env-statistics-three>
    <!-- 基101表续表(三) -->
    <env-statistics-four v-if="showModel=='archives10103'" :esSopObj="esSopObj['archives10103']"></env-statistics-four>
    <!-- 基101表续表(四) -->
    <env-statistics-five v-if="showModel=='archives10104'" :esSopObj="esSopObj['archives10104']"></env-statistics-five>
    <!-- 基102表 -->
    <env-statistics-six v-if="showModel=='archives10200'" :evnTitle="dataList" :esSopObj="esSopObj['archives10200']"></env-statistics-six>
    <!-- 基103表 -->
    <env-statistics-seven v-if="showModel=='archives10300'" :evnTitle="dataList"
                          :esSopObj="esSopObj['archives10300']"></env-statistics-seven>
    <!-- 基104表 -->
    <env-statistics-eight v-if="showModel=='archives10400'" :evnTitle="dataList"
                          :esSopObj="esSopObj['archives10400']"></env-statistics-eight>
    <!-- 基105表 -->
    <env-statistics-nine v-if="showModel=='archives10500'"  :evnTitle="dataList" :esSopObj="esSopObj['archives10500']"></env-statistics-nine>
    <!-- 基106表 -->
    <env-statistics-ten v-if="showModel=='archives10600'"  :evnTitle="dataList" :esSopObj="esSopObj['archives10600']"></env-statistics-ten>
    <!-- 基201表 -->
    <env-statistics-eleven v-if="showModel=='archives20100'" :evnTitle="dataList"
                           :esSopObj="esSopObj['archives20100']"></env-statistics-eleven>
    <!-- 基501表 -->
    <env-statistics-twelve v-if="showModel=='archives50100'" :evnTitle="dataList"
                           :esSopObj="esSopObj['archives50100']"></env-statistics-twelve>
    <!-- 基501表续表(一) -->
    <env-statistics-thirteen v-if="showModel=='archives50101'"
                             :esSopObj="esSopObj['archives50101']"></env-statistics-thirteen>
    <!-- 基502表 -->
    <env-statistics-fourteen v-if="showModel=='archives50200'" :evnTitle="dataList"
                             :esSopObj="esSopObj['archives50200']"></env-statistics-fourteen>
    <!-- 基502表续表（一) -->
    <env-statistics-fifteen v-if="showModel=='archives50201'"
                             :esSopObj="esSopObj['archives50201']"></env-statistics-fifteen>
    <!-- 基503表 -->
    <env-statistics-sixteen v-if="showModel=='archives50300'" :evnTitle="dataList"
                            :esSopObj="esSopObj['archives50300']"></env-statistics-sixteen>
    <!-- 基503表续表(一) -->
    <env-statistics-seventeen v-if="showModel=='archives50301'"
                              :esSopObj="esSopObj['archives50301']"></env-statistics-seventeen>
    <!-- 基503表续表(二) -->
    <env-statistics-eighteen v-if="showModel=='archives50302'"
                             :esSopObj="esSopObj['archives50302']"></env-statistics-eighteen>
    <div v-if="showModel == ''" class="isEmptyTips">暂无信息</div>
  </div>
</template>
<script>
  import mapPolluteEpHttp from '@/https/map/mapPolluteEpStatisticsHttp'
  import polluteAsourceFileHttp from '@/https/pollute/polluteAsourceFileHttp'
  import envStatisticsOne from './envStatistics/envStatisticsOne'
  import envStatisticsTwo from './envStatistics/envStatisticsTwo'
  import envStatisticsTwoWater from './envStatistics/envStatisticsTwoWater'
  import envStatisticsThree from './envStatistics/envStatisticsThree'
  import envStatisticsFour from './envStatistics/envStatisticsFour'
  import envStatisticsFive from './envStatistics/envStatisticsFive'
  import envStatisticsSix from './envStatistics/envStatisticsSix'
  import envStatisticsSeven from './envStatistics/envStatisticsSeven'
  import envStatisticsEight from './envStatistics/envStatisticsEight'
  import envStatisticsNine from './envStatistics/envStatisticsNine'
  import envStatisticsTen from './envStatistics/envStatisticsTen'
  import envStatisticsEleven from './envStatistics/envStatisticsEleven'
  import envStatisticsTwelve from './envStatistics/envStatisticsTwelve'
  import envStatisticsThirteen from './envStatistics/envStatisticsThirteen'
  import envStatisticsFourteen from './envStatistics/envStatisticsFourteen'
  import envStatisticsFifteen from './envStatistics/envStatisticsFifteen'
  import envStatisticsSixteen from './envStatistics/envStatisticsSixteen'
  import envStatisticsSeventeen from './envStatistics/envStatisticsSeventeen'
  import envStatisticsEighteen from './envStatistics/envStatisticsEighteen'
  import {objectAssign} from '@/utils/util'
  import subTab from './subTab'
  export default {
    components: {
      subTab,
      envStatisticsOne,
      envStatisticsTwo,
      envStatisticsTwoWater,
      envStatisticsThree,
      envStatisticsFour,
      envStatisticsFive,
      envStatisticsSix,
      envStatisticsSeven,
      envStatisticsEight,
      envStatisticsNine,
      envStatisticsTen,
      envStatisticsEleven,
      envStatisticsTwelve,
      envStatisticsThirteen,
      envStatisticsFourteen,
      envStatisticsFifteen,
      envStatisticsSixteen,
      envStatisticsSeventeen,
      envStatisticsEighteen
    },
    props: {},
    data() {
      return {
        dataList: [],
        yearsList: [],
        year: '',
        sopId: '',
        esSopObj: {
          archives10100: {},
          archives10101: {},
          archives10102: {},
          archives10103: {},
          archives10104: {},
          archives10200: {},
          archives10300: {},
          archives10400: {},
          archives10500: {},
          archives10600: {},
          archives20100: {},
          archives50100: {},
          archives50101: {},
          archives50200: {},
          archives50201: {},
          archives50300: {},
          archives50301: {},
          archives50302: {}
        },
        showModel: ''
      }
    },
    created() {
    },
    mounted() {
    },

    methods: {
      init(id){
        console.log(id)
        this.sopId = id
        this.getEsYears()
        this.getArchiveList()
      },
      getEsYears () {
        let params = {
          sopId: this.sopId
        }
        polluteAsourceFileHttp.getEsYears(params).then((result) => {
          var yearList = []
          result.result.forEach(function(item) {
            yearList.push(item.year)
          })
          this.yearsList = yearList
          this.year = yearList[0]
        }).catch((error) => {
          console.error(error)
        })
      },
      getArchiveList(){
        let params = {};
        params['sopId'] = this.sopId;
        params['year'] = this.year;
        console.log(params);
        mapPolluteEpHttp.queryArchiveList(params).then((result) => {
          this.dataList = result.result;
          console.log('this.dataList:', this.dataList)
          if (this.dataList && this.dataList.length > 0) {
            this.setEsopObj();
          }
        }).catch((error) => {

        })
      },
      setEsopObj(){
        for (let item of this.dataList) {
          this.esSopObj[item.code] = {
            archivesCode: item.code,
            year: this.year,
            esSopId: item.esSopId
          };
        }
      },
      handleTabClick(item){
        this.showModel = item.code;
      }
    },
    watch: {
      year(newV, value){
        this.showModel = ''
        this.getArchiveList(this.sopId, this.year)
      }
    }
  }
</script>
<style scoped>
  .isEmptyTips{
    width: 100%;
    text-align: center;
    color: #aaa;
    font-size: 14px;
    padding-top: 20px;

  }
</style>
