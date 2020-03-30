/**
 * Created by yangqiaosheng on 2018/12/25.
 */
const Marker = function (options) {
    var self = this;
    self.city = options.city;
    self.location = options.location;
    self.color = options.color;
    self.image = options.image;
    self.scale = options.scale;
    self.options = options;
};

Marker.prototype.drawImage = function (context) {
    var self = this;
    context.translate(self.location[0], self.location[1]);
    context.scale(self.scale, self.scale);
    context.drawImage(self.image, -self.image.width / 2, -self.image.height / 2, self.image.width, self.image.height);
};

Marker.prototype.drawText = function (context) {
    var self = this;
    context.translate(self.location[0], self.location[1]);
    context.scale(self.scale, self.scale);
    context.beginPath();
    context.fillStyle = self.options.markerColor || '#ffffff';
    context.arc(0, 0, self.options.markerRadius || 14, 0, Math.PI * 2, true);
    context.closePath();
    context.fill();

    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = "14px Microsoft YaHei";
    context.fillStyle = self.color;
    context.fillText(self.city, 0, 0);
}


Marker.prototype.draw = function (context) {
    var self = this;
    context.save();
    if (self.image) {
        self.image.complete ? self.drawImage(context)
            : self.image.onload = function () {
            self.drawImage(context);
        };
    } else if (self.city) {
        self.drawText(context);
    }
    context.restore();
};

export default Marker;
