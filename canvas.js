;(function(exports){
	var IAGame = function (canvasElement, images){
		if(!canvasElement.getContext) throw "canvasElement could not get context";
		var ctx = canvasElement.getContext("2d"); //get canvas context element

		this.imagesLoaded = 0; //number of images which have finished loading

		this.images = {
			background: "ia-logo-back.png",
			black: "ia-logo-dot-black.png",
			blue: "ia-logo-dot-blue.png",
			green: "ia-logo-dot-green.png",
			red: "ia-logo-dot-red.png"
		}

		for (var key in this.images){
			var src = this.images[key];
			this.images[key] = new Image();
			this.images[key].onload = function(){
				this.imagesLoaded ++;
			}.bind(this);
			this.images[key].src = "./img/" + src;
		};

		this.dots = [
			new Dot("blue", {x: 0, y: 0}),
			new Dot("red", {x: 125, y: 0}),
			new Dot("green", {x: 250, y: 0}),
			new Dot("black", {x: 375, y: 0}),
			new Dot("black", {x: 500, y: 0})
		];

		this.currentDot = null;

		/*
         * Update function which runs to update positions and check for winning
		 */
		this.update = function(){
			if(this.imagesLoaded < Object.keys(this.images).length) return;
			if(this.currentDot){
				this.currentDot.pos.x = mouseX;
				this.currentDot.pos.y = mouseY;
			}
		};

		/*
		 * Draw function which repaints canvas at (hopefully) 60 frames per second
		 */
		this.draw = function(){
			if(this.imagesLoaded < Object.keys(this.images).length) return;
			ctx.drawImage(this.images.background, 0, 100);
			this.dots.forEach(function(dot){
				ctx.drawImage(this.images[dot.color], dot.pos.x, dot.pos.y);
			}.bind(this));
		};

		this.mousedown = function(evt){
			this.dots.forEach(function(dot){
				if(dot.contains({ x: evt.x, y: evt.y })){
					this.currentDot = dot;
				}
			}.bind(this));
		};

		this.mouseup = function(evt){
			this.currentDot = null;
		};

	};

	var Dot = function(color, start){
		this.color = color;
		this.start = start;
		this.size = {x: 100, y: 100},
		this.pos = {x: start.x, y: start.y};
	}

	Dot.prototype.contains = function(pos){
		var xSquared = Math.pow(pos.x - (this.pos.x + (this.size.x / 2)), 2);
		var ySquared = Math.pow(pos.y - (this.pos.y + (this.size.y / 2)), 2);
		return ((xSquared + ySquared) < Math.pow((this.size.x / 2), 2))
	};

	exports.IAGame = IAGame;
})(window);

var iagame; // debugging

window.onload = function(){
	var canvas = document.getElementById("app");
	canvas.width = "600";
	canvas.height = "700";
	iagame = new IAGame(canvas);

	canvas.addEventListener("mousedown", function(evt){iagame.mousedown(evt)});
	canvas.addEventListener("mouseup", function(evt){iagame.mouseup(evt)});

	var updateGame = function(){
		window.requestAnimationFrame(updateGame);
		iagame.update();
		iagame.draw();
	}

	window.requestAnimationFrame(updateGame); //gogogo
}