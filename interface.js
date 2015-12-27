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

// Game bar / screen
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

$('#btn-win-restart').click(function()
{
	$('#win-screen').hide();
	game.start(game.level.id);
});

$('#btn-win-resume').click(function()
{
	$('#win-screen').hide();
	game.start(game.level.next);
});

$('#btn-win-menu').click(function()
{
	$('#win-screen').hide();
	game.start(game.level.next);
	$('#btn-menu').click();
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
	Waypoint.refreshAll();
});
$('#btn-exit').click(function()
{
	window.close();
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
	$('#btn-back').click();
	$('#loader').hide();
});

//------------------------------------------------------------------------------

});
