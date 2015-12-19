/*********************************************************\
* Bahavior classes for game entities                      *
\*********************************************************/

function Behavior()
{
	this.update    = parent.update    || function() {};
	this.click     = parent.click     || function() {};
	this.drag      = parent.drag      || function() {};
	this.dragstart = parent.dragstart || function() {};
	this.dragend   = parent.dragend   || function() {};
}

Behavior.Habit = function Habit(name, func)
{
	Behavior.prototype[name] = function()
	{
		var prev = {};
		for (var x in this)
			if (this.hasOwnProperty(x))
				prev[x] = this[x];

		func.apply(this, Array.prototype.slice.call(arguments));

		for (var x in this)
			if (this.hasOwnProperty(x) && prev[x] != this[x])
				this[x].next = prev[x];

		return this;
	}
}

Behavior.None = Object.freeze(new Behavior); // No behavior, booooooring!

//------------------------------------------------------------------------------

Behavior.Habit('Pieter', function (rate) // Random wiggling
{
	rate = rate || 10;

	this.update = function update(dt)
	{
		var dx = (Math.random() - 0.5) * dt / rate;
		var dy = (Math.random() - 0.5) * dt / rate;

		this.point.x += dx;
		this.point.y += dy;
		this.point.clamp(game.rect);

		update.next.call(this, dt);
	}
});

//------------------------------------------------------------------------------
