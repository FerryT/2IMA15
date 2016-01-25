/*********************************************************\
* Interactive demo for about page                         *
\*********************************************************/

//------------------------------------------------------------------------------

AboutDemo.Rect = new Rectangle(-100, -100, 200, 200);
AboutDemo.R = 15; // Point radius
AboutDemo.D = AboutDemo.R * 2; // Point diameter

function AboutDemo(id1, id2, algorithm)
{
	this.field = new AboutField(id1);
	this.dual = new AboutField(id2);
	this.rect = this.field.rect;
	this.algorithm = algorithm;

	this.dual.xscale = d3.scale.linear()
		.domain([-1, 1])
		.range([100,-100])
	;
	
	this.q1 = this.rect.clone();
	this.q1.w /= 2;
	this.q1.h /= 2;
	this.q2 = this.q1.clone();
	this.q2.x += this.q2.w;
	this.q3 = this.q1.clone();
	this.q3.y += this.q3.h;
	this.q4 = this.q3.clone();
	this.q4.x += this.q4.w;

	var self = this;

	this.field.svg.on('click', function ()
	{
		if (d3.event.defaultPrevented) return;
		self.add(new Point(d3.mouse(this)));
	});

	this.field.behavior.points = function ()
	{
		(d3.behavior.drag()
			.on('drag', function (d)
			{
				d.x = d3.event.x;
				d.y = d3.event.y;

				var limit = self.rect.shrink(-AboutDemo.R / 2);
				if (d3.event.x < limit.x || d3.event.x > limit.x + limit.w
					|| d3.event.y < limit.y || d3.event.y > limit.y + limit.h)
				{
					d.outside = true;
				}
				else
				{
					delete d.outside;
					d.clamp(self.rect.shrink(AboutDemo.D));
				}
				self.findSlice().dualify().update();
			})
			.on('dragend', function ()
			{
				self.field.points = self.field.points.map(function (points)
				{
					return points.filter(function (point)
					{
						return !point.outside;
					});
				});
				self.findSlice().dualify().update();
			})
		).call(this);
		this
			.on('mouseover', function (d)
			{
				d.selected = true;
				self.dualify().update();
			})
			.on('mouseout', function (d)
			{
				delete d.selected;
				self.dualify().update();
			})
		;
	}
}

AboutDemo.prototype.add = function add(point)
{
	if (!point || point.constructor != Point)
		throw new TypeError('first argument must be a Point.');
	this.field.add(point);
	return this.findSlice().dualify().update();
}

AboutDemo.prototype.findSlice = function findSlice()
{
	this.field.clearSlices();
	function inside(point) { return !point.outside; }
	try {
		var line = this.algorithm(
			this.field.points[1].filter(inside),
			this.field.points[2].filter(inside));
	} catch (e) {}
	if (line)
		this.field.add(line, 0);
	return this;
}

AboutDemo.prototype.dualify = function dualify()
{
	var dual = this.dual;
	dual.clearSlices();
	this.field.points.forEach(function(points, group)
	{
		points.forEach(function(point)
		{
			if (point.outside) return;
			var line = point.dual();
			line.selected = point.selected;
			dual.add(line, group);
		});
	});
	dual.clearPoints();
	this.field.slices.forEach(function(slices, group)
	{
		slices.forEach(function(slice)
		{
			var point = slice.line.dual();
			point.selected = slice.selected;
			dual.add(point, group);
		});
	});
	return this;
}

AboutDemo.prototype.update = function update()
{
	this.field.update();
	this.dual.update();
	return this;
}

//------------------------------------------------------------------------------

function AboutField(id)
{
	this.svg = d3.select('#' + id);
	this.rect = AboutDemo.Rect.clone();
	this.xscale = undefined;
	this.yscale = undefined;

	this.svg.selectAll('*').remove();
	this.svg.attr('viewBox', this.rect + '');
	this.svg.append('g').attr('class', 'points');
	this.svg.append('g').attr('class', 'lines');

	this.clearSlices();
	this.clearPoints();

	this.behavior = {
		slices: function () {},
		points: function () {},
	}
}

AboutField.prototype.add = function add(ent, group)
{
	if (ent.constructor == Line)
		return this.addSlice(ent, group);
	else if (ent.constructor == Point)
		return this.addPoint(ent, group);
	return this;
}

AboutField.prototype.addSlice = function add(line, group)
{
	if (typeof group == 'undefined')
		group = +(this.slices[1].length > this.slices[2].length) + 1;
	if (this.xscale)
		{ line.x1 = this.xscale(line.x1); line.x2 = this.xscale(line.x2); }
	if (this.yscale)
		{ line.y1 = this.yscale(line.y1); line.y2 = this.yscale(line.y2); }
	var slice = new Slice(line, this.rect.shrink(-10));
	slice.group = group;
	this.slices[group].push(slice);
	return this;
}

AboutField.prototype.addPoint = function add(point, group)
{
	if (typeof group == 'undefined')
		group = +(this.points[1].length > this.points[2].length) + 1;
	point = point.clone();
	if (this.xscale)
		point.x = this.xscale(point.x);
	if (this.yscale)
		point.y = this.yscale(point.y);
	point.group = group;
	this.points[group].push(point);
	return this;
}

AboutField.prototype.clearSlices = function clearSlices()
{
	this.slices = [[],[],[]];
	return this;
}

AboutField.prototype.clearPoints = function clearPoints()
{
	this.points = [[],[],[]];
	return this;
}

AboutField.prototype.update = function update()
{
	var lines = this.svg.select('.lines').selectAll('line')
		.data(d3.merge(this.slices));
	lines.enter().append('line')
		.call(this.behavior.slices)
	;
	lines
		.attr('class', function (d) { return 'group' + (d.group - 1); })
		.attr('x1', function (d) { return d.slice.x1; })
		.attr('y1', function (d) { return d.slice.y1; })
		.attr('x2', function (d) { return d.slice.x2; })
		.attr('y2', function (d) { return d.slice.y2; })
		.style('opacity', function (d) { return d.line.selected ? .7 : null; })
	;
	lines.exit().remove();

	var points = this.svg.select('.points').selectAll('circle')
		.data(d3.merge(this.points));
	points.enter().append('circle')
		.attr('r', AboutDemo.R)
		.call(this.behavior.points)
		.on('click', function () { d3.event.stopPropagation(); })
	;
	points
		.style('display', function (d) { return d.outside ? 'none' : null; })
		.attr('class', function (d) { return 'group' + (d.group - 1); })
		.attr('cx', function (d) { return d.x; })
		.attr('cy', function (d) { return d.y; })
		.style('opacity', function (d) { return d.selected ? .7 : null; })
	;
	points.exit().remove();

	return this;
}

//------------------------------------------------------------------------------
