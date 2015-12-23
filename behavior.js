/*********************************************************\
* Behavior classes for game entities                      *
\*********************************************************/

function Behavior()
{
	function noop() { return false; }
	this.create    = noop;
	this.update    = noop;
	this.click     = noop;
	this.drag      = noop;
	this.dragstart = noop;
	this.dragend   = noop;
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

// Clicking the level will add points
Behavior.Habit('Editable', function (behavior)
{
	this.click = function click(x, y)
	{
		var group = +(this.groups[0].length > this.groups[1].length);
		this.add(new Entity(new Point(x, y), group, behavior));
		return click.next.call(this, x, y) || true;
	}
});

//------------------------------------------------------------------------------

// Makes entities movable by dragging them
Behavior.Habit('Draggable', function ()
{
	this.create = function create()
	{
		this.size = 20;
		return create.next.call(this) || true;
	}

	this.drag = function drag(x, y)
	{
		this.point.x = x;
		this.point.y = y;
		return drag.next.call(this, x, y) || true;
	}
});

//------------------------------------------------------------------------------

// Keeps the entities within a rectangle
Behavior.Habit('Clamped', function (rect)
{
	if (rect.constructor != Rectangle)
		throw new TypeError('first argument must be a Rectangle.');

	if (this.create.next)
		this.create = function create()
		{
			var ret = create.next.call(this);
			this.point.clamp(rect);
			return ret;
		}

	if (this.update.next)
		this.update = function update(dt)
		{
			var ret = update.next.call(this, dt);
			this.point.clamp(rect);
			return ret;
		}

	if (this.click.next)
		this.click = function click(x, y)
		{
			var ret = click.next.call(this, x, y);
			this.point.clamp(rect);
			return ret;
		}

	if (this.drag.next)
		this.drag = function drag(x, y)
		{
			var ret = drag.next.call(this, x, y);
			this.point.clamp(rect);
			return ret;
		}

	if (this.dragstart.next)
		this.dragstart = function dragstart(x, y)
		{
			var ret = dragstart.next.call(this, x, y);
			this.point.clamp(rect);
			return ret;
		}

	if (this.dragend.next)
		this.dragend = function dragend(x, y)
		{
			var ret = dragend.next.call(this, x, y);
			this.point.clamp(rect);
			return ret;
		}
});

//------------------------------------------------------------------------------

// Entities that wiggle randomly
Behavior.Habit('Pieter', function (rate)
{
	rate = rate || 10;

	this.update = function update(dt)
	{
		var dx = (Math.random() - 0.5) * dt / rate;
		var dy = (Math.random() - 0.5) * dt / rate;

		this.point.x += dx;
		this.point.y += dy;

		return update.next.call(this, dt) || true;
	}
});

//------------------------------------------------------------------------------

// Describes entities moving vertically in a jumping motion
Behavior.Habit('Bounce', function (rate)
{
	rate = rate || 10;

	this.update = function update(dt)
	{
		if(this.velocity.y >= 50)
			this.velocity.y = -50;

		this.velocity.y += rate * dt / 1000;
		this.point.y += this.velocity.y / dt;

		return update.next.call(this, dt) || true;
	}
});

//------------------------------------------------------------------------------

// Describes entities moving away from mouse clicks
Behavior.Habit('Coward', function (rate)
{
	rate = rate || 10;
	var decayRate = 0.05 * rate;

	this.update = function update(dt)
	{
		this.velocity.x *= (1 - decayRate * dt / 1000);
		this.velocity.y *= (1 - decayRate * dt / 1000);

		this.point.x += this.velocity.x / dt;
		this.point.y += this.velocity.y / dt;

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

//------------------------------------------------------------------------------
