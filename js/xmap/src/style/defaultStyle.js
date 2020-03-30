/**
 * Created by fp on 2017/9/21.
 * 默认样式库
 */
import ol from "../../ol_extend";
const defaultStyle = {};

defaultStyle.isArray = function (o) {
  return Object.prototype.toString.call(o) === '[object Array]';
};

//根据不同的样式类型与参数得到样式
defaultStyle.getStyleByType = function (styleParam, map, feature, resolution) {
  if (defaultStyle.isArray(styleParam)) {
    let styleArr = [];
    styleParam.forEach(function (item) {
      let firstChar = item.styleType.substr(0, 1).toUpperCase();
      let newStyleType = firstChar + item.styleType.substr(1);
      styleArr = styleArr.concat(defaultStyle['get' + newStyleType](item, map, feature, resolution));
    });
    return styleArr;
  } else if (JSON.stringify(styleParam) !== '{}') {
    let firstChar = styleParam.styleType.substr(0, 1).toUpperCase();
    let newStyleType = firstChar + styleParam.styleType.substr(1);
    return defaultStyle['get' + newStyleType](styleParam, map, feature, resolution);
  }
};

defaultStyle.defaultPolygon = {
  strokeColor: 'blue',
  fillColor: 'blue',
  strokeWeight: '2'
};

defaultStyle.getPolygon = function (styleParam) {
  let style = Object.assign({}, defaultStyle.defaultPolygon, styleParam);
  return [
    new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: style.strokeColor,
        width: style.strokeWeight
      }),
      fill: new ol.style.Fill({
        color: style.fillColor
      })
    })
  ];
};


defaultStyle.defaultLine = {
  strokeColor: 'blue',
  strokeWeight: '2'
};

defaultStyle.getLine = function (styleParam) {
  let style = Object.assign({}, defaultStyle.defaultLine, styleParam);
  return [
    new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: style.strokeColor,
        width: style.strokeWeight
      })
    })
  ];

};

defaultStyle.defaultCircle = {
  strokeColor: 'blue',
  fillColor: 'rgba(255, 255, 255, 0.5)',
  strokeWeight: 0,
  radius: 7
};

defaultStyle.getCircle = function (styleParam) {
  let style = Object.assign({}, defaultStyle.defaultCircle, styleParam);
  if (styleParam.strokeWeight === 0) {
    return [new ol.style.Style({
      image: new ol.style.Circle({
        radius: style.radius,
        fill: new ol.style.Fill({
          color: style.fillColor
        })
      })
    })];
  } else {
    return [new ol.style.Style({
      image: new ol.style.Circle({
        radius: style.radius,
        fill: new ol.style.Fill({
          color: style.fillColor
        }),
        stroke: new ol.style.Stroke({
          color: style.strokeColor,
          width: style.strokeWeight
        })
      })
    })];
  }
};


defaultStyle.defaultIcon = {
  anchor: [0.5, 1],
  scale: 1,
  opacity: 1,
  rotation: 0
};

defaultStyle.getIcon = function (styleParam) {
  let style = Object.assign({}, defaultStyle.defaultIcon, styleParam);
  return [new ol.style.Style({
    image: new ol.style.Icon(({
      scale: style.scale,
      anchor: style.anchor,
      src: style.src,
      size: style.size,
      offsetOrigin: style.offsetOrigin,
      offset: style.offset,
      opacity: style.opacity,
      rotation: style.rotation

    }))
  })];
};


defaultStyle.defaultText = {
  text: '',
  fontWeight: '500',
  fontFamily: '微软雅黑',
  fontSize: '14px',
  fillColor: 'rgba(255, 255, 255, 1)',
  offsetX: 0,
  offsetY: 0,
  scale: 1
};

