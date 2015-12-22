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
	this.goals = this.svg.append('g').attr('class', 'goals');
	this.lines = this.svg.append('g').attr('class', 'lines');
	this.points = this.svg.append('g').attr('class', 'points');
}

//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

Field.prototype.updateGoals = function()
{
	var goals = this.goals.selectAll('line')
		.data(this.game.level.goals);

	goals.enter()
		.append('line')
	;

	goals
		.attr('x1', function (d) { return d.line.x1; })
		.attr('y1', function (d) { return d.line.y1; })
		.attr('x2', function (d) { return d.line.x2; })
		.attr('y2', function (d) { return d.line.y2; })
		.style('stroke-width', function (d) { return d.width; })
	;

	goals.exit()
		.remove()
	;

	return this;
}

//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

Field.prototype.updatePoints = function()
{
	var radius = 10,
		points = this.points.selectAll('circle')
			.data(this.game.level.entities,
				function (d) { return d.id; });

	points.enter()
		.append('circle')
		.attr('class', function (d) { return 'group' + d.group; })
		.attr('r', radius)
		.call(Field.behave, Field.updatePoint)
	;

	points
		.attr('cx', function (d) { return d.point.x; })
		.attr('cy', function (d) { return d.point.y; })
	;

	points.exit()
		.remove()
	;

	return this;
}

//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

Field.prototype.updateLines = function()
{
	var lines = this.lines.selectAll('line')
		.data(this.game.slices);

	lines.enter()
		.append('line')
	;

	lines
		.attr('x1', function (d) { return d.slice.x1; })
		.attr('y1', function (d) { return d.slice.y1; })
		.attr('x2', function (d) { return d.slice.x2; })
		.attr('y2', function (d) { return d.slice.y2; })
	;

	lines.exit()
		.remove()
	;

	return this;
}

//------------------------------------------------------------------------------

Field.behave = function behave(selection, update)
{
	var drag = d3.behavior.drag()
		.on('drag', function (d)
		{
			if (d.behavior.drag.call(d, d3.event.x, d3.event.y))
				update(this);
		}).on('dragstart', function (d)
		{
			d3.event.sourceEvent.stopPropagation();
			if (d.behavior.dragstart.call(d, d3.event.x, d3.event.y))
				update(this);
		}).on('dragend', function (d)
		{
			if (d.behavior.dragend.call(d, d3.event.x, d3.event.y))
				update(this);
		})
	;
	selection
		.call(drag)
		.on('click', function (d)
		{
			if (d3.event.defaultPrevented) return;
			var mouse = d3.mouse(this);
			if (d.behavior.click.call(d, mouse[0], mouse[1]))
				update(this);
			d3.event.stopPropagation();
		})
	;
}

Field.updatePoint = function update(point)
{
	d3.select(point)
		.attr('cx', function (d) { return d.point.x; })
		.attr('cy', function (d) { return d.point.y; })
	;
}

Field.updateField = function update(field)
{
	field
		.updateGoals()
		.updateLines()
		.updatePoints()
	;
}

//------------------------------------------------------------------------------
