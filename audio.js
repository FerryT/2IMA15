/*********************************************************\
* Music and sound effects operations                      *
\*********************************************************/

function MusicPlayer(id)
{
	this.audio = document.getElementById(id);
	this.playing = false;
	this.timer = undefined;
}

//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

MusicPlayer.prototype.play = function play()
{
	if (this.playing && !this.audio.ended) return;
	this.audio.currentTime = 0;
	this.audio.play();
	this.playing = true;
	return this;
}

//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

MusicPlayer.prototype.loop = function loop(start, end)
{
	if (this.playing && !this.audio.ended) return;

	var self = this,
		duration = (end - start) * 1000 - 25;
	function repeat()
	{
		self.audio.currentTime = start;
		self.timer = setTimeout(repeat, duration);
	}
	setTimeout(function()
	{
		self.audio.currentTime = 0;
		self.timer = setTimeout(repeat, end * 1000 - 25);
	}, 1000);
	return this.play();
}

//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

MusicPlayer.prototype.stop = function stop()
{
	if (!this.playing) return;
	if (this.timer)
	{
		clearTimeout(this.timer);
		this.timer = undefined;
	}
	this.audio.pause();
	this.audio.currentTime = 0;
	this.playing = false;
	return this;
}

//------------------------------------------------------------------------------
