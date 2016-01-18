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
Behavior.Habit('Draggable', function (centering)
{
	this.create = function create()
	{
		this.size = 20;
		return create.next.call(this) || true;
	}

	if (centering)
		this.drag = function drag(x, y, dx, dy)
		{
			this.point.x = x;
			this.point.y = y;
			return drag.next.call(this, x, y, dx, dy) || true;
		}
	else
		this.drag = function drag(x, y, dx, dy)
		{
			this.point.x += dx;
			this.point.y += dy;
			return drag.next.call(this, x, y, dx, dy) || true;
		}

	this.dragstart = function dragstart(x, y)
	{
		this.captured = true;
		return dragstart.next.call(this, x, y) || false;
	}

	this.dragend = function dragend(x, y)
	{
		delete this.captured;
		return dragend.next.call(this, x, y) || false;
	}
});

//------------------------------------------------------------------------------

// Makes entities collide
Behavior.Habit('Colliding', function (game)
{
	if (game.constructor != Game)
		throw new TypeError('first argument must be a Game.');

	function collide(ent1)
	{
		for (var i = 0, l = game.level.entities.length, ent, v, n, dist; i < l; ++i)
		{
			ent2 = game.level.entities[i];
			if (ent1 == ent2) continue;

			v = new Vector(ent2.point.x-ent1.point.x, ent2.point.y-ent1.point.y);
			n = v.size();
			dist = n - ent1.size - ent2.size;
			if (dist < 0)
			{
				ent1.point.x += v.x / n * dist;
				ent1.point.y += v.y / n * dist;
			}
		}
	}

	if (this.create.next)
		this.create = function create()
		{
			var ret = create.next.call(this);
			collide(this);
			return ret;
		}

	if (this.update.next)
		this.update = function update(dt)
		{
			var ret = update.next.call(this, dt);
			collide(this);
			return ret;
		}

	if (this.click.next)
		this.click = function click(x, y)
		{
			var ret = click.next.call(this, x, y);
			collide(this);
			return ret;
		}

	if (this.drag.next)
		this.drag = function drag(x, y, dx, dy)
		{
			var ret = drag.next.call(this, x, y, dx, dy);
			collide(this);
			return ret;
		}

	if (this.dragstart.next)
		this.dragstart = function dragstart(x, y)
		{
			var ret = dragstart.next.call(this, x, y);
			collide(this);
			return ret;
		}

	if (this.dragend.next)
		this.dragend = function dragend(x, y)
		{
			var ret = dragend.next.call(this, x, y);
			collide(this);
			return ret;
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
