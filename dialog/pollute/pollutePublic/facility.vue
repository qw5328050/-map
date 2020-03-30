<template>
  <div class="popbox-detail-content">
    <tech-detail-air :techDetailAir="techDetailAir"></tech-detail-air>
    <tech-detail-water :techDetailWater="techDetailWater"></tech-detail-water>
  </div>
</template>
<script>
  import mapPollutePublicHttp from '@/https/map/mapPollutePublicHttp'
  import tdMainProduct from './techDetail/tdMainProduct.vue'
  import tdMainProductMore from './techDetail/tdMainProductMore.vue'
  import techDetailAir from './techDetail/techDetailAir.vue'
  import techDetailFuel from './techDetail/techDetailFuel.vue'
  import techDetailMaterial from './techDetail/techDetailMaterial.vue'
  import techDetailWater from './techDetail/techDetailWater.vue'
  import polluteAsourceFileHttp from '@/https/pollute/polluteAsourceFileHttp'
  import envStatisticsListTwo from './techDetail/envStatisticsListTwo.vue'

  export default {
    props: {
      itemData: Object
    },
    components: {
      tdMainProduct,
      tdMainProductMore,
      techDetailAir,
      techDetailFuel,
      techDetailMaterial,
      techDetailWater,
      envStatisticsListTwo
    },
    created(){
      this.getSourceInfoFacilitiesSource()
    },
    data() {
      return {
        tab: ['主要产品及产能', '原辅材料及辅料', '废气治污设施', '废气治污设施'],
        tabIndex: 0,
        showFlag: 0,
        techDetailAir: [], // 燃料
        techDetailWater: [], // 燃料
        factorDataEs: {}
      }
    },
    methods: {
      // tabChange(index) {
      //   this.tabIndex = index
      // },
      getSourceInfoFacilitiesSource(){
        let params = {
          sopId: this.itemData.id
        }
        polluteAsourceFileHttp.getSourceInfoFacilitiesSource(params)
          .then(res => {
            let result = res.result;
            this.techDetailAir = result.airs
            this.techDetailWater = result.waters
          })
      },
    }
  }
</script>

