<template>
  <div class="popbox-detail-content" v-if="visible">
    <table class="table table-bordered light-gray-th table-baseInfo">
      <tbody>
      <tr>
        <th style="width: 12%;">污染源类别</th>
        <td style="width: 21%;">
          <!--<zt-dictionary :itemCode="constants.sop_type" :code="itemData.type"></zt-dictionary>-->
          <zt-dict-select
            :itemCode="constants.sop_type"
            v-model="dataModel.type"
            @handleOptionClick="handleClick">
          </zt-dict-select>
        </td>
        <th style="width: 12%;">污染源编号</th>
        <td style="width: 20%;">{{itemData.code}}</td>
        <!--<td style="width: 5%;" rowspan="3" class="pop-code-wrapper">-->
          <!--&lt;!&ndash;<img :src="`http://www.jneep.net/gridres${itemData.qrCode}`" class="pop-code" alt="" style="width: 70px;height: 70px;">&ndash;&gt;-->
          <!--<template>-->
            <!--<qrCode :qrCodeSopId="itemData.id"></qrCode>-->
          <!--</template>-->
        <!--</td>-->
        <td style="width: 30%;padding: 0!important;" colspan="2" rowspan="7" class="td-map">
          <map-location :dataList="mapPointList" style="width:383px;height:410px;position: relative;"></map-location>
        </td>
      </tr>
      <tr>
        <th>行政区域</th>
        <td>
          <div class="form-inline">
            <div class="form-group">
              <zt-select v-model="dataModel.countyCode" style="" @change="handleChangeCounty">
                <zt-option v-for="(item,index) in countyList"
                           :key="item.code"
                           :value="item.code"
                           :label="item.name">
                </zt-option>
              </zt-select>
            </div>
            <div class="form-group" v-if="dataModel.countyCode !== ''">
              <zt-select style="" v-model="dataModel.streetCode" @change="handleChangeStreet">
                <zt-option v-for="item in streetList"
                           :key="item.code"
                           :label="item.fullName"
                           :value="item.code">
                </zt-option>
              </zt-select>
            </div>
          </div>
          <!--{{itemData.county}}{{itemData.street?'-'+itemData.street:''}}-->
        </td>
        <th>行业类别</th>
        <td>{{itemData.industryName}}
          <!--<zt-dictionary :itemCode="constants.industry_type" :code="itemData.industry"></zt-dictionary>-->
        </td>
      </tr>
      <tr>
        <th>企业名称</th>
        <td colspan="3">
          <zt-input v-model="dataModel.name"></zt-input>
        </td>
        <!--<th>污染物类型</th>-->
        <!--<th></th>-->
        <!--<td colspan="2">-->
        <!--&lt;!&ndash;<template v-if="itemData.pollutionType">&ndash;&gt;-->
        <!--&lt;!&ndash;<template v-for="pollution in (itemData.pollutionType).split(',')">{{ pollution |&ndash;&gt;-->
        <!--&lt;!&ndash;dictionaryConvert(constants.pollution_type) }}&ndash;&gt;-->
        <!--&lt;!&ndash;</template>&ndash;&gt;-->
        <!--&lt;!&ndash;</template>&ndash;&gt;-->
        <!--</td>-->
      </tr>
      <tr>
        <th>统一社会信用代码</th>
        <td>
          <zt-input v-model="dataModel.socialCreditCode"></zt-input>
        </td>
        <th>组织机构代码</th>
        <td colspan="1">
          <zt-input v-model="dataModel.organizationCode"></zt-input>
        </td>
      </tr>
      <tr>
        <th>注册地址</th>
        <td>
          <zt-input v-model="dataModel.address"></zt-input>
        </td>
        <th>生产经营场所地址</th>
        <td colspan="1">
          <zt-input v-model="dataModel.address"></zt-input>
        </td>
      </tr>
      <tr>
        <th>经度</th>
        <td>
          <zt-input v-model="dataModel.longitude"></zt-input>
        </td>
        <th>纬度</th>
        <td colspan="1">
          <zt-input v-model="dataModel.latitude"></zt-input>
        </td>
      </tr>
      <tr>
        <th>企业法人代表</th>
        <td>
          <zt-input v-model="dataModel.legalRepresentative"></zt-input>
        </td>
        <th>法人联系电话</th>
        <td colspan="1">
          <zt-input v-model="dataModel.mobilPhone"></zt-input>
        </td>
      </tr>
      <tr>
        <th>技术负责人</th>
        <td>
          <zt-input v-model="dataModel.techDirector"></zt-input>
        </td>
        <th>技术联系电话</th>
        <td colspan="1">
          <zt-input v-model="dataModel.techDirectorPhone"></zt-input>
        </td>
        <th>环保联系人</th>
        <td>
          <zt-input v-model="dataModel.envirDirector"></zt-input>
        </td>
      </tr>
      <tr>
        <th>企业联系人</th>
        <td>
          <zt-input v-model="dataModel.linkman"></zt-input>
        </td>
        <th>企业联系电话</th>
        <td colspan="1">
          <zt-input v-model="dataModel.linkmanMobile"></zt-input>
        </td>
        <th>环保联系电话</th>
        <td colspan="1">
          <zt-input v-model="dataModel.envirDirectorPhone"></zt-input>
        </td>
      </tr>
      <!--<tr>-->
        <!--<th>企业规模</th>-->
        <!--<td>-->
          <!--<zt-select style=""-->
                     <!--v-model="dataModel.scale"-->
                     <!--placeholder="请选择">-->
            <!--<zt-option v-for="item in esScaleList"-->
                       <!--:key="item.code"-->
                       <!--:label="item.name"-->
                       <!--:value="item.code">-->
            <!--</zt-option>-->
          <!--</zt-select>-->
        <!--</td>-->

      <!--</tr>-->
      <tr>
      <th>是否重点污染源</th>
        <td colspan="5">
          <zt-radio-group v-model="dataModel.isKeySewage">
            <zt-radio label="Y">是</zt-radio>
            <zt-radio label="N">否</zt-radio>
          </zt-radio-group>
        </td>
        <!--<th>登记注册类型</th>-->
        <!--<td colspan="1">-->
          <!--<zt-select style=""-->
                     <!--v-model="dataModel.registerType"-->
                     <!--placeholder="请选择">-->
            <!--<zt-option v-for="item in esRegisterTypeList"-->
                       <!--:key="item.code"-->
                       <!--:label="item.name"-->
                       <!--:value="item.code">-->
            <!--</zt-option>-->
          <!--</zt-select>-->
        <!--</td>-->

      </tr>
      <tr v-if="isSopSourceIndustry">
        <th>建厂时间</th>
        <td>
          <zt-date-picker
            v-model="dataModel.sopSourceIndustry.buildTime"
            style="width:120px;display: inline-block;vertical-align: middle;"
            :clearable="false"
            type="date"
            format="YYYY-MM-DD HH:mm:ss">
          </zt-date-picker>
        </td>
        <th>投产时间</th>
        <td colspan="1">
          <zt-date-picker
            v-model="dataModel.sopSourceIndustry.produceTime"
            style="width:120px;display: inline-block;vertical-align:middle;"
            :clearable="false"
            type="date"
            format="YYYY-MM-DD HH:mm:ss">
          </zt-date-picker>
        </td>
      </tr>
      <tr>
        <th>环保属性</th>
        <td colspan="5">
          <zt-dict-checkbox
            v-model="dataModel.envirProper"
            :dict-key="constants.envir_proper"
            code="detailCode"
            label="detailName">
          </zt-dict-checkbox>
        </td>
      </tr>
      <tr>
        <th>企业简介</th>
        <td colspan="5">
          <zt-input type="textarea"
                    style="height:80px;"
                    maxlength="1024"
                    v-model="dataModel.desc"></zt-input>
        </td>
      </tr>
      </tbody>
    </table>
    <div class="form-inline">
      <div class="form-group" style="padding:5px;float:right;">
        <button type="submit" class="btn btn-sm" @click="cancelIndustryInfo">取消</button>
        <button type="submit" class="btn btn-primary btn-sm" @click="saveIndustryInfo">保存</button>
      </div>
    </div>
  </div>
