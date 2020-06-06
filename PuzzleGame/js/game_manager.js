function GameManager(InputManager, Actuator, StorageManager, editor) {
  this.editor = editor;
  this.inputManager   = new InputManager(this.editor);
  this.storageManager = new StorageManager;
  this.actuator       = new Actuator(this.editor);
  
  
  this.inputManager.on("move", this.move.bind(this));
  this.inputManager.on("generate", this.generate.bind(this));
  this.inputManager.on("tileCreate", this.tileCreate.bind(this));
  this.inputManager.on("outputPuzzle", this.outputPuzzle.bind(this));
  this.inputManager.on("load", this.load.bind(this));
  this.inputManager.on("save", this.save.bind(this));
  this.inputManager.on("codeLoad", this.codeLoad.bind(this));

  this.adjustX = 117;
  this.adjustY = 117;
  
  this.setup();
}

GameManager.prototype.setSize = function (numTilesX, numTilesY) {

	if (this.sizeX != numTilesX || this.sizeY != numTilesY)
	{
		this.sizeX = numTilesX;
		this.sizeY = numTilesY;
		this.grid = new Grid(numTilesX, numTilesY);
		var i;
	    var containerSizeX = (numTilesX * this.adjustX) + 15;
	    var containerSizeY = (numTilesY * this.adjustY) + 15;

		$(".sizing-container").css("width", containerSizeX + "px");
	    $(".sizing-container").css("height", containerSizeY + "px");
		$(".sizing-container").css("margin-left", (1080 / containerSizeX) + "px");

		$(".grid-container").empty();
	    for (i = 0; i < numTilesY; i++)
	    {
			$(".grid-container").append("<div class='grid-row'>")
			$(".grid-container").append("</div>")
	    }
	    for (i = 0; i < numTilesX; i++)
	    {
			$(".grid-row").append("<div class='grid-cell'></div>");
	    }
	}
	else
	{
		this.sizeX = numTilesX;
		this.sizeY = numTilesY;
		this.grid = new Grid(numTilesX, numTilesY);
	}
}

GameManager.prototype.generate = function () {
	var X = parseInt(document.getElementById('X').value);
	var Y = parseInt(document.getElementById('Y').value);
	if (X > 10 || Y > 10)
	{
		alert("YO DON'T MAKE HUGE MAPS BRO");
	}
	else
	{
		this.setSize(X, Y);
		this.actuate();
	}
}

GameManager.prototype.tileCreate = function () {
	var X = parseInt(document.getElementById('tileX').value);
	var Y = parseInt(document.getElementById('tileY').value);
	var type = parseInt(document.getElementById('tileType').value);
	if (X > this.sizeX || Y > this.sizeY)
	{
		alert("Max Size 10x10");
	}
	else if (type < 0)
	{
		alert("The type has to be valid");
	}
	else
	{
	    var cell = {x: X, y: Y};
		if (type == 0)
		{
			this.grid.removeTile(cell);
			this.prepareTiles();
			this.actuate();
		}
		else
		{
		  var tile = new Tile(cell, type);
		  if (type == 4)
		  	tile.toggleMovable();
		  this.grid.insertTile(tile);
		  this.prepareTiles();
		  this.actuate();
		}
	}
};
GameManager.prototype.codeLoad = function () {
  this.actuator.continueGame();
  this.over        = false;
  this.won         = false;
  this.keepPlaying = false;
  var state = document.getElementById('code').value;
  if (state != null)
  {
	var x = 0;
	while (state.charAt(x) != " ")
	{
		this.sizeString += state.charAt(x);
		x++;
	}
	if (x == 3)
	{
		if (state.charAt(0) == "1")
		{
			if (state.charAt(1) == "0")
			{
				this.setSize(10, parseInt(state.charAt(2)));
			}
			else if (state.charAt(1) == "1" && state.charAt(2) == "0")
			{
				this.setSize(parseInt(state.charAt(0)), 10);
			}
		}
		else if (state.charAt(1) == "1" && state.charAt(2) == "0")
		{
			this.setSize(parseInt(state.charAt(0)), 10);
		}
	}
	else if (x == 4)
	{
		if (state.charAt(0) == "1" && state.charAt(1) == "0" && state.charAt(2) == "1" && state.charAt(3) == "0")
			this.setSize(10,10);
	}
	else
	{
        this.setSize(parseInt(state.charAt(0)), parseInt(state.charAt(1)));
	}
	for (var i = 0; i < (state.length - (x + 1)) / 3; i++)
	{
		var value = parseInt(state.charAt((i * 3) + x + 3));
		var cell = {x: parseInt(state.charAt((i * 3) + x + 1)), y: parseInt(state.charAt((i * 3) + x + 2))};
		var tile = new Tile(cell, value);
		if (value == 4)
			tile.toggleMovable();
		this.grid.insertTile(tile);
	}
	this.actuate();
  }
};

