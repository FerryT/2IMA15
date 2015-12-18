/*********************************************************\
* Bahavior classes for game entities                      *
\*********************************************************/

function Behavior(name, parent)
{
	parent = parent || this;
	this.name = name;
	this.parent = parent;
	this.update    = parent.update    || function() {};
	this.click     = parent.click     || function() {};
	this.drag      = parent.drag      || function() {};
	this.dragstart = parent.dragstart || function() {};
	this.dragend   = parent.dragend   || function() {};
}

Behavior.create = function create(name, parent)
	{ return Behavior[name] = new Behavior(name, parent); }

//------------------------------------------------------------------------------

Behavior.create('None'); // No behavior, booooooring!

//------------------------------------------------------------------------------

Behavior.create('Pieter'); // Random wiggling
Behavior.Pieter.rate = 10;

Behavior.Pieter.update = function update(dt)
{
	var dx = (Math.random() - 0.5) * dt / Behavior.Pieter.rate;
	var dy = (Math.random() - 0.5) * dt / Behavior.Pieter.rate;

	this.point.x += dx;
	this.point.y += dy;
	this.point.clamp(game.rect);
}

//------------------------------------------------------------------------------
