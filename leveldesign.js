function InitializeLevels()
{
	game.addLevel(LiuetenantsTraining());
	game.addLevel(WhoHiredTheseMen());
	game.addLevel(StrategicalPlacement());
	game.addLevel(GiveUsCompany());
	game.addLevel(StopRightThere());
	game.addLevel(Cowards());
	game.addLevel(IronSpaceships());
	game.addLevel(ClickMe());
	game.addLevel(Special());
	game.addLevel(SoManyCowards());
	game.addLevel(TwoGroups());
	game.addLevel(GainingStrength());
	game.addLevel(Irrational());
}

function Walls()
{
	var walls = [];
	function add(level, x, y, w, h)
	{
		var left = new Behavior().Walls(goal.time, w / 2);
		var right = new Behavior().Walls(goal.time, -w / 2);
		level
			.add(new Structure(new Rectangle(x - w, y, w, h), left))
			.add(new Structure(new Rectangle(x + w, y, w, h), right))
		;
	}
	for (var i = 0, l = this.goals.length, goal; i < l; ++i)
	{
		goal = this.goals[i];
		add(this,
			goal.line.x1,
			goal.line.y1 - goal.width / 2,
			goal.line.x2 - goal.line.x1,
			goal.width);
	}
	if (this.behavior == Behavior.None)
		this.behavior = new Behavior();
	this.behavior = this.behavior.WallsColliding();
	return this;
}

function Winimation(end)
{
	d3.transition()
		.duration(500)
		.ease('cubic-out')
		.tween('game', function ()
		{
			var time = 0;
			for (var i = game.level.goals.length - 1; i >= 0; --i)
				time = Math.max(time, game.level.goals[i].time);

			var last = time *= 1000,
				pipedown = d3.interpolateRound(time, 0);

			return function (t)
			{
				time = pipedown(t);
				var rate = last - time;
				last = time;
				for (var i = 0, l = game.level.structs.length, struct; i < l; ++i)
				{
					struct = game.level.structs[i];
					if (struct.wall)
						struct.behavior.update.call(struct, rate);
				}
				game.level.behavior.update.call(game.level, rate);
				game.update();
			}
		})
		.each('end', end)
	;
}

function LiuetenantsTraining()
{
	var draggable = new Behavior().Draggable().Clamped(game.rect),
		behavior = new Behavior(),
		level = new Level('Liuetenant\'s training', 'Some cadets are so stubborn, you have to drag them yourself.')
			.add(new Goal(new Line(0, .5, 1, .5).multiply(game.rect), 40, 20 /* time limit */, 2000 /* max score */))
			.star(1900 /* gold */, 1800 /* silver */, 500)
			.call(Walls)
			// Group one
			.add(new Entity(new Point(0.25, 0.75).multiply(game.rect), 0, behavior))
			.add(new Entity(new Point(0.25, 0.25).multiply(game.rect), 0, behavior))
			//Group two
			.add(new Entity(new Point(0.75, 0.60).multiply(game.rect), 1, draggable))
			.add(new Entity(new Point(0.75, 0.75).multiply(game.rect), 1, behavior))
		;
	return level;
}

function WhoHiredTheseMen()
{
	var draggable = new Behavior().Draggable().Colliding(game).Clamped(game.rect),
		behavior = new Behavior(),
		level = new Level('Who hired these men?', 'And why am I the one who has to drag them around?')
			.add(new Goal(new Line(0, .5, 1, .5).multiply(game.rect), 40, 20, 2000))
			.star(1850,1750,500)
			.call(Walls)
			// Group one
			.add(new Entity(new Point(0.25, 0.35).multiply(game.rect), 0, draggable))
			.add(new Entity(new Point(0.25, 0.25).multiply(game.rect), 0, behavior))
			//Group two
			.add(new Entity(new Point(0.75, 0.60).multiply(game.rect), 1, draggable))
			.add(new Entity(new Point(0.75, 0.75).multiply(game.rect), 1, behavior))
		;
	return level;
}

