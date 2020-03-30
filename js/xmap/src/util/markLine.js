/**
 * Created by yangqiaosheng on 2018/12/25.
 */

/**
 * 标志线的构造函数
 * @param options
 * @constructor
 */
const MarkLine = function (options) {
    var self = this;
    self.from = options.from;
    self.to = options.to;
    self.id = options.id;
    self.step = 0;
    self.options = options;
};

/**
 * 获取点列表
 * @param from
 * @param to
 * @returns {[*,*]}
 */
MarkLine.prototype.getPointList = function (from, to) {
    var self = this;
    var points = [[from[0], from[1]], [to[0], to[1]]];
    var ex = points[1][0];
    var ey = points[1][1];
    points[3] = [ex, ey];
    points[1] = self.getOffsetPoint(points[0], points[3]);
    points[2] = self.getOffsetPoint(points[3], points[0]);
    points = self.smoothSpline(points, false);
    //修正最后一点在插值产生的偏移
    points[points.length - 1] = [ex, ey];
    return points;
};

/**
 * 获取偏移点
 */
MarkLine.prototype.getOffsetPoint = function (start, end) {
    var self = this;
    var distance = self.getDistance(start, end) / 3;
    var angle, dX, dY;
    var mp = [start[0], start[1]];
    var deltaAngle = -0.2;              //偏移0.2弧度
    if (start[0] != end[0] && start[1] != end[1]) {
        //斜率存在
        var k = (end[1] - start[1]) / (end[0] - start[0]);
        angle = Math.atan(k);
    } else if (start[0] == end[0]) {
        //垂直线
        angle = (start[1] <= end[1] ? 1 : -1) * Math.PI / 2;
    } else {
        //水平线
        angle = 0;
    }
    if (start[0] <= end[0]) {
        angle -= deltaAngle;
        dX = Math.round(Math.cos(angle) * distance);
        dY = Math.round(Math.sin(angle) * distance);
        mp[0] += dX;
        mp[1] += dY;
    } else {
        angle += deltaAngle;
        dX = Math.round(Math.cos(angle) * distance);
        dY = Math.round(Math.sin(angle) * distance);
        mp[0] -= dX;
        mp[1] -= dY;
    }
    return mp;
};

MarkLine.prototype.smoothSpline = function (points, isLoop) {
    var self = this;
    var len = points.length;
    var ret = [];
    var distance = 0;
    for (var i = 1; i < len; i++) {
        distance += self.getDistance(points[i - 1], points[i]);
    }
    var segs = distance / 2;
    segs = segs < len ? len : segs;
    for (var i = 0; i < segs; i++) {
        var pos = i / (segs - 1) * (isLoop ? len : len - 1);
        var idx = Math.floor(pos);
        var w = pos - idx;
        var p0;
        var p1 = points[idx % len];
        var p2;
        var p3;
        if (!isLoop) {
            p0 = points[idx === 0 ? idx : idx - 1];
            p2 = points[idx > len - 2 ? len - 1 : idx + 1];
            p3 = points[idx > len - 3 ? len - 1 : idx + 2];
        } else {
            p0 = points[(idx - 1 + len) % len];
            p2 = points[(idx + 1) % len];
            p3 = points[(idx + 2) % len];
        }
        var w2 = w * w;
        var w3 = w * w2;

        ret.push([self.interpolate(p0[0], p1[0], p2[0], p3[0], w, w2, w3), self.interpolate(p0[1], p1[1], p2[1], p3[1], w, w2, w3)]);
    }
    return ret;
};

MarkLine.prototype.interpolate = function (p0, p1, p2, p3, t, t2, t3) {
    var v0 = (p2 - p0) * 0.5;
    var v1 = (p3 - p1) * 0.5;
    return (2 * (p1 - p2) + v0 + v1) * t3 + (-3 * (p1 - p2) - 2 * v0 - v1) * t2 + v0 * t + p1;
};

MarkLine.prototype.getDistance = function (p1, p2) {
    return Math.sqrt((p1[0] - p2[0]) * (p1[0] - p2[0]) + (p1[1] - p2[1]) * (p1[1] - p2[1]));
};

/**
 *
 * @param context
 */
MarkLine.prototype.drawMarker = function (context) {
    var self = this;
    self.from.draw(context);
    self.to.draw(context);
    self.center.draw(context);
};

MarkLine.prototype.drawLinePath = function (context) {
    var self = this;
    var pointList = self.path = self.getPointList(self.from.location, self.to.location);
    var len = pointList.length;
    context.save();
    context.beginPath();
    context.lineWidth = self.options.lineWidth;
    context.strokeStyle = self.options.colors[0];
    if (self.options.lineType && self.options.lineType == 'dashed') {
        context.setLineDash(self.options.lineDash || [25, 10]);
        context.moveTo(pointList[0][0], pointList[0][1]);
        for (var i = 0; i < len; i++) {
            context.lineTo(pointList[i][0], pointList[i][1]);
        }
    } else if (self.options.lineType && self.options.lineType == 'dotted') {
        for (var i = 1; i < len; i += 2) {
            context.moveTo(pointList[i - 1][0], pointList[i - 1][1]);
            context.lineTo(pointList[i][0], pointList[i][1]);
        }
    } else if (self.options.lineType && self.options.lineType == 'solid') {
        // context.setLineDash([]);
        context.moveTo(pointList[0][0], pointList[0][1]);
        for (var i = 0; i < len; i++) {
            context.lineTo(pointList[i][0], pointList[i][1]);
        }
    }
    context.stroke();
    context.restore();
    this.step = 0; //缩放地图时重新绘制动画
};

MarkLine.prototype.drawMoveCircle = function (context) {
    var self = this;
    var pointList = this.path || this.getPointList(self.from.location, self.to.location);
    context.save();
    context.fillStyle = self.options.fillColor;
    context.shadowColor = self.options.shadowColor;
    context.shadowBlur = self.options.shadowBlur;
    context.beginPath();
    context.arc(pointList[this.step][0], pointList[this.step][1], self.options.moveRadius, 0, Math.PI * 2, true);
    context.fill();
    context.closePath();
    context.restore();
    this.step += 1;
    if (this.step >= pointList.length) {
        this.step = 0;
    }
};

export default MarkLine;
