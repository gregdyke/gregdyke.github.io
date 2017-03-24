function Loopy($root) {
  this.$root = $root || document;
  this.samples = {};
  Loopy.loopies.push(this);
}

Loopy.loopies = [];
Loopy.context = new ( window.AudioContext || window.webkitAudioContext)();

Loopy.oldonload = window.onload;

window.onload = function() {
  Loopy.oldonload && Loopy.oldonload();
  var $loopies = document.querySelectorAll(".loopy");
  for (var i=0; i<$loopies.length; i++) {
    var $loopy = $loopies.item(i);
    var loopy = new Loopy($loopy);
    var $samples = $loopy.querySelectorAll(".sample");
    for (var j=0; j<$samples.length; j++) {
      var $sample = $samples.item(j);
      loopy.addSample($sample.dataset.title, $sample.dataset.src, $sample.dataset.pattern);
    }
  }

};

Loopy.SampleUi = function(sample, offset) {
  this.sample = sample;
  this.radius = 50;
  this.beatRadius = 7;
  this.y = 100;
  this.x = 100;
  
  this.impl = new Loopy.SampleUi.Paperjs(200, 200);
  this.impl.init(this);
    
};

Loopy.SampleUi.prototype.draw = function() {
  this.impl.clear();
  this.drawUi();
  if (!this.sample.muted) {
    this.drawNeedle();
  }
  this.drawRhythm();
};

Loopy.SampleUi.prototype.drawRhythm = function() {

  var onsetStart = -0.02;
  var steadyStart = 0;
  var steadyEnd = 0.03;
  var decayEnd = 0.05;


  var self = this;
  var timeFraction = this.sample.getTimeFraction();
  
  this.sample.beats.forEach(function(beat, i) {

    var delta = timeFraction-beat.time;
    
    var size = 1.0;
    
    if (!self.sample.muted && delta>onsetStart && delta<decayEnd) {
	    if (delta<steadyStart) {
		    size += (onsetStart-delta)/onsetStart;
	    } else if (delta<steadyEnd) {
		    size += 1.0;
	    } else if (delta<steadyEnd) {
		    size += (decayEnd-delta)/(decayEnd-steadyEnd);
	    }
	  }
	  
	  self.drawBeat(i, beat.time, size/beat.weight);
  });
    
};

Loopy.SampleUi.prototype.getPositionOnCircle = function(fraction) {
  return {
    x: Math.cos(2*Math.PI*(fraction-0.25))*this.radius + this.x,
    y: Math.sin(2*Math.PI*(fraction-0.25))*this.radius + this.y
  };
};

Loopy.SampleUi.prototype.drawNeedle = function() {
  var timeFraction = this.sample.getTimeFraction();
  var point = this.getPositionOnCircle(timeFraction);
  this.impl.drawNeedle(point.x, point.y, this.x, this.y);
};

Loopy.SampleUi.prototype.drawUi = function() {
  this.impl.drawUi(this.sample, this.x, this.y, this.radius);
};

Loopy.SampleUi.prototype.drawBeat = function(i, fraction, size) {
  var point = this.getPositionOnCircle(fraction);

  this.impl.drawBeat(i, point.x, point.y, this.beatRadius*size);
};



Loopy.SampleUi.Paperjs = function(w, h) {
  this.w = w;
  this.h = h;
  this.p = new paper.PaperScope();
};

Loopy.SampleUi.Paperjs.prototype.init = function(sampleUi) {

  var titleDom = document.createElement("div");
  titleDom.textContent = sampleUi.sample.name;
  titleDom.setAttribute("style", "text-align:center; margin-bottom:0; font-weight:bold");
  
  var canvasDom = document.createElement("canvas");
  canvasDom.setAttribute("width", this.w);
  canvasDom.setAttribute("height", this.h);
  
  var divDom = document.createElement("div");
  divDom.setAttribute("style", "display:inline-block");
  divDom.appendChild(titleDom);
  divDom.appendChild(canvasDom);
  sampleUi.sample.parentLoop.$root.appendChild(divDom);
  
  this.p.setup(canvasDom);
  this.createNeedle();
  this.createUi(sampleUi);
  this.createBeats(sampleUi);
  this.p.view.onFrame = function() {
    sampleUi.draw();
  };
  this.p.view.draw();
};