function StrategicalPlacement()
{	
	var behavior = new Behavior().Clamped(game.rect),
		behaviorL = new Behavior().Editable(behavior),
		level = new Level('Strategical placement', 'Sometimes you\'re allowed to determine placement yourself.', behaviorL)
			.add(new Goal(new Line(0, .5, 1, .5).multiply(game.rect), 40, 20, 2000))
			.star(1950,1850,1000)
			.call(Walls)
			// Group one
			.add(new Entity(new Point(0.40, 0.25).multiply(game.rect), 0, behavior))
			.add(new Entity(new Point(0.20, 0.25).multiply(game.rect), 0, behavior))
			.add(new Entity(new Point(0.40, 0.75).multiply(game.rect), 0, behavior))
			.add(new Entity(new Point(0.20, 0.75).multiply(game.rect), 0, behavior))
			//Group two
			.add(new Entity(new Point(0.60, 0.75).multiply(game.rect), 1, behavior))
			.add(new Entity(new Point(0.80, 0.75).multiply(game.rect), 1, behavior))
			.add(new Entity(new Point(0.60, 0.25).multiply(game.rect), 1, behavior))
		;
	return level;
}

function GiveUsCompany()
{	
	var behavior = new Behavior().Clamped(game.rect),
		behaviorL = new Behavior().Editable(behavior),
		level = new Level('Give us company', 'Our crew called in for reinforcements on the other side of the warphole.', behaviorL)
			.add(new Goal(new Line(0, .5, 1, .5).multiply(game.rect), 40, 20, 2000))
			.call(Walls)
			.star(1900,1800,500)
			// Group one
			.add(new Entity(new Point(0.40, 0.75).multiply(game.rect), 0, behavior))
			.add(new Entity(new Point(0.20, 0.75).multiply(game.rect), 0, behavior))
			//Group two
			.add(new Entity(new Point(0.60, 0.75).multiply(game.rect), 1, behavior))
			.add(new Entity(new Point(0.80, 0.75).multiply(game.rect), 1, behavior))
		;
	return level;
}

function Cowards()
{	
	var behavior1 = new Behavior().Coward(150, 100, false, true).Clamped(game.rect),
		behavior2 = new Behavior().Coward(150, 100, false, true).Clamped(game.rect),
		level = new Level('Cowards', 'Some men are motivated by fear.', new Behavior().Clickable())
			.add(new Goal(new Line(0, .5, 1, .5).multiply(game.rect), 40, 20, 2000))
			.call(Walls)
			.star(1900,1750,1000)
			// Group one
			.add(new Entity(new Point(0.40, 0.4).multiply(game.rect), 0, behavior1))
			.add(new Entity(new Point(0.45, 0.3).multiply(game.rect), 0, behavior1))
			.add(new Entity(new Point(0.55, 0.3).multiply(game.rect), 0, behavior1))
			.add(new Entity(new Point(0.60, 0.4).multiply(game.rect), 0, behavior1))
			//Group two
			.add(new Entity(new Point(0.40, 0.6).multiply(game.rect), 1, behavior2))
			.add(new Entity(new Point(0.45, 0.7).multiply(game.rect), 1, behavior2))
			.add(new Entity(new Point(0.55, 0.7).multiply(game.rect), 1, behavior2))
			.add(new Entity(new Point(0.60, 0.6).multiply(game.rect), 1, behavior2))
	;
	return level;
}

function IronSpaceships()
{	
	var behavior1 = new Behavior().Coward(100, 100, true).Colliding(game).Clamped(game.rect),
		behavior2 = new Behavior().Coward(100, 100, true).Colliding(game).Clamped(game.rect),
		level = new Level('Iron spaceships', 'Great against bullets, bad against magnets.', new Behavior().Clickable())
			.add(new Goal(new Line(0, .5, 1, .5).multiply(game.rect), 40, 20, 2000))
			.call(Walls)
			.star(1650,1500,1300)
			// Group one
			.add(new Entity(new Point(0.40, 0.4).multiply(game.rect), 0, behavior1))
			.add(new Entity(new Point(0.45, 0.3).multiply(game.rect), 0, behavior1))
			.add(new Entity(new Point(0.55, 0.3).multiply(game.rect), 0, behavior1))
			.add(new Entity(new Point(0.60, 0.4).multiply(game.rect), 0, behavior1))
			//Group two
			.add(new Entity(new Point(0.40, 0.6).multiply(game.rect), 1, behavior2))
			.add(new Entity(new Point(0.45, 0.7).multiply(game.rect), 1, behavior2))
			.add(new Entity(new Point(0.55, 0.7).multiply(game.rect), 1, behavior2))
			.add(new Entity(new Point(0.60, 0.6).multiply(game.rect), 1, behavior2))
	;
	return level;
}