defaultStyle.getText = function (styleParam) {
  let style = Object.assign({}, defaultStyle.defaultText, styleParam);
  if (style.fontSize.toString().indexOf('px') < 0) {
    style.fontSize = style.fontSize.toString() + 'px';
  }
  if (style.text === null || style.text === undefined) {
    style.text = '';
  }
  let font = style.fontWeight + ' ' + style.fontSize + ' ' + style.fontFamily;
  let textStyle = new ol.style.Text(
    {
      text: style.text.toString(),
      font: font,
      offsetX: style.offsetX,
      offsetY: style.offsetY,
      scale: style.scale,
      fill: new ol.style.Fill({
        color: style.fillColor
      }),
      stroke: new ol.style.Stroke({
        color: style.strokeColor,
        width: 2
      })
    })
  if (style.backgroundFillColor) {
    let fill = new ol.style.Fill({
      color: style.backgroundFillColor
    })
    textStyle.setBackgroundFill(fill)
  }
  if (style.backgroundStrokeColor) {
    let stroke = new ol.style.Stroke({
      color: style.backgroundStrokeColor
    })
    textStyle.setBackgroundStroke(stroke)
  }
  if (style.padding) {
    textStyle.setPadding(style.padding)
  }

  return [new ol.style.Style({
    text: textStyle
  })]
};

defaultStyle.defaultBgRectangle = {
  strokeColor: 'blue',
  fillColor: 'blue',
  strokeWeight: '2'
};

defaultStyle.getBgRectangle = function (styleParam, map) {
  let style = Object.assign({}, defaultStyle.defaultBgRectangle, styleParam);
  return [new ol.style.Style({
    geometry: function (feature) {
      let name = feature.get('data').name;
      let lengthPixel = name.length * 18;
      let degreeWidth = xmap.util.transformPixel2Degree(lengthPixel, map.olMap.getView().getResolution());
      let degreeHeight = xmap.util.transformPixel2Degree(24, map.olMap.getView().getResolution());
      let point = feature.getGeometry().getLastCoordinate();
      let lng = point[0], lat = point[1];
      return new ol.geom.Polygon([[
        [lng - degreeWidth / 2, lat - degreeHeight / 2],
        [lng + degreeWidth / 2, lat - degreeHeight / 2],
        [lng + degreeWidth / 2, lat + degreeHeight / 2],
        [lng - degreeWidth / 2, lat + degreeHeight / 2]
      ]]);
    },
    stroke: new ol.style.Stroke({
      color: style.strokeColor,
      width: style.strokeWeight
    }),
    fill: new ol.style.Fill({
      color: style.fillColor
    })
  })]
};

defaultStyle.getGradient = function (styleParam, map, feature, resolution) {
  let style = Object.assign({}, defaultStyle.defaultPolygon, styleParam);
  let grad = defaultStyle.getGradientFill(styleParam, feature, resolution);
  return [
    new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: style.strokeColor,
        width: style.strokeWeight
      }),
      fill: new ol.style.Fill({
        color: grad
      })
    })
  ];
};


defaultStyle.getGradientFill = function (styleParam, feature, resolution) {
  let canvas = document.createElement('canvas');
  let context = canvas.getContext('2d');
  let pixelRatio = ol.has.DEVICE_PIXEL_RATIO;
  let extent = feature.getGeometry().getExtent();
  let grad = context.createLinearGradient(0, 0,
    ol.extent.getWidth(extent) / resolution * pixelRatio, 0);
  if (feature.get('data').plotType.toLowerCase() === xmap.util.PlotType.TAILED_SQUAD_COMBAT.toLowerCase()) {
    let angle = xmap.PlotUtils.getAzimuth(feature.get('data').points[0], feature.get('data').points[1]);
    if (angle <= Math.PI / 2) {
      grad = context.createLinearGradient(ol.extent.getWidth(extent) / resolution * pixelRatio, 0,
        0, ol.extent.getHeight(extent) / resolution * pixelRatio);
    } else if (Math.PI / 2 < angle && angle <= Math.PI) {
      grad = context.createLinearGradient(0, 0,
        ol.extent.getWidth(extent) / resolution * pixelRatio,
        ol.extent.getHeight(extent) / resolution * pixelRatio);
    } else if (Math.PI < angle && angle <= 3 * Math.PI / 2) {
      grad = context.createLinearGradient(0, ol.extent.getHeight(extent) / resolution * pixelRatio,
        ol.extent.getWidth(extent) / resolution * pixelRatio, 0);
    } else {
      grad = context.createLinearGradient(ol.extent.getWidth(extent) / resolution * pixelRatio,
        ol.extent.getHeight(extent) / resolution * pixelRatio,
        0, 0);
    }
  }
  grad.addColorStop(0, styleParam.fillColor[0]);
  grad.addColorStop(1, styleParam.fillColor[1]);
  return grad;
};

export default defaultStyle;

