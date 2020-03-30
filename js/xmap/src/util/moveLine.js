/**
 * Created by yangqiaosheng on 2018/12/25.
 */
import MarkLine from './markLine'
import Marker from './marker'

const MoveLine = function (options) {
    var self = this;
    self.options = options;
    self.map = self.options.map;

    self.size = self.map.getSize();
};

MoveLine.prototype.setBaseContext = function (context) {
    var self = this;
    self.baseContext = context;
};

MoveLine.prototype.setBaseDelta = function (delta) {
    var self = this;
    self.options.baseDelta = delta;
};

MoveLine.prototype.setAnimateContext = function (context) {
    var self = this;
    self.animateContext = context;
};

MoveLine.prototype.setAnimateDelta = function (delta) {
    var self = this;
    self.options.animateDelta = delta;
};

MoveLine.prototype.addMarkLines = function () {
    var self = this;
    self.markLines = [];
    var zoom = self.map.getView().getZoom();
    self.scale = zoom < 2 ? Math.pow(2, zoom - 2) : 1;
    var dataset = self.options.data;
    dataset.forEach(function (from, i) {
        var fromId = from.id;
        var fromName = from.name;
        var fromPixels = self.map.getPixelFromCoordinate([from.lng, from.lat]);
        var sopInfo = from.sopInfo;
        sopInfo.forEach(function (to, j) {
            var toId = to.id;
            var toName = to.name;
            var toCount = to.count;
            var toPixels = self.map.getPixelFromCoordinate([to.lng, to.lat]);
            var markLine = new MarkLine({
                id: fromId + "_" + toId,
                from: new Marker({
                    location: fromPixels,
                    scale: self.scale
                }),
                to: new Marker({
                    location: toPixels,
                    scale: self.scale
                }),
                lineType: self.options.lineType,
                lineDash: self.options.lineDash,
                lineWidth: self.options.lineWidth,
                colors: self.options.colors,
                fillColor: self.options.fillColor,
                shadowColor: self.options.shadowColor,
                shadowBlur: self.options.shadowBlur,
                moveRadius: self.options.moveRadius
            });
            var centerPixels = markLine.getOffsetPoint(fromPixels, toPixels);
            markLine.center = new Marker({
                city: toCount,
                location: centerPixels,
                color: self.options.colors[0],
                scale: self.scale
            });
            self.drawMarkLine(markLine);
            self.markLines.push(markLine);
        });
    });
};

MoveLine.prototype.drawMarkLine = function (markLine) {
    var self = this;
    if (self.baseContext) {
        markLine.drawLinePath(self.baseContext);
        markLine.drawMarker(self.baseContext);
    }
};

MoveLine.prototype.stop = function () {
    var self = this;
    if (self.animationId && cancelAnimationFrame) {
        cancelAnimationFrame(self.animationId);
    }
};


MoveLine.prototype.animate = function () {
    var self = this;
    if (self.animateContext) {
        self.animateContext.fillStyle = 'rgba(0,0,0,.93)';
        var prev = self.animateContext.globalCompositeOperation;
        self.animateContext.globalCompositeOperation = 'destination-in';
        self.animateContext.fillRect(0, 0, self.size[0], self.size[1]);
        self.animateContext.globalCompositeOperation = prev;

        for (var i = 0; i < self.markLines.length; i++) {
            var markLine = self.markLines[i];
            markLine.drawMoveCircle(self.animateContext); //移动圆点
        }
    }
};

MoveLine.prototype.startLoop = function () {
    var self = this;
    self.stop();

    var fps = 25;        // 60 帧 ==> 5 帧
    var now;
    var timeDelta;
    var interval = 1000 / fps;
    var then = Date.now();

    // var frames
    // var oldtime = 0;

    (function drawFrame() {
        if (requestAnimationFrame) {
            self.animationId = requestAnimationFrame(drawFrame);
            now = Date.now();
            timeDelta = now - then;
            // console.log("==delta==" + delta);
            if (timeDelta > interval) {       //控制帧速
                then = now - (timeDelta % interval);
                // frames = 1000/(time-oldtime);
                // oldtime = time;
                // console.log("==frames==" + frames);
                self.animate();
                self.map.renderSync();
            }
        } else {
            setTimeout(tick, interval);
            self.animate();
            self.map.renderSync();
        }
    })();
};

window.requestAnimationFrame = function () {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame
        || window.mozRequestAnimationFrame || window.oRequestAnimationFrame
        || window.msRequestAnimationFrame || function (callback) {
            return window.setTimeout(callback, 1000 / 15);
        };
}();

if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function (id) {
        clearTimeout(id);
    };
}

export default MoveLine;

