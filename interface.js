/*********************************************************\
* Menus and page interaction                              *
\*********************************************************/

$(function() {

//------------------------------------------------------------------------------

// Initialization
$('button.icon').each(function()
{
	var glyph = $(this).text();
	$(this)
		.html('<svg class="icon"><use xlink:href="#'+glyph+'" class="icon-'+glyph+'"></use></svg>')
	;
});

setTimeout(function () { window.scrollTo(0, 1); }, 1);

function resize()
{
	var isTouchScreen = 'ontouchstart' in window;
	$('body')
		.css('font-size', Math.max(screen.height / 50, 5) * (isTouchScreen ? 1 : 0.8))
	;
}

resize();

// Topbar
$('#btn-back').click(function()
{
	$('#btn-play').text(game.level.id ? 'Resume' : 'Play');
	$('#levels').hide();
	$('#options').hide();
	$('#about').hide();
	$('#topbar').hide();
});

// Game bar / screen
$('#btn-menu').click(function()
{
	game.pause();
	$('#level-buttons a').trigger('update');
	$('#menu').show();
	$('#levels').show();
	$('#topbar').show();
	$('#gamebar').hide();
});

$('#btn-restart').click(function()
{
	game.start(game.level.id);
});

$('#btn-pause').click(function()
{
	game.pause();
	$('#pause-screen').show();
});

$('#pause-screen').click(function()
{
	$('#pause-screen').hide();
	game.resume();
});

$('#lose-screen').click(function()
{
	$('#lose-screen').hide();
	game.start(game.level.id);
});

$('#btn-win-restart').click(function()
{
	$('#win-screen').hide();
	game.start(game.level.id);
});

$('#btn-win-resume').click(function()
{
	$('#win-screen').hide();
	if (game.level.next)
		game.start(game.level.next);
	else
		$('#btn-win-menu').click();
});

$('#btn-win-menu').click(function()
{
	$('#win-screen').hide();
	game.stop();
	$('#btn-menu').click();
});

$('#win-screen').on('score', function()
{
	d3.select('#win-score').transition()
		.duration(5000)
		.ease(d3.ease('circle-in-out'))
		.tween("text", function()
		{
			var score = d3.interpolateRound(0, game.level.score());
			return function(t) { this.textContent = score(t); };
		})
	;
});

// Game
var GameUpdater = {
	start: function()
	{
		$('#levelheader').text(game.level.name);
		$('#leveltext').text(game.level.desc);
		if (GameUpdater.timer) return;
		GameUpdater.update();
		GameUpdater.timer = setInterval(GameUpdater.update, 1000);
	},
	stop: function()
	{
		if (!GameUpdater.timer) return;
		clearInterval(GameUpdater.timer);
		GameUpdater.update();
		delete GameUpdater.timer;
	},
	update: function()
	{
		$('#game-score').text(game.level.score());
	}
}

// Menu
$('#btn-play').click(function()
{
	$('#level-buttons a').trigger('update');
	$('#levels').show();
	$('#topbar').show();
});
$('#btn-options').click(function()
{
	$('#options').show();
	$('#topbar').show();
});
$('#btn-about').click(function()
{
	$('#about').show();
	$('#topbar').show();
	Waypoint.refreshAll();
});
$('#btn-exit').click(function()
{
	window.open('', '_self', '');
	window.close();
});

// Levels
$(function()
{
	function starter(id)
	{
		return function()
		{
			if (game.data.unlocked[id] !== true) return;
			if (game.level.id == id)
				game.resume();
			else
				game.start(id);
			$('#gamebar').show();
			$('#menu').hide();
			$('#levels').hide();
		}
	}
	function updater(id)
	{
		return function()
		{
			$(this)
				.toggleClass('locked', game.data.unlocked[id] !== true)
				.toggleClass('paused', game.level.id == id)
			;
		}
	}
	for (var i = 1, l = game.levels.length; i < l; ++i)
	{
		$('#level-buttons')
			.append($('<a>')
				.text(i)
				.attr('title', game.levels[i].name)
				.click(starter(i))
				.on('update', updater(i)))
		;
	}
});

// About
$('#about-tabs a').click(function()
{
	var target = $('#' + $(this).attr('id').slice(4));
	$('#about article').scrollTo(target, 350, { offset: -20 });
});
function select()
{
	$('#about-tabs a').removeClass('selected');
	$('#btn-' + $(this.element).attr('id')).toggleClass('selected', true);
}
$('#about section').waypoint(select, { context: $('#about article') });
$('#about section').waypoint(select, {
	context: $('#about article'),
	offset: '50%'
});

// Done loading
$(function()
{
	game.on('pause', GameUpdater.stop);
	game.on('resume', GameUpdater.start);
	$('#btn-back').click();
	$('#loader').hide();
});

//------------------------------------------------------------------------------

});
