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
			a O(n<sup>3</sup>) algorithm and a O(n<sup>2</sup>) algorithm. For the O(n) algorithm, we refer to a good \
			explanation by Danielle MacNevin ')
		.append('<a href=http://cgm.cs.mcgill.ca/~athens/cs507/Projects/2002/DanielleMacNevin/algorithm-pg3.html>over here</a>.<br>')
		.append('The most simple algorithm is the O(n<sup>3</sup>) algorithm. It works on two groups of points that are both of odd size.\
			For a group with an odd number of points to have as many on one side of a line as on the other, one point has to be \
			on the line. This is exactly used in the algorithm. The algorithm checks for every pair of two points, where one point is \
			chosen from each group, if the line defined by those two points is a hamsandwich cut. \
			To determine if the line is a hamsandwich cut, given the line, for every point it is determined whether they are to the left or \
			to the right of the line. By this counting, one can determine whether or not the line is a hamsandwich cut. \
			This algorithm runs in O(n<sup>3</sup>) time, because it will check for O(n<sup>2</sup>) combination of points whether or not it is a \
			hamsandwich cut in O(n) time.<br>')
		.append('The O(n<sup>2</sup>) algorithm is not only a lot faster, but also more advanced. It makes use of a concept called duality. \
			We refer to the section on duality for a more thorough explanation, but in short it means that there is a second representation of the problem. This second \
			representation sees the points in the original problems as lines, and the hamsandwich line as a point.<br>')
		.append('After transforming the problem to its dual representation, for both sets of lines, the median line is determined. \
			The median line is a set of linesegments (it is not truly a line). It is made up of the parts of lines. A segment is part \
			of the median line of a group, if of that group there are as many lines above as below it. In the figure below, for the set of red lines, \
			the median line is accentuated by pink, and for the blue line by dark blue. One can see that there is always exactly one line above and below the median line \
			for the given group.')		
		.append('<br><img src="MedianLine.gif" alt="Shows the median lines of in the dual representation." height="480" width="480" style="margin:0px auto;display:block"><br>')
		.append('After determining the median line, the intersections of the two median lines are determined (the green and brown circles in the figure). The point of intersection between the \
			two median lines represents the cut-line in the original representation. This is the case, because when the median lines intersect, that \
			means there are as many lines on both sides of that intersection (which correspond to points in the original representation).<br> \
			The algorithm takes O(n) time to create the dual representation, but after that it will have to compute the median line for both groups. \
			This takes O(n<sup>2</sup>) time. After this, one can simply go over all the intersections of the median line, which takes at most O(n). \
			Because these actions all happen sequentially, the dominating factor is O(n<sup>2</sup>). The key reason that this runs in O(n<sup>2</sup>) \
			instead of O(n<sup>3</sup>), is that when you find the intersections of the median lines, you know that it is a valid slice - without checking all \
			other lines first.')
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
	.append($('<p>')
		.append($('<label>').text('Algorithm: '))
		.append($('<select>')
			.attr('id', 'about-alg')
			.append($('<option>').text('None').val('none'))
			.append($('<option>').text('Naive').val('naive'))
			.append($('<option>').text('Duality').val('dual'))))
	.append($('<p>')
		.append('Duality is a different way to interpret geometric problems with points and lines. \
			Where the original problem considers a point, the dual representation will consider a line, and vice versa. \
			The demo above will give you some feeling for this. You can drag the points, and see how they behave in the \
			dual representation. If you mouse-over a point, the corresponding line will be highlighted.<br> \
			Points are converted rather directly; a point (p<sub>x</sub>,p<sub>y</sub>) will be converted to the line y=p<sub>x</sub>*x-p<sub>y</sub>. \
			Conversely, the line y=a*x+b will be convered to point (a,b). You can see this in the demo, if you increase p<sub>x</sub> \
			by moving a point to the right, the corresponding line will get a steeper slope. Likewise, moving the point downwards will \
			make the corresponding line go down as well.<br>'))
;

$(function()
{
	var demo = new AboutDemo('about-field1', 'about-field2', DualityAlgorithm);

	demo
		.add(demo.q1.shrink(30).randomPoint())
		.add(demo.q2.shrink(30).randomPoint())
		.add(demo.q3.shrink(30).randomPoint())
		.add(demo.q4.shrink(30).randomPoint())
	;

	$('#about-alg')
		.change(function()
		{
			demo.algorithm = ({
				naive: NaiveAlgorithm,
				dual: DualityAlgorithm,
			})[$(this).val()];
			demo.findSlice().dualify().update();
		})
		.val('dual')
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
				 Below, you can see two figures with two point sets, divided by lines. The line in the left image is not a hamsandwich-cut, because \
				 the set of red points is not split in half by the cut (there are two below the line, and none above). The right image does have a \
				 hamsandwich-cut, because for both the red and blue points, there are as many above as below the line.')
		.append('<br><img src="SliceFail.gif" alt="A bad cut" height="480" width="480" style="float:left">')
		.append('<img src="SliceGood.gif" alt="A correct cut" height="480" width="480" style="float:right"><br>')
		.append(' In this game, every level has two groups of points, represented by colored space ships. \
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
		.append('<img src="game.gif" alt="An overview of UI elements." height="470" width="900" style="margin:0px auto;display:block"><br>')
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
