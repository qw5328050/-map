<template>
  <!-- 查看巡查详情 -->
  <zt-dialog class="zt-popbox-wrapper" appendToBody title="巡查详情" :visible.sync="visible" modal sizeClass="larger">
    <div class="grids-supervise">
      <div class="mb_15">
        <h3 class="form-item-name">巡查信息</h3>
        <table class="table small-padding table-bordered light-blue-th">
          <tr>
            <th style="width:20%;">所在网格</th>
            <td style="width:30%;">{{data.gridName}}</td>
            <th style="width:20%;">事件来源</th>
            <td style="width:30%;">{{data.caseSource}}</td>
          </tr>
          <tr>
            <th>问题类型</th>
            <td>{{data.problemType}}</td>
            <th>问题描述</th>
            <td>{{data.description}}</td>
          </tr>
          <tr>
            <th>上报人</th>
            <td>{{data.personName}}</td>
            <th>上报时间</th>
            <td>{{data.time}}</td>
          </tr>
          <tr>
            <th>电话号码</th>
            <td>{{data.mobile}}</td>
            <th>状态</th>
            <td>{{data.status}}</td>
          </tr>
          <tr>
            <th>地址</th>
            <td colspan="3">{{data.address}}</td>
          </tr>
          <tr>
            <th>补充说明</th>
            <td colspan="3">{{data.remark}}</td>
          </tr>
        </table>
      </div>

      <zt-table
        :data="detailData.task || []"
        :height="215">
        <zt-column prop="handleStep" label="处理环节" align="left" width="200"></zt-column>
        <zt-column prop="finishTime" label="完成期限" align="left" width="200"></zt-column>
        <zt-column prop="signTime" label="签收时间" align="left" width="200"></zt-column>
        <zt-column prop="time" label="处理时间" align="left" width="200"></zt-column>
        <zt-column prop="handler" label="处理人" align="left" width="200"></zt-column>
        <zt-column prop="groupName" label="处理单位" align="left" width="200"></zt-column>
        <zt-column prop="handleDesc" label="处理情况" align="left" width="200"></zt-column>
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
    name: 'xuncDetailDialog',
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
