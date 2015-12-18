/*********************************************************\
* Geometric data structures and operations                *
\*********************************************************/

function Point(x, y)
{
	if ($.isArray(x))
	{
		this.x = x[0];
		this.y = x[1];
	}
	else
	{
		this.x = x || 0;
		this.y = y || 0;
	}
}

Point.prototype.clone = function clone()
	{ return new Point(this.x, this.y); }

//------------------------------------------------------------------------------

function Line(x1, y1, x2, y2)
{
	if ($.isArray(x1))
	{
		this.x1 = x1[0];
		this.y1 = x1[1];
		this.x2 = x1[2];
		this.y2 = x1[3];
	}
	else if (x1 && x1.constructor == Point)
	{
		this.x1 = x1.x;
		this.y1 = x1.y;
		this.x2 = y1.x;
		this.y2 = y1.y;
	}
	else
	{
		this.x1 = x1 || 0;
		this.y1 = y1 || 0;
		this.x2 = x2 || 0;
		this.y2 = y2 || 0;
	}
}

Line.prototype.clone = function clone()
	{ return new Line(this.x1, this.y1, this.x2, this.y2); }

//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

Line.prototype.extend = function extend(rect)
{
	if (rect.constructor != Rectangle)
		throw new TypeError('first argument must be a Rectangle.')
	var dx = this.x2 - this.x1,
		dy = this.y2 - this.y1,
		x = this.x1,
		y = this.y1
		t1x = (rect.x - x) / dx,
		t1y = (rect.y - y) / dy,
		t2x = (rect.x + rect.w - x) / dx,
		t2y = (rect.y + rect.h - y) / dy,
		t1 = Math.max(Math.min(t1x, t2x), Math.min(t1y, t2y)),
		t2 = Math.min(Math.max(t1x, t2x), Math.max(t1y, t2y));
	return new Line(t1 * dx + x, t1 * dy + y, t2 * dx + x, t2 * dy + y);
}

//------------------------------------------------------------------------------

Line.prototype.orientation = function orientation(point)
{
	if (point.constructor != Point)
		throw new TypeError('first argument must be a point.')
	
	var d = (this.x1 - point.x) * (this.y2 - point.y) - (this.x2 - point.x) * (this.y1 - point.y);
	return Math.sign(d); // Determines the sign
}

//------------------------------------------------------------------------------

function Rectangle(x, y, w, h)
{
	if ($.isArray(x))
	{
		this.x = x[0];
		this.y = x[1];
		this.w = x[2];
		this.h = x[3];
	}
	else if (x && x.constructor == Point)
	{
		this.x = Math.min(x.x, y.x);
		this.y = Math.min(x.y, y.y);
		this.w = Math.abs(x.x - y.x);
		this.h = Math.abs(x.y - y.y);
	}
	else
	{
		this.x = x || 0;
		this.y = y || 0;
		this.w = w || 0;
		this.h = h || 0;
	}
}

Rectangle.prototype.clone = function clone()
	{ return new Rectangle(this.x, this.y, this.w, this.h); }

//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

Rectangle.prototype.shrink = function shrink(amount)
{
	return new Rectangle(
		this.x + amount / 2,
		this.y + amount / 2,
		this.w - amount,
		this.h - amount);
}

//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

Rectangle.prototype.randomPoint = function randomPoint()
{
	return new Point(
		this.x + this.w * Math.random(),
		this.y + this.h * Math.random());
}

//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

Rectangle.prototype.toString = function toString()
{
	return [this.x, this.y, this.w, this.h].join(' ');
}

//------------------------------------------------------------------------------