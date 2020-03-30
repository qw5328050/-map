<template>
  <div class="popbox-detail-content">
    <div class="table-list-wrapper">
      <section class="table-list">
        <h3 class="form-item-name">监察执法列表</h3>
        <table class="table small-padding table-complex table-bordered light-blue-th">
          <thead>
          <tr>
            <th>检查日期</th>
            <th>检查人</th>
            <th>检查单位</th>
            <th>任务类型</th>
            <th>是否发现涉嫌环境违法行为</th>
            <th>涉嫌环境违法行为类型</th>
            <th>检查时企业生产状态</th>
            <th>现场监察结论</th>
            <th>违法行为处理建议</th>
          </tr>
          </thead>
          <tbody>
            <tr v-if="loading&&dataList&&dataList.length==0"><td class="al_center" colspan="9">{{constants.no_data_text}}</td></tr>
            <tr v-for="item in dataList" >
              <td>{{item.time | dateConvert('YYYY-MM-DD')}}</td>
              <td>{{item.person}}</td>
              <td>{{item.unitName}}</td>
              <td>{{item.type | dictionaryConvert(constants.enforcement_type)}}</td>
              <td>{{item.hasUnlawful | yeaOrNoConvert}}</td>
              <td>{{item.unlawfulType |dictionaryConvert(constants.unlawfal_type)}}</td>
              <td>{{item.status | dictionaryConvert(constants.production_state)}}</td>
              <td>{{item.summing}}</td>
              <td>{{item.suggest}}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  </div>
</template>
<script>
  import mapMobileLawHttp from '@/https/map/mapMobileLawHttp'
  export default {
    props: {
      itemData: Object
    },
    data() {
      return {
        loading:false,
        dataList:[],
      }
    },
    created() {
        this.getData();
    },
    mounted() {
    },
    methods: {
      getData() {
        this.loading = false;
        mapMobileLawHttp.queryMobileLawRecordById(this.itemData.id).then((result) => {
          this.dataList = result.data;
          this.loading  = true;
        }).catch((error) => {
          this.loading  = true;
        })
      },
    },
  }
</script>