<!--<template>
  <div class="popbox-detail-content content-scroll">
    <div class="table-list-wrapper">
      <section class="table-list mb_15">
        <h3 class="form-item-name">大气排放口基本情况表</h3>
        <table class="table small-padding table-complex table-bordered light-blue-th table-flex">
          <thead>
          <tr>
            <th rowspan="2">生产工艺</th>
            <th rowspan="2">生产设施编号</th>
            <th rowspan="2">生产设施名称</th>
            <th rowspan="2">对应产污环节名称</th>
            <th rowspan="2">污染物种类</th>
            <th rowspan="2">排放形式</th>
            <th colspan="6" class="al_center">污染治理设施</th>
            <th rowspan="2">有组织排放口编号</th>
            <th rowspan="2">有组织排放口名称</th>
            <th rowspan="2">排放口设置是否符合要求</th>
            <th rowspan="2">排放口类型</th>
            <th rowspan="2">其他信息</th>
          </tr>
          <tr>
            <th>污染治理 设施编号</th>
            <th>污染治理 设施名称</th>
            <th>污染治理 设施工艺</th>
            <th>是否为可 行技术</th>
            <th>是否涉及 商业秘密</th>
            <th>污染治理设施 其他信息</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>制剂加工</td>
            <td>MF0036</td>
            <td>全自动水 平袋装颗 粒包装机</td>
            <td>制剂加工 废气</td>
            <td>颗粒物</td>
            <td>有组织</td>
            <td>TA001</td>
            <td>含尘废气 处理系统</td>
            <td>袋式除尘</td>
            <td>是</td>
            <td>否</td>
            <td>/</td>
            <td>DA001</td>
            <td>标准化废 气检测口</td>
            <td>是</td>
            <td>一般 排放口</td>
            <td>/</td>
          </tr>
          <tr>
            <td>制剂加工</td>
            <td>MF0036</td>
            <td>全自动水 平袋装颗 粒包装机</td>
            <td>制剂加工 废气</td>
            <td>颗粒物</td>
            <td>有组织</td>
            <td>TA001</td>
            <td>含尘废气 处理系统</td>
            <td>袋式除尘</td>
            <td>是</td>
            <td>否</td>
            <td>/</td>
            <td>DA001</td>
            <td>标准化废 气检测口</td>
            <td>是</td>
            <td>一般 排放口</td>
            <td>/</td>
          </tr>
          </tbody>
        </table>
      </section>
      <section class="table-list">
        <h3 class="form-item-name">废水类别、污染物及污染治理设施信息表</h3>
        <table class="table small-padding table-complex table-bordered light-blue-th table-flex">
          <thead>
          <tr>
            <th rowspan="2">生产工艺</th>
            <th rowspan="2">生产设施编号</th>
            <th rowspan="2">生产设施名称</th>
            <th rowspan="2">对应产污环节名称</th>
            <th rowspan="2">污染物种类</th>
            <th rowspan="2">排放形式</th>
            <th colspan="6" class="al_center">污染治理设施</th>
            <th rowspan="2">有组织排放口编号</th>
            <th rowspan="2">有组织排放口名称</th>
            <th rowspan="2">排放口设置是否符合要求</th>
            <th rowspan="2">排放口类型</th>
            <th rowspan="2">其他信息</th>
          </tr>
          <tr>
            <th>污染治理 设施编号</th>
            <th>污染治理 设施名称</th>
            <th>污染治理 设施工艺</th>
            <th>是否为可 行技术</th>
            <th>是否涉及 商业秘密</th>
            <th>污染治理设施 其他信息</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>制剂加工</td>
            <td>MF0036</td>
            <td>全自动水 平袋装颗 粒包装机</td>
            <td>制剂加工 废气</td>
            <td>颗粒物</td>
            <td>有组织</td>
            <td>TA001</td>
            <td>含尘废气 处理系统</td>
            <td>袋式除尘</td>
            <td>是</td>
            <td>否</td>
            <td>/</td>
            <td>DA001</td>
            <td>标准化废 气检测口</td>
            <td>是</td>
            <td>一般 排放口</td>
            <td>/</td>
          </tr>
          <tr>
            <td>制剂加工</td>
            <td>MF0036</td>
            <td>全自动水 平袋装颗 粒包装机</td>
            <td>制剂加工 废气</td>
            <td>颗粒物</td>
            <td>有组织</td>
            <td>TA001</td>
            <td>含尘废气 处理系统</td>
            <td>袋式除尘</td>
            <td>是</td>
            <td>否</td>
            <td>/</td>
            <td>DA001</td>
            <td>标准化废 气检测口</td>
            <td>是</td>
            <td>一般 排放口</td>
            <td>/</td>
          </tr>
          <tr>
            <td>制剂加工</td>
            <td>MF0036</td>
            <td>全自动水 平袋装颗 粒包装机</td>
            <td>制剂加工 废气</td>
            <td>颗粒物</td>
            <td>有组织</td>
            <td>TA001</td>
            <td>含尘废气 处理系统</td>
            <td>袋式除尘</td>
            <td>是</td>
            <td>否</td>
            <td>/</td>
            <td>DA001</td>
            <td>标准化废 气检测口</td>
            <td>是</td>
            <td>一般 排放口</td>
            <td>/</td>
          </tr>
          <tr>
            <td>制剂加工</td>
            <td>MF0036</td>
            <td>全自动水 平袋装颗 粒包装机</td>
            <td>制剂加工 废气</td>
            <td>颗粒物</td>
            <td>有组织</td>
            <td>TA001</td>
            <td>含尘废气 处理系统</td>
            <td>袋式除尘</td>
            <td>是</td>
            <td>否</td>
            <td>/</td>
            <td>DA001</td>
            <td>标准化废 气检测口</td>
            <td>是</td>
            <td>一般 排放口</td>
            <td>/</td>
          </tr>
          <tr>
            <td>制剂加工</td>
            <td>MF0036</td>
            <td>全自动水 平袋装颗 粒包装机</td>
            <td>制剂加工 废气</td>
            <td>颗粒物</td>
            <td>有组织</td>
            <td>TA001</td>
            <td>含尘废气 处理系统</td>
            <td>袋式除尘</td>
            <td>是</td>
            <td>否</td>
            <td>/</td>
            <td>DA001</td>
            <td>标准化废 气检测口</td>
            <td>是</td>
            <td>一般 排放口</td>
            <td>/</td>
          </tr>
          <tr>
            <td>制剂加工</td>
            <td>MF0036</td>
            <td>全自动水 平袋装颗 粒包装机</td>
            <td>制剂加工 废气</td>
            <td>颗粒物</td>
            <td>有组织</td>
            <td>TA001</td>
            <td>含尘废气 处理系统</td>
            <td>袋式除尘</td>
            <td>是</td>
            <td>否</td>
            <td>/</td>
            <td>DA001</td>
            <td>标准化废 气检测口</td>
            <td>是</td>
            <td>一般 排放口</td>
            <td>/</td>
          </tr>
          <tr>
            <td>制剂加工</td>
            <td>MF0036</td>
            <td>全自动水 平袋装颗 粒包装机</td>
            <td>制剂加工 废气</td>
            <td>颗粒物</td>
            <td>有组织</td>
            <td>TA001</td>
            <td>含尘废气 处理系统</td>
            <td>袋式除尘</td>
            <td>是</td>
            <td>否</td>
            <td>/</td>
            <td>DA001</td>
            <td>标准化废 气检测口</td>
            <td>是</td>
            <td>一般 排放口</td>
            <td>/</td>
          </tr>
          <tr>
            <td>制剂加工</td>
            <td>MF0036</td>
            <td>全自动水 平袋装颗 粒包装机</td>
            <td>制剂加工 废气</td>
            <td>颗粒物</td>
            <td>有组织</td>
            <td>TA001</td>
            <td>含尘废气 处理系统</td>
            <td>袋式除尘</td>
            <td>是</td>
            <td>否</td>
            <td>/</td>
            <td>DA001</td>
            <td>标准化废 气检测口</td>
            <td>是</td>
            <td>一般 排放口</td>
            <td>/</td>
          </tr>
          <tr>
            <td>制剂加工</td>
            <td>MF0036</td>
            <td>全自动水 平袋装颗 粒包装机</td>
            <td>制剂加工 废气</td>
            <td>颗粒物</td>
            <td>有组织</td>
            <td>TA001</td>
            <td>含尘废气 处理系统</td>
            <td>袋式除尘</td>
            <td>是</td>
            <td>否</td>
            <td>/</td>
            <td>DA001</td>
            <td>标准化废 气检测口</td>
            <td>是</td>
            <td>一般 排放口</td>
            <td>/</td>
          </tr>
          <tr>
            <td>制剂加工</td>
            <td>MF0036</td>
            <td>全自动水 平袋装颗 粒包装机</td>
            <td>制剂加工 废气</td>
            <td>颗粒物</td>
            <td>有组织</td>
            <td>TA001</td>
            <td>含尘废气 处理系统</td>
            <td>袋式除尘</td>
            <td>是</td>
            <td>否</td>
            <td>/</td>
            <td>DA001</td>
            <td>标准化废 气检测口</td>
            <td>是</td>
            <td>一般 排放口</td>
            <td>/</td>
          </tr>
          </tbody>
        </table>
      </section>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {}
    },
    created() {

    },
    mounted() {
    },
    methods: {},
  }
</script>-->
