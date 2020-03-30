<template>
  <div class="popbox-detail-content">
    <div class="panel-table" style="width: 100%;">
      <zt-table :data="dataList" :height="440" ref="table">
        <zt-column width="70" label="序号">
          <template slot-scope="scope">
            {{orderIndex(scope)}}
          </template>
        </zt-column>
        <zt-column prop="county" width="100" label="所属区县"  align="center"></zt-column>
        <zt-column prop="name" width="100" label="被处罚企业" align="center"></zt-column>
        <zt-column prop="docCode" label="行政处罚决定书文号" align="center"></zt-column>
        <zt-column prop="industryType" width="140" label="企业所属行业" align="center"></zt-column>
        <!--<zt-column prop="punishName" width="100" label="处罚名称" align="center"></zt-column>-->
        <zt-column prop="punishType" width="100" label="处罚类型" align="center">
          <!--<template slot-scope="scope">{{formatterType(scope.row.punishType)}}</template>-->
        </zt-column>
        <zt-column prop="punishTypeDesc" width="100" label="处罚" align="center"></zt-column>
        <!--<zt-column prop="punishResult" width="100" label="处罚结果" align="center"></zt-column>-->
        <zt-column prop="punishDate" width="120" label="处罚决定日期" align="center" ></zt-column>
        <zt-column width="120" label="附件列表" align="center" >
          <template slot-scope="scope">
            <a @click="showAttachList(scope.row.attachList)" class="link underline">查看附件</a>
          </template>
        </zt-column>
      </zt-table>
      <!-- 分页 -->
      <!-- 分页  -->
      <zt-pagination :page-size="pageSize" :total="total"
                     @change="handlePgChange"></zt-pagination>
    </div>

    <zt-dialog appendToBody="" title="附件列表" :visible.sync="dialogVisible" sizeClass="middle">
      <div style="padding: 20px;">
      <zt-table
        :data="currentAttachList"
        ref="multitable"
        :height="360"
        border>
        <zt-column width="120" label="序号">
          <template slot-scope="scope">
            {{orderIndex(scope)}}
          </template>
        </zt-column>
        <zt-column width="320" label="附件列表" align="center" >
          <template slot-scope="scope">
            <div>
              <hb-file-download-preview :item="scope.row" :ellipsis="false" style="display: inline-block;vertical-align: top;width:280px;"></hb-file-download-preview>
              <preview-plugin v-if="scope.row.fileUrl" :item="scope.row" :noTable="true" style="display: inline-block;vertical-align: top;"></preview-plugin>
            </div>
          </template>
        </zt-column>
      </zt-table>
      </div>
    </zt-dialog>
  </div>
</template>

<script>
  import polluteAsourceFileHttp from '@/https/pollute/polluteAsourceFileHttp'
  import mapPollutePublicHttp from '@/https/map/mapPollutePublicHttp'
  import aSourceFileHttp from '@/https/pollute/aSourceFile/aSourceFileHttp'
  import hbFileDownloadPreview from '@/components/_public/hbFileDownloadPreview.vue'
  import PreviewPlugin from '@/components/_public/previewPlugin'

  export default {
    data() {
      return {
        dataList: [],
        pageSize: 10,
        pageNo: 1,
        gasWantotal: 0,
        smallpagination: false,
        dialogVisible: false,
        currentAttachList: []
      }
    },
    components: {
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
      showAttachList(data){
        console.log('currentAttachList:', data)
        this.currentAttachList = []
        this.currentAttachList = data
        this.dialogVisible = true
      },
      handlePgChange(pageNo, pageSize) {
        this.pageNo = pageNo;
        this.pageSize = pageSize;
        this.getPunishBySopId()
      },
      getPunishBySopId() {
        let params = {
          sopId: this.itemData.id,
          page: this.pageNo,
          size: this.pageSize
        }
        aSourceFileHttp.pollutantPunishPageList(params)
          .then(res => {
            console.log('punishmentDateList:', res)
            this.dataList = res.result.data
            this.pageNo = res.result.currentPage
            this.pageSize = res.result.size
            this.gasWantotal = res.result.total
            console.log(this.dataList)
          })
      },
      // 处罚类型转换
      formatterType(type){
        if(type == '001'){
          return '罚款'
        } else if(type == '002') {
          return '移送'
        } else if(type == '003') {
          return '未申报'
        } else if(type == '004') {
          return '停产限产'
        } else if(type == '005') {
          return '查扣没收'
        } else if(type == '006') {
          return '期限整改'
        } else if(type == '007') {
          return '警告'
        } else if(type == '008') {
          return '其他'
        }
      },
      orderIndex(scope) {
        return (this.pageNo - 1) * this.pageSize + scope.$index + 1;
      },
    },
  }
</script>
<style>
  .emptyList{
    width: 100%;
    height: 100%;
    text-align: center;
    line-height: 3;
    color: #999;
  }
  .nostyle {
    color: #333!important;
    text-decoration: none!important;
  }
</style>