GameManager.prototype.load = function () {
  if (this.saveState != null)
  {
	var x = 0;
	while (this.saveState.charAt(x) != " ")
	{
		this.sizeString += this.saveState.charAt(x);
		x++;
	}
	if (x == 3)
	{
		if (this.saveState.charAt(0) == "1")
		{
			if (this.saveState.charAt(1) == "0")
			{
				this.setSize(10, parseInt(this.saveState.charAt(2)));
			}
			else if (this.saveState.charAt(1) == "1" && this.saveState.charAt(2) == "0")
			{
				this.setSize(parseInt(this.saveState.charAt(0)), 10);
			}
		}
		else if (this.saveState.charAt(1) == "1" && this.saveState.charAt(2) == "0")
		{
			this.setSize(parseInt(this.saveState.charAt(0)), 10);
		}
	}
	else if (x == 4)
	{
		if (this.saveState.charAt(0) == "1" && this.saveState.charAt(1) == "0" && this.saveState.charAt(2) == "1" && this.saveState.charAt(3) == "0")
			this.setSize(10,10);
	}
	else
	{
        this.setSize(parseInt(this.saveState.charAt(0)), parseInt(this.saveState.charAt(1)));
	}
	for (var i = 0; i < (this.saveState.length - (x + 1)) / 3; i++)
	{
		var cell = {x: parseInt(this.saveState.charAt((i * 3) + x + 1)), y: parseInt(this.saveState.charAt((i * 3) + x + 2))};
		var tile = new Tile(cell, parseInt(this.saveState.charAt((i * 3) + x + 3)));
		if (parseInt(this.saveState.charAt((i * 3) + x + 3)) == 4)
			tile.toggleMovable();
		this.grid.insertTile(tile);
	}
	this.actuate();
  }
};

GameManager.prototype.save = function () {
    var outputStr = this.sizeX + "" + this.sizeY + " ";
  for (var i = 0; i < this.sizeX; i++)
  {
	  for (var j = 0; j < this.sizeY; j++)
	  {
		  if (this.grid.cells[i][j] != null)
		  {
			  outputStr += this.grid.cells[i][j].x;
			  outputStr += this.grid.cells[i][j].y;
			  outputStr += this.grid.cells[i][j].value;
		  }
	  }
  }
  this.saveState = outputStr;
};

// Return true if the game is lost, or has won and the user hasn't kept playing
GameManager.prototype.isGameTerminated = function () {
  return this.over || (this.won);
};

GameManager.prototype.outputPuzzle = function () {
  var outputStr = this.sizeX + "" + this.sizeY + " ";
  for (var i = 0; i < this.sizeX; i++)
  {
	  for (var j = 0; j < this.sizeY; j++)
	  {
		  if (this.grid.cells[i][j] != null)
		  {
			  outputStr += this.grid.cells[i][j].x;
			  outputStr += this.grid.cells[i][j].y;
			  outputStr += this.grid.cells[i][j].value;
		  }
	  }
  }
  document.getElementById('output').innerHTML = "GENERATED CODE: " + outputStr;
};

// Set up the game
GameManager.prototype.setup = function () {
    //var previousState = this.storageManager.getGameState();
    this.over        = false;
    this.won         = false;
    this.keepPlaying = false;

  this.setSize(3,3);
  // Update the actuator
  this.actuate();
};

