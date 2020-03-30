<template>
  <!-- 原辅材料及辅料 -->
  <div class="table-list-wrapper" style="margin-top: 20px;">
    <section class="table-list mb_15">
      <h3 class="form-item-name wry_title">原料及辅料信息</h3>
      <table class="table small-padding table-complex table-bordered light-blue-th table-flex">
        <tbody>
        <tr>
          <th>行业类别</th>
          <th>种类</th>
          <th>名称</th>
          <th>年最大使用量计量单位</th>
          <th>年最大使用量</th>
          <th>纯度</th>
          <th>有毒有害成分</th>
          <th>有毒有害成分占比</th>
          <th>是否涉及商业秘密</th>
        </tr>
        <!--<tr v-if="loading">-->
          <!--<td colspan="10" class="text-center">{{constants.loadingText}}</td>-->
        <!--</tr>-->
        <tr v-if="techDetailMaterial.length === 0">
          <td colspan="9" class="text-center" style="text-align: center;">{{constants.emptyText}}</td>
        </tr>
        <tr v-else v-for="(item, index) in techDetailMaterial">
          <td>{{item.industryType}}</td>
          <td>{{item.type}}</td>
          <td>{{item.name}}</td>
          <td>{{item.unit}}<br></td>
          <td>{{item.value}}</td>
          <td>{{item.puritychen}}<br></td>
          <td>{{item.dangerElement}}<br></td>
          <td>{{item.dangerElementRate}}<br></td>
          <td>{{item.involvedSecret}}</td>
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
      techDetailMaterial: Array
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
      //   mapPollutePublicHttp.getElementalProcess(params)
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
