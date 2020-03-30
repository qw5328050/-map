/**
 * Created by fp on 2018/12/20.
 */
import ol from '../../ol_extend'
import VectorLayer from '../layer/vectorLayer'
import util from '../util/util'
import store from '@/store'

// 每一秒经度相当于30.92米
const DragRadiusInteraction_M = 30.92

const DragRadiusInteraction = function (opt_options) {
  this.options = opt_options
  this.featureCoord = opt_options.center
  this.map = opt_options.map
  this.olMap = this.map.olMap
  this.type_ = 'dragRadius'
  this.dragPan = null
  this.draggingStatus = false
  this.radius = opt_options.radius !== undefined ? opt_options.radius : 40000
  if (this.radius < 1000) {
    this.radius = 1000
  }
  this.getDragPanInteraction()
  this.pointLayer = new VectorLayer({
    map: this.map,
    styleFunction: function () {
      return {
        styleType: 'polygon',
        strokeColor: '#158bf3',
        fillColor: 'rgba(21,139,243,.2)',
        strokeWeight: '1'
      }
    }
  })
  this.map.addExcludeFocusLayer(this.pointLayer)
  this.initRadius({
    radius: this.radius
  })
  this.dragListenerKeys_ = []
  this.dragger = new ol.pointer.PointerEventHandler(this.searchTipElement.querySelector('.nearby-drag-btn'))

  ol.events.listen(this.dragger, ol.pointer.EventType.POINTERDOWN,
    this.handleDraggerStart, this)
/*  ol.events.listen(this.dragger, ol.pointer.EventType.POINTERMOVE,
    this.handleDraggerDrag, this);
  ol.events.listen(this.dragger, ol.pointer.EventType.POINTERUP,
    this.handleDraggerEnd, this); */
}
ol.inherits(DragRadiusInteraction, ol.Object)

DragRadiusInteraction.prototype.getDragPanInteraction = function () {
  let interactions = this.olMap.getInteractions().getArray()
  interactions.some(item => {
    if (item instanceof ol.interaction.DragPan) {
      this.dragPan = item
      return true
    } else {
      return false
    }
  })
}

DragRadiusInteraction.prototype.initRadius = function (options) {
  let that = this
  // 显示半圆
  let lonDis = this.getLatLonByMete(options.radius)
  lonDis = parseFloat(lonDis)
  this.cir = new ol.geom.Circle(this.featureCoord, lonDis)
  let circleGeomFeature = new ol.Feature(this.cir)
  this.pointLayer.getLayer().getSource().addFeature(circleGeomFeature)
  that.olMap.getView().setCenter(this.featureCoord)
  this.searchTipElement = document.createElement('div')
  this.searchTipElement.innerHTML = this.getTipOverlayHtml()
  this.searchTipOverlay = new ol.Overlay({
    id: 'searchTip',
    element: this.searchTipElement,
    offset: [-17, 0],
    positioning: 'center-center'
  })
  this.olMap.addOverlay(this.searchTipOverlay)
  window.setTimeout(() => {
    this.addOverlayClose()
  }, 100)
  that.searchTipOverlay.setPosition([this.featureCoord[0] + lonDis, this.featureCoord[1]])
  this.emitUpdateRadius()
  this.moveToCenter()
}

DragRadiusInteraction.prototype.getTipOverlayHtml = function () {
  let radiusText = this.formatRadius(this.radius)
  return `<div class="nearby-range">
        <span class="nearby-drag-btn"></span>
        <span class="nearby-distance">${radiusText}</span>
        <a href="javascript:void(0)" class="btn btn-primary btn-sm close-btn">关闭</a>
    </div>`
}

DragRadiusInteraction.prototype.formatRadius = function (radius) {
  let radiusString = ''
  if (radius >= 1000) {
    radiusString = parseFloat(parseFloat(radius) / 1000).toFixed(2).toString()
    const arr = radiusString.split('.')
    if (arr[1] === '00') {
      radiusString = arr[0]
    } else if (arr[1][1] === '0') {
      radiusString.substr(0, radiusString.length - 1)
    }
    radiusString += '公里'
  } else {
    radiusString = radius.toString() + '米'
  }
  return radiusString
}

