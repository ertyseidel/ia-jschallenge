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
			}
			this.images[key].src = "./img/" + src;
		};

		/*
         * Update function which runs to update positions and check for winning
		 */
		this.update = function(){
			if(this.imagesLoaded < Object.keys(this.images).length) return;

		}
		/*
		 * Draw function which repaints canvas at (hopefully) 60 frames per second
		 */
		this.draw = function(){
			if(this.imagesLoaded < Object.keys(this.images).length) return;
			ctx.drawImage(this.images.background, 0, 0);
		}

	};

	exports.IAGame = IAGame;
})(window);

window.onload = function(){
	var canvas = document.getElementById("app");
	canvas.style.width = "800px";
	canvas.style.height = "600px";
	var iagame = new IAGame(canvas);

	var updateGame = function(){
		window.requestAnimationFrame(updateGame);
		iagame.update();
		iagame.draw();
	}

	window.requestAnimationFrame(updateGame); //gogogo
}