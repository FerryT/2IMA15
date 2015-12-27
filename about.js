/*********************************************************\
* About page contents                                     *
\*********************************************************/

$(function() {

//------------------------------------------------------------------------------
// Algorithms

$('#about-algorithms')
	.append($('<h2>').text('Algorithms'))
	.append($('<p>')
		.append('text text text')
		.append('<br>')
		.append('text text text')
	)
	.append($('<p>')
		.append('text text text')
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
;

//------------------------------------------------------------------------------
// Credits

$('#about-credits')
	.append($('<h2>').text('Credits'))
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
