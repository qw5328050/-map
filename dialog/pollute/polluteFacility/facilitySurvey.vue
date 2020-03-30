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
              <td style="width: 27%;">{{itemData.type | dictionaryConvert(constants.pollution_source_type)}}</td>
              <th style="width: 23%;">企业名称</th>
              <td style="width: 27%;">{{itemData.name}}</td>
            </tr>
            <tr>
              <th>所属行业</th>
              <td>{{itemData.industry | dictionaryConvert(constants.industry_type)}}</td>
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
                <template v-if="itemData.polluttionType">
                  <template v-for="pollution in (itemData.polluttionType).split(',')">{{ pollution |
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
      </div>
      <!-- 图表信息 -->
      <div class="detail-chart">
        <div class="chart-item mb_10">
          <h3 class="form-item-name mb_5">主要产品产量</h3>
          <div class="chart-box">
            <img src="static/images/temporary/pollute-detail-01.png" alt=""/>
          </div>
        </div>
        <div class="chart-item mb_10">
          <h3 class="form-item-name mb_5">电量消耗</h3>
          <div class="chart-box">
            <img src="static/images/temporary/pollute-detail-02.png" alt=""/>
          </div>
        </div>
        <div class="chart-item">
          <h3 class="form-item-name mb_5">污染物进口浓度趋势</h3>
          <div class="chart-box">
            <img src="static/images/temporary/pollute-detail-03.png" alt=""/>
          </div>
        </div>
        <div class="chart-item">
          <h3 class="form-item-name mb_5">污染物出口浓度趋势</h3>
          <div class="chart-box">
            <img src="static/images/temporary/pollute-detail-04.png" alt=""/>
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
        approvalList: [],
        punishDataList: []
      }
    },
    props: {
      itemData: Object,
    },
    created() {
      this.getEnvApprovalRegList();
      this.getPunishBySopId();
    },
    mounted() {
    },
    methods: {
      reportClick(code){
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
      getPunishBySopId() {
        mapPollutePublicHttp.getPunishBySopId(this.itemData.id).then((result) => {
          this.punishDataList = result.data;
          this.loadingTwo = true;
        }).catch((error) => {
          this.loadingTwo = true;
        })
      },
    },
  }
</script>
