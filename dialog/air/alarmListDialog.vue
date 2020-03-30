<template>
  <div class="zt-popbox-wrapper" v-if="visible">
    <div class="modal"></div>
    <div class="popbox-wrapper _lc">
      <div class="popbox popbox-size-larger">
        <!-- 头部 -->
        <header class="popbox-header">
          <h3>{{itemData.name}}</h3>
          <a href="javascript:void(0);" @click="close" class="iconfont">&#xe601;</a>
        </header>
        <!-- body -->
        <div class="popbox-body">
          <div class="grids-supervise">
            <div class="table-list">
              <zt-table :data="dataList" ref="table" height="460">
                <zt-column prop="dateTime" width="180" label="数据时间">
                </zt-column>
                <zt-column prop="time" width="180" label="报警时间">
                </zt-column>
                <zt-column prop="content" contentAlign="left" width="200" label="报警消息">
                </zt-column>
                <zt-column prop="processStatus" width="180" label="消息处理情况">
                </zt-column>
                <zt-column prop="handleStatus" label="任务落实情况">
                </zt-column>
              </zt-table>
              <div class="more-info-wrapper">
                <a href="" @click.stop.prevent="handleMore">
                  <span class="iconfont">&#xe661;</span>查看更多报警消息</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/jsx">
  import mapUtil from '@/map/js/util/mapUtil'
  import baseDialog from '../base/baseDialog'
  import mapDialogHttp from '@/https/map/mapDialogHttp'
  export default {
    name: 'alarmListDialog',
    mixins: [baseDialog],
    data(){
      return {
        dataList: []
      }
    },
    created(){
      this.dataList = [];
    },
    methods: {
      show() {
        document.querySelector('body').appendChild(this.$mount().$el);
        this.visible = true;
        this.getData();
      },
      getData(){
        mapDialogHttp.findGasWarnByStationPagination({
          stationCode: this.itemData.code,
          dateType: this.itemData.dateType,
          page: 1,
          limit: 8
        }).then(result => {
          if (result.data) {
            this.dataList = result.data.data;
          } else {
            this.dataList = [];
          }
        })
      },
      close() {
        this.$mapEvtBus.$emit(mapUtil.EVT_NAME.panel_showPanel, {});
        document.querySelector('body').removeChild(this.$mount().$el);
        this.visible = false;
      },
      handleMore(){
        let url = window.location.href.replace('monitor', 'manage/message');
        window.open(url, '_blank');
      }
    }
  }
</script>

