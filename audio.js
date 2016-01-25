/*********************************************************\
* Music and sound effects operations                      *
\*********************************************************/

function MusicPlayer(id)
{
	this.audio = document.getElementById(id);
	this.playing = false;
}

//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

MusicPlayer.prototype.play = function play()
{
	if (this.playing && !this.audio.ended) return;
	this.audio.currentTime = 0;
	this.audio.play();
	this.playing = true;
	this.loop = undefined;
	return this;
}

//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

MusicPlayer.prototype.loop = function loop(start, end)
{
	if (this.playing && !this.audio.ended) return;

	var self = this,
		duration = (end - start) * 1000 - 25;
	function loop()
	{
		self.audio.currentTime = start;
		self.loop = setTimeout(loop, duration);
	}
	this.audio.currentTime = 0;
	this.loop = setTimeout(loop, end * 1000 - 25);
	return this.play();
}

//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

MusicPlayer.prototype.stop = function stop()
{
	if (!this.playing) return;
	if (this.loop)
	{
		clearTimeout(this.loop);
		this.loop = undefined;
	}
	this.audio.pause();
	this.audio.currentTime = 0;
	this.playing = false;
	return this;
}

//------------------------------------------------------------------------------
