;(function(exports){
	var IAGame = function (canvasElement, images){
		if(!canvasElement.getContext) throw "canvasElement could not get context";
		var ctx = canvasElement.getContext("2d"); //get canvas context element
		var imagesLoaded = 0; //when this hits 5, all of the images are loaded
		/*
         * Update function which runs to update positions and check for winning
		 */
		this.update = function(){
			if(imagesLoaded < 5) return;

		}
		/*
		 * Draw function which repaints canvas at (hopefully) 60 frames per second
		 */
		this.draw = function(){
			
		}

	};

	exports.IAGame = IAGame;
})(window);

window.onload = function(){
	var iagame = new IAGame(document.getElementById("app"));

	var images = {
		"background": new Image(),
		"black": new Image(),
		"blue": new Image(),
		"green": new Image(),
		"red": new Image()
	}

	var imgpath = "./img/"
	for (var key in images){
		images[key].onload = function(){
			iagame.imagesLoaded ++;
		}
	};

	images.background.src = imgpath + "ia-logo-back.png";
	images.black.src = imgpath + "ia-logo-dot-black.png";
	images.blue.src = imgpath + "ia-logo-dot-blue.png";
	images.green.src = imgpath + "ia-logo-dot-green.png";
	images.red.src = imgpath + "ia-logo-dot-red.png";

	var updateGame = function(){
		window.requestAnimationFrame(updateGame);
		iagame.update();
		iagame.draw();
	}

	window.requestAnimationFrame(updateGame); //gogogo
}