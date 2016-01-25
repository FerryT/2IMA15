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

Point.prototype.is = function is(point)
	{ return this.x == point.x && this.y == point.y; }

//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

Point.prototype.distance = function distance(point)
{
	if (point.constructor != Point)
		throw new TypeError('first argument must be a point.');

	var vx = this.x - point.x,
		vy = this.y - point.y;
	return Math.sqrt(vx * vx + vy * vy);
}

//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

Point.prototype.clamp = function clamp(rect)
{
	if (rect.constructor != Rectangle)
		throw new TypeError('first argument must be a Rectangle.');
	this.x = Math.min(Math.max(this.x, rect.x), rect.x + rect.w);
	this.y = Math.min(Math.max(this.y, rect.y), rect.y + rect.h);
}

//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

Point.prototype.dual = function dual() // *IMPORTANT* do not use in algorithms!
{
	//return new Line(0, -this.y, this.y / this.x, 0);
	return new Line(0, -this.y, 1, this.x - this.y);
}

//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

Point.prototype.multiply = function multiply(rect)
{
	if (rect.constructor != Rectangle)
		throw new TypeError('first argument must be a Rectangle.');
	return new Point(
		 rect.x + rect.w * this.x,
		 rect.y + rect.h * this.y);
}

//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

Point.prototype.collidePoint = function collidePoint(point, dist)
{
	v = new Vector(point.x - this.x, point.y - this.y);
	norm = v.size();
	dist = norm - dist;
	if (dist >= 0)
		return false;
	this.x += v.x / norm * dist;
	this.y += v.y / norm * dist;
	return true;
}
//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

Point.prototype.collideRectangle = function collideRectangle(rect, dist)
{
	var x1 = rect.x, x2 = x1 + rect.w, y1 = rect.y, y2 = y1 + rect.h,
		state = (this.x < x1 ? 0 : (this.x > x2 ? 2 : 1))
		+ (this.y < y1 ? 0 : (this.y > y2 ? 6 : 3)),
		cx = this.x - rect.x - rect.w / 2,
		cy = this.y - rect.y - rect.h / 2;
	if (state == 4)
		state = cx < cy ? (-cx < cy ? 7 : 3) : (-cx < cy ? 5 : 1);
	switch (state)
	{
		case 0: return this.collidePoint(new Point(x1, y1), dist);
		case 1: return this.y > y1 - dist ? (this.y = y1 - dist, true) : false;
		case 2: return this.collidePoint(new Point(x2, y1), dist);
		case 3: return this.x > x1 - dist ? (this.x = x1 - dist, true) : false;
		case 5: return this.x < x2 + dist ? (this.x = x2 + dist, true) : false;
		case 6: return this.collidePoint(new Point(x1, y2), dist);
		case 7: return this.y < y2 + dist ? (this.y = y2 + dist, true) : false;
		case 8: return this.collidePoint(new Point(x2, y2), dist);
	}
	return false;
}

//------------------------------------------------------------------------------

function Vector(x, y)
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

Vector.prototype.clone = function clone()
	{ return new Vector(this.x, this.y); }

Vector.prototype.size = function size()
	{ return Math.sqrt(this.x*this.x + this.y*this.y); }

Vector.prototype.normal = function normal()
	{ return new Vector(this.x/this.size(), this.y/this.size()); }

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
		throw new TypeError('first argument must be a Rectangle.');
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

//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

Line.prototype.dual = function dual() // *IMPORTANT* do not use in algorithms!
{
	var y0 = this.atX(0),
		y1 = this.atX(1);
	return new Point(y1 - y0, -y0);
}

//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

Line.prototype.multiply = function multiply(rect)
{
	if (rect.constructor != Rectangle)
		throw new TypeError('first argument must be a Rectangle.');
	return new Line(
		rect.x + rect.w * this.x1,
		rect.y + rect.h * this.y1,
		rect.x + rect.w * this.x2,
		rect.y + rect.h * this.y2);
}

//------------------------------------------------------------------------------

Line.prototype.orientation = function orientation(point)
{
	if (point.constructor != Point)
		throw new TypeError('first argument must be a point.');
	
	var d = (this.x1 - point.x) * (this.y2 - point.y) - (this.x2 - point.x) * (this.y1 - point.y);
	return Math.sign(d); // Determines the sign
}

//------------------------------------------------------------------------------

Line.prototype.distance = function distance(point)
{
	if (point.constructor != Point)
		throw new TypeError('first argument must be a point.');

	var d = Math.abs((this.x2-this.x1)*(this.y1-point.y)-(this.x1-point.x)*(this.y2-this.y1))/Math.sqrt(Math.pow((this.x2-this.x1),2)+Math.pow((this.y2-this.y1),2));
	return d;
}

//------------------------------------------------------------------------------
// Returns the slope of the line. If x2-x1=0, dx will be taken to be 0.01 to avoid divide by 0.
Line.prototype.slope = function slope()
{
	var dx = this.x2 - this.x1;
	var dy = this.y2 - this.y1;

	if(dx == 0) dx = 0.01;
	return dy/dx;
}

//------------------------------------------------------------------------------
// Returns the Y value of the line at x.
Line.prototype.atX = function atX(x)
{
	var a = this.slope();
	var b = this.y1 - a * this.x1;
	return a*x + b;
}

//------------------------------------------------------------------------------
// Finds the point of intersection between two non-parallel lines
Line.prototype.intersectionWith = function intersectionWith(line)
{
	if (line.constructor != Line)
		throw new TypeError('first argument must be a Line.');
	// Transform both lines to the form y=ax+b
	var a1 = this.slope();
	var a2 = line.slope();
	if (a1 == a2)
		throw new Error('Lines are parallel');

	var b1 = this.y1 - a1 * this.x1;
	var b2 = line.y1 - a2 * line.x1;

	// Find the x of intersection  
	// (a1*x+b1 = a2*x + b2) ->
	var x = (b2 - b1) / (a1 - a2);
	var y = a1*x+b1;
	return new Point(x, y);
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

Rectangle.prototype.clamp = function clamp(rect)
{
	if (rect.constructor != Rectangle)
		throw new TypeError('first argument must be a Rectangle.');
	this.x = Math.min(Math.max(this.x, rect.x), rect.x + rect.w - this.w);
	this.y = Math.min(Math.max(this.y, rect.y), rect.y + rect.h - this.h);
}

//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

Rectangle.prototype.multiply = function multiply(rect)
{
	if (rect.constructor != Rectangle)
		throw new TypeError('first argument must be a Rectangle.');
	return new Rectangle(
		 rect.x + rect.w * this.x,
		 rect.y + rect.h * this.y,
		 rect.w * this.w,
		 rect.h * this.h);
}

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