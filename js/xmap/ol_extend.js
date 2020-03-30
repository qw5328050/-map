/**
 * Created by fp on 2018/8/14.
 */

import {
  Collection, Feature, ImageTile, Map, MapBrowserEvent, MapEvent,
  Object, Overlay, VectorTile, View, inherits
} from 'ol/index';
import {Draw, Modify, Select, DragPan, DoubleClickZoom, defaults as interactionDefaults} from 'ol/interaction';
import {Zoom, ZoomSlider} from 'ol/control';
import MousePosition from 'ol/control/MousePosition';
import {
  Circle as StyleCircle, Fill, Icon, IconImage, Image as StyleImage,
  RegularShape, Stroke, Style, Text
} from 'ol/style';
import {Circle, Geometry, LineString, MultiLineString, MultiPoint, MultiPolygon, Point, Polygon} from 'ol/geom';
import {WKT, GeoJSON} from 'ol/format';
import {pointerMove, singleClick} from 'ol/events/condition';
import TileGrid from 'ol/tilegrid/TileGrid';
import TileGridWMTS from 'ol/tilegrid/WMTS';
import {getTopLeft, getWidth, getHeight, getTopRight, containsCoordinate} from 'ol/extent'
import {Image, Tile, TileArcGISRest, TileWMS, Vector, WMTS, XYZ, TileImage, ImageStatic, ImageCanvas,Cluster} from 'ol/source';

import {
  Image as ImageLayer, Tile as TileLayer,
  Vector as VectorLayer, VectorTile as VectorTileLayer
} from 'ol/layer';
import {getLength, getArea, getDistance} from 'ol/sphere';
import {format} from 'ol/coordinate';

import {get as getProjection, equivalent as equivalentProjection, getTransform, transformExtent,transform} from 'ol/proj';

import {listen, listenOnce, unlisten, unlistenByKey} from 'ol/events';

import crop from './plugins/filter/Crop'
import PointerEventHandler from 'ol/pointer/PointerEventHandler';
import EventType from 'ol/pointer/EventType';
import EventTypes from 'ol/events/EventType'


const ol = {
  Collection, Feature, ImageTile, Map, MapBrowserEvent, MapEvent, Object, Overlay, Tile, VectorTile, View, inherits
};
ol.interaction = {
  Draw, Modify, Select, DragPan, DoubleClickZoom, defaults: interactionDefaults
};
ol.control = {
  Zoom, ZoomSlider, MousePosition
};
ol.style = {
  Circle: StyleCircle,
  Image: StyleImage,
  Fill, Icon, IconImage, RegularShape, Stroke, Style, Text
};

ol.geom = {
  Circle, Geometry, LineString, MultiLineString, MultiPoint, MultiPolygon, Point, Polygon
};
ol.format = {
  WKT, GeoJSON
};

ol.events = {
  condition: {
    pointerMove, singleClick
  },
  listen, listenOnce, unlisten, unlistenByKey, EventType:EventTypes
};
ol.tilegrid = {
  TileGrid: TileGrid,
  WMTS: TileGridWMTS
};

ol.extent = {
  getTopLeft, getWidth, getHeight, getTopRight, containsCoordinate
};

ol.source = {
  Image, Tile, TileArcGISRest, TileWMS, Vector, WMTS, XYZ, TileImage, ImageStatic, ImageCanvas,Cluster
};

ol.layer = {
  Image: ImageLayer,
  Tile: TileLayer,
  Vector: VectorLayer,
  VectorTile: VectorTileLayer
};

/*ol.Sphere = {
 getLength, getArea, getDistance
 };*/

ol.Sphere = function () {

};

ol.coordinate = {
  format
};

ol.proj = {
  get: getProjection,
  getTransform,
  transformExtent,
  transform
};

ol.filter = {
  Crop: crop
};

ol.pointer = {
  PointerEventHandler,
  EventType
};

export default  ol;
