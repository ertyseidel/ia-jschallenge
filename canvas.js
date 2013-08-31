;(function(exports){
	var IAGame = function (canvasElement){
		if(!canvasElement.getContext) throw "canvasElement could not get context";
		var ctx = canvasElement.getContext("2d"); //get canvas context element


		this.update = function(){

		}

		this.draw = function(){

		}

	};

	exports.IAGame = IAGame;
})(window);

window.onload = function(){
	iagame = new IAGame(document.getElementById("app"));
	iagame.start();
}