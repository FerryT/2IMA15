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

window.scrollTo(0, 1);

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
	$('#btn-resume').hide();
});

$('#btn-restart').click(function()
{
	game.start(game.level.id);
});

$('#btn-pause').click(function()
{
	game.pause();

	$('#btn-pause').hide();
	$('#btn-resume').show();
});

$('#btn-resume').click(function()
{
	game.resume();

	$('#btn-pause').show();
	$('#btn-resume').hide();
});

// Menu
$('#btn-play').click(function()
{
	$('#menu').hide();
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
});
$('#btn-exit').click(function()
{
	window.close();
});

// Done loading
$('#btn-back').click();
$('#loader').hide();

//------------------------------------------------------------------------------

});
