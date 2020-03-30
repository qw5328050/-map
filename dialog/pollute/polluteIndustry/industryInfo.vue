<template>
  <div class="popbox-detail-content" v-if="visible">
    <table class="table table-bordered light-gray-th table-baseInfo">
      <tbody>
      <tr>
        <th style="width: 12%;">污染源类别</th>
        <td style="width: 21%;">
          <zt-dictionary :itemCode="constants.sop_type" :code="itemData.type"></zt-dictionary>
        </td>
        <th style="width: 12%;">污染源编号</th>
        <td style="width: 20%;">{{itemData.code}}</td>
        <td style="width: 5%;" rowspan="3" class="pop-code-wrapper">
          <!--<img :src="`http://www.jneep.net/gridres${itemData.qrCode}`" class="pop-code" alt="" style="width: 70px;height: 70px;">-->
          <template>
            <qrCode :qrCodeSopId="itemData.id"></qrCode>
          </template>
        </td>
        <td style="width: 30%;padding: 0!important;" colspan="2" rowspan="9" class="td-map">
          <map-location :dataList="mapPointList" style="width:383px;height:410px;position: relative;"></map-location>
        </td>
      </tr>
      <tr>
        <th>行政区域</th>
        <td>{{itemData.county}}{{itemData.street?'-'+itemData.street:''}}</td>
        <th>行业类别</th>
        <td>{{itemData.industryName}}
          <!--<zt-dictionary :itemCode="constants.industry_type" :code="itemData.industry"></zt-dictionary>-->
        </td>
      </tr>
      <tr>
        <th>企业名称</th>
        <td colspan="3">{{itemData.name}}</td>
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
        <td>{{itemData.socialCreditCode}}</td>
        <th>组织机构代码</th>
        <td colspan="2">{{itemData.organizationCode}}</td>
      </tr>
      <tr>
        <th>注册地址</th>
        <td>{{itemData.address}}</td>
        <th>生产经营场所地址</th>
        <td colspan="2">{{itemData.customIndustry.manageAddress}}</td>
      </tr>
      <tr>
        <th>经度</th>
        <td>{{itemData.longitude}}</td>
        <th>纬度</th>
        <td colspan="2">{{itemData.latitude}}</td>
      </tr>
      <tr>
        <th>企业法人代表</th>
        <td>{{itemData.legalRepresentative}}</td>
        <th>法人联系电话</th>
        <td colspan="2">{{itemData.mobilPhone}}</td>
      </tr>
      <!--<tr>-->
        <!--<th>技术负责人</th>-->
        <!--<td>{{itemData.director}}</td>-->
        <!--<th>技术联系电话</th>-->
        <!--<td colspan="2">{{itemData.directorPhone}}</td>-->
      <!--</tr>-->
      <tr>
        <th>企业联系人</th>
        <td>{{itemData.linkman}}</td>
        <th>企业联系人联系方式</th>
        <td colspan="2">{{itemData.linkmanMobile}}</td>
      </tr>
      <!--<tr>-->
      <!--<th>环保联系人</th>-->
      <!--<td>{{itemData.envirDirector}}</td>-->
      <!--<th>环保联系电话</th>-->
      <!--<td colspan="2">{{itemData.envirDirectorPhone}}</td>-->
      <!--</tr>-->
      <tr>
        <th>建厂时间</th>
        <td>{{itemData.customIndustry.buildTime}}</td>
        <th>投产时间</th>
        <td colspan="2">{{itemData.customIndustry.produceTime}}</td>
      </tr>
      <!--<tr>-->
      <!--<th>企业环保属性</th>-->
      <!--<td colspan="5" class="sub-table">-->
      <!--<table>-->
      <!--<tr>-->
      <!--<th v-for="item in itemData.envirProperDict">{{item.name}}</th>-->
      <!--<th v-if="itemData.environmentalCredit"></th>-->
      <!--</tr>-->
      <!--<tr>-->
      <!--<td v-for="item in itemData.envirProperDict">-->
      <!--<label class="checkbox mr_10">-->
      <!--<span class="checkbox__input" :class="{'is-checked': item.flag == 1 }">-->
      <!--<span class="checkbox__inner"></span>-->
      <!--<input type="checkbox" class="checkbox__original">-->
      <!--</span>-->
      <!--</label>-->
      <!--</td>-->
      <!--<td v-if="itemData.environmentalCredit">{{itemData.environmentalCredit ? itemData.environmentalCredit+'分':''}}</td>-->
      <!--</tr>-->
      <!--</table>-->
      <!--</td>-->
      <!--</tr>-->
      <tr>
        <th>企业简介</th>
        <td colspan="5">{{itemData.remarkStr}}</td>
      </tr>
      <tr>
        <th>营业执照</th>
        <template v-if="attachmentBus">
          <td><a :href="filePath + attachmentBus" target="_blank" class="link">点击查看</a></td>
        </template>
        <template v-else>
          <td></td>
        </template>
        <th>组织机构代码证</th>
        <template v-if="attachmentOrg">
          <td colspan="2"><a :href="filePath + attachmentOrg" target="_blank" class="link">点击查看</a></td>
        </template>
        <template v-else>
          <td colspan="2"></td>
        </template>
        <!--<td></td>-->
        <template v-if="attachmentEnt">
          <td><a :href="filePath + attachmentEnt" target="_blank" class="link"></a></td>
        </template>
        <template v-else>
          <td></td>
        </template>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  import mapLocation from '../pollutePublic/mapLocation'
  import mapPollutePublicHttp from "@/https/map/mapPollutePublicHttp"
  import sopDetailHttp from "@/https/map/mapPollutePublicHttp"
  import qrCode from "@/components/_public/qrCode"

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
        mapPointList: [],
        attachmentBus: '',
        attachmentOrg: '',
        attachmentEnt: '',
        filePath: window.SITE_CONFIG.proxyName,
        visible: false
      }
    },
    created() {
    },
    mounted() {
      // this.getAttachments4Sop();
      let pointList =  [];
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
    methods: {
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
      getAttachments4Sop() {
        let params = {
          id: this.itemData.sopId
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
