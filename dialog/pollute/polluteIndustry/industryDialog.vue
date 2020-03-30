<template>
  <div style="width: 100%;height: 100%;position: fixed;left: 0;top: 0;z-index: 1000;" v-if="visible">
    <!-- 遮照层 -->
    <div class="modal"></div>
    <div class="popbox-detail-content popbox-wrapper _lc popbox-pollute-detail-wrapper popbox-drag"
         v-zt-dialog-drag="true" style="padding-top: 5vh;">
      <div class="popbox popbox-size-xxlg zt-drag-dialog">
        <!-- 头部 -->
        <header class="popbox-header zt-drag-dialog-header">
          <h3>{{dataInfo.name}}</h3>
          <a href="javascript:void(0);" class="iconfont" @click.stop.prevent="close">&#xe601;</a>
        </header>
        <!-- body -->
        <div class="popbox-body">
          <div class="popbox-body-inner">
            <div class="popbox-pollute-detail cf">
              <!-- 侧边栏目导航 -->
              <left-nav
                v-if="menuList && menuList.length > 0"
                ref="leftNav"
                @change="handelNavChange"
                :menuList="menuList"
                :selectNavDesc="selectNavDesc"
                :selectNavCode="selectNavCode"
              ></left-nav>
              <!-- 右侧内容区域-基本信息 -->
              <industry-info :itemData="dataInfo" v-if="selectNavDesc == 'qiyexinxi' && dataInfo.type == '1'"></industry-info>
              <!-- 右侧内容区域-基本信息-畜禽 -->
              <husbandry-info :itemData="dataInfo"
                              v-if="selectNavDesc=='qiyexinxi' && dataInfo.type == '2'"></husbandry-info>
              <!-- 右侧内容区域-基本信息-集中治污 -->
              <facility-info :itemData="dataInfo"
                             v-if="selectNavDesc=='qiyexinxi' && dataInfo.type == '3'"></facility-info>
              <!-- 右侧内容区域-基本信息-建筑工地 -->
              <construction-info :itemData="dataInfo"
                                 v-if="selectNavDesc=='qiyexinxi' && dataInfo.type == '4'"></construction-info>
              <!-- 右侧内容区域-基本信息-餐饮 -->
              <catering-info :itemData="dataInfo"
                             v-if="selectNavDesc=='qiyexinxi' && dataInfo.type == '5'"></catering-info>
              <!-- 右侧内容区域-要素工艺 -->
              <factor-tech :itemData="itemData" v-if="selectNavDesc =='shengchanyaosu'"></factor-tech>
              <!-- 右侧内容区域-制污设施 -->
              <facility :itemData="itemData" v-if="selectNavDesc =='zhiwusheshi'"></facility>
              <!-- 右侧内容区域-排污统计 -->
              <dust-statistics :itemData="dataInfo" v-if="selectNavDesc =='paiwutongji'"></dust-statistics>
              <!-- 右侧内容区域-排污许可 -->
              <discharge-base :itemData="itemData" v-if="selectNavDesc =='paiwuxuke'"></discharge-base>
              <!-- 右侧内容区域-在线监测 -->
              <online-monitoring :itemData="itemData" v-if="selectNavDesc =='zaixianjiance'"></online-monitoring>
              <!-- 右侧内容区域-电量监测 -->
              <power-monitoring :itemData="itemData" v-if="selectNavDesc =='dianliangjiance'"></power-monitoring>
              <!-- 右侧内容区域-手工监测 -->
              <manual-monitoring :itemData="itemData" v-if="selectNavDesc =='shougongjiance'"></manual-monitoring>
              <!-- 右侧内容区域-扬尘监测 -->
              <dust-monitoring :itemData="itemData" v-if="selectNavDesc =='yangchenjiance'"></dust-monitoring>
              <!-- 右侧内容区域-环保画像 -->
              <env-portrait :itemData="itemData" v-if="selectNavDesc =='huanbaohuaxiang'"></env-portrait>
              <!-- 右侧内容区域-耗能监控 -->
              <!--<energy-monitoring :itemData="itemData" v-if="selectNavDesc =='qiyexinxi'"></energy-monitoring>-->
              <!-- 右侧内容区域-环评审批 -->
              <!--<env-approval :itemData="itemData" v-if="selectNavDesc =='qiyexinxi'"></env-approval>-->
              <!-- 右侧内容区域-环评审批 -->
              <!--<law-enforce :itemData="itemData" v-if="selectNavDesc =='qiyexinxi'"></law-enforce>-->
              <!-- 右侧内容区域-环境影响评价 -->
              <approval-list :itemData="itemData" v-if="selectNavDesc =='huanjingyingxiangpingjia'"></approval-list>
              <!-- 右侧内容区域-建筑工地重污染天气应急 -->
              <construction-eg-weather :itemData="itemData" v-if="selectNavDesc =='zhongwurantianqiyingji' &&
             itemData.type === constants.polluteType.construction"></construction-eg-weather>
              <!-- 右侧内容区域-工业企业重污染天气应急 -->
              <industry-eg-weather :itemData="itemData" v-if="selectNavDesc =='zhongwurantianqiyingji' &&
             itemData.type === constants.polluteType.industry"></industry-eg-weather>
              <!-- 右侧内容区域-辐射许可 -->
              <radiation :itemData="itemData" v-if="selectNavDesc =='fushexuke'"></radiation>
              <!-- 右侧内容区域-行政处罚 -->
              <punish :itemData="itemData" v-if="selectNavDesc =='xingzhengchufa'"></punish>
              <!-- 右侧内容区域-环境统计 -->
              <env-statistics ref="env" v-if="selectNavDesc =='huanjingtongji'"></env-statistics>
              <!-- 右侧内容区域-污染源普查 -->
              <ep-survey :itemData="itemData" v-if="selectNavDesc =='wuranyuanpucha'"></ep-survey>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import mapPollutePublicHttp from "@/https/map/mapPollutePublicHttp";
  import sopDetailHttp from "@/https/monitor/sopDetailHttp";
  import {objectAssign} from "@/utils/util";
  import {getDictListByKey} from "@/components/_public/zt/dictionary/index";
  import industrySurvey from "./industrySurvey";
  import leftNav from "../pollutePublic/leftNav";
  import industryInfo from "./industryInfo";
  import dischargeBase from "../pollutePublic/dischargeBase";
  import epSurvey from "../pollutePublic/epSurvey";
  import facility from "../pollutePublic/facility";
  import factorTech from "../pollutePublic/factorTech";
  import envApproval from "../pollutePublic/envApproval";
  import lawEnforce from "../pollutePublic/lawEnforce";
  import punish from "../pollutePublic/punish";
  import envStatistics from "../pollutePublic/envStatistics";
  import dustStatistics from "../pollutePublic/dustStatistics";
  import onlineMonitoring from "../pollutePublic/onlineMonitoring";
  import powerMonitoring from "../pollutePublic/powerMonitoring";
  import manualMonitoring from "../pollutePublic/manualMonitoring";
  import energyMonitoring from "../pollutePublic/energyMonitoring";
  import approvalList from "../polluteEnv/approvalList";
  import constructionEgWeather from '../polluteEnv/constructionEgWeather.vue'
  import industryEgWeather from '../polluteEnv/industryEgWeather.vue'
  import radiation from "../polluteEnv/radiation";
  import husbandryInfo from '../polluteHusbandry/husbandryInfo'
  import facilityInfo from '../polluteFacility/facilityInfo'
  import constructionInfo from '../polluteConstruction/constructionInfo'
  import cateringInfo from '../polluteCatering/cateringInfo'
  import dustMonitoring from '../pollutePublic/dustMonitoring'
  import envPortrait from '../pollutePublic/envPortrait'

  export default {
    data() {
      return {
        visible: false,
        selectDailog: "survey",
        menuList: [],
        selectNavCode: '',
        selectNavDesc: '',
        dialogClientHeight: 0,
        dataInfo: {}
      };
    },
    components: {
      industrySurvey,
      leftNav,
      industryInfo,
      dischargeBase,
      epSurvey,
      facility,
      factorTech,
      envApproval,
      lawEnforce,
      envStatistics,
      punish,
      onlineMonitoring,
      powerMonitoring,
      manualMonitoring,
      energyMonitoring,
      approvalList,
      radiation,
      constructionEgWeather,
      industryEgWeather,
      husbandryInfo,
      facilityInfo,
      constructionInfo,
      cateringInfo,
      dustMonitoring,
      dustStatistics,
      envPortrait
    },
    created() {
    },
    mounted() {
      this.$nextTick(() => {
        this.getData()
        this.getScreenWidthAndHeight()
      });
      console.log('this.itemData111:', this.itemData)
    },
    methods: {
      // 浏览器宽高
      getScreenWidthAndHeight() {
        this.dialogClientHeight = document.body.clientHeight
      },
      getData() {
        let that = this
        console.log('this.itemData:', that.itemData)
        let params = {
          id: that.itemData.sopId
        }
        sopDetailHttp.getSourceInfo(params)
          .then(result => {
            console.log('this.dataInfo:', result)
            that.dataInfo = result.result
            if(that.dataInfo.type == '1') {
              that.selectNavCode = '6002'
            } else if (that.dataInfo.type == '2') {
              that.selectNavCode = '6202'
            } else if (that.dataInfo.type == '3') {
              that.selectNavCode = '6102'
            } else if (that.dataInfo.type == '4') {
              that.selectNavCode = '6302'
            } else if (that.dataInfo.type == '5') {
              that.selectNavCode = '6402'
            }
            that.selectNavDesc = 'qiyexinxi'
            that.getMenuTree()
          })
          .catch(error => {
          });
      },
      getMenuTree() {
        let params = {
          sopId: this.itemData.sopId
        }
        sopDetailHttp.getMenuTree(params)
          .then(result => {
            console.log('result.data:', result.result)
            this.menuList = result.result
            this.menuList[0].children[0].active = true
          })
          .catch(error => {
          });
      },
      handelNavChange(node) {
        if (node.code == "huanjingtongji") {
          // that.envYear = node.desc;
          this.selectNavDesc = node.code;
          // 环境统计日期
          // var dateList = []
          // node.childList.sort(this.compare('desc'))
          // node.childList.forEach(function(item){
          //   dateList.push(parseInt(item.desc))
          // })
          console.log('node.childList:', this.itemData.id)
          this.$nextTick(() => {
            this.$refs.env.init(this.itemData.id);
          });
        } else {
          console.log('node:', node)
          this.selectNavDesc = node.code
          this.selectNavCode = node.id
        }
      },
      compare(property) {
        return function (a, b) {
          var value1 = a[property]
          var value2 = b[property]
          return value2 - value1;
        }
      },
      show() {
        document.querySelector("body").appendChild(this.$mount().$el);
        this.visible = true;
      },
      close() {
        this.visible = false;
      }
    }
  };
</script>
<style scoped>
  .modal {
    width: 100%;
    height: 100%;
    background: #000;
    opacity: .5;
    z-index: 1000;
  }
</style>

