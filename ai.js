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
Behavior.Habit('Coward', function (initialspeed, decayrate, attractInstead, sporadic)
{
	initialspeed = initialspeed || 100.0;
	decayrate = decayrate || 10;
	attractInstead = attractInstead || false;
	sporadic = sporadic || false;

	var decayRate = 0.05 * decayrate;

	this.update = function update(dt)
	{
		this.velocity.x *= (1 - decayRate * dt / 1000);
		this.velocity.y *= (1 - decayRate * dt / 1000);

		this.point.x += this.velocity.x / dt;
		this.point.y += this.velocity.y / dt;

		if(sporadic && this.velocity.size() > 4)
		{
			this.point.x += Math.random() * 3 - 1.5;
			this.point.y += Math.random() * 3 - 1.5;			
		}

		return update.next.call(this, dt) || true;
	};

	this.click = function click(x, y)
	{
		var dx = this.point.x - x;
		var dy = this.point.y - y;

		var d = Math.sqrt(dx * dx + dy * dy);

		var normalized_dx = dx/d;
		var normalized_dy = dy/d;

		this.velocity.x = normalized_dx*Math.max(initialspeed-d,0);		
		this.velocity.y = normalized_dy*Math.max(initialspeed-d,0);

		if(attractInstead)
		{			
			this.velocity.x *= -1;		
			this.velocity.y *= -1;
		}

		return click.next.call(this, x, y) || false;
	}
});

//------------------------------------------------------------------------------
