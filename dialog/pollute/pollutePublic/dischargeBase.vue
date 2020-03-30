<template>
  <div class="popbox-detail-content">
    <!-- 选择许可让编号 -->
    <div class="licence">
      <div class="form-flex">
        <div class="form-item-content">
          <div class="form-control select-mock">
            <div class="selected-item" @click="showLicenseNoPanel=!showLicenseNoPanel">{{defaultPermit.licenseNo}}
              <time>({{defaultPermit.lastTime}})
              </time>
            </div>
            <div class="select-list has-icon" v-show="showLicenseNoPanel">
              <ul>
                <li v-for="item in permitList">
                  <a href="javascript:void(0);" :class="{'cur':item.id == defaultPermit.id}" @click="chooseLicenseNo(item)">{{item.licenseNo}}
                    <time>({{item.lastTime}})
                    </time>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- tab页 -->
    <!-- 子tabs -->
    <!--<div class="tab-boder no-bg flex-start has-border sub-tab">-->
      <sub-tab ref="subTab" :tabList="dischargeBaseList" itemName="name" itemValue="code"  @tabClick="childrenTabChange" :showBtnTwo="true" style="margin-bottom: 15px;"></sub-tab>
      <!--<div class="tab-item" :class="{'cur':showModel=='base'}" @click="showModel='base'">基本情况表</div>-->
      <!--<div class="tab-item" :class="{'cur':showModel=='product'}" @click="showModel='product'">主要产品及产能</div>-->
      <!--<div class="tab-item" :class="{'cur':showModel=='material'}" @click="showModel='material'">主要原辅材料及燃料</div>-->
      <!--<div class="tab-item" :class="{'cur':showModel=='nodus'}" @click="showModel='nodus'">排污节点及污染治理设施</div>-->
      <!--<div class="tab-item" :class="{'cur':showModel=='gas'}" @click="showModel='gas'">大气排放口</div>-->
      <!--<div class="tab-item" :class="{'cur':showModel=='gasInfo'}" @click="showModel='gasInfo'">大气排放信息</div>-->
      <!--<div class="tab-item" :class="{'cur':showModel=='water'}" @click="showModel='water'">水排放口</div>-->
      <!--<div class="tab-item" :class="{'cur':showModel=='waterInfo'}" @click="showModel='waterInfo'">水排放信息</div>-->
      <!--<div class="tab-item" :class="{'cur':showModel=='other'}" @click="showModel='other'">其他污染物排放信息</div>-->
      <!--<div class="tab-item" :class="{'cur':showModel=='control'}" @click="showModel='control'">环境管理要求</div>-->
    <!--</div>-->
    <!-- 基本情况表 -->
    <div class="sub-tab-content" v-if="showModel=='base'">
      <section class="table-list mb_15">
        <table class="table small-padding table-complex table-bordered light-blue-th">
          <tbody>
          <tr>
            <th style="width: 23%">许可证编号</th>
            <td style="width: 27%">{{dataInfo.licenseNo}}</td>
            <th style="width: 23%">许可证管理类别</th>
            <td style="width: 27%">{{dataInfo.manageType}}</td>
          </tr>
          <tr>
            <th>有效期限</th>
            <td>自 {{dataInfo.lastTime}} 止
            </td>
            <th rowspan="4">许可证二维码</th>
            <td rowspan="4"><img :src="`http://www.jneep.net/gridres${dataInfo.qrCode}`" alt="" style="width: 115px;height: 115px;"></td>
          </tr>
          <tr>
            <th>发证机关</th>
            <td>{{dataInfo.issueUnit}}</td>
          </tr>
          <tr>
            <th>发证日期</th>
            <td>{{dataInfo.issueTime}}</td>
          </tr>
          <tr>
            <th>是否需整改</th>
            <td>{{dataInfo.needAbarbeitung}}</td>
          </tr>
          <tr>
            <th>技术负责人</th>
            <td>{{dataInfo.techDirector}}</td>
            <th>联系电话</th>
            <td>{{dataInfo.techDirectorPhone}}</td>
          </tr>
          <tr>
            <th>所在地区是否属于大气污染重点控制区</th>
            <td>{{dataInfo.airPollutionKey}}</td>
            <th>所在地区是否属于总磷总氮控制区</th>
            <td>{{dataInfo.phosphNitroKey}}</td>
          </tr>
          <tr>
            <th>是否工业园区</th>
            <td>{{dataInfo.isIndustryPark}}</td>
            <th>所属工业园区名称</th>
            <td>{{dataInfo.industryParkName}}</td>
          </tr>
          <tr>
            <th>主要污染物类别</th>
            <td colspan="3">{{dataInfo.primaryPolluType}}</td>
            <!--<th>&nbsp;</th>
            <td>&nbsp;</td>-->
          </tr>
          <tr>
            <th>大气主要污染物种类</th>
            <td>{{dataInfo.primaryPolluTypeAir}}</td>
            <th>废水主要污染物种类</th>
            <td>{{dataInfo.primaryPolluTypeWater}}</td>
          </tr>
          <tr>
            <th>大气污染物排放形式</th>
            <td>{{dataInfo.primaryPolluFormAir}}</td>
            <th>废水污染物排放规律</th>
            <td>{{dataInfo.primaryPolluFormWater}}</td>
          </tr>
          <tr>
            <th>大气污染物排放执行标准名称</th>
            <td>{{dataInfo.primaryPolluNormAir}}</td>
            <th>水污染物排放执行标准名称</th>
            <td>{{dataInfo.primaryPolluNormWater}}</td>
          </tr>
          </tbody>
        </table>
      </section>
    </div>
    <!-- 大气排放口 -->
    <discharge-gas v-if="showModel=='gas'" :permitId="defaultPermit.id" ref="gas"></discharge-gas>
    <!-- 主要产品及产能 -->
    <discharge-main-product v-if="showModel=='product'" :permitId="defaultPermit.id" ref="product"></discharge-main-product>
    <!-- 主要原辅材料及燃料 -->
    <discharge-material v-if="showModel=='material'" :permitId="defaultPermit.id" ref="material"></discharge-material>
    <!-- 排污节点及污染治理设施 -->
    <discharge-nodus v-if="showModel=='nodus'" :permitId="defaultPermit.id" ref="nodus"></discharge-nodus>
    <!-- 大气排放信息 -->
    <discharge-gas-info v-if="showModel=='gasInfo'" :permitId="defaultPermit.id" ref="gasInfo"></discharge-gas-info>
    <!-- 水排放口 -->
    <discharge-water v-if="showModel=='water'" :permitId="defaultPermit.id" ref="water"></discharge-water>
    <!-- 水排放口信息 -->
    <discharge-water-info v-if="showModel=='waterInfo'" :permitId="defaultPermit.id" ref="waterInfo"></discharge-water-info>
    <!-- 其他污染物排放信息 -->
    <discharge-other v-if="showModel=='other'" :permitId="defaultPermit.id" ref="other"></discharge-other>
    <!-- 环境管理要求 -->
    <discharge-control v-if="showModel=='control'" :permitId="defaultPermit.id" ref="control"></discharge-control>
  </div>
