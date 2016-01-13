function InitializeLevels()
{
	//game.addLevel(LevelOne());
	//game.addLevel(LevelOneB());
	//game.addLevel(LevelThree());
	game.addLevel(LevelZero());
	game.addLevel(LevelTwo());
	//game.addLevel(LevelFour());
}

// Todo: concrete points instead of random ones

function LevelZero()
{	
	var behavior1 = new Behavior().Coward(50, 25).Clamped(game.rect),
		behavior2 = new Behavior().Coward(200, 100).Clamped(game.rect),
		level = new Level('Runaround', new Behavior().Clickable())
			.add(new Goal(new Line(0, .5, 1, .5).multiply(game.rect), 40))
			// Group one
			.add(new Entity(new Point(0.5, 0.5).multiply(game.rect), 0, behavior1))
			.add(new Entity(new Point(0.1, 0.2).multiply(game.rect), 0, behavior1))
			.add(new Entity(new Point(0.1, 0.3).multiply(game.rect), 0, behavior1))
			.add(new Entity(new Point(0.1, 0.4).multiply(game.rect), 0, behavior1))
			//Group two
			.add(new Entity(new Point(0.5, 0.5).multiply(game.rect), 1, behavior2))
			.add(new Entity(new Point(0.1, 0.9).multiply(game.rect), 1, behavior2))
			.add(new Entity(new Point(0.2, 0.9).multiply(game.rect), 1, behavior2))
			.add(new Entity(new Point(0.3, 0.9).multiply(game.rect), 1, behavior2))
	;
	return level;
}

function LevelOne()
{	
	var behavior = new Behavior().Clamped(game.rect),
		behaviorL = new Behavior().Editable(behavior),
		level = new Level('I\'ll wait', behaviorL)
			.add(new Goal(new Line(0, .5, 1, .5).multiply(game.rect), 40))
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

function LevelOneB()
{	
	var behavior = new Behavior().Draggable().Clamped(game.rect),
		level = new Level('I\'ll wait')
			.add(new Goal(new Line(0, .5, 1, .5).multiply(game.rect), 40))
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

function LevelTwo()
{	
	var behavior = new Behavior().Bounce(20,40).Draggable().Clamped(game.rect),
		behavior2 = new Behavior().Clamped(game.rect),
		level = new Level('Jump!')
			.add(new Goal(new Line(0, .5, 1, .5).multiply(game.rect), 40))
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

function LevelThree()
{	
	var behavior1 = Behavior.None,
		behavior2 = new Behavior().Pieter(2.5).Draggable().Clamped(game.rect),
		level = new Level('Runnin\' with the devil!')
			.add(new Goal(new Line(0, .5, 1, .5).multiply(game.rect), 40))
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
		level = new Level('Somebody get me a doctor')
			.add(new Goal(new Line(0, .5, 1, .5).multiply(game.rect), 40))
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
