;(function(exports){
	var IAGame = function (canvasElement, images){
		this.imagesLoaded = 0; //number of images which have finished loading

		this.backgroundCache = null;

		this.dirty = true;

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

		this.won = false;

		/*
		 * Update function which runs to update positions and check for winning
		 */
		this.update = function(){
			var dotsCorrect = 0;
			if(this.imagesLoaded < Object.keys(this.images).length) return;
			if(this.currentDot){
				this.dirty = true;
				this.currentDot.pos.x = this.currentMousePos.x - this.currentDot.mousePos.x;
				this.currentDot.pos.y = this.currentMousePos.y - this.currentDot.mousePos.y;

				var correctDrop = false;
				this.drops.forEach(function(drop){
					if(drop.contains(this.currentDot.getCenter()) && drop.color == this.currentDot.color){
						this.currentDot.pos.x = drop.pos.x;
						this.currentDot.pos.y = drop.pos.y;
						correctDrop = true;
					}
				}.bind(this));

				this.currentDot.correctlyDropped = correctDrop;
			}

			this.dots.forEach(function(dot){
				if(!dot.correctlyDropped && dot !== this.currentDot){
					if(dot.pos.x != dot.start.x){
						dot.pos.x -= (dot.pos.x - dot.start.x) / 10;
						if(Math.abs(dot.pos.x - dot.start.x) < .1) dot.pos.x = dot.start.x;
						this.dirty = true;	
					}
					if(dot.pos.y != dot.start.y){
						dot.pos.y -= (dot.pos.y - dot.start.y) / 10;
						if(Math.abs(dot.pos.y - dot.start.y) < .1) dot.pos.y = dot.start.y;
						this.dirty = true;	
					} 
				} else if(dot !== this.currentDot){
					dotsCorrect ++;
				}
			}.bind(this));

			var tempWon = this.won;
			this.won = dotsCorrect == Object.keys(this.images).length;
			if(this.won != tempWon) this.dirty = true;
		};

		/*
		 * Draw function which repaints canvas at (hopefully) 60 frames per second
		 */
		this.draw = function(ctx){
			if(!this.dirty) return;
			ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

			if(this.backgroundCache == null){
				var that = this;
				this.backgroundCache = renderToCanvas(ctx.canvas.width, ctx.canvas.height, function(ctx){
					if(that.imagesLoaded < Object.keys(that.images).length) return;
					ctx.drawImage(that.images.background, 0, 100);
				});
			}

			ctx.drawImage(this.backgroundCache, 0, 0);

			this.dots.forEach(function(dot){
				ctx.drawImage(this.images[dot.color], dot.pos.x, dot.pos.y);
			}.bind(this));

			if(this.won){
				ctx.fillStyle = "#000000";
				ctx.font="30px sans-serif";
				ctx.fillText("You Win!", 100, 50);
			}
			
			this.dirty = false;
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
		this.correctlyDropped = false;
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

	//from http://kaioa.com/node/103
	var renderToCanvas = function (width, height, renderFunction) {
		var buffer = document.createElement('canvas');
		buffer.width = width;
		buffer.height = height;
		renderFunction(buffer.getContext('2d'));
		return buffer;
	};

	exports.IAGame = IAGame;
})(window);

window.onload = function(){
	var canvas = document.getElementById("app");
	canvas.width = "600";
	canvas.height = "700";
	canvas.style.position = "relative";
	iagame = new IAGame(canvas);
	if(!canvas.getContext) throw "canvas could not get context";
	var ctx = canvas.getContext("2d"); //get canvas context element

	canvas.addEventListener("mousedown", function(evt){iagame.mousedown(evt)});
	canvas.addEventListener("mouseup", function(evt){iagame.mouseup(evt)});
	canvas.addEventListener("mousemove", function(evt){iagame.mousemove(evt)});

	var updateGame = function(){
		window.requestAnimationFrame(updateGame);
		iagame.update();
		iagame.draw(ctx);
	}

	window.requestAnimationFrame(updateGame); //gogogo
}