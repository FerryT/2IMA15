/*********************************************************\
* Structural definition of the game                       *
\*********************************************************/

function Game(width, height)
{
	width = width || 100;
	height = height || 100;
	this.rect = new Rectangle(0, 0, width, height);
	this.levels = [new Level('')];

	this.level = 0;
	this.score = 0;
	this.slices = [];
}

Game.prototype.addLevel = function addLevel(def)
{
	if (!def.constructor == Level)
		throw new TypeError();
	this.levels.push(def);
}

Game.prototype.start = function start(level)
{
	this.level = level || 1;
	// Todo
}

Game.prototype.pause = function pause()
{
	// Todo
}

Game.prototype.slice = function slice(line)
{
	this.slices.push(line);
}

//------------------------------------------------------------------------------

function Level(name/*, [[p1, p2, ...], [p1, p2, ...], ...] */)
{
	this.name = name;
	this.sets = Array.prototype.slice.call(arguments, 1);
}

//------------------------------------------------------------------------------
