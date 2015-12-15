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

// Topbar
$('#btn-back').click(function()
{
	$('#menu').show();
	$('#options').hide();
	$('#about').hide();
	$('#topbar').hide();
	$('#btn-resume').hide();
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
