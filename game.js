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

	this.level = this.levels[0].clone();
	this.paused = true;
	this.score = 0;
	this.slices = [];
	this.rate = rate || 1000;
}

Game.prototype.addLevel = function addLevel(def)
{
	if (!def.constructor == Level)
		throw new TypeError();
	this.levels.push(def);
}

Game.prototype.start = function start(level)
{
	this.pause();
	levelheader.innerText = this.levels[level].name;
	this.level = this.levels[level].clone();
	if (level + 1 < this.levels.length)
		this.level.next = level + 1;
	this.resume();
}

Game.prototype.pause = function pause()
{
	if (this.paused) return;
	this.paused = true;
	clearInterval(this.interval);
}

Game.prototype.resume = function resume()
{
	if (!this.paused) return;
	this.paused = false;
	this.interval = setInterval(this.update.bind(this), this.rate);
}

Game.prototype.slice = function slice(line)
{
	this.slices.push(new Slice(line, this.rect.shrink(-10)));
}

Game.prototype.update = function update()
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
}

Game.prototype.win = function win()
{
	// Todo: do something
	if (this.level.next)
	{
		window.alert("Congratulations! But there are more levels..");
		this.start(this.level.next);		
	}
	else
	{
		window.alert("You beat the game");
	}
}

//------------------------------------------------------------------------------

function Level(name)
{
	this.name = name;
	this.goals = [];
	this.entities = [];
	this.groups = [];
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
	else if (ent.constructor == Goal)
	{
		this.goals.push(ent);
	}
	else if(ent.constructor == Array && ent.length > 0 && ent[0].constructor == Entity)
	{
		for(var i = 0; i<ent.length; i++)
		{
			this.add(ent[i]);
		}
	}
}

Level.prototype.points = function(group)
{
	return this.groups[group].map(function (ent) { return ent.point; });
}

Level.prototype.clone = function clone()
{
	var level = new Level(this.name);
	for (var i = 0, l = this.goals.length; i < l; ++i)
		level.add(this.goals[i].clone());
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

function Entity(point, group, behavior, id)
{
	if (!point || point.constructor != Point)
		throw new TypeError('first argument must be a Point.');
	
	this.point = point;
	this.group = +group || 0;
	this.behavior = behavior || Behavior.None;
	this.id = id || Entity.id++;

	// We use point as a 2D speed vector (for now)
	this.velocity = new Point(0,0);
}

Entity.id = 0;

Entity.prototype.clone = function clone()
{
	return new Entity(this.point.clone(), this.group, this.behavior, this.id);
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
