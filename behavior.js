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
Behavior.Habit('Editable', function (behavior, dragignore)
{
	function edit(x, y)
	{
		var group = +(this.groups[0].length > this.groups[1].length);
		this.add(new Entity(new Point(x, y), group, behavior));

		for(var i = 0, l = this.entities.length; i < l; ++i)
			this.entities[i].behavior.click.call(this.entities[i], x, y);
	}

	if (dragignore)
		this.click = function click(x, y)
		{
			edit.call(this, x, y);
			return click.next.call(this, x, y) || true;
		}
	else
		this.dragend = function dragend(x, y)
		{
			edit.call(this, x, y);
			return dragend.next.call(this, x, y) || true;
		}
});

//------------------------------------------------------------------------------

// Clicking the level will notify entities
Behavior.Habit('Clickable', function (dragignore)
{
	if (dragignore)
		this.click = function click(x, y)
		{
			for(var i = 0, l = this.entities.length; i < l; ++i)
				this.entities[i].behavior.click.call(this.entities[i], x, y);
			return click.next.call(this, x, y) || true;
		}
	else
		this.dragend = function dragend(x, y)
		{
			for(var i = 0, l = this.entities.length; i < l; ++i)
				this.entities[i].behavior.click.call(this.entities[i], x, y);
			return dragend.next.call(this, x, y) || true;
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

	this.drag = function drag(x, y, dx, dy)
	{
		this.point.x += dx;
		this.point.y += dy;
		return drag.next.call(this, x, y, dx, dy) || true;
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
		this.drag = function drag(x, y, dx, dy)
		{
			var ret = drag.next.call(this, x, y, dx, dy);
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
