<template>
  <!-- 任务/事件列表 -->
  <zt-dialog class="zt-popbox-wrapper" appendToBody title="任务/事件列表" :visible.sync="visible" modal sizeClass="larger">
    <div class="grids-supervise">
      <zt-table
        :data="tableList">
        <zt-column prop="typeDesc" label="类型" align="left" width="100"></zt-column>
        <zt-column prop="time" label="创建时间" align="left" width="180"></zt-column>
        <zt-column prop="personName" label="创建人" align="left" width="100"></zt-column>
        <zt-column prop="groupName" label="创建单位" align="left" width="250"></zt-column>
        <zt-column prop="processType" label="监管结果" align="left" width="150">
          <template slot-scope="scope">
            <a href="javascript:void(0)" @click="showDetail(scope.row)" :class="scope.row.type == 'patrol' ? 'patrol' : 'default'">{{scope.row.hasOwnProperty('processType') ? scope.row.processType : '详情'}}</a>
          </template>
        </zt-column>
        <zt-column prop="problemType" label="问题类型" align="left" width="150"></zt-column>
        <zt-column prop="attachment" label="附件" align="left" width="150">
          <template slot-scope="scope">
            <div class="img-group" v-if="scope.row.attachment && scope.row.attachment.length > 0">
              <img :src="scope.row.attachment[0].fileUrl" alt="">
              <span class="num">{{scope.row.attachment.length}}</span>
            </div>
            <!-- <div class="no-img" v-else>
              <span class="no-img-tips">暂无<br>图片</span>
            </div> -->
          </template>
        </zt-column>
      </zt-table>
      <zt-pagination
        layout="total,prev, pager, next"
        :page-size="pageSize"
        :total="total"
        @change="handlePgChange">
      </zt-pagination>

      <task-detail-dialog ref="taskDetailDialog"></task-detail-dialog>
      <event-detail-dialog ref="eventDetailDialog"></event-detail-dialog>
<!--      <xunc-detail-dialog ref="xuncDetailDialog"></xunc-detail-dialog>-->
    </div>
  </zt-dialog>
</template>

<script>
  import mapGridHttp from '@/https/map/mapGridHttp'
  import TaskDetailDialog from './taskDetailDialog'
  import EventDetailDialog from './eventDetailDialog'
  import XuncDetailDialog from './xuncDetailDialog'

  export default {
    name: 'taskListDialog',
    components: {XuncDetailDialog, EventDetailDialog, TaskDetailDialog},
    data () {
      return {
        visible: false,
        pageSize: 6,
        pageNo: 1,
        total: 0,
        tableList: []
      }
    },
    methods: {
      init (params) {
        const {pollutionId, timeStamp} = params
        this.visible = true
        this.$nextTick(() => {
          this.getDataList(pollutionId, timeStamp)
        })
      },
      getDataList (pollutionId, timeStamp) {
        let params = {
          pollutionId: pollutionId,
          timeStamp: timeStamp,
          limit: this.pageSize || 6,
          page: this.pageNo || 1
        }
        mapGridHttp.getGridPollutionDataList(params).then((result) => {
          let dataList = result.data.data
          if (dataList && dataList.length > 0) {
            this.tableList = result.data.data
            this.total = result.data.total
          } else {
            this.tableList = []
            this.total = 0
          }
        })
      },
      handlePgChange (pageNo, pageSize) {
        this.pageNo = pageNo
        this.pageSize = pageSize
        this.getDataList()
      },
      showDetail (item) {
        let params = {
          id: item.id,
          gridTarget: item.gridTarget,
          type: item.type
        }
        if (item.type == 'task') {
          this.$refs.taskDetailDialog.init(params)
        }
        if (item.type == 'event') {
          this.$refs.eventDetailDialog.init(params)
        }
        // else {
        //   this.$refs.taskDetailDialog.init(params)
        // }
      }
    }
  }
</script>

<style scoped>
  .patrol {
    color: #333
  }
  a.patrol:hover {
    color: #333 !important;
  }
  .default {
    color: #0f97f6;
  }
</style>
