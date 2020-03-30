<template>
  <!-- 任务详情 -->
  <zt-dialog class="zt-popbox-wrapper" appendToBody title="任务详情" :visible.sync="visible" modal sizeClass="larger">
    <div class="grids-supervise">
      <div class="task-detail-wrapper">
        <div class="task-detail-list">
          <div class="task-detail-left">
            <ul>
              <li><label>任务类型：</label>{{data.type}}</li>
              <li><label>任务站点：</label>{{data.name}}</li>
              <li><label>创建单位：</label>{{data.groupName}}</li>
              <li><label>创建人：</label>{{data.personName}}</li>
              <li><label>创建时间：</label>{{data.time}}</li>
              <li><label>任务期限：</label>{{data.finishTime}}</li>
            </ul>
          </div>
          <div class="task-detail-right">
            <div class="task-des" style="height: 83px">
              <dl>
                <dt>任务说明</dt>
                <dd>{{data.description}}</dd>
              </dl>
            </div>
            <zt-table
              :data="detailData.dispatch || []"
              width="550px"
              height="135">
              <zt-column prop="handler" label="接收对象" align="left" width="200"></zt-column>
              <zt-column prop="handleStatus" label="处理状态" align="left" width="150"></zt-column>
              <zt-column prop="handleTime" label="处理时间" align="left" width="200"></zt-column>
            </zt-table>
          </div>
        </div>
      </div>
      <h3 class="form-item-name">处理流程</h3>
      <zt-table
        :data="detailData.task || []"
        height="150">
        <zt-column prop="handleTime" label="时间" align="left" width="200"></zt-column>
        <zt-column prop="divName" label="所属区域" align="left" width="200"></zt-column>
        <zt-column prop="handler" label="操作人" align="left" width="200"></zt-column>
        <zt-column prop="handleStep" label="操作" align="left" width="200"></zt-column>
        <zt-column prop="handleDesc" label="详情" align="left" width="200"></zt-column>
        <zt-column prop="attachment" label="附件" align="left" width="100">
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
    </div>
  </zt-dialog>
</template>

<script>
  import mapGridHttp from '@/https/map/mapGridHttp'

  export default {
    name: 'taskDetailDialog',
    data () {
      return {
        visible: false,
        data: {},
        detailData: {}
      }
    },
    methods: {
      init (params) {
        const {pollutionId, id, gridTarget, type} = params
        this.visible = true
        this.$nextTick(() => {
          this.getData(pollutionId, id, gridTarget, type)
          this.getDetailData(id, type)
        })
      },
      getData (pollutionId, id, gridTarget, type) {
        const params = {
          pollutionId: pollutionId,
          id: id,
          gridTarget: gridTarget,
          type: type
        }
        mapGridHttp.getGridDataInfo(params).then((result) => {
          this.data = result.data
        })
      },
      getDetailData (id, type) {
        const params = {
          id: id,
          type: type
        }
        mapGridHttp.getGridPollutionDataDetail(params).then((result) => {
          this.detailData = result.data
        })
      }
    }
  }
</script>

<style scoped>

</style>
