<template>
  <!-- 废水治污设施 -->
  <div class="table-list-wrapper">
    <section class="table-list mb_15">
      <h3 class="form-item-name wry_title">废水治污设施</h3>
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
          <th rowspan="2">排放口编号</th>
          <th rowspan="2">排放口名称</th>
          <th rowspan="2">排放口设置是否符合要求</th>
          <th rowspan="2">排放口类型</th>
          <th rowspan="2">其他信息</th>
        </tr>
        <tr>
          <th>编号</th>
          <th>名称</th>
          <th>工艺</th>
          <th>是否为可行技术</th>
          <th>是否涉及商业秘密</th>
        </tr>
        </thead>
        <tbody>
        <!--<tr v-if="loading">-->
          <!--<td colspan="17" class="text-center">{{constants.loadingText}}</td>-->
        <!--</tr>-->
        <tr v-if="techDetailWater.length === 0">
          <td colspan="16" class="text-center">{{constants.emptyText}}</td>
        </tr>
        <tr v-else v-for="(item, index) in techDetailWater">
          <td>{{item.industryType}}</td>
          <td>{{item.waterType}}</td>
          <td>{{item.pollutionType}}</td>
          <td>{{item.curbFacilityCode}}</td>
          <td>{{item.curbFacilityName}}</td>
          <td>{{item.curbFacilityCraft}}</td>
          <td>{{item.isCurbFacilityAble}}</td>
          <td>{{item.isCurbFacilitySecret}}</td>
          <td>{{item.curbFacilityElseinfo}}</td>
          <td>{{item.letDirection}}</td>
          <td>{{item.letWay}}</td>
          <td>{{item.letRule}}</td>
          <td>{{item.outletCode}}</td>
          <td>{{item.outletName}}</td>
          <td>{{item.isOutletPass}}</td>
          <td>{{item.outletType}}</td>
        </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script type="text/jsx">
  import mapPollutePublicHttp from '@/https/map/mapPollutePublicHttp'
  export default {
    data(){
      return {
        loading: true,
        // dataList: []
      }
    },
    props: {
      techDetailWater: Array
    },
    mounted(){
      // this.getDataList();
    },
    methods: {
      // getDataList() {
      //   let params = {
      //     sopId: this.$parent.itemData.id,
      //     page: 1,
      //     limit: this.constants.maxPageSize
      //   };
      //   mapPollutePublicHttp.getFacilityWater(params)
      //     .then(res => {
      //       this.loading = false;
      //       if (res.data.data) {
      //         this.dataList = res.data.data
      //       }
      //     })
      // },
    }
  }
</script>
