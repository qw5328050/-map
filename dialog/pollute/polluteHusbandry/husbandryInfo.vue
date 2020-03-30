<template>
  <div class="popbox-detail-content">
    <table class="table table-bordered light-gray-th table-baseInfo">
      <tbody>
      <tr>
        <th style="width: 12%;">污染源类别</th>
        <td style="width: 21%;">
          <zt-dictionary :itemCode="constants.sop_type" :code="itemData.type"></zt-dictionary>
        </td>
        <th style="width: 12%;">污染源编号</th>
        <td style="width: 20%;">{{itemData.code}}</td>
        <td style="width: 5%;padding: 0;" rowspan="2" class="pop-code-wrapper">
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
            <!--<template v-for="pollution in (itemData.pollutionType).split(',')">{{ pollution |-->
              <!--dictionaryConvert(constants.pollution_type) }}-->
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
        <!--         <td>{{itemData.lng}}</td> -->
        <template v-if="itemData.longitude && itemData.longitude != 'null'">
          <td>{{itemData.longitude}}</td>
        </template>
        <template v-else>
          <td></td>
        </template>

        <th>纬度</th>
        <!-- <td colspan="2">{{itemData.lat}}</td> -->
        <template v-if="itemData.latitude && itemData.latitude != 'null'">
          <td colspan="2">{{itemData.latitude}}</td>
        </template>
        <template v-else>
          <td colspan="2"></td>
        </template>
      </tr>
      <tr>
        <th>企业法人代表</th>
        <!-- <td>{{itemData.legalRepresentative}}</td> -->
        <template v-if="itemData.legalRepresentative && itemData.legalRepresentative != 'null'">
          <td>{{itemData.legalRepresentative}}</td>
        </template>
        <template v-else>
          <td></td>
        </template>
        <th>联系电话</th>
        <td colspan="2">{{itemData.mobilPhone}}</td>
      </tr>
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
        <th>统一社会信用代码</th>
        <td>{{itemData.socialCreditCode}}</td>
        <th>组织机构代码</th>
        <td colspan="2">{{itemData.organizationCode}}</td>
        <th style="width:8%">畜禽种类</th>
        <td style="width: 22%;">
          <zt-dictionary :itemCode="constants.sop_beasts_type" :code="itemData.customFarm.beastsType"></zt-dictionary>
        </td>
      </tr>
      <tr>
        <th>圈舍清粪方式</th>
        <!--<zt-dictionary :itemCode="constants.sop_beasts_type" :code="itemData.customFarm.nightsoilWay"></zt-dictionary>-->
        <td>{{itemData.customFarm.nightsoilWay}}</td>
        <th>圈舍通风方式</th>
        <td colspan="2">{{itemData.customFarm.ventilationPattern}}</td>
        <th>所在流域</th>
        <td>{{itemData.customFarm.basinName}}
        </td>
      </tr>
      <tr>
        <th>受纳水体</th>
        <td>
          <zt-dictionary :itemCode="constants.sop_water_area" :code="itemData.customFarm.receivingWater"></zt-dictionary>
        </td>
        <th>是否有排污口</th>
        <td colspan="2">{{itemData.customFarm.hasOutlet | yeaOrNoConvert}}</td>
        <th>排水去向</th>
        <td>{{itemData.customFarm.directionTypeName}}
        </td>
        <!--<td>-->
          <!--<zt-dictionary :itemCode="constants.sop_direction_type" :code="itemData.customFarm.directionType"></zt-dictionary>-->
        <!--</td>-->
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
      let pointList = [];
      pointList.push({
        name: this.itemData.name,
        type: this.itemData.type,
        typeStr: this.itemData.type.toString(),
        longitude: this.itemData.longitude,
        latitude: this.itemData.latitude,
      });
      this.mapPointList = pointList;
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
    },
  }
</script>
