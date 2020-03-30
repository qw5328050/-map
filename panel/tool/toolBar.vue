<template>
  <!-- 工具条容器 -->
  <div class="tool-wrapper filter">
    <!-- 工具条 -->
    <div class="tool-box">
      <div class="tool-item" :class="{cur: type===1}" @click="selectLayer(1)">
        <div class="region-name">{{curDivisionName}}</div>
        <span class="iconfont arrow">&#xe64f;</span>
      </div>
      <div class="tool-item" :class="{cur: type===2}" @click="selectLayer(2)">
        <span class="iconfont">&#xe669;</span>图层
      </div>
      <div class="tool-item" :class="{cur: type===3}" @click="selectLayer(3)">
        <span class="iconfont">&#xe66c;</span>排名
      </div>
      <div class="tool-item" :class="{cur: type===4}" @click="selectLayer(4)">
        <span class="iconfont">&#xe630;</span>设置
      </div>
    </div>
    <!-- 筛选内容 -->
    <div class="tool-filter-content" v-zt-clickoutside="close">
      <div :class="{dis_none: showLayer === false}">
        <region-panel :class="{dis_none: type!==1}" @close="close" @pickCb="regionPickCb"></region-panel>
        <layer-panel ref="layerPanel" :showShik="showShik"
                     :class="{dis_none: type!==2}" @close="close" @pickCb="layerPickCb"></layer-panel>
        <ranking-panel :class="{dis_none: type!==3}" @close="close" @pickCb="rankPickCb"></ranking-panel>
        <setting-panel :class="{dis_none: type!==4}" @close="close" @pickCb="settingPickCb"></setting-panel>
      </div>
    </div>
  </div>
</template>

<script>
  import RegionPanel from './regionPanel'
  import RankingPanel from './rankingPanel'
  import LayerPanel from './layerPanel'
  import CountPanel from './countPanel'
  import mapUtil from '@/map/js/util/mapUtil'
  import SettingPanel from './settingPanel'

  export default {
    name: 'tool-bar',
    components: {SettingPanel, CountPanel, LayerPanel, RankingPanel, RegionPanel},
    props: {
      //是否显示市控
      showShik: {
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        type: 1, // 1: 区域 2：图层 3：排名 4：计数,
        showLayer: false,
        curDivisionName: ''
      }
    },
    mounted () {
      if (this.$mapEvtBus) {
        this.$mapEvtBus.$on('tool_setSelected', params => {
        });
        this.$mapEvtBus.$on('tool_showPanel', params => {
          this.showLayer = true
        });
        this.$mapEvtBus.$on('tool_hidePanel', params => {
          this.close()
        });

        this.$mapEvtBus.$on(mapUtil.EVT_NAME.tool_showShik, params => {
          this.$refs.layerPanel.showShikPoint();
        })
      }
    },
    beforeDestroy() {
      this.$mapEvtBus.$off('tool_setSelected');
      this.$mapEvtBus.$off('tool_showPanel');
      this.$mapEvtBus.$off('tool_hidePanel');
      this.$mapEvtBus.$off(mapUtil.EVT_NAME.tool_showShik);
    },
    methods: {
      // 行政区划选择回调
      regionPickCb (val) {
        this.curDivisionName = val.divisionName
//        this.$emit('divisionChange', val)
        this.divisionChange(val)
      },
      // 图层选择回调
      layerPickCb (val, classCode, typeCode, layerData) {
        this.layerChange({
          obj: val,
          classCode,
          typeCode,
          layerData
        })
//        this.$emit('layerChange', val, classCode, typeCode)
      },
      // 排名选择回调
      rankPickCb (val) {
        console.log('rank======' + JSON.stringify(val))
      },
      // 设置选择回调
      settingPickCb (val) {
        console.log('setting======' + JSON.stringify(val))
        this.$mapEvtBus.$emit(mapUtil.EVT_NAME.map_updateMapSetting, val)
      },
      selectLayer (type) {
        this.type = type
        this.showLayer = true
      },
      close () {
        this.showLayer = false
      },
      divisionChange (params) {
        this.$mapEvtBus.$emit(mapUtil.EVT_NAME.map_showDivision, params)
      },
      layerChange (params) {
        this.$mapEvtBus.$emit(mapUtil.EVT_NAME.map_showLayer, params)
      }
    }
  }
</script>
