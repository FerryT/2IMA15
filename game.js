/*********************************************************\
* Structural definition of the game                       *
\*********************************************************/

function Game(width, height)
{
	this.paused = false;
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
	this.paused = true;
}

Game.prototype.resume = function resume()
{
	this.paused = false;
}

Game.prototype.slice = function slice(line)
{
	this.slices.push(new Slice(line, this.rect.shrink(-10)));
}

Game.prototype.update = function update(elapsedTime)
{
	if(!this.paused)
	{
		this.levels[this.level].update(elapsedTime, this.rect.w, this.rect.h);
	}
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

Level.prototype.update = function update(elapsedTime, width, height)
{
	var nrEntities = this.entities.length;
	for(var i = 0; i<nrEntities; i++)
	{
		this.entities[i].update(elapsedTime, width, height)
	}
}

//------------------------------------------------------------------------------

function Entity(point, group)
{
	if (!point || point.constructor != Point)
		throw new TypeError('first argument must be a Point.');
	this.id = Entity.id++;
	this.point = point;
		console.log(this.id +":"+this.point.x + " , " + this.point.y)
	this.group = +group || 0;
}

Entity.id = 0;

//------------------------------------------------------------------------------

function Slice(line, bb)
{
	if (!line || line.constructor != Line)
		throw new TypeError('first argument must be a Line.');
	this.line = line;
	this.slice = line.extend(bb);
}

Entity.prototype.update = function update(elapsedTime, width, height)
{	
		var dx = (Math.random() - 0.5)*elapsedTime/10;
		var dy = (Math.random() - 0.5)*elapsedTime/10;

		this.point.x += dx;
		this.point.y += dy;
		this.point.x = Math.min(this.point.x, width);
		this.point.x = Math.max(this.point.x, 0);
		this.point.y = Math.min(this.point.y, height);
		this.point.y = Math.max(this.point.y, 0);
}
//------------------------------------------------------------------------------
