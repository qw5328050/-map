/**
 * 自定义报警图层处理
 */
import VideoLayer from "./videoLayer";

class VideoAlarmLayer extends VideoLayer {

  getPicStyle (itemData, zoom, resolution, point, params) {
    return [{
      styleType: 'icon',
      scale: this.getScale(zoom),
      src: this.getPicPath(itemData, params.id)
    }]
  }

  getSelectedPicStyle (itemData, zoom, resolution, point, params) {
    return [{
      styleType: 'icon',
      scale: this.getSelectedScale(zoom),
      src: this.getPicPath(itemData, params.id)
    }]
  }

  getPicPath (itemData, id) {
    return this.imgPrePath + '/mapImg/video/2.png'
  }

  getScale(zoom) {
    let scale = 0.8
    if (zoom < 1) {
      scale = 0.5
    } else if (zoom >= 1 && zoom < 2) {
      scale = 0.55
    } else if (zoom >= 2 && zoom < 3) {
      scale = 0.6
    } else if (zoom >= 3 && zoom < 4) {
      scale = 0.65
    } else if (zoom >= 4 && zoom < 5) {
      scale = 0.7
    } else if (zoom >= 5 && zoom < 6) {
      scale = 0.75
    } else if (zoom >= 6 && zoom < 7) {
      scale = 0.8
    }
    return scale
  }

  getSelectedScale(zoom) {
    let scale = 0.9
    if ( zoom < 1) {
      scale = 0.6
    } else if (zoom >= 1 && zoom < 2) {
      scale = 0.65
    } else if (zoom >= 2 && zoom < 3) {
      scale = 0.7
    } else if (zoom >= 3 && zoom < 4) {
      scale = 0.75
    } else if (zoom >= 4 && zoom < 5) {
      scale = 0.8
    } else if (zoom >= 5 && zoom < 6) {
      scale = 0.85
    } else if (zoom >= 6 && zoom < 7) {
      scale = 0.9
    }
    return scale
  }
}

export default VideoAlarmLayer
