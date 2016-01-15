/*********************************************************\
* About page contents                                     *
\*********************************************************/

$(function() {

//------------------------------------------------------------------------------
// Algorithms

$('#about-algorithms')
	.append($('<h2>').text('Algorithms'))
	.append($('<p>')
		.append('')
		.append('<br>')
		.append('text text text')
	)
;

//------------------------------------------------------------------------------
// Duality

$.fn.svg = function addSVG(id)
{
	d3.selectAll(this).append('svg').attr('id', id);
	return this;
}

$('#about-duality')
	.append($('<h2>').text('Duality'))
	.svg('about-field1')
	.svg('about-field2')
;

$(function()
{
	var field1 = new AboutField('about-field1');
	var field2 = new AboutField('about-field2');

	field1
		.add(field1.rect.randomPoint())
		.add(field1.rect.randomPoint())
		.add(new Line(field1.rect.randomPoint(), field1.rect.randomPoint()), 0)
		.update()
	;
	field2
		.add(field1.points[1][0].dual())
		.add(field1.points[2][0].dual())
		.update()
	;
	// WIP - they draw correctly but are always off screen
});

//------------------------------------------------------------------------------
// Info

$('#about-info')
	.append($('<h2>').text('Info'))
	.append($('<p>')
		.append(
			'This game was made as part of the course Geometric Algorithms (2IMA15) at Eindhoven University of Technology.<br>\
			The goal is to engage students of the course with Geometric problems, in this case the Pizza Slice (or Hamsandwich cut) problem.<br>\
			The source code can be found online at ')
		.append('<a href=https://github.com/FerryT/2IMA15>Github</a>.<br>')
		.append('The pizza slice problem is a geometric problem, where given <i>n</i> groups of points,\
				 a line has to be found which divides all groups in two.\
				 That is, for groups <i>1</i> through <i>n</i>, there are as many points on one side of the line as the others.<br>\
				 In this game, every level has two groups of points. The goal is to move or add points so that the groups are exactly\
				 divided by the goal line.')
	)
;

//------------------------------------------------------------------------------
// Credits

$('#about-credits')
	.append($('<h2>').text('Credits'))
	.append($('<p>')
		.append('This game was made by Ferry Timmers, Yannick van Ballegooie and Pieter Gijsbers<br>')
		.append('As instructor of the course, Kevin Buchin has been our support.<br>')
		.append('The icons are from Open Iconic used under the MIT license.')
	)
;

//------------------------------------------------------------------------------
// Interactive demo

function AboutField(id)
{
	this.svg = d3.select('#' + id);
	this.rect = new Rectangle(-200, -200, 200, 200);

	this.svg.selectAll('*').remove();
	this.svg.attr('viewBox', this.rect + '');
	this.svg.append('g').attr('class', 'points');
	this.svg.append('g').attr('class', 'lines');

	this.slices = [[],[],[]];
	this.points = [[],[],[]];
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
	point.group = group;
	this.points[group].push(point);
	return this;
}

AboutField.prototype.update = function update()
{
	var lines = this.svg.select('.lines').selectAll('line')
		.data(d3.merge(this.slices));
	lines.enter().append('line');
	lines
		.attr('class', function (d) { return 'group' + (d.group - 1); })
		.attr('x1', function (d) { return d.slice.x1; })
		.attr('y1', function (d) { return d.slice.y1; })
		.attr('x2', function (d) { return d.slice.x2; })
		.attr('y2', function (d) { return d.slice.y2; })
	;
	lines.exit().remove();

	var points = this.svg.select('.points').selectAll('circle')
		.data(d3.merge(this.points));
	points.enter().append('circle').attr('r', 15);
	points
		.attr('class', function (d) { return 'group' + (d.group - 1); })
		.attr('cx', function (d) { return d.x; })
		.attr('cy', function (d) { return d.y; })
	;
	points.exit().remove();

	return this;
}

//------------------------------------------------------------------------------

});
