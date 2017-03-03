/*var height, width;
var line;
var Dots = [];
var canvas = document.createElement('canvas');
var ctx = canvas.getContext("2d");
box.appendChild(canvas);*/
var canvas = document.createElement('canvas');
var ctx = canvas.getContext("2d");
var Dots = [];
var drawType = "column";

function musicStyle(obj) {
	this.size = obj.size;
	this.box = obj.box;
	this.height = null;
	this.width = null;
	this.line = null;

	//this.canvas = document.createElement('canvas');
	//this.ctx = this.canvas.getContext("2d");
	//this.draw.type = "column";
}
musicStyle.prototype.appendCanvas = function() {
	this.box.appendChild(canvas);
}

musicStyle.prototype.changeStyle = function(spans, className) {
	var self = this;
	spans.click(function() {
		var i = $(this).index();
		spans.removeClass(className)
			.eq(i).addClass(className);
		drawType = spans.eq(i).attr('type');
	});
}
musicStyle.prototype.random = function(m, n) {
	return Math.round(Math.random() * (n - m) + m);
}

musicStyle.prototype.getDots = function() {
	var self = this;
	for (var i = 0; i < size; i++) {
		var x = this.random(0, this.width);
		var y = this.random(0, this.height);
		var color = "rgba(" + this.random(0, 255) + "," + this.random(0, 255) + "," + this.random(0, 255) + ",0)";
		Dots.push({
			x: x,
			y: y,
			color: color,
			cap: 0,
			dx: self.random(1, 4)
		});
	};
}


musicStyle.prototype.resize = function() {
	this.height = this.box.clientHeight;
	this.width = this.box.clientWidth;
	canvas.height = this.height;
	canvas.width = this.width;
	/*this.line = ctx.createLinearGradient(0, 0, 0, this.height);
	this.line.addColorStop(0, "pink");
	this.line.addColorStop(0.5, "grey");
	this.line.addColorStop(1, "lightblue");*/
	this.getDots();
}


musicStyle.prototype.draw = function(arr) {
	ctx.clearRect(0, 0, this.width, this.height);
	var w = this.width / this.size;
	var cw = w * 0.6;
	var ch = cw;
	ctx.fillStyle = "black";
	for (var i = 0; i < this.size; i++) {
		var o = Dots[i];
		if (drawType == "column") {
			var h = arr[i] / 256 * this.height;
			ctx.fillRect(w * i, this.height - h, cw, h);
			ctx.fillRect(w * i, this.height - ( /*o.cap +*/ ch), cw, ch);
			/*o.cap--;
			if (o.cap < 0) {
				o.cap = 0;
			}
			if (h > 0 && o.cap < h + 30) {
				o.cap = h + 30 > this.height - ch ? this.height - ch : h + 30;
			}*/
		} else if (drawType == "dot") {
			ctx.beginPath();
			var r = 10 + arr[i] / 256 * (this.height > this.width ? this.width : this.height) / 10;
			ctx.arc(o.x, o.y, r, 0, Math.PI * 2, true);
			var circle = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, r);
			circle.addColorStop(0, "white");
			circle.addColorStop(1, o.color);
			ctx.fillStyle = circle;
			ctx.fill();
			o.x += o.dx;
			o.x = o.x > this.width ? 0 : o.x;
		}
	}
}