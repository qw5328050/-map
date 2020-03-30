/**
 * Created by fp on 2017/11/23.
 * 导航栏控件
 */
import ol from '../../ol_extend';
const Navigation = function () {
};
ol.inherits(Navigation, ol.Object);


Navigation.prototype.getControl = function(){
     let controlArray = [];
    controlArray.push(new ol.control.Zoom({
        className: 'navigation ol-zoom',
        zoomInTipLabel: '放大',
        zoomOutTipLabel: '缩小'
    }));

    controlArray.push(new ol.control.ZoomSlider({
        className: 'navigation ol-zoomslider'
    }));
    return controlArray;
};

export default Navigation;