DragRadiusInteraction.prototype.updateRadiusText = function () {
  this.searchTipElement.querySelector('.nearby-distance').innerHTML = this.formatRadius(this.radius)
}

DragRadiusInteraction.prototype.addOverlayClose = function () {
  const self = this
  this.searchTipElement.querySelector('.close-btn').addEventListener('click', function () {
    store.commit('map/updataRelatedAnalysis', true)
    self.destroy()
    self.options.endCallback && self.options.endCallback()
  })
}

DragRadiusInteraction.prototype.emitUpdateRadius = function () {
  this.options.updateCallback && this.options.updateCallback({
    center: this.featureCoord,
    radius: this.radius
  })
}

DragRadiusInteraction.prototype.moveToCenter = function () {
  let lon = parseFloat(this.getLatLonByMete(this.radius))
  let extent = [this.featureCoord[0] - lon, this.featureCoord[1] - lon,
    this.featureCoord[0] + lon, this.featureCoord[1] + lon]
  this.olMap.getView().fit(extent, {
    padding: [10, 40, 10, 400],
    constrainResolution: false
  })
}

DragRadiusInteraction.prototype.destroy = function () {
  this.map.removeLayer(this.pointLayer)
  this.olMap.removeOverlay(this.searchTipOverlay)
}

DragRadiusInteraction.prototype.handleDraggerStart = function (evt) {
  let that = this
  console.log('handleDraggerStart')
  that.dragPan.setActive(false)
  this.draggingStatus = true
  if (this.dragListenerKeys_.length === 0) {
    this.dragListenerKeys_.push(
      ol.events.listen(document, ol.events.EventType.MOUSEMOVE, this.handleDraggerDrag, this),
      ol.events.listen(document, ol.events.EventType.TOUCHMOVE, this.handleDraggerDrag, this),
      ol.events.listen(document, ol.pointer.EventType.POINTERMOVE, this.handleDraggerDrag, this),
      ol.events.listen(document, ol.events.EventType.MOUSEUP, this.handleDraggerEnd, this),
      ol.events.listen(document, ol.events.EventType.TOUCHEND, this.handleDraggerEnd, this),
      ol.events.listen(document, ol.pointer.EventType.POINTERUP, this.handleDraggerEnd, this)
    )
  }
}

DragRadiusInteraction.prototype.handleDraggerDrag = function (evt) {
  let that = this
  if (this.draggingStatus) {
    let evtCoordinate = that.olMap.getEventCoordinate(evt)
    let radiusLon = Math.abs(evtCoordinate[0] - this.featureCoord[0])
    let radiusMete = parseInt(this.getMeteByLon(radiusLon))
    if (radiusMete < 970) {
      return
    } else if (radiusMete >= 970 && radiusMete <= 1030) {
      radiusMete = 1000
    }
    this.radius = radiusMete
    this.cir.setRadius(radiusLon)
    // 设置文本框显示的距离
    this.updateRadiusText()
    that.searchTipOverlay.setPosition([evtCoordinate[0], this.featureCoord[1]])
  }
}

DragRadiusInteraction.prototype.handleDraggerEnd = function (evt) {
  let that = this
  console.log('handleDraggerEnd')
  if (this.draggingStatus) {
    that.dragPan.setActive(true)
    this.draggingStatus = false
    this.emitUpdateRadius()
    this.moveToCenter()
  }
  if (this.dragListenerKeys_.length > 0) {
    this.dragListenerKeys_.forEach(ol.events.unlistenByKey)
    this.dragListenerKeys_.length = 0
  }
}

/**
 * 将米的距离换算成经度的距离
 * @param mete
 */
DragRadiusInteraction.prototype.getLatLonByMete = function (mete) {
  let lonDis = (mete / (DragRadiusInteraction_M * 3600)).toFixed(8)
  return lonDis
}

/**
 * 将经度的距离换算成米的距离
 * @param mete
 */
DragRadiusInteraction.prototype.getMeteByLon = function (lon) {
  let mete = lon * (DragRadiusInteraction_M * 3600)
  return mete
}

export default DragRadiusInteraction
