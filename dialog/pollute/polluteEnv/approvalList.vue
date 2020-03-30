<template>
  <div class="popbox-detail-content">
    <div class="panel-table" style="width: 100%;">
      <zt-table :data="dataList" ref="table"
                @currentRowChange="handleCurrentRowChange">
        <!--:height="constants.polluteDialogHeight"-->
        <zt-column width="80" type="index" label="序号"></zt-column>
        <zt-column prop="address" width="140" label="建设地点" align="center"></zt-column>
        <zt-column prop="name" width="300" label="项目名称" align="center"></zt-column>
        <zt-column prop="investmentTotal" label="项目总投资（万元）" align="center"></zt-column>
        <zt-column prop="investmentEnvir" label="环保投资（万元）" align="center"></zt-column>
        <zt-column prop="constructionNature" width="140" label="建设性质" align="center"></zt-column>
        <zt-column prop="projectCategory" width="160" label="环评类别" align="center"></zt-column>
        <zt-column prop="organizationUnit" width="160" label="环评编制单位" align="center"></zt-column>
        <zt-column prop="referenceNumber" width="220" label="环评审批文号/备案号" align="center"></zt-column>
        <zt-column prop="approveDate" width="200" label="批复/备案时间" align="center"></zt-column>
        <zt-column prop="attachList" width="220" label="附件列表" align="center">
          <template slot-scope="scope">
            <hb-file-download :scope="scope" showFj attachmentsKey="attachList"></hb-file-download>
          </template>
        </zt-column>
      </zt-table>
      <!-- 分页 -->
      <zt-pagination
        :page-size="pageSize"
        :currentPage="pageNo"
        :total="total"
        :pagerCount="5"
        @change="handlePgChange"
      ></zt-pagination>
    </div>
    <div class="currentDetail">
      详情
    </div>
    <div class="popbox-body">
      <div class="table-col-show" style="padding: 0!important;height:auto;">
        <table class="table table-bordered light-gray-th table-baseInfo">
          <tbody>
          <tr>
            <th style="width: 15%;">项目名称</th>
            <td colspan="3" style="width: 85%;">{{assessmentInfo.name}}</td>
          </tr>
          <tr>
            <th style="width: 15%;">项目类别</th>
            <td style="width: 35%;">{{assessmentInfo.projectType}}</td>
            <th style="width: 15%;">建设单位</th>
            <td style="width: 35%;">{{assessmentInfo.sopName}}</td>
          </tr>
          <tr>
            <th style="width: 15%;">环境影响评价分类管理名录</th>
            <td style="width: 35%;">{{assessmentInfo.assessmentClass}}</td>
            <th style="width: 15%;">建设性质</th>
            <td style="width: 35%;">{{assessmentInfo.constructionNature}}</td>
          </tr>
          <tr>
            <th style="width: 15%;">国民经济代码</th>
            <td style="width: 35%;">{{assessmentInfo.economicCode}}</td>
            <th style="width: 15%;">建设地点</th>
            <td style="width: 35%;">{{assessmentInfo.address}}</td>
          </tr>
          <tr>
            <th style="width: 15%;">投资额</th>
            <td style="width: 35%;">{{assessmentInfo.investmentTotal}}</td>
            <th style="width: 15%;">环保投资</th>
            <td style="width: 35%;">{{assessmentInfo.investmentEnvir}}</td>
          </tr>
          <tr>
            <th style="width: 15%;">环评编制单位</th>
            <td style="width: 35%;">{{assessmentInfo.organizationUnit}}</td>
            <th style="width: 15%;">受理时间</th>
            <td style="width: 35%;">{{assessmentInfo.acceptTime}}</td>
          </tr>
          <tr>
            <th style="width: 15%;">审批机关</th>
            <td style="width: 35%;">{{assessmentInfo.approvalAuthority}}</td>
            <th style="width: 15%;">环保审批文号</th>
            <td style="width: 35%;">{{assessmentInfo.referenceNumber}}</td>
          </tr>
          <tr>
            <th style="width: 15%;">批复时间</th>
            <td style="width: 35%;">{{assessmentInfo.appproveDate}}</td>
            <th style="width: 15%;">录入人</th>
            <td style="width: 35%;">{{assessmentInfo.entryPerson}}</td>
          </tr>
          <tr>
            <th style="width: 15%;">社会统一信用代码</th>
            <td style="width: 35%;">{{assessmentInfo.socialCreditCode}}</td>
            <th style="width: 15%;">法人姓名</th>
            <td style="width: 35%;">{{assessmentInfo.legalPerson}}</td>
          </tr>
          <tr>
            <th style="width: 15%;">法人身份证号</th>
            <td style="width: 35%;">{{assessmentInfo.frsfzhm}}</td>
            <th style="width: 15%;">法人联系电话</th>
            <td style="width: 35%;">{{assessmentInfo.docClegalRepresTelode}}</td>
          </tr>
          <tr>
            <th style="width: 15%;">建设单位联系人姓名</th>
            <td style="width: 35%;">{{assessmentInfo.projectPerson}}</td>
            <th style="width: 15%;">建设单位联系电话</th>
            <td style="width: 35%;">{{assessmentInfo.projectTel}}</td>
          </tr>
          <tr>
            <th style="width: 15%;">环评报告书/表</th>
            <td style="width: 35%;">
              <table>
                <tr v-for="item in assessmentInfo.attachmentsReport">
                  <td style="border: none;padding: 0;">
                    <hb-file-download-preview :item="item"
                                              style="display: inline-block;vertical-align: top;"></hb-file-download-preview>
                    <preview-plugin v-if="item.fileUrl" :item="item" :noTable="true"
                                    style="display: inline-block;vertical-align: top;"></preview-plugin>
                  </td>
                </tr>
              </table>
            </td>
            <th style="width: 15%;">环评批复</th>
            <td style="width: 35%;">
              <table>
                <tr v-for="item in assessmentInfo.attachmentsAccept">
                  <td style="border: none;padding: 0;">
                    <hb-file-download-preview :item="item"
                                              style="display: inline-block;vertical-align: top;"></hb-file-download-preview>
                    <preview-plugin v-if="item.fileUrl" :item="item" :noTable="true"
                                    style="display: inline-block;vertical-align: top;"></preview-plugin>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <th style="width: 15%;">环保审批登记表</th>
            <td style="width: 35%;">
              <table>
                <tr v-for="item in assessmentInfo.attachmentsRegister">
                  <td style="border: none;padding: 0;">
                    <hb-file-download-preview :item="item"
                                              style="display: inline-block;vertical-align: top;"></hb-file-download-preview>
                    <preview-plugin v-if="item.fileUrl" :item="item" :noTable="true"
                                    style="display: inline-block;vertical-align: top;"></preview-plugin>
                  </td>
                </tr>
              </table>
            </td>
            <th style="width: 15%;">验收受理时间</th>
            <td style="width: 35%;">{{assessmentInfo.checkAcceptDate}}</td>
          </tr>
          <tr>
            <th style="width: 15%;">验收审批机关</th>
            <td style="width: 35%;">{{assessmentInfo.checkApproveUnit}}</td>
            <th style="width: 15%;">验收批复号</th>
            <td style="width: 35%;">{{assessmentInfo.checkAppproveNumber}}</td>
          </tr>
          <tr>
            <th style="width: 15%;">验收监测（调查）单位</th>
            <td style="width: 35%;">{{assessmentInfo.checkTestUnit}}</td>
            <th style="width: 15%;">验收批复时间</th>
            <td style="width: 35%;">{{assessmentInfo.checkAppproveDate}}</td>
          </tr>
          <tr>
            <th style="width: 15%;">审批录入人</th>
            <td style="width: 35%;">{{assessmentInfo.checkEntryPerson}}</td>
            <th style="width: 15%;">验收监测报告书或调查报告书</th>
            <td style="width: 35%;">
              <table>
                <tr v-for="item in assessmentInfo.attachmentsCheckTest">
                  <td style="border: none;padding: 0;">
                    <hb-file-download-preview :item="item"
                                              style="display: inline-block;vertical-align: top;"></hb-file-download-preview>
                    <preview-plugin v-if="item.fileUrl" :item="item" :noTable="true"
                                    style="display: inline-block;vertical-align: top;"></preview-plugin>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <th style="width: 15%;">环评批复（验收）</th>
            <td style="width: 35%;">
              <table>
                <tr v-for="item in assessmentInfo.attachmentsCheckAnswer">
                  <td style="border: none;padding: 0;">
                    <hb-file-download-preview :item="item"
                                              style="display: inline-block;vertical-align: top;"></hb-file-download-preview>
                    <preview-plugin v-if="item.fileUrl" :item="item" :noTable="true"
                                    style="display: inline-block;vertical-align: top;"></preview-plugin>
                  </td>
                </tr>
              </table>
            </td>
            <th style="width: 15%;">“三同时”登记表</th>
            <td style="width: 35%;">
              <table>
                <tr v-for="item in assessmentInfo.attachmentsCheckThree">
                  <td style="border: none;padding: 0;">
                    <hb-file-download-preview :item="item"
                                              style="display: inline-block;vertical-align: top;"></hb-file-download-preview>
                    <preview-plugin v-if="item.fileUrl" :item="item" :noTable="true"
                                    style="display: inline-block;vertical-align: top;"></preview-plugin>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>


