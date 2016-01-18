function InitializeLevels()
{
	game.addLevel(DragMe());
	game.addLevel(DragUs());
	game.addLevel(PlaceUs());
	game.addLevel(GiveUsCompany());
	game.addLevel(HoldMe());
	game.addLevel(Cowards());
	game.addLevel(Magnets());
	game.addLevel(ClickMe());
	//game.addLevel(LevelFour());
}

function DragMe()
{
	var draggable = new Behavior().Draggable().Clamped(game.rect),
		behavior = new Behavior(),
		level = new Level('Drag me!', 'Add description here...')
			.add(new Goal(new Line(0, .5, 1, .5).multiply(game.rect), 40, 20 /* time limit */, 2000 /* max score */))
			// Group one
			.add(new Entity(new Point(0.25, 0.75).multiply(game.rect), 0, behavior))
			.add(new Entity(new Point(0.25, 0.25).multiply(game.rect), 0, behavior))
			//Group two
			.add(new Entity(new Point(0.75, 0.60).multiply(game.rect), 1, draggable))
			.add(new Entity(new Point(0.75, 0.75).multiply(game.rect), 1, behavior))
		;
	return level;
}

function DragUs()
{
	var draggable = new Behavior().Draggable().Clamped(game.rect),
		behavior = new Behavior(),
		level = new Level('Drag us!', 'Add description here...')
			.add(new Goal(new Line(0, .5, 1, .5).multiply(game.rect), 40, 20, 2000))
			// Group one
			.add(new Entity(new Point(0.25, 0.35).multiply(game.rect), 0, draggable))
			.add(new Entity(new Point(0.25, 0.25).multiply(game.rect), 0, behavior))
			//Group two
			.add(new Entity(new Point(0.75, 0.60).multiply(game.rect), 1, draggable))
			.add(new Entity(new Point(0.75, 0.75).multiply(game.rect), 1, behavior))
		;
	return level;
}

