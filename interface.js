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

$('#game-title, #orient-guard h1').text(document.title);

function resize()
{
	var isTouchScreen = 'ontouchstart' in window,
		isLandscape = window.innerHeight <= window.innerWidth;

	$('body')
		.css('font-size', Math.max(screen.height / 50, 5) * (isTouchScreen ? 1 : 0.8))
	;

	if (!isTouchScreen) return;
	if (isLandscape)
		$('#orient-guard').hide();
	else
		$('#orient-guard').show();
}
resize();
$(window).resize(resize);

// Topbar
$('#btn-back').click(function()
{
	$('#btn-play').text(game.level.id ? 'Resume' : 'Play');
	$('#levels').hide();
	$('#options').hide();
	$('#about').hide();
	$('#topbar').hide();
	if (window.musicplayer) musicplayer.setModal(false);
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
	d3.select('#win-score').transition();
	game.start(game.level.id);
});

$('#btn-win-resume').click(function()
{
	$('#win-screen').hide();
	d3.select('#win-score').transition();
	if (game.level.next)
		game.start(game.level.next);
	else
		$('#btn-win-menu').click();
});

$('#btn-win-menu').click(function()
{
	$('#win-screen').hide();
	d3.select('#win-score').transition();
	game.stop();
	$('#btn-menu').click();
});

function stareffect(type)
{
	d3.select('body').append('div')
		.attr('class', 'star-effect ' + type)
		.transition().duration(1500)
		.style({ 'background-size': '100%', opacity: 0 })
		.each('end', function () { d3.select(this).remove(); })
	;
}

$('#win-screen').on('score', function()
{
	d3.select('#win-score').transition()
		.duration(3000)
		.ease(d3.ease('exp-in-out'))
		.tween("text", function()
		{
			var score = d3.interpolateRound(0, game.level.score()),
				effect = { gold: game.level.gold, silver: game.level.silver, bronze: game.level.bronze };
			return function(t)
			{
				var value = score(t);
				this.textContent = value;
				for (var type in effect) if (value >= effect[type])
				{
					delete effect[type];
					stareffect(type);
				}
			};
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
	if (window.musicplayer) musicplayer.setModal(true);
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
				.toggleClass('gold', game.data.star[id] === 1)
				.toggleClass('silver', game.data.star[id] === 2)
				.toggleClass('bronze', game.data.star[id] === 3)
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

// Options
$('#btn-reset-game').click(function()
{
	game.stop();
	ResetGame();
	$('#btn-back').click();
});

$('#btn-music-off').click(function()
{
	if (window.musicplayer)
		window.musicplayer.stop();
	localStorage.music = 'off';
});

$('#btn-music-on').click(function()
{
	if (window.musicplayer)
		window.musicplayer.stop();
	StartMusic();
	delete localStorage.music;
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
	setTimeout(function () { window.scrollTo(0, 1); }, 1);
});

//------------------------------------------------------------------------------

});
