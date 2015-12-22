/*********************************************************\
* Behavior classes for game entities                      *
\*********************************************************/

function Behavior()
{
	function noop() { return false; }
	this.update    = parent.update    || noop;
	this.click     = parent.click     || noop;
	this.drag      = parent.drag      || noop;
	this.dragstart = parent.dragstart || noop;
	this.dragend   = parent.dragend   || noop;
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

// Makes entities movable by dragging them
Behavior.Habit('Draggable', function ()
{
	this.drag = function drag(x, y)
	{
		this.point.x = x;
		this.point.y = y;
		this.point.clamp(game.rect); // Todo: Make clamping a separate habit

		return drag.next.call(this, x, y) || true;
	}
});

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

		return update.next.call(this, dt) || true;
	}
});

//------------------------------------------------------------------------------

// Describes points moving vertically in a jumping motion
Behavior.Habit('Bounce', function (rate)
{
	rate = rate || 10;

	this.update = function update(dt)
	{
		if(this.velocity.y >= 50)
			this.velocity.y = -50;

		this.velocity.y += rate * dt / 1000;


		this.point.y += this.velocity.y / dt;
		this.point.clamp(game.rect);

		return update.next.call(this, dt) || true;
	}
});

//------------------------------------------------------------------------------

// Describes points moving away from mouse clicks
Behavior.Habit('Coward', function (rate)
{
	rate = rate || 10;

	this.update = function update(dt)
	{
		var decayRate = 0.05 * rate;
		this.velocity.x *= (1 - decayRate * dt / 1000);
		this.velocity.y *= (1 - decayRate * dt / 1000);


		this.point.x += this.velocity.x / dt;
		this.point.y += this.velocity.y / dt;
		this.point.clamp(game.rect);

		return update.next.call(this, dt) || true;
	};

	this.click = function click(x, y)
	{
		var dx = this.point.x - x;
		var dy = this.point.y - y;

		this.velocity.y = 100.0/dx;
		this.velocity.y = 100.0/dy;

		return click.next.call(this, dt) || false;
	}
});