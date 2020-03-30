/**
 * 放射源图层处理
 */
import fsyHttp from '@/https/monitor/fsyHttp'
import FsyLayer from '../layer/fsyLayer'
import mapUtil from '@/map/js/util/mapUtil'

class FsyLayerHandle {
  
  constructor (options) {
    this.mapObj = options.mapObj
    this.mapEvtHandle = options.mapEvtHandle
    this.mapObj = options.mapObj
    this.fsyLayer = null
  }

  /**
   * 
   * @param options 
   */
  showDataInMap (options) {
    this.clear()
    if (options.checked) {
      this.initLayer()
      this.addDataInMap()
    }
  }

  clear () {
    this.removeLayer()
  }

  addDataInMap () {
    fsyHttp.getUnitList().then(result => {
      if (result.data && result.data.length > 0) {
        this.addDataToLayer(result.data)
      }
    })
  }
 
  addDataToLayer (data) {
    this.mapObj.showData({
      name: mapUtil.staticParams.fsy,
      data: data
    })
  }

  initLayer () {
    !this.fsyLayer && (this.fsyLayer = new FsyLayer({
      name: mapUtil.staticParams.fsy,
      map: this.mapObj
    }))
  }
  
  removeLayer () {
    this.mapObj.removeLayer({
      name: mapUtil.staticParams.fsy
    })
    this.fsyLayer = null
  }
}

export default FsyLayerHandle
