$(document).ready(function(){
	var temp1 = $(window).height();
	$("#canvas").attr("height", temp1 - 100);
	var temp2 	 = $(window).width();
	$("#canvas").attr("width", temp2 - 300);
	var h      = $("#canvas").height();
	var w      = $("#canvas").width();
	var ctx    = ($("#canvas")[0]).getContext("2d");
	var cellwidth = 10;
	var initLength = 5;
	var food;
	var score;
	var dir;
	var snake;

	function newgame(){
		dir = "right";
		score = 0;
		snake = [];
		createSnake();
		createFood();

		if(typeof game_loop != "undefined")
			clearInterval(game_loop);
		game_loop = setInterval(draw, 80);
	}

	function createFood(){
		food = {
			x : Math.round(Math.random() * w/cellwidth),
			y : Math.round(Math.random() * h/cellwidth)
		};
	}

	function createSnake(){
		for(var i = initLength - 1; i >= 0; i--){
			snake.push({x : i, y : 0});
		}
	}

	function draw(){
		//console.log("draw");
		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, w, h);
		ctx.strokeStyle = "black";
		ctx.strokeRect(0, 0, w, h);

		// For movement, pop out the tail and place it in front of the current head cell

		var x = snake[0].x;
		var y = snake[0].y;
		// console.log(x,w);
		// console.log(y,h);

		if(dir === "right")
			x++;
		else if(dir === "left")
			x--;
		else if(dir === "up")
			y--;
		else if(dir === "down")
			y++;

		// Handle collisions with walls and body

		if(x <= -1 || x >= (w/cellwidth) || y <= -1 || y >= (h/cellwidth) || check_collision(x, y, snake)){
			newgame();
			return;
		}

		// Handle getting food

		var tail;
		if(x === food.x && y === food.y){
			tail = {x : x, y: y};
			createFood();
			score++;
		}
		else{
			tail = snake.pop();
			tail.x = x;
			tail.y = y;
		}

		snake.unshift(tail);

		for(var i = 0; i < snake.length; i++){
			var cell = snake[i];
			paint_cell(cell);
		}
		paint_cell(food);
		ctx.font = "18px Georgia";
		ctx.fillStyle = "blue";
		ctx.fillText("Score : " + score, 5, h - 5);
	}

	function paint_cell(cell){
		x = cell.x;
		y = cell.y;
		//console.log("paint");
		ctx.fillStyle = "blue";
		ctx.fillRect(x*cellwidth, y*cellwidth, cellwidth, cellwidth);
		//console.log(x*cellwidth, y*cellwidth, cellwidth, cellwidth);
		ctx.strokeStyle = "white";
		ctx.strokeRect(x*cellwidth, y*cellwidth, cellwidth, cellwidth);
	}

	function check_collision(x, y, array){
		for(var i = 0; i < array.length; i++){
			if(array[i].x == x && array[i].y == y)
			 return true;
		}
		return false;
	}

	// Keypress handler

	$(document).keydown(function(e){
		var key = e.which;
		if(key == "37" && dir != "right")
			dir = "left";
		else if(key == "38" && dir != "down")
		 	dir = "up";
		else if(key == "39" && dir != "left")
			dir = "right";
		else if(key == "40" && dir != "up")
			dir = "down";
	});

	newgame();

});