// Sends the updated grid to the actuator
GameManager.prototype.actuate = function () {
  // Clear the state when the game is over (game over only, not win)
  if (this.over) {
    this.storageManager.clearGameState();
  } else {
    this.storageManager.setGameState(this.serialize());
  }

  this.actuator.actuate(this.grid, {
    over:       this.over,
    won:        this.won,
    terminated: this.isGameTerminated()
  });

};

// Represent the current game as an object
GameManager.prototype.serialize = function () {
  return {
    over:        this.over,
    won:         this.won,
  };
};

// Save all tile positions and remove merger info
GameManager.prototype.prepareTiles = function () {
  this.grid.eachCell(function (x, y, tile) {
    if (tile) {
      tile.savePosition();
    }
  });
};

// Move a tile and its representation
GameManager.prototype.moveTile = function (tile, cell) {
  this.grid.cells[tile.x][tile.y] = null;
  this.grid.cells[cell.x][cell.y] = tile;
  tile.updatePosition(cell);
};

// Move tiles on the grid in the specified direction
GameManager.prototype.move = function (direction) {
  // 0: up, 1: right, 2: down, 3: left
  var self = this;

  if (this.isGameTerminated() && !this.editor) return; // Don't do anything if the game's over

  var cell, tile;

  var vector     = this.getVector(direction);
  var traversals = this.buildTraversals(vector);
  var moved      = false;

  // Save the current tile positions
  this.prepareTiles();

  // Traverse the grid in the right direction and move tiles
  traversals.x.forEach(function (x) {
    traversals.y.forEach(function (y) {
      cell = { x: x, y: y };
      tile = self.grid.cellContent(cell);

      if (tile && tile.getMovable()) {
        var positions = self.findFarthestPosition(cell, vector);

        self.moveTile(tile, positions.farthest);

        if (!self.positionsEqual(cell, tile)) {
          moved = true; // The tile moved from its original cell!
        }
      }
    });
  });
  
  var j = 0;
  var i = 0;
  for (j = 0; j < this.sizeX; j++)
  {
	  for (i = 0; i < this.sizeY; i++)
	  {
		  cell = {x: j, y: i};
		  tile = self.grid.cellContent(cell);
		  if (tile)
		  {
			  if (tile.value == 1)
			  {
				  var nextCell = {x: j + 1, y: i};
				  var next = self.grid.cellContent(nextCell);
				  if (next && next.value == 2)
				  {
					  if (!this.Editor)
						self.won = true;
				  }
			  }
		  }
	  }
  }

  if (moved) {

    if (!this.movesAvailable()) {
      this.over = true;
    }

    this.actuate();
  }
};

// Get the vector representing the chosen direction
GameManager.prototype.getVector = function (direction) {
  // Vectors representing tile movement
  var map = {
    0: { x: 0,  y: -1 }, // Up
    1: { x: 1,  y: 0 },  // Right
    2: { x: 0,  y: 1 },  // Down
    3: { x: -1, y: 0 }   // Left
  };

  return map[direction];
};

// Build a list of positions to traverse in the right order
GameManager.prototype.buildTraversals = function (vector) {
  var traversals = { x: [], y: [] };

  for (var pos = 0; pos < this.sizeX; pos++) {
    traversals.x.push(pos);
  }
  for (var pos = 0; pos < this.sizeY; pos++) {
	traversals.y.push(pos);
  }

  // Always traverse from the farthest cell in the chosen direction
  if (vector.x === 1) traversals.x = traversals.x.reverse();
  if (vector.y === 1) traversals.y = traversals.y.reverse();

  return traversals;
};

GameManager.prototype.findFarthestPosition = function (cell, vector) {
  var previous;

  // Progress towards the vector direction until an obstacle is found
  do {
    previous = cell;
    cell     = { x: previous.x + vector.x, y: previous.y + vector.y };
  } while (this.grid.withinBounds(cell) &&
           this.grid.cellAvailable(cell));

  return {
    farthest: previous,
  };
};

GameManager.prototype.movesAvailable = function () {
  return this.grid.cellsAvailable();
};

GameManager.prototype.positionsEqual = function (first, second) {
  return first.x === second.x && first.y === second.y;
};