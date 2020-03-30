<template>
  <!-- 主要产品及产能 -->
  <div class="table-list-wrapper">
    <section class="table-list mb_15">
      <h3 class="form-item-name wry_title">主要产品及产能</h3>
      <table class="table small-padding table-complex table-bordered light-blue-th table-flex">
        <thead>
        <tr>
          <th rowspan="2" style="width: 30px;">序号</th>
          <th rowspan="2">行业类别</th>
          <th rowspan="2">主要生产单位名称</th>
          <th rowspan="2">主要工艺名称</th>
          <th rowspan="2">主要设施名称</th>
          <th rowspan="2">是否涉及商业秘密</th>
          <th colspan="4" class="al_center" style="width: 400px;">生产设施编号</th>
          <th rowspan="2">产品名称</th>
          <th rowspan="2">计量单位</th>
          <th rowspan="2">生产能力</th>
          <th rowspan="2">设计年生产时间</th>
          <th rowspan="2">其他产品信息</th>
          <th rowspan="2">其他工艺信息</th>
        </tr>
        <tr>
          <th>参数名称</th>
          <th>计量单位</th>
          <th>设计值</th>
          <th>其他设施参数信息</th>
        </tr>
        </thead>
        <tbody>
        <!--<tr v-if="loading">-->
          <!--<td colspan="16" class="text-center">{{constants.loadingText}}</td>-->
        <!--</tr>-->
        <tr v-if="mainProduct.length === 0">
          <td colspan="16" class="text-center">{{constants.emptyText}}</td>
        </tr>
        <tr v-else v-for="(item, index) in mainProduct">
          <td>{{index + 1}}</td>
          <td>{{item.type}}</td>
          <td>{{item.unitName}}</td>
          <td>{{item.carftName}}</td>
          <td>{{item.facilityName}}</td>
          <td>{{item.isSecretFac}}</td>
          <td>{{item.parameterName}}</td>
          <td>{{item.parameterUnit}}</td>
          <td>{{item.parameterValue}}</td>
          <td>{{item.parameterElseinfo}}</td>
          <td>{{item.productName}}</td>
          <td>{{item.recordUnit}}</td>
          <td>{{item.productionCapacity}}</td>
          <td>{{item.yearProductionTime}}</td>
          <td>{{item.productElse}}</td>
          <td>{{item.carftElse}}</td>
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
        loading: false,
        // dataList: []
      }
    },
    props: {
      mainProduct: Array
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
      //   mapPollutePublicHttp.getProduct(params)
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
