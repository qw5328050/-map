<template>
  <div class="popbox-detail-content">
    <table class="table table-bordered light-gray-th table-baseInfo">
      <tbody>
      <tr>
        <th style="width: 12%;">污染源类别</th>
        <td>
          <zt-dictionary :itemCode="constants.sop_type" :code="itemData.type"></zt-dictionary>
        </td>
        <th style="width: 12%;">污染源编号</th>
        <td style="width: 20%;">{{itemData.code}}</td>
        <td style="width: 5%;" rowspan="2" class="pop-code-wrapper">
          <!--<img src="/static/images/temporary/code.jpg" class="pop-code" alt="">-->
          <template>
            <qrCode :qrCodeSopId="itemData.id"></qrCode>
          </template>
        </td>
        <td style="width: 30%;height:310px;" colspan="2" rowspan="6" class="td-map">
          <map-location :dataList="mapPointList" style="width:383px;height:310px;position: relative;"></map-location>
        </td>
      </tr>
      <tr>
        <th>污染源名称</th>
        <td>{{itemData.name}}</td>
        <th>行政区域</th>
        <td>{{itemData.county}}{{itemData.street?'-'+itemData.street:''}}</td>
        <!--<th>污染物类型</th>-->
        <!--<td colspan="2">-->
        <!--<template v-if="itemData.pollutionType">-->
        <!--<template v-for="(item,index) in (itemData.pollutionType).split(',')">-->
        <!--<template v-if="index == (itemData.pollutionType).split(',').length - 1">-->
        <!--{{ item | dictionaryConvert(constants.pollution_type) }}-->
        <!--</template>-->
        <!--<template v-else>-->
        <!--{{ item | dictionaryConvert(constants.pollution_type) }}，-->
        <!--</template>-->
        <!--</template>-->
        <!--</template>-->
        <!--</td>-->
      </tr>
      <tr>
        <th>地址</th>
        <td colspan="4">{{itemData.address}}</td>
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
        <th>联系电话</th>
        <td colspan="2">{{itemData.mobilPhone}}</td>
      </tr>
      <tr>
        <th>企业联系人</th>
        <td>{{itemData.envMechanismPerson}}</td>
        <th>企业联系人联系方式</th>
        <td colspan="2">{{itemData.envMechanismTel}}</td>
      </tr>
      <!--<tr>-->
      <!--<th>环保联系人</th>-->
      <!--<td>{{itemData.envirDirector}}</td>-->
      <!--<th>环保联系电话</th>-->
      <!--<td colspan="2">{{itemData.envirDirectorPhone}}</td>-->
      <!--</tr>-->
      <tr>
        <th>统一社会信用代码</th>
        <td>{{itemData.socialCreditCode}}</td>
        <th>组织机构代码</th>
        <td colspan="2">{{itemData.organizationCode}}</td>
        <th style="width:8%">开业日期</th>
        <td style="width: 22%;">{{itemData.customDining.businessTime}}</td>
      </tr>
      <tr>
        <th>炉头数量</th>
        <td>{{itemData.customDining.burnerNumber}}</td>
        <th>油烟监测设备</th>
        <td colspan="2">{{itemData.customDining.checkDevice | yeaOrNoConvert}}</td>
        <th>油烟治理设备</th>
        <td>{{itemData.customDining.manageDevice | yeaOrNoConvert}}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  import mapLocation from '../pollutePublic/mapLocation'
  import qrCode from '@/components/_public/qrCode'

  export default {
    components: {
      mapLocation,
      qrCode
    },
    props: {
      itemData: Object
    },
    data(){
      return {
        mapPointList: []
      }
    },
    created() {

    },
    mounted() {
      let pointList =  [];
      pointList.push({
        name: this.itemData.name,
        type: this.itemData.type,
        typeStr: this.itemData.type.toString(),
        longitude: this.itemData.longitude,
        latitude: this.itemData.latitude,
      });
      this.mapPointList = pointList;
    },
    methods: {},
  }
</script>
