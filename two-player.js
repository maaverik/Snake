$(document).ready(function(){
	// var temp1 = $(window).height();
	// console.log("height = " + temp1);
	// $("#canvas").attr("height", 500);
	// var temp2 	 = $(window).width(); 
	// console.log("width = " + temp2);
	// $("#canvas").attr("width", 700);

	var h          = $("#canvas").height();
	var w          = $("#canvas").width();
	var ctx        = ($("#canvas")[0]).getContext("2d");	
	var cellwidth  = 10;
	var initLength = 5;
	var food1;
	var food2;
	var score1;
	var score2;
	var dir1;
	var dir2;
	var snake1;
	var snake2;

	function newgame(option){
		console.log("newgame");
		if(option === 1){
			dir1 = "right";
			score1 = 0;
			snake1 = [];
			ctx.fillStyle = "blue";
			createSnake(1);
			createFood(1);
		}
		else if(option === 2){
			dir2 = "right";
			score2 = 0;
			snake2 = [];
			ctx.fillStyle = "blue";
			createSnake(2);
			createFood(2);
		}
		else{
			dir1 = "right";
			score1 = 0;
			snake1 = [];
			ctx.fillStyle = "blue";
			createSnake(1);
			createFood(1);

			dir2 = "right";
			score2 = 0;
			snake2 = [];
			ctx.fillStyle = "blue";
			createSnake(2);
			createFood(2);	
		}

		if(typeof game_loop != "undefined") 
			clearInterval(game_loop);
		game_loop = setInterval(draw, 80);
	}

	function createFood(option){
		if(option === 1){
			food1 = {
				x : Math.round(Math.random() * w/cellwidth),
				y : Math.round(Math.random() * h/cellwidth) 
			};
		}
		else if (option === 2){
			food2 = {
				x : Math.round(Math.random() * w/cellwidth),
				y : Math.round(Math.random() * h/cellwidth) 	
			};
		}
	}

	function createSnake(option){
		if(option === 1){
			for(var i = initLength - 1; i >= 0; i--){
				snake1.push({x : i, y : 0});
			}
		}
		else if(option === 2){
			for(var i = initLength - 1; i >= 0; i--){
				snake2.push({x : i, y : h/cellwidth - 3});
			}
		}
	}

	function draw(){
		//console.log("draw");
		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, w, h);
		ctx.strokeStyle = "black";
		ctx.strokeRect(0, 0, w, h);

		// For movement, pop out the tail and place it in front of the current head cell
		 
		// snake 1
		
		var x = snake1[0].x;
		var y = snake1[0].y;
		console.log("1: " + x);
		console.log("1: " + y);

		if(dir1 === "right") 
			x++;
		else if(dir1 === "left") 
			x--;
		else if(dir1 === "up") 
			y--;
		else if(dir1 === "down") 
			y++;

		// Handle collisions with walls and body
		
		if(x === -1 || x === w/cellwidth || y === -1 || y === h/cellwidth || check_collision(x, y, snake1) || check_collision(x, y, snake2) || (x === food2.x && y === food2.y)){
			newgame(1);
			return;
		}
		
		// Handle getting food

		var tail;
		if(x === food1.x && y === food1.y){
			tail = {x : x, y: y};
			createFood(1);
			score1++;
		} 
		else{
			tail = snake1.pop();
			tail.x = x;
			tail.y = y;
		}

		snake1.unshift(tail);

		
		// snake 2

		x = snake2[0].x;
		y = snake2[0].y;
		
		if(dir2 === "right") 
			x++;
		else if(dir2 === "left") 
			x--;
		else if(dir2 === "up") 
			y--;
		else if(dir2 === "down") 
			y++;

		// Handle collisions with walls and body
		
		if(x === -1 || x === w/cellwidth || y === -1 || y === h/cellwidth || check_collision(x, y, snake2) || check_collision(x, y, snake1) || (x === food1.x && y === food1.y)){
			newgame(2);
			return;
		}
		
		// Handle getting food

		if(x === food2.x && y === food2.y){
			tail = {x : x, y: y};
			createFood(2);
			score2++;
		} 
		else{
			tail = snake2.pop();
			tail.x = x;
			tail.y = y;
		}

		snake2.unshift(tail);

		ctx.fillStyle = "red";
		
		for(var i = 0; i < snake1.length; i++){
			var cell1 = snake1[i];
			paint_cell(cell1);
		}
		paint_cell(food1);
		ctx.font = "18px Georgia";
		ctx.fillText("Score : " + score1, 5, h - 5);

		ctx.fillStyle = "blue";

		for(var i = 0; i < snake2.length; i++){
			var cell2 = snake2[i];
			paint_cell(cell2);
		}
		paint_cell(food2);
		ctx.font = "18px Georgia";
		ctx.fillText("Score : " + score2, w - 73, h - 5);
	}

	function paint_cell(cell){
		x = cell.x;
		y = cell.y;
		ctx.fillRect(x*cellwidth, y*cellwidth, cellwidth, cellwidth);
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
		if(key == "37" && dir2 != "right") 
			dir2 = "left";
		else if(key == "38" && dir2 != "down")
		 	dir2 = "up";
		else if(key == "39" && dir2 != "left") 
			dir2 = "right";
		else if(key == "40" && dir2 != "up")
			dir2 = "down";

		if(key == "65" && dir1 != "right") 
			dir1 = "left";
		else if(key == "87" && dir1 != "down")
		 	dir1 = "up";
		else if(key == "68" && dir1 != "left") 
			dir1 = "right";
		else if(key == "83" && dir1 != "up")
			dir1 = "down";
	});

	newgame(0);

});
