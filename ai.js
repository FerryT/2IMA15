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
Behavior.Habit('Bounce', function (rate, height)
{
	rate = rate || 10;
	height = height || 50;

	this.update = function update(dt)
	{
		if(this.velocity.y >= height)
			this.velocity.y = -height;

		this.velocity.y += rate * dt / 1000;
		this.point.y += this.velocity.y / dt;

		return update.next.call(this, dt) || true;
	}
});

//------------------------------------------------------------------------------

// Describes entities moving away from mouse clicks
Behavior.Habit('Coward', function (initialspeed, decayrate)
{
	decayrate = decayrate || 10;
	var decayRate = 0.05 * decayrate;
	initialspeed = initialspeed || 100.0;

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

		var speed = initialspeed / Math.sqrt(dx*dx + dy*dy);

		//if(Math.abs(dx) < 50)
			this.velocity.x = speed/dx;
		
		//if(Math.abs(dy) < 50)
			this.velocity.y = speed/dy;

		return click.next.call(this, x, y) || false;
	}
});

//------------------------------------------------------------------------------
