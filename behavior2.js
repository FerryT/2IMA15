/*********************************************************\
* Behavior classes for game structures                    *
\*********************************************************/

//------------------------------------------------------------------------------

Behavior.Habit('Walls', function (time, width)
{
	time *= 1000;
	var value = width / time;

	this.create = function create()
	{
		this.time = time;
		this.wall = true;
		return create.next.call(this) || false;
	}

	this.update = function update(dt)
	{
		if (this.time <= 0)
			return update.next.call(this, dt) || false;
		this.time -= dt;
		this.rect.x += value * dt;
		return update.next.call(this, dt) || true;
	}
});

//------------------------------------------------------------------------------

Behavior.Habit('WallsColliding', function ()
{
	function bump(point, rect)
	{
		var y = point.y, y1 = rect.y, y2 = y1 + rect.h;
		if (y < y1 || y > y2) return;		
		var slice = game.slices[0];
		if (slice)
			point.y = slice.line.orientation(point) < 0 ? y1 - 1 : y2 + 1;
		else
			point.y = (y < (y1 + y2) / 2) ? y1 - 1 : y2 + 1;			
	}

	this.update = function update(dt)
	{
		update.next.call(this, dt);
		for (var i = 0, l = this.entities.length, ent; i < l; ++i)
		{
			ent = this.entities[i];
			for (var j = 0, k = this.structs.length, struct; j < k; ++j)
			{
				struct = this.structs[j];
				if (!struct.wall) continue;
				if (ent.point.collideRectangle(struct.rect, ent.size))
					bump(ent.point, struct.rect);
			}
		}
		return true;
	}
});

//------------------------------------------------------------------------------