Loopy.SampleUi.Paperjs.prototype.createNeedle = function() {
  this.needle = new this.p.Path();
  this.needle.strokeColor = 'black';
};

Loopy.SampleUi.Paperjs.prototype.createBeats = function(sampleUi) {
  var p = this.p;
  this.beats = sampleUi.sample.beats.map(function(beat) {
    var point = sampleUi.getPositionOnCircle(beat.time);
    var beatPath = new p.Shape.Circle(new p.Point(point.x, point.y), sampleUi.beatRadius);
    beatPath.strokeColor = 'black';
    beatPath.fillColor = 'white';
    return beatPath;
  });
};

Loopy.SampleUi.Paperjs.prototype.createUi = function(sampleUi) {
  var centerPoint = new this.p.Point(sampleUi.x, sampleUi.y);
  
  this.ring = new this.p.Shape.Circle(centerPoint, sampleUi.radius);
  this.ring.strokeColor = 'black';
  
  var playCircle = new this.p.Shape.Circle(centerPoint, sampleUi.radius/3);
  playCircle.strokeColor = 'black';
  playCircle.fillColor = 'white';
  
  this.playButtonText = new this.p.PointText(centerPoint.add(new this.p.Point(0,3)));
  this.playButtonText.justification = 'center';
  this.playButtonText.fillColor = 'black';
  this.playButtonText.fontFamily = 'FontAwesome';
  
  this.playButton = new this.p.Group(playCircle, this.playButtonText); 
  this.playButton.onMouseDown = function() {
    sampleUi.sample.toggleMute();
  }
};

Loopy.SampleUi.Paperjs.prototype.drawNeedle = function(x1, y1, x2, y2) {
  this.needle.visible = true;
  this.needle.removeSegments();
  this.needle.addSegment(new this.p.Point(x1, y1));
  this.needle.addSegment(new this.p.Point(x2, y2));
};

Loopy.SampleUi.Paperjs.prototype.drawBeat = function(i, x, y, r) {
  this.beats && (this.beats[i].radius = r);
};

Loopy.SampleUi.Paperjs.prototype.drawUi = function(sample, x, y, r) {
  this.playButtonText.content = (sample.muted) ? '\uf04b' : '\uf04c';
};

Loopy.SampleUi.Paperjs.prototype.circle = function(x, y, r) {
  //this.p.ellipse(x, y, r*2, r*2);
};

Loopy.SampleUi.Paperjs.prototype.line = function(x1, y1, x2, y2) {
  //this.p.line(x1, y1, x2, y2);
};

Loopy.SampleUi.Paperjs.prototype.clear = function() {
  this.needle && (this.needle.visible = false);
};

Loopy.Audio = function() {
    this.context = Loopy.context;
    this.buffers = {};
    this.samples = {};
    this.playingLoops = {};
};

Loopy.Audio.prototype.addSample = function(sample) {
    var self = this;
    var req = new XMLHttpRequest();
    req.open('GET', sample.url, true);
    req.responseType = 'arraybuffer';
    req.onload = function() {
        self.context.decodeAudioData(
            req.response,
            function(buffer) {
                self.buffers[sample.name] = buffer;
                sample.buffer = buffer;
            },
            function() {
                console.log('Error decoding audio "' + sample.url + '".');
            }
        );
    };
    req.send();
};

