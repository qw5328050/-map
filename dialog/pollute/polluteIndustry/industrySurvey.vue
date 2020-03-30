<template>
  <div class="popbox-body">
    <div class="popbox-pollute cf" style="height:400px;overflow: auto">
      <!-- 表格信息 -->
      <div class="form-wrapper table-detail">
        <div class="form-item mb_15">
          <a href="javascript:void(0);" @click="reportClick('A02.01')"><h3 class="form-item-name">企业基本信息</h3></a>
          <table class="table-info light-blue-th">
            <tr>
              <th style="width: 23%;">污染源类别</th>
                <template v-if="itemData.type">
                  <td style="width: 27%;">
                    {{itemData.type | dictionaryConvert(constants.pollution_source_type)}}
                  </td>
                </template>
                <template v-else>
                  <td style="width: 27%;">
                  </td>
                </template>

              <th style="width: 23%;">企业名称</th>
              <td style="width: 27%;">{{itemData.name}}</td>
            </tr>
            <tr>
              <th>所属行业</th>
              <template v-if="itemData.industry">
                <td>{{itemData.industry | dictionaryConvert(constants.industry_type)}}</td>
              </template>
              <template v-else>
                <td></td>
              </template>
              <th>行政区域</th>
              <td>{{itemData.county}}{{itemData.street?'-'+itemData.street:''}}</td>
            </tr>
            <tr>
              <th>统一社会信用代码</th>
              <td>{{itemData.socialCreditCode}}</td>
              <th>组织机构代码</th>
              <td>{{itemData.organizationCode}}</td>
            </tr>
            <tr>
              <th>排污许可证编号</th>
              <td>{{itemData.licenseNo}}</td>
              <th>排污种类</th>
              <td>
                <template v-if="itemData.pollutionType">
                  <template v-for="pollution in (itemData.pollutionType).split(',')">{{ pollution |
                    dictionaryConvert(constants.pollution_type) }}
                  </template>
                </template>
              </td>
            </tr>
            <tr>
              <th>环保属性</th>
              <td colspan="3">
                <div class="property" v-if="itemData.envirProper">
                  <template v-for="proper in (itemData.envirProper).split(',')">
                    <span class="label label-primary-border">
                      {{ proper | dictionaryConvert(constants.envir_proper) }}
                    </span>
                  </template>
                </div>
              </td>
            </tr>
          </table>
        </div>
        <!-- 环评项目 -->
        <div class="form-item mb_15">
          <a href="javascript:void(0);" @click="reportClick('A04.01')"><h3 class="form-item-name">环评项目</h3></a>
          <table class="table mid-padding light-blue-th table-border-outer">
            <thead>
            <tr>
              <th style="width: 17%;">项目类别</th>
              <th style="width: 45%;">项目名称</th>
              <th style="width: 26%;">环评批复文号/备案文号</th>
              <th style="width: 17%;">批复时间</th>
            </tr>
            </thead>
            <tbody>
            <tr v-if="loadingOne&&approvalList&&approvalList.length==0">
              <td class="al_center" colspan="4">{{constants.no_data_text}}</td>
            </tr>
            <tr v-for="item in approvalList">
              <td>{{item.typeName}}</td>
              <td>{{item.name}}</td>
              <td><a href="javascript:void(0);" @click="reportClick('A04.01')">{{item.referenceNumber}}</a></td>
              <td>{{item.appproveDate | dateConvert('YYYY-MM-DD')}}</td>
            </tr>
            </tbody>
          </table>
        </div>
        <!-- 行政处罚 -->
        <div class="form-item mb_15">
          <a href="javascript:void(0);" @click="reportClick('A04.03')"><h3 class="form-item-name">行政处罚</h3></a>
          <table class="table mid-padding light-blue-th table-border-outer">
            <thead>
            <tr>
              <th style="width: 17%;">处罚类别类别</th>
              <th style="width: 45%;">处罚名称</th>
              <th style="width: 26%;">行政处罚决定书文号</th>
              <th style="width: 17%;">处罚决定日期</th>
            </tr>
            </thead>
            <tbody>
            <tr v-if="loadingTwo&&punishDataList&&punishDataList.length==0">
              <td class="al_center" colspan="4">{{constants.no_data_text}}</td>
            </tr>
            <tr v-for="item in punishDataList">
              <td>{{item.punishTypeText}}</td>
              <td>{{item.punishName}}</td>
              <td><a href="javascript:void(0);" @click="reportClick('A04.03')">{{item.docCode}}</a></td>
              <td>{{item.punishDate | dateConvert('YYYY-MM-DD')}}</td>
            </tr>
            </tbody>
          </table>
        </div>
        <div class="form-item">
          <!-- 图表信息 -->
          <div class="detail-chart">
            <div class="chart-item mb_15">
              <h3 class="form-item-name mb_5">主要产品产量</h3>
              <div class="chart-box">
                <table class="table small-padding table-complex table-bordered light-blue-th">
                  <thead>
                    <tr>
                      <th>产品名称</th>
                      <th v-for="(item,index) in productYears">{{item}}年</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item,index) in productData">
                      <td v-for="(item2,index) in item">
                        {{item2}}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="chart-item mb_15">
              <h3 class="form-item-name mb_5">主要原辅料和能源消耗</h3>
              <div class="chart-box">
                <table class="table small-padding table-complex table-bordered light-blue-th">
                  <thead>
                    <tr>
                      <th>原辅料/能源</th>
                      <th v-for="(item,index) in materialYears">{{item}}年</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item,index) in materialData">
                      <td v-for="(item2,index) in item">
                        {{item2}}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="chart-item">
              <h3 class="form-item-name mb_5">废气排污量</h3>
              <div class="chart-box">
                <!--<img src="static/images/temporary/pollute-detail-03.png" alt=""/>-->
                <div ref="airChart" style="width:380px; height:247px;"></div>
              </div>
            </div>
            <div class="chart-item">
              <h3 class="form-item-name mb_5">废水排污量</h3>
              <div class="chart-box">
                <!--<img src="static/images/temporary/pollute-detail-04.png" alt=""/>-->
                <div ref="waterChart" style="width:380px; height:247px;"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
  import mapPollutePublicHttp from '@/https/map/mapPollutePublicHttp'

  export default {
    data() {
      return {
        loadingOne: false,
        loadingTwo: false,
        productData:[],
        productYears:[],
        materialData:[],
        materialYears:[],
        approvalList: [],
        punishDataList: [],
        exhaustGasList: [],
        wastewaterDischargeList: []
      }
    },
    props: {
      itemData: Object,
    },
    created() {
      this.getEnvApprovalRegList();
      this.getPunishBySopId();
      this.getExhaustGasFn();
      this.getWastewaterDischargeFn();
      this.getSopDetailProduct();
      this.getSopDetailMaterial();
    },
    mounted() {
      console.log(this.itemData)
    },
    methods: {
      reportClick(code) {
        this.$emit('contentClick', code)
      },
      getEnvApprovalRegList() {
        this.approvalList = [];
        mapPollutePublicHttp.getEnvApprovalRegList(this.itemData.id).then((result) => {
          if (result.data && result.data.length > 0) {
            for (let item of result.data) {
              this.approvalList.push({
                typeName: '登记表',
                name: item.name,
                referenceNumber: item.referenceNumber,
                appproveDate: item.appproveDate
              });
            }

          }
        }).then(() => {
          this.getEnvApprovalReportList();
        }).catch((error) => {
          this.loadingOne = true;
        })
      },
      getEnvApprovalReportList() {
        mapPollutePublicHttp.getEnvApprovalReportList(this.itemData.id).then((result) => {
          if (result.data && result.data.length > 0) {
            for (let item of result.data) {
              this.approvalList.push({
                typeName: '报告书',
                name: item.name,
                referenceNumber: item.referenceNumber,
                appproveDate: item.appproveDate
              });
            }
          }
          this.loadingOne = true;
        }).catch((error) => {
          this.loadingOne = true;
        })
      },
      getSopDetailProduct() {
        mapPollutePublicHttp.getSopDetailProduct(this.itemData.id).then((result) => {
          if (result.data) {
            let names = result.data.sopProductList;
            let dataList = result.data.dataList;
            let years = [];
            //抽取年份
            for (var i = 0; i < dataList.length; i++) {
              let year = dataList[i].year;
              years.push(year);
            }
            this.productYears = years;
            //重组数据
            for (var i = 0; i < names.length; i++) {
              let name = names[i];
              let values = [];
              values.push(name);
              for (var j = 0; j < dataList.length; j++) {
                let vv = dataList[j][name];
                values.push(vv);
              }
              this.productData.push(values);
            }
          }
          this.loadingOne = true;
        }).catch((error) => {
          this.loadingOne = true;
        })
      },
      getSopDetailMaterial() {
        mapPollutePublicHttp.getSopDetailMaterial(this.itemData.id).then((result) => {
          if (result.data) {
            let names = result.data.sopProductList;
            let dataList = result.data.dataList;
            let years = [];
            //抽取年份
            for (var i = 0; i < dataList.length; i++) {
              let year = dataList[i].year;
              years.push(year);
            }
            this.materialYears = years;
            //重组数据
            for (var i = 0; i < names.length; i++) {
              let name = names[i];
              let values = [];
              values.push(name);
              for (var j = 0; j < dataList.length; j++) {
                let vv = dataList[j][name];
                values.push(vv);
              }
              this.materialData.push(values);
            }
          }
          this.loadingOne = true;
        }).catch((error) => {
          this.loadingOne = true;
        })
      },
      getPunishBySopId() {
        mapPollutePublicHttp.getPunishBySopId(this.itemData.id).then((result) => {
          this.punishDataList = result.data;
          this.loadingTwo = true;
        }).catch((error) => {
          this.loadingTwo = true;
        })
      },
      getExhaustGasFn() { // this.itemData.id('58f68ebab8794caeaff0ae490365a3d9')
        mapPollutePublicHttp.getExhaustGas(this.itemData.countyCode, this.itemData.id).then((result) => {
          console.log(result.data)
          this.exhaustGasList = result.data
          const options = this.airLineChartsFn(result.data)
          options.grid = {
            left: 50,
            right: 30,
            top: 30,
            bottom: 30
          }
          const eCharts = this.$echarts.init(this.$refs.airChart)
          // console.log(eCharts)
          eCharts.setOption(options)
          this.loadingTwo = true
        }).catch((error) => {
          this.loadingTwo = true
        })
      },
      getWastewaterDischargeFn() { // this.itemData.id('c7f4b6855087480f985653077bdef49d')
        mapPollutePublicHttp.getWastewaterDischarge(this.itemData.countyCode, this.itemData.id).then((result) => {
          console.log(result.data)
          this.wastewaterDischargeList = result.data
          const options = this.warterLineChartsFn(result.data)
          options.grid = {
            left: 50,
            right: 30,
            top: 30,
            bottom: 30
          }
          const eCharts = this.$echarts.init(this.$refs.waterChart)
          // console.log(eCharts)
          eCharts.setOption(options)
          this.loadingTwo = true
        }).catch((error) => {
          this.loadingTwo = true
        })
      },
      airLineChartsFn(data) {
        let yearData = []
        let dustData = []
        let noxData = []
        let so2Data = []
        let volatilityData = []
        data.forEach((item, index) => {
          noxData.push(item.nox)
          so2Data.push(item.so2)
          volatilityData.push(item.volatility)
          dustData.push(item.dust)
          yearData.push(item.year)
        })
        let options = {
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['颗粒物', '氮氧化物', '二氧化硫', '挥发性有机物']
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: yearData
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              name: '颗粒物',
              type: 'line',
              data: dustData
            },
            {
              name: '氮氧化物',
              type: 'line',
              data: noxData
            },
            {
              name: '二氧化硫',
              type: 'line',
              data: so2Data
            },
            {
              name: '挥发性有机物',
              type: 'line',
              data: volatilityData
            }
          ]
        }
        return options
      },
      warterLineChartsFn(data) {
        let anData = []
        let pData = []
        let solidData = []
        let nData = []
        let yearData = []
        data.forEach((item, index) => {
          anData.push(item.an)
          pData.push(item.p)
          solidData.push(item.solid)
          nData.push(item.n)
          yearData.push(item.year)
        })
        let options = {
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['化学需氧量', '氨氮', '总磷', '总氧']
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: yearData
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              name: '化学需氧量',
              type: 'line',
              data: solidData
            },
            {
              name: '氨氮',
              type: 'line',
              data: anData
            },
            {
              name: '总磷',
              type: 'line',
              data: pData
            },
            {
              name: '总氧',
              type: 'line',
              data: nData
            }
          ]
        }
        return options
      }
    }
  }
</script>
