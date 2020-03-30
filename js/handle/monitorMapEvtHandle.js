/**
 * Created by fp on 2019/1/15.
 */
import moment from 'moment'
import mapUtil from '@/map/js/util/mapUtil'
import MapEvtHandle from './mapEvtHandle'

class MonitorMapEvtHandle extends MapEvtHandle {
  constructor (options) {
    super(options)
    this.dateType = 'hour'
    this.factorName = ''
    this.airFactorName = mapUtil.defaultParams.jiezFactor
    this.selectedLayer = null
    this.addExtendListener()
  }

  // 增加更多的监听
  addExtendListener () {
    if (this.$mapEvtBus) {
      this.$mapEvtBus.$on(mapUtil.EVT_NAME.map_updateMonitorDateType, dateType => {
        this.dateType = dateType
        this.updateAllSelected()
      })

      this.$mapEvtBus.$on(mapUtil.EVT_NAME.map_updateMonitorFactorName, factorName => {
        this.factorName = factorName
        // this.moveCarLayerHandle.refresh();
        this.updateAllSelected()
      })

      this.$mapEvtBus.$on(mapUtil.EVT_NAME.map_showMonitorLayer, ({item, selectList, airFactorName}) => {
        // console.log('==item==')
        // console.log(item)
        // console.log('==selectList==')
        // console.log(selectList)
        // console.log('==airFactorName==')
        // console.log(airFactorName)
        if (airFactorName) {
          this.airFactorName = airFactorName
        } else {
          this.airFactorName = mapUtil.defaultParams.jiezFactor
        }
        if (item.code === 'wrkqc') {
          this.airAlarmType = 'wrkqc1'
        }
        let codeArr = []
        selectList.forEach(obj => {
          if (mapUtil.airAlarmTypeList.indexOf(obj.code) >= 0) {
            codeArr.push(obj.code)
          }
        })
        item.codes = codeArr.join(',')
        this.layerChange(item)
        this.selectedLayer = selectList
      })

      this.$mapEvtBus.$on(mapUtil.EVT_NAME.map_showAirMonitorLayer, ({item, airFactorName}) => {
        this.airFactorName = airFactorName
        this.layerChange(item)
      })

      this.$mapEvtBus.$on(mapUtil.EVT_NAME.map_updateMonitorAirFactorName, params => {
        this.airFactorName = params.factorName
        this.layerChange(params)
      })

      this.$mapEvtBus.$on(mapUtil.EVT_NAME.map_showYunTuDetail, position => {
        this.showYunYuDialog(position, this.getAirDateType())
      })
    }
  }

  showYunYuDialog (position, dateType) {
    let layer = this.airLayerHandle.getYunTuLayer(position)
    if (layer) {
      mapUtil.getYunTuDetail(position, layer.layer, this.mapObj.map.olMap.getView().getResolution()).then(params => {
        this.$mapEvtBus.$emit(mapUtil.EVT_NAME.dialog_showDialog, {
          type: mapUtil.pmPoint,
          id: params.id,
          position: position,
          dateType: dateType
        })

      })
    }
  }

  // 更新地图上的数据
  updateAllSelectedLayer () {
    this.updateAllSelected()
  }

  updateAllSelected () {
    this.selectedLayer && this.selectedLayer.forEach(item => {
      item.checked = true
      this.layerChange(item)
    })
  }

  getAirDateType () {
    if (this.dateType) {
      return this.dateType
    } else {
      return mapUtil.defaultParams.airDateType
    }
  }

  /**
   * 根据code类型（zhgc guok  shengk），获取选中的因子
   * @param code
   * @returns {*}
   */
  getSelectedFactorByCode (code) {
    let factor = 'aqi'
    if (mapUtil.normalTypeList.indexOf(code) >= 0) {
      if (this.airFactorName) {
        factor = this.airFactorName
      } else {
        factor = mapUtil.defaultParams.jiezFactor
      }
    } else if (mapUtil.pm1025TypeList.indexOf(code) >= 0) {
      if (this.factorName && mapUtil.pm1025.indexOf(this.factorName) >= 0) {
        factor = this.factorName
      } else {
        factor = mapUtil.defaultParams.monitorFactorName
      }
    } else if (mapUtil.weizZhgcList.indexOf(code) >= 0) {
      if (this.factorName) {
        factor = this.factorName
      } else {
        factor = mapUtil.defaultParams.monitorFactorName
      }
    } else if (mapUtil.airTypeList.indexOf(code) >= 0) {
      if (this.factorName) {
        factor = this.factorName
      } else {
        factor = mapUtil.defaultParams.jiezFactor
      }
    }
    return factor
  }

  // 获取日期
  getDate () {
    let dateType = this.getAirDateType()
    if (dateType === 'hour') {
      return moment().format('YYYY-MM-DD HH:00:00')
    } else if (dateType === 'day') {
      return moment().format('YYYY-MM-DD 00:00:00')
    } else if (dateType === 'month') {
      return moment().format('YYYY-MM-00 00:00:00')
    } else {
      return moment().format('YYYY-MM-DD HH:00:00')
    }
  }
}

export default MonitorMapEvtHandle