<script type="text/jsx">
  //环境监管-环境影响评价
  import polluteEnvHttp from '@/https/pollute/polluteEnvHttp'
  import hbFileDownload from '@/components/_public/hbFileDownload.vue'
  import polluteAsourceFileHttp from '@/https/pollute/polluteAsourceFileHttp'
  import hbFileDownloadPreview from '@/components/_public/hbFileDownloadPreview.vue'
  import PreviewPlugin from '@/components/_public/previewPlugin'

  export default {
    data() {
      return {
        dataList: [],
        pageSize: 10,
        pageNo: 1,
        total: 0,
        selectedDatas: [],
        assessmentInfo: {}
      }
    },
    components: {
      hbFileDownload,
      hbFileDownloadPreview,
      PreviewPlugin
    },
    props: {
      itemData: Object
    },
    created() {
      this.dataList = [];
      this.getPunishBySopId()
    },
    mounted() {

    },
    methods: {
      handlePgChange(pageNo, pageSize) {
        this.pageNo = pageNo;
        this.pageSize = pageSize;
        this.getPunishBySopId();
      },
      getPunishBySopId() {
        let params = {
          sopId: this.itemData.id,
          page: this.pageNo,
          size: this.pageSize
        }
        polluteEnvHttp.projectList(params).then((result) => {
          this.dataList = result.result.data;
          this.total = result.result.total
          var initId = result.result.data[0].id
          this.getProjectApproval(initId)
        }).catch((error) => {

        })
      },
      getProjectApproval(id) {
        let params = {
          id: id
        }
        polluteAsourceFileHttp.getProjectApproval(params)
          .then(res => {
            console.log(res)
            this.assessmentInfo = res.result
          })
      },
      handleCurrentRowChange(rowDatas) {
        // console.log('rowDatas:', rowDatas)
        this.selectedDatas = rowDatas
      },
    },
    watch: {
      selectedDatas(newVal, oldVal) {
        var newItem = newVal
        this.getProjectApproval(newItem.id)
      }
    }
  }
</script>

<style>
  .emptyList {
    width: 100%;
    height: 100%;
    text-align: center;
    line-height: 3;
    color: #999;
  }

  .currentDetail {
    width: 100%;
    padding: 18px 0;
    font-weight: bold;
  }
</style>