function PlaceUs()
{	
	var behavior = new Behavior().Clamped(game.rect),
		behaviorL = new Behavior().Editable(behavior),
		level = new Level('Put me down!', 'Add description here...', behaviorL)
			.add(new Goal(new Line(0, .5, 1, .5).multiply(game.rect), 40, 20, 2000))
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
		level = new Level('Give us company!', 'Add description here...', behaviorL)
			.add(new Goal(new Line(0, .5, 1, .5).multiply(game.rect), 40, 20, 2000))
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
		level = new Level('Runaround', 'Add description here...', new Behavior().Clickable())
			.add(new Goal(new Line(0, .5, 1, .5).multiply(game.rect), 40, 20, 2000))
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

function Magnets()
{	
	var behavior1 = new Behavior().Coward(100, 100, true).Clamped(game.rect),
		behavior2 = new Behavior().Coward(100, 100, true).Clamped(game.rect),
		level = new Level('Runaround', 'Add description here...', new Behavior().Clickable())
			.add(new Goal(new Line(0, .5, 1, .5).multiply(game.rect), 40, 20, 2000))
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
		level = new Level('Click me', 'Add description here...', new Behavior().Clickable())
			.add(new Goal(new Line(0, .5, 1, .5).multiply(game.rect), 40, 20, 2000))
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

function HoldMe()
{	
	var bounce = new Behavior().Bounce(20,40).Clamped(game.rect),
		bounceDrag = new Behavior().Bounce(20,40).Draggable().Clamped(game.rect),
		stay = new Behavior(),
		level = new Level('Hold me', 'Add description here...', new Behavior().Clickable())
			.add(new Goal(new Line(0, .5, 1, .5).multiply(game.rect), 40, 20, 2000))
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

function DragPoints()
{	
	var behavior = new Behavior().Draggable().Clamped(game.rect),
		level = new Level('I\'ll wait', 'Add description here...')
			.add(new Goal(new Line(0, .5, 1, .5).multiply(game.rect), 40, 20, 2000))
			// Group one
			.add(new Entity(new Point(0.2, 0.1).multiply(game.rect), 0, behavior))
			.add(new Entity(new Point(0.4, 0.1).multiply(game.rect), 0, behavior))
			.add(new Entity(new Point(0.6, 0.1).multiply(game.rect), 0, behavior))
			.add(new Entity(new Point(0.8, 0.1).multiply(game.rect), 0, behavior))
			//Group two
			.add(new Entity(new Point(0.2, 0.9).multiply(game.rect), 1, behavior))
			.add(new Entity(new Point(0.4, 0.9).multiply(game.rect), 1, behavior))
			.add(new Entity(new Point(0.6, 0.9).multiply(game.rect), 1, behavior))
			.add(new Entity(new Point(0.8, 0.9).multiply(game.rect), 1, behavior))
		;
	return level;
}

function DragBouncingPoints()
{	
	var behavior = new Behavior().Bounce(20,40).Draggable().Clamped(game.rect),
		behavior2 = new Behavior().Clamped(game.rect),
		level = new Level('Jump!', 'Add description here...')
			.add(new Goal(new Line(0, .5, 1, .5).multiply(game.rect), 40, 20, 2000))
			// Group one
			.add(new Entity(new Point(0.4, 0.3).multiply(game.rect), 0, behavior))
			.add(new Entity(new Point(0.3, 0.1).multiply(game.rect), 0, behavior2))
			.add(new Entity(new Point(0.5, 0.9).multiply(game.rect), 0, behavior2))
			.add(new Entity(new Point(0.7, 0.1).multiply(game.rect), 0, behavior2))
			//Group two
			.add(new Entity(new Point(0.6, 0.3).multiply(game.rect), 1, behavior))
			.add(new Entity(new Point(0.3, 0.9).multiply(game.rect), 1, behavior2))
			.add(new Entity(new Point(0.5, 0.1).multiply(game.rect), 1, behavior2))
			.add(new Entity(new Point(0.7, 0.9).multiply(game.rect), 1, behavior2))
		;
	return level;
}

function DragMovingPoints()
{	
	var behavior1 = Behavior.None,
		behavior2 = new Behavior().Pieter(2.5).Draggable().Clamped(game.rect),
		level = new Level('Runnin\' with the devil!', 'Add description here...')
			.add(new Goal(new Line(0, .5, 1, .5).multiply(game.rect), 40, 20, 2000))
			// Group one
			.add(new Entity(new Point(0.1, 0.1).multiply(game.rect), 0, behavior1))
			.add(new Entity(new Point(0.1, 0.9).multiply(game.rect), 0, behavior1))
			.add(new Entity(new Point(0.9, 0.1).multiply(game.rect), 0, behavior1))
			.add(new Entity(new Point(0.9, 0.9).multiply(game.rect), 0, behavior1))
			// Group two
			.add(new Entity(new Point(0.2, 0.3).multiply(game.rect), 1, behavior2))
			.add(new Entity(new Point(0.4, 0.3).multiply(game.rect), 1, behavior2))
			.add(new Entity(new Point(0.6, 0.3).multiply(game.rect), 1, behavior2))
			.add(new Entity(new Point(0.8, 0.3).multiply(game.rect), 1, behavior2))
		;
	return level;
}

function LevelFour()
{	
	var behavior = new Behavior().Pieter(0.5).Clamped(game.rect),
		level = new Level('Somebody get me a doctor', 'Add description here...')
			.add(new Goal(new Line(0, .5, 1, .5).multiply(game.rect), 40, 20, 2000))
			// Group one
			.add(new Entity(game.rect.randomPoint(), 0, behavior))
			.add(new Entity(game.rect.randomPoint(), 0, behavior))
			.add(new Entity(game.rect.randomPoint(), 0, behavior))
			.add(new Entity(game.rect.randomPoint(), 0, behavior))
			.add(new Entity(game.rect.randomPoint(), 0, behavior))
			.add(new Entity(game.rect.randomPoint(), 0, behavior))
			// Group two
			.add(new Entity(game.rect.randomPoint(), 1, behavior))
			.add(new Entity(game.rect.randomPoint(), 1, behavior))
			.add(new Entity(game.rect.randomPoint(), 1, behavior))
			.add(new Entity(game.rect.randomPoint(), 1, behavior))
			.add(new Entity(game.rect.randomPoint(), 1, behavior))
			.add(new Entity(game.rect.randomPoint(), 1, behavior))
		;
	return level;
}
