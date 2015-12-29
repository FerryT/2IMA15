/*********************************************************\
* Artificial "intelligence" for game entities             *
\*********************************************************/

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

		return click.next.call(this, x, y) || false;
	}
});

//------------------------------------------------------------------------------
