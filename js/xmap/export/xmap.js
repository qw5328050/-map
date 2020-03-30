/**
 * Created by fp on 2018/8/14.
 */
import ol from '../ol_extend';
import DrawInteraction from '../src/interaction/drawInteraction';
import Measure from '../src/control/measure';
import Navigation from '../src/control/navigation';
import VectorLayer from '../src/layer/vectorLayer';
import DivLayer from '../src/layer/divLayer';
import WindyLayer from '../src/layer/windyLayer';
import TdtLayer from '../src/layer/tdtLayer';
import TileWMSLayer from '../src/layer/tileWMSLayer';
import TileWMTSLayer from '../src/layer/tileWMTSLayer';
import TileArcGISRestLayer from '../src/layer/tileArcGISRestLayer';
import TileArcGISXYZLayer from '../src/layer/tileArcGISXYZLayer';
import ImageLayer from '../src/layer/imageLayer';
import ClusterLayer from '../src/layer/clusterLayer'
import TimerTrackLayer from '../src/layer/timerTrackLayer'

import DragRadiusInteraction from '../src/interaction/dragRadiusInteraction'
import RipperUtil from '../src/util/ripperUtil';

import util from '../src/util/util';
import Map from '../src/map/map';

const xmap = {};
xmap.DrawInteraction = DrawInteraction;
xmap.control = {
  Measure: Measure,
  Navigation: Navigation
};

xmap.VectorLayer = VectorLayer;
xmap.DivLayer = DivLayer;
xmap.WindyLayer = WindyLayer;
xmap.TdtLayer = TdtLayer;
xmap.TileWMSLayer = TileWMSLayer;
xmap.TileWMTSLayer = TileWMTSLayer;
xmap.TileArcGISRestLayer = TileArcGISRestLayer;
xmap.TileArcGISXYZLayer = TileArcGISXYZLayer;
xmap.ImageLayer = ImageLayer;
xmap.ClusterLayer = ClusterLayer;
xmap.TimerTrackLayer = TimerTrackLayer;
xmap.DragRadiusInteraction = DragRadiusInteraction;
xmap.RipperUtil = RipperUtil;
xmap.util = util;
xmap.Map = Map;
xmap.ol = ol;

export default xmap;
