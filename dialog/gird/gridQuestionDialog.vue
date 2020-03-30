<template>
  <div v-if="visible && hidePlane">
    <!-- 遮照层 -->
    <div class="modal"></div>
    <div class="popbox-wrapper">
      <div class="popbox popbox-size-default">
        <!-- 头部 -->
        <header class="popbox-header">
          <h3>问题详情</h3>
          <a href="javascript:void(0);" @click="close" class="iconfont close-popbox">&#xe601;</a>
        </header>
        <!-- body -->
        <div class="popbox-body">
          <div class="grids-supervise">
            <table class="table table-bordered small-padding light-blue-th">
              <tbody>
              <tr>
                <th style="width: 13%;">所属网格</th>
                <td style="width: 35%;">{{item.gridName}}</td>
                <th style="width: 16%;">事件来源</th>
                <td style="width: 36%;">{{item.caseSource}}</td>
              </tr>
              <tr>
                <th>问题类型</th>
                <td>{{item.problemType}}</td>
                <th>问题描述</th>
                <td>{{item.description}}</td>
              </tr>
              <tr>
                <th>上报人</th>
                <td>{{item.personName}}</td>
                <th>上报时间</th>
                <td>{{item.time}}</td>
              </tr>
              <tr>
                <th>电话号码</th>
                <td>{{item.mobile}}</td>
                <th>状态</th>
                <td>{{item.status}}</td>
              </tr>
              <tr>
                <th>地址</th>
                <td colspan="3">{{item.address}}
                </td>
              </tr>
              <tr>
                <th>补充说明</th>
                <td>{{item.remark}}</td>
                <th>事件编号</th>
                <td>{{item.id}}</td>
              </tr>
              <tr v-if="item.attachment && item.attachment.length > 0 ">
                <th>附件</th>
                <td colspan="3">
                  <hb-file-download-preview :item="item"
                                            style="display: inline-block;vertical-align: top;">
                  </hb-file-download-preview>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script type="text/jsx">
  import processMonitorHttp from '@/https/emergency/hpwe/process-monitor'
  import {objectAssign} from '@/utils/util'
  import mapUtil from '@/map/js/util/mapUtil'
  import baseDialog from '@/map/dialog/base/baseDialog'
  import hbFileDownloadPreview from '@/components/_public/hbFileDownloadPreview.vue'
  export default {
    data(){
      return {
        item: {},
        hidePlane: false
      }
    },
    components: {
      hbFileDownloadPreview,
    },
    mixins: [baseDialog],
    mounted(){
      this.$nextTick(() => {
        this.showDetail();
      })
    },
    methods: {
      showDetail(){
        processMonitorHttp.getGriddataDetail({
          id: this.itemData.id,
          type: this.itemData.type
        }).then(response => {
          this.item = response.result;
          this.hidePlane = true;
        })
      },
      show() {
        document.querySelector("body").appendChild(this.$mount().$el);
        this.visible = true;
      },
      close() {
        this.visible = false;
      }
    }
  }
</script>
