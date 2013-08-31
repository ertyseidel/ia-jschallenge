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

		this.drops = [
			new Drop("blue", {x: 275, y: 148}),
			new Drop("red", {x: 455, y: 172}),
			new Drop("green", {x: 145, y: 435}),
			new Drop("black", {x: 47, y: 291}),
			new Drop("black", {x: 419, y: 388})
		];

		this.currentDot = null;
		this.currentMousePos = {x: 0, y: 0};

		/*
         * Update function which runs to update positions and check for winning
		 */
		this.update = function(){
			if(this.imagesLoaded < Object.keys(this.images).length) return;
			if(this.currentDot){
				this.currentDot.pos.x = this.currentMousePos.x - this.currentDot.mousePos.x;
				this.currentDot.pos.y = this.currentMousePos.y - this.currentDot.mousePos.y;

				this.drops.forEach(function(drop){
					if(drop.contains(this.currentDot.getCenter()) && drop.color == this.currentDot.color){
						this.currentDot.pos.x = drop.pos.x;
						this.currentDot.pos.y = drop.pos.y;
					}
				}.bind(this));
			}
		};

		/*
		 * Draw function which repaints canvas at (hopefully) 60 frames per second
		 */
		this.draw = function(){
			ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
			if(this.imagesLoaded < Object.keys(this.images).length) return;
			ctx.drawImage(this.images.background, 0, 100);
			this.dots.forEach(function(dot){
				ctx.drawImage(this.images[dot.color], dot.pos.x, dot.pos.y);
			}.bind(this));
		};

		this.mousemove = function(evt){
			if(this.currentDot){
				this.currentMousePos.x = evt.offsetX;
				this.currentMousePos.y = evt.offsetY;
			}
		}

		this.mousedown = function(evt){
			this.currentMousePos.x = evt.offsetX;
			this.currentMousePos.y = evt.offsetY;
			this.dots.forEach(function(dot){
				if(dot.contains({ x: this.currentMousePos.x, y: this.currentMousePos.y })){
					dot.mousePos.x = this.currentMousePos.x - dot.pos.x;
					dot.mousePos.y = this.currentMousePos.y - dot.pos.y;
					this.currentDot = dot;
				}
			}.bind(this));
		};

		this.mouseup = function(evt){
			this.currentDot = null;
		};

	};

	var contains = function(pos){
		var xSquared = Math.pow(pos.x - (this.pos.x + (this.size.x / 2)), 2);
		var ySquared = Math.pow(pos.y - (this.pos.y + (this.size.y / 2)), 2);
		return ((xSquared + ySquared) < Math.pow((this.size.x / 2), 2))
	};

	var getCenter = function(){
		return {x: this.pos.x + this.size.x / 2, y: this.pos.y + this.size.y / 2};
	}

	var Dot = function(color, start){
		this.color = color;
		this.start = start;
		this.size = {x: 100, y: 100},
		this.pos = {x: start.x, y: start.y},
		this.mousePos = {x: 0, y: 0}
	}

	Dot.prototype.contains = contains;

	Dot.prototype.getCenter = getCenter;

	var Drop = function(color, pos){
		this.color = color;
		this.pos = pos;
		this.size = {x: 100, y: 100};
	};

	Drop.prototype.contains = contains;

	Drop.prototype.getCenter = getCenter;

	

	exports.IAGame = IAGame;
})(window);

var iagame; // debugging

window.onload = function(){
	var canvas = document.getElementById("app");
	canvas.width = "600";
	canvas.height = "700";
	canvas.style.position = "relative";
	iagame = new IAGame(canvas);

	canvas.addEventListener("mousedown", function(evt){iagame.mousedown(evt)});
	canvas.addEventListener("mouseup", function(evt){iagame.mouseup(evt)});
	canvas.addEventListener("mousemove", function(evt){iagame.mousemove(evt)});

	var updateGame = function(){
		window.requestAnimationFrame(updateGame);
		iagame.update();
		iagame.draw();
	}

	window.requestAnimationFrame(updateGame); //gogogo
}