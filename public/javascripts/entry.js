require("!style-loader!css-loader!./../stylesheets/index.css");
require("!style-loader!css-loader!./../stylesheets/mobile.css");
var musicVisualizer = require("./musicVisualizer.js");
var CanvasParticl = require("./background.js");
var $ = require("jquery");

NavSlide();
clickMusic();
changeStyle();
changeNavBorder();
CanvasParticl();


var size = 64;
var box = $("#box")[0];
var height, width;
var canvas = document.createElement('canvas');
var ctx = canvas.getContext("2d");
box.appendChild(canvas);
var Dots = [];
draw.type = "column";
window.onresize = resize;
var line;
resize();

var mv = new musicVisualizer({
	size: size,
	visualizer: draw
});


function changeNavBorder() {
	var headerDd = $('.header dd');
	var h1H = $('h1').text();
	var n = $(".content form").hasClass('comment-form');
	if (h1H == "BLOG+" || n) {
		headerDd.removeClass('active');
		headerDd.eq(0).addClass('active');
	} else if (h1H == "MUSIC") {
		headerDd.removeClass('active');
		headerDd.eq(1).addClass('active');
	} else if (h1H == "自我简介") {
		headerDd.removeClass('active');
		headerDd.eq(2).addClass('active');
	}
}

function NavSlide() {
	var slideP = $("header dd:last-child");
	var slideC = $("header ul");
	slideP.hover(function() {
		slideC.css("display", "").slideDown(200);
	}, function() {
		slideC.slideUp(200);
	});
	slideP.click(function() {
		if (slideC.css("display") === "none") {
			slideC.css("display", "").slideDown(200);
		} else {
			slideC.slideUp(200);
		}
	});
}


function clickMusic() {
	var lis = $(".music li");
	lis.click(function() {
		var i = $(this).index();
		lis.css('color', 'black');
		lis.eq(i).css('color', 'grey');
		mv.play('/musics/' + lis.eq(i).html());
	});
}



function random(m, n) {
	return Math.round(Math.random() * (n - m) + m);
}

function getDots() {
	Dots = [];
	for (var i = 0; i < size; i++) {
		var x = random(0, width);
		var y = random(0, height);
		var color = "rgba(" + random(0, 255) + "," + random(0, 255) + "," + random(0, 255) + ",0)";
		Dots.push({
			x: x,
			y: y,
			color: color,
			cap: 0,
			dx: random(1, 4)
		});
	};
}


function resize() {
	height = box.clientHeight;
	width = box.clientWidth;
	canvas.height = height;
	canvas.width = width;
	line = ctx.createLinearGradient(0, 0, 0, height);
	line.addColorStop(0, "pink");
	line.addColorStop(0.5, "grey");
	line.addColorStop(1, "lightblue");
	getDots();
}


function draw(arr) {
	ctx.clearRect(0, 0, width, height);
	var w = width / size;
	var cw = w * 0.6;
	var ch = cw;
	ctx.fillStyle = line;
	for (var i = 0; i < size; i++) {
		var o = Dots[i];
		if (draw.type == "column") {
			var h = arr[i] / 256 * height;
			ctx.fillRect(w * i, height - h, cw, h);
			ctx.fillRect(w * i, height - (o.cap + ch), cw, ch);
			o.cap--;
			if (o.cap < 0) {
				o.cap = 0;
			}
			if (h > 0 && o.cap < h + 30) {
				o.cap = h + 30 > height - ch ? height - ch : h + 30;
			}
		} else if (draw.type == "dot") {
			ctx.beginPath();
			var r = 10 + arr[i] / 256 * (height > width ? width : height) / 10;
			ctx.arc(o.x, o.y, r, 0, Math.PI * 2, true);
			var circle = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, r);
			circle.addColorStop(0, "white");
			circle.addColorStop(1, o.color);
			ctx.fillStyle = circle;
			ctx.fill();
			o.x += o.dx;
			o.x = o.x > width ? 0 : o.x;
		}
	}
}


function changeStyle() {
	var divs = $(".musicList div");
	divs.click(function() {
		var i = $(this).index();
		divs.removeClass('selected')
			.eq(i).addClass('selected');
		draw.type = divs.eq(i).attr('type');
	});
}