function ClickMe()
{	
	var behavior1 = new Behavior().Coward(500, 100).Clamped(game.rect),
		behavior2 = new Behavior().Coward(500, 100).Clamped(game.rect),
		level = new Level('Click on the space ships', 'We have the warphole to worry about. We\'ll repair the fourth wall later.', new Behavior().Clickable())
			.add(new Goal(new Line(0, .5, 1, .5).multiply(game.rect), 40, 20, 2000))
			.call(Walls)
			.star(1500,1300,1200)
			// Group one
			.add(new Entity(new Point(0.40, 0.4).multiply(game.rect), 0, behavior1))
			.add(new Entity(new Point(0.45, 0.3).multiply(game.rect), 0, behavior1))
			.add(new Entity(new Point(0.55, 0.3).multiply(game.rect), 0, behavior1))
			.add(new Entity(new Point(0.60, 0.4).multiply(game.rect), 0, behavior1))
			//Group two
			.add(new Entity(new Point(0.40, 0.6).multiply(game.rect), 1, behavior2))
			.add(new Entity(new Point(0.45, 0.7).multiply(game.rect), 1, behavior2))
			.add(new Entity(new Point(0.55, 0.7).multiply(game.rect), 1, behavior2))
			.add(new Entity(new Point(0.60, 0.6).multiply(game.rect), 1, behavior2))
	;
	return level;
}

function StopRightThere()
{	
	var bounce = new Behavior().Bounce(20,40).Clamped(game.rect),
		bounceDrag = new Behavior().Bounce(20,40).Draggable().Clamped(game.rect),
		stay = new Behavior(),
		level = new Level('Stop right there', 'You can drag big spaceships, even when they are moving.', new Behavior().Clickable())
			.add(new Goal(new Line(0, .5, 1, .5).multiply(game.rect), 40, 20, 2000))
			.call(Walls)
			.star(1700,1500,1300)
			// Group one
			.add(new Entity(new Point(0.15, 0.25).multiply(game.rect), 0, bounce))
			.add(new Entity(new Point(0.50, 0.25).multiply(game.rect), 0, bounceDrag))
			.add(new Entity(new Point(0.85, 0.25).multiply(game.rect), 0, bounce))
			.add(new Entity(new Point(0.15, 0.75).multiply(game.rect), 0, stay))
			.add(new Entity(new Point(0.50, 0.15).multiply(game.rect), 0, stay))
			.add(new Entity(new Point(0.85, 0.75).multiply(game.rect), 0, stay))
			//Group two
			.add(new Entity(new Point(0.30, 0.25).multiply(game.rect), 1, bounce))
			.add(new Entity(new Point(0.70, 0.25).multiply(game.rect), 1, bounce))
			.add(new Entity(new Point(0.30, 0.75).multiply(game.rect), 1, stay))
			.add(new Entity(new Point(0.70, 0.75).multiply(game.rect), 1, stay))
	;
	return level;
}

function Special()
{
	var draggable = new Behavior().Draggable().Colliding(game).Clamped(game.rect),
		coward = new Behavior().Coward(150, 100, false, true).Clamped(game.rect),
		push = new Behavior().Coward(150, 100, false, false).Clamped(game.rect),
		pull = new Behavior().Coward(150, 100, true, false).Clamped(game.rect),
		wigglypull = new Behavior().Coward(150, 100, true, true).Clamped(game.rect),
		bounce = new Behavior().Bounce(20,40).Clamped(game.rect),
		donothing = new Behavior(),
		level = new Level('Everyone is unique!', 'They were arguing over who has the best ship. Just put them in line.', new Behavior().Clickable())
			.add(new Goal(new Line(0, .5, 1, .5).multiply(game.rect), 40, 20, 2000))
			.call(Walls)
			.star(1700,1600,1500)
			// Group one
			.add(new Entity(new Point(0.15, 0.75).multiply(game.rect), 0, donothing))
			.add(new Entity(new Point(0.30, 0.75).multiply(game.rect), 0, draggable))
			.add(new Entity(new Point(0.45, 0.75).multiply(game.rect), 0, coward))
			.add(new Entity(new Point(0.60, 0.75).multiply(game.rect), 0, push))
			.add(new Entity(new Point(0.75, 0.75).multiply(game.rect), 0, wigglypull))
			.add(new Entity(new Point(0.85, 0.65).multiply(game.rect), 0, bounce))
			//Group two
			.add(new Entity(new Point(0.90, 0.75).multiply(game.rect), 1, donothing))
			.add(new Entity(new Point(0.90, 0.90).multiply(game.rect), 1, donothing))
			.add(new Entity(new Point(0.75, 0.90).multiply(game.rect), 1, donothing))
			.add(new Entity(new Point(0.25, 0.10).multiply(game.rect), 1, donothing))
			.add(new Entity(new Point(0.10, 0.10).multiply(game.rect), 1, donothing))
			.add(new Entity(new Point(0.10, 0.25).multiply(game.rect), 1, donothing))
		;
	return level;
}

