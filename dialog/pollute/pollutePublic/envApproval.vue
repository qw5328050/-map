<template>
  <div class="popbox-detail-content">
    <section class="table-list mb_15">
      <h3 class="form-item-name">环评审批报告表</h3>
      <table class="table-info light-blue-th table-baseInfo mt_10" v-for="(item,index) in reportDataList">
        <tr>
          <th style="width: 12%;">项目名称</th>
          <td style="width: 21%;">
            {{item.name}}
          </td>
          <th style="width: 12%;">建设单位</th>
          <td style="width: 21%;">
            {{item.sopName}}
          </td>
          <th style="width: 12%;">建设地点</th>
          <td style="width: 21%;">
            {{item.address}}
          </td>
        </tr>
        <tr>
          <th>项目类别</th>
          <td>
            {{item.projectType | dictionaryConvert(constants.project_type)}}
          </td>
          <th>建设性质</th>
          <td>
            {{item.constructionNature | dictionaryConvert(constants.construction_nature)}}
          </td>
          <th>环境影响评价分类管理名录</th>
          <td>
            {{item.assessmentClass}}
          </td>
        </tr>
        <tr>
          <th>国民经济代码</th>
          <td>
            {{item.economicCode}}
          </td>
          <th>项目总投资(万元)</th>
          <td>
            {{item.investmentTotal}}
          </td>
          <th>环保投资(万元)</th>
          <td>
            {{item.investmentEnvir}}
          </td>
        </tr>
        <tr>
          <th>环评编制单位</th>
          <td>
            {{item.sopName}}
          </td>
          <th>受理时间</th>
          <td>
            {{item.acceptTime}}
          </td>
          <th>审批机关</th>
          <td>
            {{item.approvalAuthority}}
          </td>
        </tr>
        <tr>
          <th>批复时间</th>
          <td>
            {{item.appproveDate}}
          </td>
          <th>环评审批文号</th>
          <td>
            {{item.referenceNumber}}
          </td>
          <th>录入人</th>
          <td>
            {{item.entryPerson}}
          </td>
        </tr>
        <tr>
          <th>环评报告书/表</th>
          <td>
            <p v-for="file in item.attachmentsReport"><a :href="file.fileUrl">{{file.fileName}}</a></p>
          </td>
          <th>环评批复</th>
          <td>
            <p v-for="file in item.attachmentsAccept"><a :href="file.fileUrl">{{file.fileName}}</a></p>
          </td>
          <th>环保审批登记表</th>
          <td>
            <p v-for="file in item.attachmentsRegister"><a :href="file.fileUrl">{{file.fileName}}</a></p>
          </td>
        </tr>

      </table>
    </section>

    <section class="table-list mb_15">
      <h3 class="form-item-name">环评审批登记表</h3>
      <table class="table-info light-blue-th table-baseInfo mt_10" v-for="(item,index) in regDataList">
        <tr>
          <th style="width: 12%;">项目名称</th>
          <td style="width: 21%;">
            {{item.name}}
          </td>
          <th style="width: 12%;">建设单位</th>
          <td style="width: 21%;">
            {{item.sopName}}
          </td>
          <th style="width: 12%;">建设地点</th>
          <td style="width: 21%;">
            {{item.address}}
          </td>
        </tr>
        <tr>
          <th>项目类别</th>
          <td>
            {{item.projectType | dictionaryConvert(constants.project_type)}}
          </td>
          <th>建设性质</th>
          <td>
            {{item.constructionNature | dictionaryConvert(constants.construction_nature)}}
          </td>
          <th>拟投入生产运营日期</th>
          <td>
            {{item.productDate}}
          </td>
        </tr>
        <tr>
          <th>占地面积(平方米)</th>
          <td>
            {{item.area}}
          </td>
          <th>项目总投资(万元)</th>
          <td>
            {{item.investmentTotal}}
          </td>
          <th>环保投资(万元)</th>
          <td>
            {{item.investmentEnvir}}
          </td>
        </tr>
        <tr>
          <th>备案号</th>
          <td>
            {{item.referenceNumber}}
          </td>
          <th>备案日期</th>
          <td colspan="3">
            {{item.appproveDate}}
          </td>
        </tr>
        <tr>
          <th>备案依据</th>
          <td colspan="5">
            {{item.referenceGist}}
          </td>
        </tr>
        <tr>
          <th>建设内容及规模</th>
          <td colspan="5">
            {{item.constructionContent}}
          </td>
        </tr>
        <tr>
          <th>主要环境影响</th>
          <td>
            {{item.majorEnvirImpacts}}
          </td>
          <th>采取的环境措施及排放去向</th>
          <td colspan="3">
            {{item.envirMeasure}}
          </td>
        </tr>

      </table>
    </section>
  </div>
</template>

<script>
  import mapPollutePublicHttp from '@/https/map/mapPollutePublicHttp'

  export default {
    data() {
      return {
        regDataList: [],
        reportDataList: [],
      }
    },
    props: {
      itemData: Object
    },
    created() {
      this.regDataList = [];
      this.reportDataList = [];
      this.getEnvApprovalRegList();
      this.getEnvApprovalReportList();
    },
    mounted() {

    },
    methods: {
      getEnvApprovalRegList() {
        mapPollutePublicHttp.getEnvApprovalRegList(this.itemData.id).then((result) => {
          this.regDataList = result.data;
          if (this.regDataList.length == 0) {
            this.regDataList.push({});
          }
        }).catch((error) => {

        })
      },
      getEnvApprovalReportList() {
        mapPollutePublicHttp.getEnvApprovalReportList(this.itemData.id).then((result) => {
          this.reportDataList = result.data;
          if (this.reportDataList.length == 0) {
            this.reportDataList.push({});
          }
        }).catch((error) => {

        })
      }

    },
  }
</script>
