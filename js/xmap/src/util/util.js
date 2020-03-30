/**
 * Created by fp on 2017/11/16.
 */
import ol from '../../ol_extend'
const util = {};

util.EPSG4326Obj = ol.proj.get('EPSG:4326');
util.EPSG4326Str = 'EPSG:4326';

util.EPSG3857Obj = ol.proj.get('EPSG:3857');
util.EPSG3857Str = 'EPSG:3857';

util.console = function (msg) {
  console.log(msg);
};

util.error = function (msg) {
  console.error(msg);
};

util.getGeomJsonFormat = function () {
  return new ol.format.GeoJSON({defaultDataProjection: "EPSG:4326"})
};

util.wkt = new ol.format.WKT();

util.checkPosLegal = function (lon, lat) {
  if (isNaN(parseFloat(lon)) || isNaN(parseFloat(lat))) {
    return false;
  }
  let longFloat = parseFloat(lon);
  let latiFloat = parseFloat(lat);
  if (longFloat > 180 || longFloat < -180) {
    return false;
  }
  if (latiFloat > 90 || latiFloat < -90) {
    return false;
  }
  return true;
};

util.formatPos = function (point) {
  console.log("util_point:",point);
  if (isNaN(parseFloat(point[0])) || isNaN(parseFloat(point[1]))) {
    return false;
  }
  return [parseFloat(point[0]), parseFloat(point[1])];
};


util.getFeatureFromPoint = function (lon, lat, fromProj, toProj) {
  if (util.checkPosLegal(lon, lat)) {
    let longFloat = parseFloat(lon);
    let latiFloat = parseFloat(lat);
    if (longFloat === 0 || latiFloat === 0) {
      return undefined;
    }
    let geomPoint = new ol.geom.Point([longFloat, latiFloat]);
    return new ol.Feature(util.transformGeomProj(geomPoint, fromProj, toProj));
  }
  return undefined;
};


util.getFeatureFromCircle = function (center, radiusDegree, fromProj, toProj) {
  let lng = center[0], lat = center[1];
  if (util.checkPosLegal(lng, lat)) {
    let longFloat = parseFloat(lng);
    let latiFloat = parseFloat(lat);
    if (longFloat === 0 || latiFloat === 0) {
      return undefined;
    }
    let geom = new ol.geom.Circle([longFloat, latiFloat], radiusDegree);
    return new ol.Feature(util.transformGeomProj(geom, fromProj, toProj));
  }

};

util.getFeatureFromWkt = function (geometryStr, fromProj, toProj) {
  let format = new ol.format.WKT();
  let geom = format.readGeometry(geometryStr);
  return new ol.Feature({
    geometry: util.transformGeomProj(geom, fromProj, toProj)
  });
};

util.transformGemo2Str = function (geometry, fromProj, toProj) {
  let format = new ol.format.WKT();
  return format.writeGeometry(geometry);
};


util.getFeatureFromGeom = function (geometry, fromProj, toProj) {
  return new ol.Feature({
    geometry: util.transformGeomProj(geometry, fromProj, toProj)
  });
};

util.getFilterFromWKT = function (filterGeom, toProj) {
  let filterFeature = util.getFeatureFromWkt(filterGeom,
    util.EPSG4326Obj, toProj);
  return new ol.filter.Crop({
    feature: filterFeature,
    inner: false
  });
};

util.getFeatureFromLineGeometry = function (geometryArray) {
  let lineStringGeom = new ol.geom.LineString(geometryArray);
  return new ol.Feature({
    geometry: lineStringGeom
  });
};

util.transformGeomProj = function (geometry, fromProj, toProj) {
  return geometry.clone().transform(fromProj, toProj);
};

util.transformPointT4326 = function (coordinate, fromProj) {
  if (fromProj.getCode() === util.EPSG4326Obj.getCode()) {
    return coordinate;
  } else {
    return ol.proj.transform(coordinate, fromProj, util.EPSG4326Obj);
  }
};

util.transformPointF4326 = function (coordinate, toProj) {
  if (toProj.getCode().toUpperCase() === util.EPSG4326Obj.getCode()) {
    return util.formatPos(coordinate);
  } else {
    return ol.proj.transform(util.formatPos(coordinate), util.EPSG4326Obj, toProj);
  }
};

util.transformPointProj = function (coordinate, fromProj, toProj) {
  if (fromProj.getCode() === toProj.getCode()) {
    return util.formatPos(coordinate);
  }
  return ol.proj.transform(util.formatPos(coordinate), fromProj, toProj);
};

util.supportFullScreen = function () {
  let body = document.body;
  return !!(
    body.webkitRequestFullscreen ||
    (body.mozRequestFullScreen && document.mozFullScreenEnabled) ||
    (body.msRequestFullscreen && document.msFullscreenEnabled) ||
    (body.requestFullscreen && document.fullscreenEnabled)
  );
};