function TwoGroups()
{
	var draggable = new Behavior().Draggable().Colliding(game).Clamped(game.rect),
		coward = new Behavior().Coward(150, 100, false, true).Clamped(game.rect),
		donothing = new Behavior(),
		level = new Level('Break is over', 'Scare them back to work.', new Behavior().Clickable())
			.add(new Goal(new Line(0, .5, 1, .5).multiply(game.rect), 40, 30, 2000))
			.call(Walls)
			.star(1500,1300,1200)
			// Group one
			.add(new Entity(new Point(0.15, 0.25).multiply(game.rect), 0, draggable))
			.add(new Entity(new Point(0.30, 0.25).multiply(game.rect), 0, draggable))
			.add(new Entity(new Point(0.45, 0.25).multiply(game.rect), 0, draggable))
			.add(new Entity(new Point(0.60, 0.25).multiply(game.rect), 0, donothing))
			.add(new Entity(new Point(0.75, 0.25).multiply(game.rect), 0, donothing))
			.add(new Entity(new Point(0.90, 0.25).multiply(game.rect), 0, donothing))
			//Group two
			.add(new Entity(new Point(0.90, 0.75).multiply(game.rect), 1, coward))
			.add(new Entity(new Point(0.75, 0.75).multiply(game.rect), 1, coward))
			.add(new Entity(new Point(0.60, 0.75).multiply(game.rect), 1, coward))
			.add(new Entity(new Point(0.45, 0.75).multiply(game.rect), 1, donothing))
			.add(new Entity(new Point(0.30, 0.75).multiply(game.rect), 1, donothing))
			.add(new Entity(new Point(0.15, 0.75).multiply(game.rect), 1, donothing))
		;
	return level;
}

function SoManyCowards()
{	
	var behavior1 = new Behavior().Coward(130, 120, false, true).Clamped(game.rect),
		behavior2 = new Behavior().Coward(130, 120, false, true).Clamped(game.rect),
		level = new Level('So many cowards', 'No, seriously, who hired these men?', new Behavior().Clickable())
			.add(new Goal(new Line(0, .5, 1, .5).multiply(game.rect), 40, 20, 2000))
			.call(Walls)
			.star(1500,1400,1200)
			// Group one
			.add(new Entity(new Point(0.20, 0.2).multiply(game.rect), 0, behavior1))
			.add(new Entity(new Point(0.20, 0.2).multiply(game.rect), 0, behavior1))
			.add(new Entity(new Point(0.20, 0.2).multiply(game.rect), 0, behavior1))
			.add(new Entity(new Point(0.20, 0.2).multiply(game.rect), 0, behavior1))
			.add(new Entity(new Point(0.20, 0.2).multiply(game.rect), 0, behavior1))
			.add(new Entity(new Point(0.20, 0.2).multiply(game.rect), 0, behavior1))
			.add(new Entity(new Point(0.20, 0.2).multiply(game.rect), 0, behavior1))
			.add(new Entity(new Point(0.20, 0.2).multiply(game.rect), 0, behavior1))
			.add(new Entity(new Point(0.20, 0.2).multiply(game.rect), 0, behavior1))
			.add(new Entity(new Point(0.20, 0.2).multiply(game.rect), 0, behavior1))
			.add(new Entity(new Point(0.20, 0.2).multiply(game.rect), 0, behavior1))
			.add(new Entity(new Point(0.20, 0.2).multiply(game.rect), 0, behavior1))
			//Group two
			.add(new Entity(new Point(0.80, 0.8).multiply(game.rect), 1, behavior2))
			.add(new Entity(new Point(0.80, 0.8).multiply(game.rect), 1, behavior2))
			.add(new Entity(new Point(0.80, 0.8).multiply(game.rect), 1, behavior2))
			.add(new Entity(new Point(0.80, 0.8).multiply(game.rect), 1, behavior2))
			.add(new Entity(new Point(0.80, 0.8).multiply(game.rect), 1, behavior2))
			.add(new Entity(new Point(0.80, 0.8).multiply(game.rect), 1, behavior2))
			.add(new Entity(new Point(0.80, 0.8).multiply(game.rect), 1, behavior2))
			.add(new Entity(new Point(0.80, 0.8).multiply(game.rect), 1, behavior2))
			.add(new Entity(new Point(0.80, 0.8).multiply(game.rect), 1, behavior2))
			.add(new Entity(new Point(0.80, 0.8).multiply(game.rect), 1, behavior2))
			.add(new Entity(new Point(0.80, 0.8).multiply(game.rect), 1, behavior2))
			.add(new Entity(new Point(0.80, 0.8).multiply(game.rect), 1, behavior2))
	;
	return level;
}

