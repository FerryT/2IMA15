/*********************************************************\
* About page contents                                     *
\*********************************************************/

$(function() {

//------------------------------------------------------------------------------
// Algorithms

$('#about-algorithms')
	.append($('<h2>').text('Algorithms'))
	.append($('<p>')
		.append('There are several algorithms that, given two set of points, find \
			a line which cuts all of those sets in half. The fastest algorithm can do this in \
			O(n) time, but is very complex. We will discuss two algorithms we implemented ourselves, \
			a O(n<sup>3</sup>) algorithm and a O(n log n) algorithm. For the O(n) algorithm, we refer to a good \
			explanation by Danielle MacNevin ')
		.append('<a href=http://cgm.cs.mcgill.ca/~athens/cs507/Projects/2002/DanielleMacNevin/algorithm-pg3.html>over here</a>.<br>')
		.append('The most simple algorithm is the O(n<sup>3</sup>) algorithm. It works on two groups that are both of odd size.\
			For a group with an odd number of points to have as many on one side of a line as on the other, one point has to be \
			on the line. This is exactly used in the algorithm. The algorithm checks for every pair of two points, where one point is \
			chosen from each group, if the line defined by those two points is a hamsandwich cut. \
			To determine if the line is a hamsandwich cut, given the line, for every point it is determined whether they are to the left or \
			to the right of the line. By this counting, one can determine whether or not the line is a hamsandwich cut. \
			This algorithm runs in O(n<sup>3</sup>) time, because it will check for O(n<sup>2</sup>) combination of points whether or not it is a \
			hamsandwich cut in O(n) time.<br>')
		.append('The O(n log n) algorithm is not only a lot faster, but also more advanced. It makes use of a concept called duality. \
			We refer to the section on duality for a more thorough explanation, but in short it means that there is a second representation of the problem. This second \
			representation sees the points in the original problems as lines, and the hamsandwich line as a point. TODO<br>')
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
	.append('Duality is a different way to interpret geometric problems with points and lines. \
		Where the original problem considers a point, the dual representation will consider a line, and vice versa. \
		')
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
		.append('<br>')
		.append('The pizza slice problem is a geometric problem, where given <i>n</i> groups of points,\
				 a line has to be found which divides all groups in two.\
				 That is, for groups <i>1</i> through <i>n</i>, there are as many points on one side of the line as the others.<br>\
				 In this game, every level has two groups of points, represented by colored space ships. \
				 The goal is to move or add points so that the groups are exactly divided by the goal line.')
	)
;

//------------------------------------------------------------------------------
// How to play

$('#about-instructions')
	.append($('<h2>').text('Instructions'))
	.append($('<p>')
		.append(
			'Supreme judge Zoid Splark has recently ruled the laws of physics to be unconstitutional, \
			and as such, he has decided to abolish them. Because of this, the universe became unstable. \
			Recently, rifts have been opening everywhere. The army was highly unprepared, and did not have their fleets of \
			spaceships positioned adequately to make sure every area stays defended.<br>\
			The president himself has appointed you as a new lieutenant, who has to make sure the spaceships are \
			well distributed through space. The army has two main branches, medical personnel in red ships and \
			armed forces in blue ships. You will be sent to wherever rifts appear, where you will have to divide \
			the medics and armed forces into two groups of equal size. For this task, you will be using a console, of which the \
			user interface is shown in the following figure.<br>')
		// TODO (?) Put this image in index.html and scale the content based on size of the context.
		.append('<img src="game.gif" alt="An overview of UI elements." height="470" width="900"><br>')
		.append('There will be a small briefing at the top of the screen (1). \
			The green band indicates where the rift is going to develop (2). \
			You have to make sure both sides of the rift \
			have the same amount of medics (red ships), and both sides of the rift have an equal amount of armed forces (blue ships).<br>\
			Both the medics (red) and armed forces (blue) have the same type of ships, here are a few, but not all, ships:<br>\
			- DRAGSHIP (3) This is the biggest ship the army has. You can order it by dragging it on your screen.<br>\
			- COWARDSHIP (4) This ship has the most volatile people of the army. Depending on the pilot, they either tend \
			to move towards your mouse clicks, or they will flee from it.<br>\
			- STATIONARYSHIP (5) This ship is stationary. It will never move.<br><br>\
			The president is a man of time. He will evaluate your performance solely based on time spent to move the ships. This evaluation \
			can be seen in the top left corner while commanding your fleets (6). But do not worry, if you need some time, \
			you can always take a break with the pause button in the top right corner (7). If you feel you could have done better, \
			you\'re in luck. There is a rewind button, which will revert all actions you performed since you came to the area (8), giving you a new chance. \
			There will also be a line shown on the console (9). This line indicates the current division which divides both the medics \
			and armed forces in half. Since the goal is to have both the medics and armed forces in equal representation on both sides \
			of the rift, if this line coincidices with the rift-line, you completed your mission.')
	)
;

//------------------------------------------------------------------------------
// Credits

$('#about-credits')
	.append($('<h2>').text('Credits'))
	.append($('<p>')
		.append('This game was made by Ferry Timmers, Yannick van Ballegooie and Pieter Gijsbers.<br>')
		.append('As instructor of the course, Kevin Buchin has been our support.<br>')
		.append('The icons are from Open Iconic used under the MIT license.')
	)
;

//------------------------------------------------------------------------------

});
