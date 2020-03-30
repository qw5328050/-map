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
              <industry-info-edit :itemData="dataInfo" v-if="selectNavDesc == 'qiyexinxi' && dataInfo.type == '1'" @sourceUpdateSuccess="closedDailog"></industry-info-edit>
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
  import industryInfoEdit from "./industryInfoEdit";
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
      industryInfoEdit,
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
      closedDailog() {
        this.visible = false
        this.$emit('refresh-data')
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
            var menuArray1,  menuArray2
            menuArray1 = result.result
            menuArray2 = menuArray1.slice(0, 1)
            menuArray2[0].children = menuArray2[0].children.slice(0, 1)
            this.menuList = menuArray2
            this.menuList[0].children[0].active = true
          })
          .catch(error => {
          });
      },
      handelNavChange(node) {
        console.log('node:', node)
        this.selectNavDesc = node.code
        this.selectNavCode = node.id
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

