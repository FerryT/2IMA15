/*********************************************************\
* Visual representation of the game                       *
\*********************************************************/

function Field(id, game)
{
	var self = this;

	this.svg = d3.select('#'+id);
	this.game = game;

	this.svg.selectAll('*').remove();
	this.svg.attr('viewBox', this.game.rect + '');
	this.points = this.svg.append('g').attr('class', 'points');
	this.lines = this.svg.append('g').attr('class', 'lines');
	this.dragline = this.svg.append('g').attr('class', 'dragline');

	var dragging, oldpos, newpos;
	this.svg.on('mousedown', function()
	{
		if (dragging) return;
		dragging = true;
		oldpos = new Point(d3.mouse(this));
		self.dragline
			.append('line')
			.attr('x1', oldpos.x)
			.attr('y1', oldpos.y)
			.attr('x2', oldpos.x)
			.attr('y2', oldpos.y)
		;
	}).on('mousemove', function()
	{
		if (!dragging) return;
		newpos = new Point(d3.mouse(this));
		self.dragline.select('line')
			.attr('x2', newpos.x)
			.attr('y2', newpos.y)
		;
	}).on('mouseup', function()
	{
		dragging = false;
		newpos = new Point(d3.mouse(this));
		self.game.slice(new Line(oldpos, newpos));
		self.updateLines();
		self.dragline
			.selectAll('line')
			.remove()
		;
	});
}

//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

Field.prototype.updatePoints = function()
{
	var radius = 5;

	this.points
		.selectAll('g')
		.data(this.game.levels[this.game.level].sets).enter()
		.append('g')
		.attr('class', function (d, i) { return 'color' + i; })
		.selectAll('circle')
		.data(function (d) { return d; }).enter()
		.append('circle')
			.attr('cx', function (d) { return d.x - radius })
			.attr('cy', function (d) { return d.y - radius })
			.attr('r', radius * 2)
	;
}

//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

Field.prototype.updateLines = function()
{
	var bb = this.game.rect.shrink(-10);
	this.lines
		.selectAll('line')
		.data(this.game.slices).enter()
		.append('line')
			.datum(function (d) { return d.extend(bb); })
			.attr('x1', function (d) { return d.x1; })
			.attr('y1', function (d) { return d.y1; })
			.attr('x2', function (d) { return d.x2; })
			.attr('y2', function (d) { return d.y2; })
	;
}

//------------------------------------------------------------------------------