Loopy.Audio.prototype.notifyMuteStatusForSample = function(sample) {
  var buffer = this.buffers[sample.name];
  if (buffer) {
	  if (sample.muted && this.playingLoops[sample.name]) {
	    this.playingLoops[sample.name].stop(0);
      delete this.playingLoops[sample.name];
	  } else if (!sample.muted && !this.playingLoops[sample.name]){
      var loop = this.context.createBufferSource();
      this.playingLoops[sample.name] = loop;
      loop.buffer = buffer;
      loop.loop = true;
      loop.connect(this.context.destination);
      loop.start(Math.ceil(this.context.currentTime/buffer.duration)* buffer.duration);
	  }
  }
};

Loopy.Audio.prototype.getTime = function() {
    return this.context.currentTime;
};

Loopy.prototype.addSample = function(name, url, rhythmpattern, audio) {
  
  if (!this.audio) this.audio = new Loopy.Audio();
  
  var sample = new Loopy.Sample(name, url, rhythmpattern, this.audio, this);
  this.samples[name] = sample;
  this.audio.addSample(sample);
  
  if (Object.keys(this.samples).length==2) {
    this.initMultiSampleControls();
  }
  
  return this;
};

Loopy.prototype.play = function(name) {
    var sample = this.samples[name];
    sample && sample.toggleMute();
};

Loopy.prototype.setActive = function() {
  var self = this;
  Loopy.loopies.forEach(function(loopy) {
      if (loopy !== self) {
        loopy.stopAll();
      }
  });
};

Loopy.prototype.stopAll = function() {
  var self = this;
  Object.keys(this.samples).forEach(function(sampleName) {
    self.samples[sampleName].mute();
  });
};

Loopy.prototype.startAll = function() {
  var self = this;
  
  this.setActive();
  
  Object.keys(this.samples).forEach(function(sampleName) {
    self.samples[sampleName].unMute();
  });
};

Loopy.prototype.initMultiSampleControls = function() {
  var self = this;
  
  var $controls = document.createElement("div");
  
  var $playAll = document.createElement("BUTTON");
  $playAll.appendChild(document.createTextNode("Play All"));
  $controls.appendChild($playAll);
  $playAll.addEventListener("click", function() {
    self.startAll();
  });
  
  var $stopAll = document.createElement("BUTTON");
  $stopAll.appendChild(document.createTextNode("Stop All"));
  $controls.appendChild($stopAll);
  $stopAll.addEventListener("click", function() {
    self.stopAll();
  });
  
  this.$root.insertBefore($controls, this.$root.firstChild);
  

};

Loopy.Sample = function(name, url, rhythmpattern, audio, parentLoop) {
  this.name = name;
  this.parentLoop = parentLoop;

  this.url = url;
  this.beats = Loopy.Sample.extractRhythm(rhythmpattern);

  this.beats.forEach(function(beat) {
    console.log("beat:"+JSON.stringify(beat));
  });

  this.audio = audio;
  this.muted = true;
  this.ui = new Loopy.SampleUi(this);
  
};

Loopy.Sample.extractRhythm = function(rhythmpattern) {

    var len = rhythmpattern.length;

    return rhythmpattern
	.split("")
	.map(function(s) {
	    return parseInt(s);
	})
	.map(function(weight, i) {
	    return {
		weight: weight,
		time: i/len
	    };
	})
	.filter(function(beat) {
	    return beat.weight!==0;
	});
};

Loopy.Sample.prototype.toggleMute = function() {
  this.parentLoop.setActive();
  this.muted = !this.muted;
  this.audio.notifyMuteStatusForSample(this);
};

Loopy.Sample.prototype.mute = function() {
  this.muted = true;
  this.audio.notifyMuteStatusForSample(this);
};

Loopy.Sample.prototype.unMute = function() {
  this.muted = false;
  this.audio.notifyMuteStatusForSample(this);
};

Loopy.Sample.prototype.getTimeFraction = function() {
  if (this.audio && this.buffer) {
    return (this.audio.getTime() % this.buffer.duration)/this.buffer.duration; 
  }
};