util.requestFullScreen = function (element) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  }
};

/**
 * Exit fullscreen.
 */
util.exitFullScreen = function () {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
};

util.animate = function (map, opt_options) {
  let newCenter = opt_options.newCenter;
  let pan = map.getView().animate(
    {
      duration: 400
    },
    {
      center: newCenter
    }
  );
};

util.getArcPoints = function getArcPoints(center, radius, startAngle, endAngle) {
  let x = null,
    y = null,
    pnts = [],
    angleDiff = endAngle - startAngle;
  angleDiff = angleDiff < 0 ? angleDiff + Math.PI * 2 : angleDiff;
  for (let i = 0; i <= 100; i++) {
    let angle = startAngle + angleDiff * i / 100;
    x = center[0] + radius * Math.cos(angle);
    y = center[1] + radius * Math.sin(angle);
    pnts.push([x, y]);
  }
  return pnts;
};


util.getWktFromRadius = function (center, radius) {
  let lon = util.transformMi2Degree(radius);
  let pnts = util.getArcPoints(center, lon, 0, Math.PI * 2);
  const polygon = new ol.geom.Polygon([pnts]);
  let format = new ol.format.WKT();
  return format.writeGeometry(polygon);
};

util.justiceInRadius = function (wkt, center, radius) {
  let geometry = null;
  let circleGeo = new ol.geom.Circle(center, util.transformMi2Degree(radius));
  let retBoolean = false;
  try {
    geometry = util.wkt.readGeometry(wkt);
    geometry.getCoordinates().forEach(item => {
      if (item instanceof Array) {
        item.some(detailItem => {
          if (circleGeo.intersectsCoordinate(detailItem)) {
            retBoolean = true;
            return true;
          } else {
            return false;
          }
        });
      }

    });
  } catch (e) {
  }
  return retBoolean;
};

util.MP = (2 * Math.PI * 6378137.0) / 360;
util.transformMi2Degree = function (meter) {
  return meter / util.MP;
};

util.transformPixel2Degree = function (pixel, resolution) {
  return resolution * pixel;
};

util.transformMi2Pixel = function (meter, resolution) {
  let degree = util.transformMi2Degree(meter);
  return degree / resolution;
};

util.distance = function (p1, p2) {
  let wgs84Sphere = new ol.Sphere(6378137);
  let length = wgs84Sphere.haversineDistance(p1, p2);
  return Math.round(length * 100) / 100;
};
/**
 * 将经纬度换成所需的
 * @param point
 */
util.transformPoint = function (point, code) {
  if (code === undefined || code === util.EPSG4326Str) {
    return [parseFloat(point[0]), parseFloat(point[1])];
  } else {
    return ol.proj.transform([parseFloat(point[0]), parseFloat(point[1])],
      util.EPSG4326Str, util.EPSG3857Str);
  }
};


util.fitExtent = function (map, pointList, maxExtent) {
  if (!pointList || pointList.length === 0) {
    return;
  }
  if (pointList.length === 1) {
    map.getView().setCenter(pointList);
  } else {
    let maxLatitude = -Infinity, maxLongitude = -Infinity, minLatitude = Infinity, minLongitude = Infinity;
    this.overLayArray.forEach(function (coordinate) {
      if (maxLatitude < coordinate[1]) {
        maxLatitude = coordinate[1];
      }
      if (minLatitude > coordinate[1]) {
        minLatitude = coordinate[1];
      }
      if (maxLongitude < coordinate[0]) {
        maxLongitude = coordinate[0];
      }
      if (minLongitude > coordinate[0]) {
        minLongitude = coordinate[0];
      }
    });
    if (maxExtent) {
      //如果显示的区域超过范围，不进行缩放控制
      if (minLongitude > maxExtent[2] || minLatitude > maxExtent[3] || maxLongitude < maxExtent[0] || maxLatitude < maxExtent[1]) {
        return;
      }
      if (minLongitude < maxExtent[0]) {
        minLongitude = maxExtent[0];
      }
      if (minLatitude < maxExtent[1]) {
        minLatitude = maxExtent[1];
      }
      if (maxLongitude > maxExtent[2]) {
        maxLongitude = maxExtent[2];
      }
      if (maxLatitude > maxExtent[3]) {
        maxLatitude = maxExtent[3];
      }
    }
    let disLongitude = maxLongitude - minLongitude, disLatitude = maxLatitude - minLatitude;
    let perLongitude = disLongitude / 6, perLatitude = disLatitude / 6;
    map.getView().fit([minLongitude - perLongitude, minLatitude - perLatitude,
      maxLongitude + perLongitude, maxLatitude + perLatitude], map.getSize());
  }
};

/**
 * 判断是否为空
 * @param val
 */
