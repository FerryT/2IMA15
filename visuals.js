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
	this.lines = this.svg.append('g').attr('class', 'lines');
	this.points = this.svg.append('g').attr('class', 'points');
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
		.attr('cx', function (d) { return d.point.x })
		.attr('cy', function (d) { return d.point.y })
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
