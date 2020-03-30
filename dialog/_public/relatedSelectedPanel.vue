<template>
  <div class="display-content-panel zt-related-panel">
    <div class="panel-wrapper">
      <div class="panel-title">
        <h3 style="height:29px;">显示内容</h3>
      </div>
      <div class="panel-body">
        <ul class="list-wrapper">
          <li v-for="(item, index) in dataList" :key="index">
            <zt-checkbox v-model="item.checked" @change="val=>change(val, item)">{{item.label}}</zt-checkbox>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/jsx">
  import {objectAssign} from '@/utils/util'
  import mapUtil from '@/map/js/util/mapUtil'
  import baseDialog from '@/map/dialog/base/baseDialog'

  function airData() {
    return [{
      type: 'bzz',
      label: '标准站',
      checked: true
    }, {
      type: 'feiq',
      label: '工业废气',
      checked: true
    }, {
      type: 'wpqy',
      label: '污普企业',
      checked: true
    }, {
      type: 'fengc',
      label: '风场',
      checked: false
    }
    ]
  };
  function waterData() {
    return [
      {
        type: 'feis',
        label: '工业废水',
        checked: true
      }, {
        type: 'wscl',
        label: '污水处理厂',
        checked: true
      }, {
        type: 'wpqy',
        label: '污普企业',
        checked: true
      }
    ]
  };
  export default {
    mixins: [baseDialog],
    data(){
      return {
        dataList: []
      }
    },
    mounted(){
      let data = [];
      let type = this.itemData.type;
      if (type === 'hldm') {
        data = waterData();
      } else {
        data = airData();
      }
      this.dataList = data;
      window.setTimeout(() => {
        this.$mapEvtBus.$emit(mapUtil.EVT_NAME.map_updateRelatedSelected, {
          all: this.dataList
        });
      }, 1000);
    },
    methods: {
      change(checked, item){
        this.$nextTick(() => {
          this.$mapEvtBus.$emit(mapUtil.EVT_NAME.map_updateRelatedSelected, {
            single: item,
            all: this.dataList
          });
        })
      }
    }
  }
</script>


<style type="text/css" scoped>
  .display-content-panel {
    width: 140px;
    top: auto;
    transform: inherit;
    position: absolute;
    bottom: 30px;
    right: 20px;
  }
</style>