</template>

<script>
  import mapLocation from '../pollutePublic/mapLocation'
  import mapPollutePublicHttp from "@/https/map/mapPollutePublicHttp"
  import sopDetailHttp from "@/https/map/mapPollutePublicHttp"
  import qrCode from "@/components/_public/qrCode"
  import {getDictListByKey} from '@/components/_public/zt/dictionary/index'
  import publicHttp from '@/https/_public/publicHttp'
  import aSourceFileHttp from '@/https/pollute/aSourceFile/aSourceFileHttp'

  export default {
    components: {
      mapLocation,
      qrCode
    },
    props: {
      itemData: Object
    },
    data() {
      return {
        data: [],
        mapPointList: [],
        countyList: [],
        streetList: [],
        esScaleList: [],
        esRegisterTypeList: [],
        attachmentBus: '',
        attachmentOrg: '',
        attachmentEnt: '',
        filePath: window.SITE_CONFIG.proxyName,
        visible: false,
        downFlag: false,
        isSopSourceIndustry: false,
        model: {
          id: '',
          type: '',
          countyCode: '',
          county: '',
          streetCode: '',
          street: '',
          name: ''
        },
        dataModel: {
          id: "", //主键ID
          type: "", //污染源类别
          code: "", //污染源编号
          province: "", //省份
          provinceCode: "", //省份编码
          city: "", //城市
          cityCode: "", //城市编码
          county: "", //区县
          countyCode: "", //区县编码
          street: "", //街道
          streetCode: "", //街道编码
          village: "", //村居
          villageCode: "", //村居编码
          industry: "", //行业类别
          name: "", //企业名称
          pollutionType: "", //污染物类型
          socialCreditCode: "", //统一社会信用代码
          organizationCode: "", //组织机构代码
          address: "", //注册地址
          longitude: "", //经度
          latitude: "", //纬度
          legalRepresentative: "", //企业法人代表
          mobilPhone: "", //法人联系电话
          techDirector: "", //技术负责人
          techDirectorPhone: "", //技术联系电话
          linkman: "", //企业联系人
          linkmanMobile: "", //企业联系人联系方式
          envirDirector: "", //环保联系人
          envirDirectorPhone: "", //环保联系人电话
          scale: "", //企业规模
          registerType: "", //登记注册类型
          isKeySewage: "",  //是否重点污染源
          envirProper: "", //环保属性
          desc: "", //企业简介
          sopSourceIndustry: {    //工业企业
            opStatus: '',   //工业企业-运行状态
            manageAddress: '',  //工业企业-生产经营场所地
            buildTime: '',  //工业企业（集中治污企业）-建厂时间
            produceTime: '',  //工业企业-投产时间
            pointType: '' //工业企业-点源类型（工业industry/发电power）
          },
          // sopSourceFarm: {
          //   beastsType: '',   //畜禽养殖场-畜禽种类（数据字典es_beasts_type，多选）
          //   receivingWater: '',  //畜禽养殖场-受纳水体编号
          //   nightsoilWay: '',    //畜禽养殖场-清粪方式
          //   basin: '',   //所在流域编码
          //   directionType: '',    //排水去向类型编码
          //   hasOutlet: '',    //是否有排污口
          //   ventilationPattern: '', //通风方式
          //   receivingWaterName: '', //受纳水体名称
          //   basinName: '',  //所在流域名称
          //   directionTypeName: '' //排水去向类型名称
          // }
          recordId: '',
          sourceInfoId: ''
        },
      }
    },
    created() {
      this.esScaleList = getDictListByKey(
        this.constants.es_scale
      )
      this.esRegisterTypeList = getDictListByKey(
        this.constants.es_register_type
      )
    },
    mounted() {
      this.init()
      this.getAttachments4Sop();
      // this.model.id = this.itemData.id
      // this.model.type = this.itemData.type
      // this.model.name = this.itemData.name
      // this.model.county = this.itemData.county
      // this.model.street = this.itemData.street
      // this.model.countyCode = this.itemData.countyCode
      // this.model.streetCode = this.itemData.streetCode
      this.dataModel = Object.assign(this.dataModel, this.itemData)
      let pointList = [];
      pointList.push({
        name: this.itemData.name,
        type: this.itemData.type,
        typeStr: this.itemData.type.toString(),
        longitude: this.itemData.longitude,
        latitude: this.itemData.latitude,
      });
      this.mapPointList = pointList;
      this.visible = true
    },
    watch: {
      'dataModel.countyCode'(newVal, oldVal) {
        console.log('newVal:', newVal)
        if (newVal !== '') {
          this.getDivisionStreetList()
        }
      }
    },
    methods: {
      init() {
        let dataList = getDictListByKey(this.constants.industry_type)
        dataList.forEach(function (item) {
          item.checkedStatus = false
        })
        this.data = dataList
        this.getDivisionList()
      },
      // 获取区县
      getDivisionList() {
        let params = {
          level: 3
        }
        publicHttp.getDivisionList(params)
          .then(res => {
            console.log('getDivisionList:', res)
            this.countyList = [{code: '', name: '全部'}].concat(res.result)
          })
      },
      // 获取区县
      getDivisionStreetList() {
        let params = {
          parentCode: this.dataModel.countyCode
        }
        publicHttp.getDivisionChildrenList(params)
          .then(res => {
            console.log('getChildren:', res)
            this.streetList = [{code: '', fullName: '全部'}].concat(res.result)
          })
      },
      setPorpCheck(code) {
        let flag = false;
        if (this.itemData.envirProper) {
          let tempList = this.itemData.envirProper.split(",");
          for (let item of tempList) {
            if (item == code) {
              flag = true;
              break;
            }
          }
        }
        return flag;
      },
      handleChangeCounty(county, label) {
        this.dataModel.county = label
      },
      handleChangeStreet(county, label) {
        this.dataModel.street = label
      },
      handleClick(el) {
        this.isSopSourceIndustry = (el.value == '001' ? true : false)
      },
      saveIndustryInfo() {
        aSourceFileHttp.update(this.dataModel)
          .then(res => {
            this.visible = false
            this.$ztAlert('保存成功')
            // this.$refs.form.resetFields()
            this.$emit('sourceUpdateSuccess')
          })
      },
      cancelIndustryInfo() {
        this.visible = false
        this.$emit('sourceUpdateSuccess')
      },
      openDown() {
        this.downFlag = true
      },
      getAttachments4Sop() {
        let params = {
          id: this.itemData.id
        }
        sopDetailHttp.getSourceInfo(params).then((result) => {
          if (result.data && result.data.length > 0) {
            for (let item of result.data) {
              console.log(item.fileUrl);
              if (item && item.cat === 'A001') {
                this.attachmentBus = item.fileUrl;
              }
              if (item && item.cat === 'A002') {
                this.attachmentOrg = item.fileUrl;
              }
              if (item && item.cat === 'A003') {
                this.attachmentEnt = item.fileUrl;
              }
            }
          }
        }).catch((error) => {

        })
      },
    },
  }
</script>
<style>
  #industry .group-posi {
    position: relative;
  }

  #industry .dataDown {
    position: absolute;
    top: 42px;
    width: 180px;
    background: #fff;
    border: 1px solid #dcdfe6;
    border-radius: 3px;
    z-index: 9999;
    max-height: 400px;
    overflow-y: auto;
  }

  #industry .dataDown:after {
    content: "";
    position: absolute;
    display: block;
    width: 8px;
    height: 8px;
    background: #fff;
    border-right: 1px solid #ddd;
    border-top: 1px solid #ddd;
    top: -5px;
    left: 20px;
    -webkit-transform: rotate(-45deg);
    transform: rotate(-45deg);
    margin-left: -4px;
  }
</style>
