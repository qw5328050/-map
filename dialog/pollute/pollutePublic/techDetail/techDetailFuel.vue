<template>
  <!-- 燃料信息 -->
  <div class="table-list-wrapper" style="margin-top: 20px;">
    <section class="table-list mb_15">
      <h3 class="form-item-name wry_title">燃料信息</h3>
      <table class="table small-padding table-complex table-bordered light-blue-th table-flex">
        <tbody>
        <tr>
          <th>行业类别</th>
          <th>燃料名称</th>
          <th>灰分(%)</th>
          <th>硫分(%)</th>
          <th>挥发分(%)</th>
          <th>热值()</th>
          <th>年最大使用量</th>
          <th>是否涉及商业秘密</th>
        </tr>
        <tr v-if="techDetailFuel.length === 0">
          <td colspan="8" class="text-center">{{constants.emptyText}}</td>
        </tr>
        <tr v-else v-for="(item, index) in techDetailFuel">
          <td>{{item.industryType}}</td>
          <td>{{item.fuelName}}</td>
          <td>{{item.ashContent}}</td>
          <td>{{item.sulfurContent}}<br></td>
          <td>{{item.volContent}}</td>
          <td>{{item.heatValue}}<br></td>
          <td>{{item.yearMax}}<br></td>
          <td>{{item.involvedSecret}}<br></td>
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
      techDetailFuel: Array
    },
    mounted(){
      // this.getDataList();
      console.log('techDetailFuel:', this.techDetailFuel)
    },
    methods: {
      // getDataList() {
      //   let params = {
      //     sopId: this.$parent.itemData.id,
      //     page: 1,
      //     limit: this.constants.maxPageSize
      //   };
      //   mapPollutePublicHttp.getFuelInfo(params)
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