function Cowards()
{	
	var behavior1 = new Behavior().Coward(150, 100, false, true).Clamped(game.rect),
		behavior2 = new Behavior().Coward(150, 100, false, true).Clamped(game.rect),
		level = new Level('Cowards', 'Some cadets are afraid of you. Use it to get them to the right location.', new Behavior().Clickable())
			.add(new Goal(new Line(0, .5, 1, .5).multiply(game.rect), 40, 20, 2000))
			.call(Walls)
			.star(1650,1500,1300)
			// Group one
			.add(new Entity(new Point(0.20, 0.1).multiply(game.rect), 0, behavior1))
			.add(new Entity(new Point(0.25, 0.2).multiply(game.rect), 0, behavior1))
			.add(new Entity(new Point(0.35, 0.3).multiply(game.rect), 0, behavior1))
			.add(new Entity(new Point(0.25, 0.1).multiply(game.rect), 0, behavior1))
			//Group two
			.add(new Entity(new Point(0.40, 0.6).multiply(game.rect), 1, behavior2))
			.add(new Entity(new Point(0.45, 0.7).multiply(game.rect), 1, behavior2))
			.add(new Entity(new Point(0.55, 0.7).multiply(game.rect), 1, behavior2))
			.add(new Entity(new Point(0.60, 0.6).multiply(game.rect), 1, behavior2))
	;
	return level;
}

function GainingStrength()
{	
	var behavior = new Behavior().Clamped(game.rect),
		behaviorL = new Behavior().Editable(behavior),
		level = new Level('Gaining strength', 'We need at least double the forces to guarantee a stable area.', behaviorL)
			.add(new Goal(new Line(0, .5, 1, .5).multiply(game.rect), 40, 40, 2000))
			.call(Walls)
			.star(1750,1650,1550)
			// Group one
			.add(new Entity(new Point(0.40, 0.75).multiply(game.rect), 0, behavior))
			.add(new Entity(new Point(0.20, 0.75).multiply(game.rect), 0, behavior))
			.add(new Entity(new Point(0.10, 0.75).multiply(game.rect), 0, behavior))
			.add(new Entity(new Point(0.30, 0.75).multiply(game.rect), 0, behavior))
			.add(new Entity(new Point(0.50, 0.75).multiply(game.rect), 0, behavior))
			.add(new Entity(new Point(0.60, 0.75).multiply(game.rect), 0, behavior))
			//Group two
			.add(new Entity(new Point(0.40, 0.25).multiply(game.rect), 1, behavior))
			.add(new Entity(new Point(0.20, 0.25).multiply(game.rect), 1, behavior))
			.add(new Entity(new Point(0.10, 0.25).multiply(game.rect), 1, behavior))
			.add(new Entity(new Point(0.30, 0.25).multiply(game.rect), 1, behavior))
			.add(new Entity(new Point(0.50, 0.25).multiply(game.rect), 1, behavior))
			.add(new Entity(new Point(0.60, 0.25).multiply(game.rect), 1, behavior))
		;
	return level;
}

function Irrational()
{	
	var standStill = new Behavior().Clamped(game.rect),
		clickAndAdd = new Behavior().Clickable().Editable(standStill),
		coward = new Behavior().Coward(150, 100, false, true).Clamped(game.rect),
		level = new Level('Irrational', 'The veterans are scared of the young ones', clickAndAdd)
			.add(new Goal(new Line(0, .5, 1, .5).multiply(game.rect), 40, 40, 2000))
			.call(Walls)
			.star(1650,1450,1250)
			// Group one
			.add(new Entity(new Point(0.40, 0.75).multiply(game.rect), 0, coward))
			.add(new Entity(new Point(0.45, 0.75).multiply(game.rect), 0, coward))
			.add(new Entity(new Point(0.55, 0.75).multiply(game.rect), 0, coward))
			.add(new Entity(new Point(0.60, 0.75).multiply(game.rect), 0, coward))
			//Group two
			.add(new Entity(new Point(0.40, 0.25).multiply(game.rect), 1, coward))
			.add(new Entity(new Point(0.45, 0.25).multiply(game.rect), 1, coward))
			.add(new Entity(new Point(0.60, 0.25).multiply(game.rect), 1, coward))
			.add(new Entity(new Point(0.55, 0.25).multiply(game.rect), 1, coward))
		;
	return level;
}