</template>
<script>
  import mapPollutePublicHttp from '@/https/map/mapPollutePublicHttp'
  import {objectAssign} from '@/utils/util'
  import dischargeGas from './discharge/dischargeGas'
  import dischargeGasInfo from './discharge/dischargeGasInfo'
  import dischargeWater from './discharge/dischargeWater'
  import dischargeWaterInfo from './discharge/dischargeWaterInfo'
  import dischargeOther from './discharge/dischargeOther'
  import dischargeControl from './discharge/dischargeControl'
  import dischargeMainProduct from './discharge/dischargeMainProduct'
  import dischargeMaterial from './discharge/dischargeMaterial'
  import dischargeNodus from './discharge/dischargeNodus'
  import subTab from '@/map/dialog/pollute/pollutePublic/subTab'
  export default {
    components: {
      dischargeGas,
      dischargeGasInfo,
      dischargeWater,
      dischargeWaterInfo,
      dischargeOther,
      dischargeControl,
      dischargeMainProduct,
      dischargeMaterial,
      dischargeNodus,
      subTab
    },
    data() {
      return {
        showModel: 'base',
        dataList: [],
        dataInfo: {
          id: '',
          licenseNo: '',
          manageType: '',
          issueTime: '',
          lastTime: '',
          issueUnit: '',
          needAbarbeitung: '',
          techDirector: '',
          techDirectorPhone: '',
          airPollutionKey: '',
          phosphNitroKey: '',
          isIndustryPark: '',
          industryParkName: '',
          primaryPolluType: '',
          primaryPolluTypeAir: '',
          primaryPolluTypeWater: '',
          primaryPolluFormAir: '',
          primaryPolluFormWater: '',
          primaryPolluNormAir: '',
          primaryPolluNormWater: '',
        },
        showLicenseNoPanel: false,
        permitList: [],
        defaultPermit: {
          id: ''
        },
        dischargeBaseList: [
          {name: '基本情况表', code: 'base'},
          {name: '主要产品及产能', code: 'product'},
          {name: '主要原辅材料及燃料', code: 'material'},
          {name: '排污节点及污染治理设施', code: 'nodus'},
          {name: '大气排放口', code: 'gas'},
          {name: '大气排放信息', code: 'gasInfo'},
          {name: '水排放口', code: 'water'},
          {name: '水排放信息', code: 'waterInfo'},
          {name: '其他污染物排放信息', code: 'other'},
          {name: '环境管理要求', code: 'control'}
        ]
      }
    },
    props: {
      itemData: Object
    },

    created() {
      this.getSopPmPermitList()
    },
    mounted() {

    },
    methods: {
      getSopPmPermitList(){
        let params = {
          sopId: this.itemData.id
        }
        mapPollutePublicHttp.getSopPmPermitList(params).then((result) => {
          if (result.result) {
            this.permitList = result.result
            if (result.result.length > 0) {
              this.defaultPermit = result.result[0]
              objectAssign(this.dataInfo, this.defaultPermit)
            }
            this.getDataInfo(this.defaultPermit.id || '')
          }
        }).catch((error) => {
        })
      },
      getDataInfo(permitId){
        mapPollutePublicHttp.getPermitInfo2(permitId).then((result) => {
          if (result.data) {
            objectAssign(this.dataInfo, result.data)
            // this.dataInfo = result.data
          }

        }).catch((error) => {

        })
      },
      childrenTabChange(item){
        this.showModel = item.code
      },
      chooseLicenseNo(val){
        this.showLicenseNoPanel = false;
        this.defaultPermit = val
        if (this.showModel !== 'base') {
          this.$refs[this.showModel].changeInit(val.id)
        }
        this.getDataInfo(val.id)
      }
    },
    computed: {}
  }
</script>
<style>
  .popbox-detail-content .popbox-detail-content .pop-code-sm {
    width: 100%;
  }
</style>
