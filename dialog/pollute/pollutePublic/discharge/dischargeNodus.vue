<template>
  <div class="sub-tab-content">
    <div class="table-list-wrapper">
      <section class="table-list mb_15">
        <h3 class="form-item-name">废气排放节点和治理设施</h3>
        <table class="table small-padding table-complex table-bordered light-blue-th table-flex">
          <thead>
          <tr>
            <th rowspan="2">生产工艺</th>
            <th rowspan="2">生产设施编码</th>
            <th rowspan="2">生产设施名称</th>
            <th rowspan="2">对应产污环节名称</th>
            <th rowspan="2">污染物种类</th>
            <th rowspan="2">排放形式</th>
            <th colspan="6" class="al_center">污染治理设施</th>
            <th rowspan="2">有组织排放编码</th>
            <th rowspan="2">有组织排放名称</th>
            <th rowspan="2">排放口设置是否符合要求</th>
            <th rowspan="2">排放口类型</th>
            <th rowspan="2">其他信息</th>
          </tr>
          <tr>
            <th>污染治理设施编号</th>
            <th>污染治理设施名称</th>
            <th>污染治理设施工艺</th>
            <th>是否为可行技术</th>
            <th>是否涉及商业秘密</th>
            <th>污染治理设施其他信息</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in airList">
            <td>{{item.productCraft}}</td>
            <td>{{item.productFacilityCode}}</td>
            <td>{{item.productFacilityName}}</td>
            <td>{{item.linkName}}</td>
            <td>{{item.pollutionType}}</td>
            <td>{{item.formType}}</td>
            <td>{{item.curbFacilityCode}}</td>
            <td>{{item.curbFacilityName}}</td>
            <td>{{item.curbFacilityCraft}}</td>
            <td>{{item.curbFacilityAble}}</td>
            <td>{{item.curbFacilitySecret}}</td>
            <td>{{item.curbFacilityElseinfo}}</td>
            <td>{{item.ourletCode}}</td>
            <td>{{item.ourletName}}</td>
            <td>{{item.ourletPass}}</td>
            <td>{{item.ourletType}}</td>
            <td>{{item.elseInfo}}</td>
          </tr>
          </tbody>
        </table>
      </section>
      <section class="table-list">
        <h3 class="form-item-name">废水排放节点和治理设施</h3>
        <table class="table small-padding table-complex table-bordered light-blue-th table-flex">
          <thead>
          <tr>
            <th rowspan="2">行业类别</th>
            <th rowspan="2">废水类别</th>
            <th rowspan="2">污染物种类</th>
            <th colspan="6" class="al_center">污染治理设施</th>
            <th rowspan="2">排放去向</th>
            <th rowspan="2">排放方式</th>
            <th rowspan="2">排放规律</th>
            <th rowspan="2">排放口编码</th>
            <th rowspan="2">排放口名称</th>
            <th rowspan="2">排放口设置是否符合要求</th>
            <th rowspan="2">排放口类型</th>
            <th rowspan="2">其他信息</th>
          </tr>
          <tr>
            <th>污染治理设施编号</th>
            <th>污染治理设施名称</th>
            <th>污染治理设施工艺</th>
            <th>是否为可行技术</th>
            <th>是否涉及商业秘密</th>
            <th>污染治理设施其他信息</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in waterList">
            <td>{{item.industryType}}</td>
            <td>{{item.waterType}}</td>
            <td>{{item.pollutionType}}</td>
            <td>{{item.curbFacilityCode}}</td>
            <td>{{item.curbFacilityName}}</td>
            <td>{{item.curbFacilityCraft}}</td>
            <td>{{item.curbFacilityAble}}</td>
            <td>{{item.curbFacilitySecret}}</td>
            <td>{{item.curbFacilityElseinfo}}</td>
            <td>{{item.letDirection}}</td>
            <td>{{item.letWay}}</td>
            <td>{{item.letRule}}</td>
            <td>{{item.outletCode}}</td>
            <td>{{item.outletName}}</td>
            <td>{{item.outletPass}}</td>
            <td>{{item.outletType}}</td>
            <td>{{item.elseInfo}}</td>
          </tr>
          </tbody>
        </table>
      </section>
    </div>
  </div>
</template>
<script>
  import mapPollutePublicHttp from '@/https/map/mapPollutePublicHttp'
  export default {
    data() {
      return {
        airList: [],
        waterList: []
      }
    },
    props: {
      permitId: String,
    },
    created() {
      this.init();
    },
    mounted() {
    },
    methods: {
      init() {
        this.getFacilityAirList();
        this.getFacilityWaterList();
      },
      changeInit(id) {
        this.permitId = id
        this.init();
      },
      getFacilityAirList() {
        mapPollutePublicHttp.getFacilityAirList(this.permitId).then(result => {
          if (result.code === 0) {
            this.airList = result.result
          }
          console.log('airList:', this.airList)
        }).catch(error => {
          console.log(error)
        })
      },
      getFacilityWaterList() {
        mapPollutePublicHttp.getFacilityWaterList(this.permitId).then(result => {
          if (result.code === 0) {
            this.waterList = result.result
          }
        }).catch(error => {
          console.log(error)
        })
      }
    },
  }
</script>

<style>
  .popbox-wrapper .popbox-pollute-detail .popbox-detail-content.content-scroll {
    margin-left: 0;
  }
</style>
