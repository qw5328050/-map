import CustomAlarmLayerHandle from '@/map/js/handle/customAlarmLayerHandle'

class CustomMapEvtHandle {

  constructor(options){
    // 事件监听
    this.$mapEvtBus = options.$mapEvtBus
    this.mapObj = options.mapObj
    // 切换时，不重新渲染的图层
    this.excludeTypeCode = ['jichu']

    this.customAlarmLayerHandle = new CustomAlarmLayerHandle({
      mapEvtHandle: this,
      mapObj: this.mapObj
    })
    this.layerData = null
    this.addListener()
  }

  // 增加事件监听
  addListener() {
    if (this.$mapEvtBus) {
      this.$mapEvtBus.$on(mapUtil.EVT_NAME.map_showLayer, ({obj, layerData}) => {
        this.layerChange(obj)
        if (layerData) {
          this.layerData = layerData
        }
      })
      this.$mapEvtBus.$on(mapUtil.EVT_NAME.map_removeLayer, params => {
        this.layerChange(params)
      })
      this.$mapEvtBus.$on(mapUtil.EVT_NAME.map_showData, params => {
        this.mapObj.setFitExtent(params, window.SITE_CONFIG.map.extent)
        this.searchLayerHandle.showSearchDataInMap(params)
      })
    }
  }

  // 触发事件
  emitMapEvent() {
    if (this.$mapEvtBus) {
      this.$mapEvtBus.$emit.apply(undefined, arguments)
    }
  }
}
