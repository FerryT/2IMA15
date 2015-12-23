function InitializeLevels()
{
	game.addLevel(LevelOne());
	game.addLevel(LevelZero());
	game.addLevel(LevelTwo());
	game.addLevel(LevelThree());
	game.addLevel(LevelFour());
}

// Todo: concrete points instead of random ones

function LevelZero()
{	
	var behavior1 = new Behavior().Coward(1).Clamped(game.rect),
		behavior2 = new Behavior().Coward(5).Clamped(game.rect),
		level = new Level('Runaround')
			.add(new Goal(new Line(0, .5, 1, .5).multiply(game.rect), 40))
			// Group one
			.add(new Entity(game.rect.randomPoint(), 0, behavior1))
			.add(new Entity(game.rect.randomPoint(), 0, behavior1))
			.add(new Entity(game.rect.randomPoint(), 0, behavior1))
			.add(new Entity(game.rect.randomPoint(), 0, behavior1))
			//Group two
			.add(new Entity(game.rect.randomPoint(), 1, behavior2))
			.add(new Entity(game.rect.randomPoint(), 1, behavior2))
			.add(new Entity(game.rect.randomPoint(), 1, behavior2))
			.add(new Entity(game.rect.randomPoint(), 1, behavior2))
	;
	return level;
}

function LevelOne()
{	
	var behavior = new Behavior().Draggable().Clamped(game.rect),
		behaviorL = new Behavior().Editable(behavior),
		level = new Level('I\'ll wait', behaviorL)
			.add(new Goal(new Line(0, .5, 1, .5).multiply(game.rect), 40))
			// Group one
			.add(new Entity(game.rect.randomPoint(), 0, behavior))
			.add(new Entity(game.rect.randomPoint(), 0, behavior))
			.add(new Entity(game.rect.randomPoint(), 0, behavior))
			.add(new Entity(game.rect.randomPoint(), 0, behavior))
			//Group two
			.add(new Entity(game.rect.randomPoint(), 1, behavior))
			.add(new Entity(game.rect.randomPoint(), 1, behavior))
			.add(new Entity(game.rect.randomPoint(), 1, behavior))
			.add(new Entity(game.rect.randomPoint(), 1, behavior))
		;
	return level;
}

function LevelTwo()
{	
	var behavior = new Behavior().Bounce(20).Clamped(game.rect),
		level = new Level('Jump!')
			.add(new Goal(new Line(0, .5, 1, .5).multiply(game.rect), 40))
			// Group one
			.add(new Entity(game.rect.randomPoint(), 0, behavior))
			.add(new Entity(game.rect.randomPoint(), 0, behavior))
			.add(new Entity(game.rect.randomPoint(), 0, behavior))
			.add(new Entity(game.rect.randomPoint(), 0, behavior))
			//Group two
			.add(new Entity(game.rect.randomPoint(), 1, behavior))
			.add(new Entity(game.rect.randomPoint(), 1, behavior))
			.add(new Entity(game.rect.randomPoint(), 1, behavior))
			.add(new Entity(game.rect.randomPoint(), 1, behavior))
		;
	return level;
}

function LevelThree()
{	
	var behavior1 = Behavior.None,
		behavior2 = new Behavior().Pieter(1).Clamped(game.rect),
		level = new Level('Runnin\' with the devil!')
			.add(new Goal(new Line(0, .5, 1, .5).multiply(game.rect), 40))
			// Group one
			.add(new Entity(game.rect.randomPoint(), 0, behavior1))
			.add(new Entity(game.rect.randomPoint(), 0, behavior1))
			.add(new Entity(game.rect.randomPoint(), 0, behavior1))
			.add(new Entity(game.rect.randomPoint(), 0, behavior1))
			// Group two
			.add(new Entity(game.rect.randomPoint(), 1, behavior2))
			.add(new Entity(game.rect.randomPoint(), 1, behavior2))
			.add(new Entity(game.rect.randomPoint(), 1, behavior2))
			.add(new Entity(game.rect.randomPoint(), 1, behavior2))
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
			.add(new Entity(game.rect.randomPoint(), 0, behavior))
			// Group two
			.add(new Entity(game.rect.randomPoint(), 1, behavior))
			.add(new Entity(game.rect.randomPoint(), 1, behavior))
			.add(new Entity(game.rect.randomPoint(), 1, behavior))
			.add(new Entity(game.rect.randomPoint(), 1, behavior))
			.add(new Entity(game.rect.randomPoint(), 1, behavior))
			.add(new Entity(game.rect.randomPoint(), 1, behavior))
			.add(new Entity(game.rect.randomPoint(), 1, behavior))
		;
	return level;
}
