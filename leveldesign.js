function InitializeLevels()
{
	//game.addLevel(LevelZero());
	game.addLevel(LevelOne());
	game.addLevel(LevelTwo());
	game.addLevel(LevelThree());
	game.addLevel(LevelFour());
}

function LevelZero()
{	
	var level = new Level('Runaround');

	var groupOne = [new Entity(game.rect.randomPoint(), 0, new Behavior().Coward(1)),
					new Entity(game.rect.randomPoint(), 0, new Behavior().Coward(1)),
					new Entity(game.rect.randomPoint(), 0, new Behavior().Coward(1)),
					new Entity(game.rect.randomPoint(), 0, new Behavior().Coward(1))];
	var groupTwo = [new Entity(game.rect.randomPoint(), 1, new Behavior().Coward(5)),
					new Entity(game.rect.randomPoint(), 1, new Behavior().Coward(5)),
					new Entity(game.rect.randomPoint(), 1, new Behavior().Coward(5)),
					new Entity(game.rect.randomPoint(), 1, new Behavior().Coward(5))];

	level.add(groupOne);
	level.add(groupTwo);
	level.add(new Goal(new Line(0, .5, 1, .5).multiply(game.rect), 40));
			
	return level;
}

function LevelOne()
{	
	var level = new Level('I\'ll wait', new Behavior().Editable()),
		behavior = new Behavior().Draggable();

	var groupOne = [new Entity(game.rect.randomPoint(), 0, behavior),
					new Entity(game.rect.randomPoint(), 0, behavior),
					new Entity(game.rect.randomPoint(), 0, behavior),
					new Entity(game.rect.randomPoint(), 0, behavior)];
	var groupTwo = [new Entity(game.rect.randomPoint(), 1, behavior),
					new Entity(game.rect.randomPoint(), 1, behavior),
					new Entity(game.rect.randomPoint(), 1, behavior),
					new Entity(game.rect.randomPoint(), 1, behavior)];

	level.add(groupOne);
	level.add(groupTwo);
	level.add(new Goal(new Line(0, .5, 1, .5).multiply(game.rect), 40));
			
	return level;
}

function LevelTwo()
{	
	var level = new Level('Jump!');

	var groupOne = [new Entity(game.rect.randomPoint(), 0, new Behavior().Bounce(20)),
					new Entity(game.rect.randomPoint(), 0, new Behavior().Bounce(20)),
					new Entity(game.rect.randomPoint(), 0, new Behavior().Bounce(20)),
					new Entity(game.rect.randomPoint(), 0, new Behavior().Bounce(20))];
	var groupTwo = [new Entity(game.rect.randomPoint(), 1, new Behavior().Bounce(20)),
					new Entity(game.rect.randomPoint(), 1, new Behavior().Bounce(20)),
					new Entity(game.rect.randomPoint(), 1, new Behavior().Bounce(20)),
					new Entity(game.rect.randomPoint(), 1, new Behavior().Bounce(20))];
	
	level.add(groupOne);
	level.add(groupTwo);
	level.add(new Goal(new Line(0, .5, 1, .5).multiply(game.rect), 40));
			
	return level;
}

function LevelThree()
{	
	var level = new Level('Runnin\' with the devil!');

	var behavior1 = new Behavior().Pieter(1);
	var groupOne = [new Entity(game.rect.randomPoint(), 0, Behavior.None),
					new Entity(game.rect.randomPoint(), 0, Behavior.None),
					new Entity(game.rect.randomPoint(), 0, Behavior.None),
					new Entity(game.rect.randomPoint(), 0, Behavior.None)];
	var groupTwo = [new Entity(game.rect.randomPoint(), 1, behavior1),
					new Entity(game.rect.randomPoint(), 1, behavior1),
					new Entity(game.rect.randomPoint(), 1, behavior1),
					new Entity(game.rect.randomPoint(), 1, behavior1)];
	
	level.add(groupOne);
	level.add(groupTwo);
	level.add(new Goal(new Line(0, .5, 1, .5).multiply(game.rect), 40));
			
	return level;
}

function LevelFour()
{	
	var level = new Level('Somebody get me a doctor');

	var behavior1 = new Behavior().Pieter(0.5);
	var groupOne = [new Entity(game.rect.randomPoint(), 0, behavior1),
					new Entity(game.rect.randomPoint(), 0, behavior1),
					new Entity(game.rect.randomPoint(), 0, behavior1),
					new Entity(game.rect.randomPoint(), 0, behavior1),
					new Entity(game.rect.randomPoint(), 0, behavior1),
					new Entity(game.rect.randomPoint(), 0, behavior1),
					new Entity(game.rect.randomPoint(), 0, behavior1)];
	var groupTwo = [new Entity(game.rect.randomPoint(), 1, behavior1),
					new Entity(game.rect.randomPoint(), 1, behavior1),
					new Entity(game.rect.randomPoint(), 1, behavior1),
					new Entity(game.rect.randomPoint(), 1, behavior1),
					new Entity(game.rect.randomPoint(), 1, behavior1),
					new Entity(game.rect.randomPoint(), 1, behavior1),
					new Entity(game.rect.randomPoint(), 1, behavior1)];
	
	level.add(groupOne);
	level.add(groupTwo);
	level.add(new Goal(new Line(0, .5, 1, .5).multiply(game.rect), 40));
			
	return level;
}