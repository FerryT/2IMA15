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

		update.next.call(this, dt);
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

		update.next.call(this, dt);
	};

	this.click = function click(coordinates)
	{
		var dx = this.point.x - coordinates[0];
		var dy = this.point.y - coordinates[1];

		this.velocity.y = 100.0/dx;
		this.velocity.y = 100.0/dy;
	}
});