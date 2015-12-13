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
	this.slices.push(new Slice(line, this.rect.shrink(-10)));
}

//------------------------------------------------------------------------------

function Level(name)
{
	this.name = name;
	this.entities = [];
	this.groups = [];
}

Level.prototype.add = function(ent)
{
	if (ent && ent.constructor == Entity)
	{
		this.entities.push(ent);
		this.groups[ent.group] = this.groups[ent.group] || [];
		this.groups[ent.group].push(ent);
	}
}

Level.prototype.points = function(group)
{
	return this.groups[group].map(function (ent) { return ent.point; });
}

//------------------------------------------------------------------------------

function Entity(point, group)
{
	if (!point || point.constructor != Point)
		throw new TypeError('first argument must be a Point.');
	this.point = point;
	this.group = +group || 0;
}

//------------------------------------------------------------------------------

function Slice(line, bb)
{
	if (!line || line.constructor != Line)
		throw new TypeError('first argument must be a Line.');
	this.line = line;
	this.slice = line.extend(bb);
}

//------------------------------------------------------------------------------
