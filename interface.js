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
	$('#menu').show();
	$('#options').hide();
	$('#about').hide();
	$('#topbar').hide();
});

// Game bar
$('#btn-menu').click(function()
{
	$('#btn-play').text('Resume');
	$('#menu').show();
	$('#gamebar').hide();
	game.pause();
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

// Menu
$('#btn-play').click(function()
{
	$('#menu').hide();
	$('#gamebar').show();
	game.resume();
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
});
$('#btn-exit').click(function()
{
	window.close();
});

// Done loading
$(function()
{
	$('#btn-back').click();
	$('#loader').hide();
});

//------------------------------------------------------------------------------

});
