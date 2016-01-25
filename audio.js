/*********************************************************\
* Music and sound effects operations                      *
\*********************************************************/

function MusicPlayer(id)
{
	this.audio = document.getElementById(id);
	this.playing = false;
	this.timer = undefined;
	this.modal = false;
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

//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

MusicPlayer.prototype.setModal = function setModal(modal)
{
	if (this.modal == modal) return;
	var self = this;
	d3.transition()
		.duration(1000)
		.tween('modal', function()
		{
			var i = d3.interpolate(modal ? 1 : .4, modal ? .4 : 1);
			return function (d) { self.audio.volume = i(d); };
		})
	;
	this.modal = modal;
}

//------------------------------------------------------------------------------
