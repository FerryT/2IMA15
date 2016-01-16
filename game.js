/*********************************************************\
* Structural definition of the game                       *
\*********************************************************/

function Game(width, height, rate)
{
	this.paused = false;
	width = width || 100;
	height = height || 100;
	this.rect = new Rectangle(0, 0, width, height);
	this.levels = [new Level('')];
	this.data = {
		unlocked: [true, true],
	};

	this.level = this.levels[0].clone();
	this.level.id = 0;
	this.paused = true;
	this.score = 0;
	this.slices = [];
	this.rate = rate || 1000;

	var dispatch = d3.dispatch('update', 'win');
	this.on = dispatch.on.bind(dispatch);
	this.on.dispatch = dispatch;
}

Game.prototype.addLevel = function addLevel(def)
{
	if (!def || def.constructor != Level)
		throw new TypeError();
	this.levels.push(def);
	return this;
}

Game.prototype.start = function start(level)
{
	if (level >= this.levels.length) return;
	if (this.data.unlocked[level] !== true) return;
	this.pause();
	this.level = this.levels[level].clone();
	this.level.id = level;
	this.level.next = level + 1 < this.levels.length ? level + 1 : 0;
	return this.resume().update();
}

Game.prototype.stop = function stop()
{
	this.level = this.levels[0].clone();
	this.level.id = 0;
	this.paused = true;
	return this;
}

Game.prototype.pause = function pause()
{
	if (this.paused) return;
	this.paused = true;
	clearInterval(this.interval);
	return this;
}

Game.prototype.resume = function resume()
{
	if (!this.paused) return;
	this.paused = false;
	this.interval = setInterval(this.frame.bind(this), this.rate);
	return this;
}

Game.prototype.slice = function slice(line)
{
	this.slices = [new Slice(line, this.rect.shrink(-10))];
	return this;
}

Game.prototype.frame = function frame()
{
	if(this.paused) return;

	for (var i = 0, l = this.level.entities.length, ent; i < l; ++i)
	{
		ent = this.level.entities[i];
		ent.behavior.update.call(ent, this.rate);
	}

	for (var i = 0, l = this.level.goals.length; i < l; ++i)
		if (this.level.goals[i].check())
			this.win();

	this.level.behavior.update.call(this.level, this.rate);
	return this.update();
}

Game.prototype.update = function update()
{
	var line = NaiveAlgorithm(this.level.points(0), this.level.points(1));
	if (line)
	{
		this.slice(line);
		this.on.dispatch.update();
	}
	return this;
}

Game.prototype.win = function win()
{
	this.pause();
	this.data.unlocked[this.level.next] = true;
	this.on.dispatch.win();
	return this;
}

//------------------------------------------------------------------------------

function Level(name, behavior)
{
	this.name = name;
	this.goals = [];
	this.structs = [];
	this.entities = [];
	this.groups = [];
	this.behavior = behavior || Behavior.None;

	this.behavior.create.call(this);
}

Level.prototype.add = function(ent)
{
	if (!ent) return;
	if (ent.constructor == Entity)
	{
		this.entities.push(ent);
		this.groups[ent.group] = this.groups[ent.group] || [];
		this.groups[ent.group].push(ent);
	}
	else if (ent.constructor == Structure)
	{
		this.structs.push(ent);
	}
	else if (ent.constructor == Goal)
	{
		this.goals.push(ent);
	}
	else if(Array.isArray(ent) && ent.length && ent[0].constructor == Entity)
	{
		for(var i = 0, l = ent.length; i < l; ++i)
			this.add(ent[i]);
	}
	return this;
}

Level.prototype.points = function(group)
{
	return (this.groups[group] || []).map(function (ent) { return ent.point; });
}

Level.prototype.clone = function clone()
{
	var level = new Level(this.name, this.behavior);
	for (var i = 0, l = this.goals.length; i < l; ++i)
		level.add(this.goals[i].clone());
	for (var i = 0, l = this.structs.length; i < l; ++i)
		level.add(this.structs[i].clone());
	for (var i = 0, l = this.entities.length; i < l; ++i)
		level.add(this.entities[i].clone());
	return level;
}

//------------------------------------------------------------------------------

function Goal(line, width)
{
	this.line = line;
	this.width = width;
}

Goal.prototype.clone = function clone()
	{ return new Goal(this.line.clone(), this.width); }

Goal.prototype.check = function check()
{
	var gameGroupOne = game.level.points(0);
	var gameGroupTwo = game.level.points(1);
	var goalAchieved = NaiveCheckIfLineIsProperCut(this.line, gameGroupOne, gameGroupTwo);
	return goalAchieved;
}

//------------------------------------------------------------------------------

function Entity(point, group, behavior, cls, id)
{
	if (!point || point.constructor != Point)
		throw new TypeError('first argument must be a Point.');
	
	this.point = point;
	this.size = 10;
	this.group = +group || 0;
	this.cls = cls;
	this.behavior = behavior || Behavior.None;
	this.id = id || Entity.id++;
	this.velocity = new Vector(0, 0);

	this.behavior.create.call(this);
}

Entity.id = 0;

Entity.prototype.clone = function clone()
{
	return new Entity(this.point.clone(), this.group, this.behavior, this.cls, this.id);
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

function Structure(rect, behavior, cls, id)
{
	if (!rect || rect.constructor != Rectangle)
		throw new TypeError('first argument must be a Rectangle.');

	this.rect = rect;
	this.point = rect; // Fake point, duck typing
	this.cls = cls;
	this.behavior = behavior || Behavior.None;
	this.id = id || Structure.id++;

	this.behavior.create.call(this);
}

Structure.id = 0;

Structure.prototype.clone = function clone()
{
	return new Structure(this.rect.clone(), this.behavior, this.cls, this.id);
}

//------------------------------------------------------------------------------
