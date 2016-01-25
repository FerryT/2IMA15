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
		// The entity should not move on its own if the player is dragging it
		if (this.captured) 
			return update.next.call(this, dt);

		// This makes it jump back up when it has landed
		if (this.velocity.y >= height)
		{
			this.velocity.y = -height;
		}

		// By increasing the y velocity, when jumping upwards (negative y direction)
		// the entity will gradually slow down (until it reaches velocity 0)
		// and then slowly start falling (having a positive y direction)
		this.velocity.y += rate * dt / 1000;
		this.point.y += this.velocity.y / dt;

		return update.next.call(this, dt) || true;
	}
});

//------------------------------------------------------------------------------

// Describes entities that respond to mouse clicks (either moving away or going towards it)
Behavior.Habit('Coward', function (initialspeed, decayrate, attractInstead, sporadic)
{
	initialspeed = initialspeed || 100.0;
	decayrate = decayrate || 10;
	attractInstead = attractInstead || false;
	sporadic = sporadic || false;

	var decayRate = 0.05 * decayrate;

	// The effect of the mouse click is dependent
	// on the distance between the cursor and the entity
	this.click = function click(x, y)
	{
		// Calculate the distance between click and entity
		var dx = this.point.x - x;
		var dy = this.point.y - y;

		var d = Math.sqrt(dx * dx + dy * dy);

		// We construct a normalized vector which points
		// from the mouse click to the entity, since the 
		// velocity needs to be changed in a certain direction.
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

	// The initial boosts come from mouse clicks,
	// after that we just want the entity to slowly stop moving
	this.update = function update(dt)
	{
		this.velocity.x *= (1 - decayRate * dt / 1000);
		this.velocity.y *= (1 - decayRate * dt / 1000);

		this.point.x += this.velocity.x / dt;
		this.point.y += this.velocity.y / dt;

		// We can add some randomness to the movement to make the unit seem more
		// scared. We want this additional movement to be small compared to its velocity
		// so we do not add it anymore if the entity is sufficiently slowed down.
		if(sporadic && this.velocity.size() > 4)
		{
			this.point.x += Math.random() * 3 - 1.5;
			this.point.y += Math.random() * 3 - 1.5;			
		}

		return update.next.call(this, dt) || true;
	};
});

//------------------------------------------------------------------------------