util.isEmpty = function (val) {
  return (val === undefined || val === null || util.trim(val) === '');
};


util.trim = function (str) {
  return str.toString().replace(/s/g, "");
};

util.preloadImage = function (src, succCallback, failCallback) {
  if (typeof src != 'string') {// src不是string,返回
    if (typeof failCallback === 'function') {
      failCallback();
    }
  }
  let imgObj = new Image();
  imgObj.src = src;
  imgObj.onload = function () { //图片下载完毕时异步调用callback函数。
    if (typeof succCallback === 'function') {
      succCallback();
    }
  };
  imgObj.onerror = function () {
    if (typeof failCallback === 'function') {
      failCallback();
    }
  };
};

util.isInteger = function (val) {
  return Math.floor(val) === val;
};


util.isInArray = function (obj, arr) {
  let i = arr.length;
  while (i--) {
    if (arr[i] === obj) {
      return true;
    }
  }
  return false;
};

util.isInLayer = function (obj, arr) {
  let i = arr.length;
  while (i--) {
    if (arr[i].getLayer() === obj) {
      return true;
    }
  }
  return false;
};

util.indexInArray = function (val, array) {
  for (let i = 0; i < array.length; i++) {
    if (array[i] === val) return i;
  }
  return -1;
};

util.removeInArray = function (val, array) {
  let i = util.indexInArray(val, array);
  if (i > -1) {
    this.splice(i, 1);
  }
};
/**
 * 计算长度 单位（米）
 */
util.computeLength = function (line, map, tempParams) {
  let length = Math.round(line.getLength() * 100) / 100;
  return (Math.round(length * 100) / 100);
};

util.getTailedSquadCombat = function (points) {
  return new olPlot.Geometry.TailedSquadCombat([], points, {});
};

util.getClosedCurve = function (points) {
  return new olPlot.Geometry.ClosedCurve([], points, {});
};

util.ajax = function (params, callbackSuccess, callbackFail) {
  let requestObj = '';
  if (window.XMLHttpRequest) {
    requestObj = new XMLHttpRequest();
  } else {
    requestObj = new ActiveXObject;
  }
  let sendData = '';
  if (params.type === 'POST') {
    sendData = JSON.stringify(params.data);
  }
  requestObj.open(params.type, params.url, true);
  requestObj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  requestObj.send(sendData);

  requestObj.onreadystatechange = function () {
    if (requestObj.readyState == 4) {
      if (requestObj.status == 200) {
        let obj = requestObj.response;
        if (typeof obj !== 'object') {
          obj = JSON.parse(obj);
        }
        callbackSuccess(obj)
      } else {
        callbackFail(obj);
      }
    }
  }
};

util.getPointerRange = function (dataList) {
  if (dataList.length <= 1) {
    return null;
  }
  let maxLongitude = -180, minLongitude = 180, maxLatitude = -90, minLatitude = 90;
  dataList.forEach(item => {
    let longitude = item.longitude, latitude = item.latitude;
    if (longitude < minLongitude) {
      minLongitude = longitude
    }
    if (longitude > maxLongitude) {
      maxLongitude = longitude
    }
    if (latitude < minLatitude) {
      minLatitude = latitude;
    }
    if (latitude > maxLatitude) {
      maxLatitude = latitude;
    }
  });
  return [minLongitude, minLatitude, maxLongitude, maxLatitude];
}

util.PlotType = {
  TEXTAREA: 'textArea',
  ARC: 'arc',
  CURVE: 'curve',
  GATHERING_PLACE: 'gatheringPlace',
  POLYLINE: 'polyline',
  FREEHANDLINE: 'freehandline',
  POINT: 'point',
  PENNANT: 'pennant',
  RECTANGLE: 'rectangle',
  CIRCLE: 'circle',
  ELLIPSE: 'ellipse',
  LUNE: 'lune',
  SECTOR: 'sector',
  CLOSED_CURVE: 'closedCurve',
  POLYGON: 'polygon',
  FREE_POLYGON: 'freePolygon',
  ATTACK_ARROW: 'attackArrow',
  DOUBLE_ARROW: 'doubleArrow',
  STRAIGHT_ARROW: 'straightArrow',
  FINE_ARROW: 'fineArrow',
  ASSAULT_DIRECTION: 'assaultDirection',
  TAILED_SQUAD_COMBAT: 'tailedSquadCombat',
  TAILED_ATTACK_ARROW: 'tailedAttackArrow',
  SQUAD_COMBAT: 'squad_combat',
  RECTFLAG: 'rectflag',
  TRIANGLEFLAG: 'triangleflag',
  CURVEFLAG: 'curveflag'
};

util.isDom = ( typeof HTMLElement === 'object' ) ?
  function (obj) {
    return obj instanceof HTMLElement;
  } :
  function (obj) {
    return obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string';
  };


export default util;
