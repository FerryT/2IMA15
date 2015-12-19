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
	;

	points
		.attr('cx', function (d) { return d.point.x; })
		.attr('cy', function (d) { return d.point.y; })
	;

	points.exit()
		.remove()
	;
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
}

//------------------------------------------------------------------------------
