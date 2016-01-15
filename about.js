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

$.fn.svg = function addSVG(id, cls)
{
	d3.selectAll(this).append('svg').attr('id', id).attr('class', cls);
	return this;
}

$('#about-duality')
	.append($('<h2>').text('Duality'))
	.svg('about-field1', 'about-field')
	.svg('about-field2', 'about-field')
;

$(function()
{
	var demo = new AboutDemo('about-field1', 'about-field2');

	demo
		.add(demo.q1.shrink(30).randomPoint())
		.add(demo.q2.shrink(30).randomPoint())
		.add(demo.q3.shrink(30).randomPoint())
		.add(demo.q4.shrink(30).randomPoint())
	;
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

});
