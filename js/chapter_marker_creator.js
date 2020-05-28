
jQuery(window).on('load', function() {
  ChapterMarkerCreator.findAll();
});

window.ChapterMarkerCreator = {
  findAll: function() {
    var $ = jQuery;

    var youtubeframes = $("iframe[src*='youtube.com/embed']");
    youtubeframes.each(function() {
      var chapterdiv = $(this).next();
      if (!chapterdiv.hasClass("chapters")) return;
      var nodes = chapterdiv.contents();
      var chapters = new Chapters();
      for (var i=0;i<nodes.length; i++) {
	var node = nodes.get(i); 
	var parts = node.textContent.trim().match(/@?(?:(\d?\d)[:h])?(\d?\d)(?:[:m]|mn)(\d\d)s?\s*(.*)/);
	if (parts) {
	  var time = 0;
	  if (parts[1]) time+= parts[1]*3600;
	  time+=parts[2]*60;
	  time+=parts[3]*1;
	  chapters.addChapter(time, parts[4]);
	}
	node.parentNode.removeChild(node);
      }
      ChapterMarkerPlayer.insert({
	container: this,
	chapters: chapters,
	width: this.getAttribute("width"),
	height: this.getAttribute("height")
      });

    });
	 
function Chapters() {
  this.chapters = {}
  this.times = []

  this.addChapter = function(time, chapter) {
    this.chapters[time] = chapter
    this.times.push(time)
  }

  this.getTimes = function() {
    // Sort the times numerically for display purposes.
    // See https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/sort#Examples
    this.times.sort(function(a,b) {
      return a - b;
    });
    return this.times
  }

  this.getChapter = function(time) {
    return this.chapters[time]
  }
}

function StructuredChapters() {
  this.sections = []
  this.currentSection = null;
  this.chapters = new Chapters()

  this.newSection = function(name) {
    this.currentSection = {
      "title": name,
      "times": []
    }
  }

  this.addChapter = function(time, chapter) {
    this.chapters.addTime(time, chapter)
    if (this.currentSection) {
      this.currentSection.times.push(time)
    }
  }

  this.getSections = function() {
    return this.sections
  }

  this.getTimes = function() {
    return this.chapters.getTimes()
  }

  this.getChapter = function(time) {
    return this.chapters.getChapterByTime(time)
  }
}
    
  }} // end ChapterMarkerCreator and ChapterMarkerCreator.findAll


/*
 Copyright 2012 Google Inc. All Rights Reserved.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

// Greg Dyke's modified version

// BEGIN_INCLUDE(namespace)
window.ChapterMarkerPlayer = {
  // Inserts a new YouTube iframe player and chapter markers as a child of an
  // existing HTML element on a page.
  insert: function(params) {
// END_INCLUDE(namespace)
    // We need to reserve 30px for the player's control bar when automatically sizing the player.
    var YOUTUBE_CONTROLS_HEIGHT = 30;
    // Assume a 9:16 (width:height) ratio when we need to calculate a player's height.
    var PLAYER_HEIGHT_TO_WIDTH_RATIO = 9 / 16;
    var DEFAULT_PLAYER_WIDTH = 400;
// BEGIN_INCLUDE(validation1)
    // params contains the following required and optional parameter names and values:
    //   videoId: (required) The YouTube video id of the video to be embedded.
    //   chapters: (required) Mapping of times (seconds since the video's start) to chapter titles.
    //   width: (optional) The width of the embedded player. 400px is used by default.
    //   playerOptions: (optional) An object corresponding to the options that can be passed to the
    //                  YT.Player constructor. See https://developers.google.com/youtube/iframe_api_reference#Loading_a_Video_Player

    if (!('chapters' in params)) {
      throw 'The "chapters" parameter must be a chapters Object.';
    }
// END_INCLUDE(validation1)
// BEGIN_INCLUDE(time_sort)
    var times = params.chapters.getTimes();
// END_INCLUDE(time_sort)
    var width = params.width || DEFAULT_PLAYER_WIDTH;

    if ('YT' in window && 'Player' in window.YT) {
      // If the iframe player API is already available, proceed to loading the player using the API.
      insertPlayerAndAddChapterMarkers(params);
    } else {
      // Load the API, and add a callback to the queue to load the player once the API is available.
      if (!('onYouTubePlayerAPIReady' in window)) {
// BEGIN_INCLUDE(invoke_callbacks)
        window.onYouTubePlayerAPIReady = function() {
          for (var i = 0; i < window.ChapterMarkerPlayer.onYouTubePlayerAPIReadyCallbacks.length; i++) {
            window.ChapterMarkerPlayer.onYouTubePlayerAPIReadyCallbacks[i]();
          }
        };
// END_INCLUDE(invoke_callbacks)
// BEGIN_INCLUDE(load_api)
        // Dynamic <script> tag insertion will effectively load the iframe Player API on demand.
        // We only want to do this once, so it's protected by the
        // !('onYouTubePlayerAPIReady' in window) check.
        var scriptTag = document.createElement('script');
        // This scheme-relative URL will use HTTPS if the host page is accessed via HTTPS,
        // and HTTP otherwise.
        scriptTag.src = '//www.youtube.com/player_api';
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(scriptTag, firstScriptTag);
// END_INCLUDE(load_api)
      }
// BEGIN_INCLUDE(queue_callbacks)
      // We need to handle the situation where multiple ChapterMarkerPlayer.insert() calls are made
      // before the YT.Player API is loaded. We do this by maintaining an array of functions, each
      // of which adds a specific player and chapters. The functions will be executed when
      // onYouTubePlayerAPIReady() is invoked by the YT.Player API.
      window.ChapterMarkerPlayer.onYouTubePlayerAPIReadyCallbacks.push(function() {
        insertPlayerAndAddChapterMarkers(params);
      });
// END_INCLUDE(queue_callbacks)
    }

// BEGIN_INCLUDE(load_player)
    // Calls the YT.Player constructor with the appropriate options to add the iframe player
    // instance to a parent element.
    // This is a private method that isn't exposed via the ChapterMarkerPlayer namespace.
    function initializePlayer(containerElement, params) {
      

      // Attempt to use any custom player options that were passed in via params.playerOptions.
      // Fall back to reasonable defaults as needed.
      var playerOptions = params.playerOptions || {};
      return new YT.Player(containerElement, {
        // Maintain a 16:9 aspect ratio for the player based on the width passed in via params.
        // Override can be done via params.playerOptions if needed
        height: playerOptions.height ||
            width * PLAYER_HEIGHT_TO_WIDTH_RATIO + YOUTUBE_CONTROLS_HEIGHT,
        width: playerOptions.width || width,
        // Unless playerVars are explicitly provided, use a reasonable default of { autohide: 1 },
        // which hides the controls when the mouse isn't over the player.
        playerVars: playerOptions.playerVars || { autohide: 1 },
        videoId: params.videoId,
        events: {
          onReady: playerOptions.onReady,
          onStateChange: playerOptions.onStateChange,
          onPlaybackQualityChange: playerOptions.onPlaybackQualityChange,
          onError: playerOptions.onError
        }
      });
    }

// END_INCLUDE(load_player)

// BEGIN_INCLUDE(format_timestamp)
    // Takes a number of seconds and returns a #h##m##s string.
    function formatTimestamp(timestamp) {
      var hours = Math.floor(timestamp / 3600);
      var minutes = Math.floor((timestamp - (hours * 3600)) / 60);
      var seconds = timestamp % 60;

      var formattedTimestamp = (seconds < 10 ? '0' : '') + seconds + 's';
      if (minutes > 0) {
        formattedTimestamp = (minutes < 10 ? '0' : '') + minutes + 'm' + formattedTimestamp;
      }
      if (hours > 0) {
        formattedTimestamp = hours + 'h' + formattedTimestamp;
      }

      return formattedTimestamp;
    }

// END_INCLUDE(format_timestamp)

// BEGIN_INCLUDE(add_chapter_markers)
    // Adds a sorted list of chapters below the player. Each chapter has an onclick handler that
    // calls the iframe player API to seek to a specific timestamp in the video.
    // This is a private method that isn't exposed via the ChapterMarkerPlayer namespace.
    function addChapterMarkers(containerElement, player, seeker) {
      var ol = document.createElement('ol');
      ol.setAttribute('class', 'chapter-list');
      ol.setAttribute('style', 'width: ' + width + 'px');
      jQuery(containerElement).next().append(ol);

      for (var i = 0; i < times.length; i++) {
        var time = times[i];
        var chapterTitle = params.chapters.getChapter(time);

        var li = document.createElement('li');
        li.setAttribute('data-time', time);
        li.textContent = formatTimestamp(time) + ': ' + chapterTitle;
        li.onclick = function() {
          // 'this' will refer to the element that was clicked
          player.seekTo(this.getAttribute('data-time'));
	  seeker.seekTo(this.getAttribute('data-time'));
        };
        ol.appendChild(li);
      }
    }

// END_INCLUDE(add_chapter_markers)

    // Convenience method to call both initializePlayer and addChapterMarkers.
    // This is a private method that isn't exposed via the ChapterMarkerPlayer namespace.
    function insertPlayerAndAddChapterMarkers(params) {

      var player = initializePlayer(params.container, params);
      var seeker = new Seeker(params.container, player, times, params.chapters)
      addChapterMarkers(params.container, player, seeker);
      seeker.seekTo(0);
      window.setInterval(function() {
	try {
	  player.getCurrentTime && seeker.seekTo(player.getCurrentTime());
	} catch (e) {
	  console.log(player);
	}
      }, 750);
    }

    function Seeker(containerElement, player, times, chapters) {
      this.params = params;
      this.player = player;
      this.times = times;
      this.chapters = chapters;
      var div = document.createElement('div');
      div.setAttribute('style', 'width: ' + width + 'px');
      div.setAttribute('class', 'seek-ui');
      jQuery(containerElement).next().append(div);
      this.prev = document.createElement('div');
      this.next = document.createElement('div');
      this.curr = document.createElement('div');
      this.prev.setAttribute('class', 'seek-prev');
      this.next.setAttribute('class', 'seek-next');
      this.curr.setAttribute('class', 'seek-curr');
      this.curr.setAttribute('style', 'width: ' + (width-40) + 'px');
      div.appendChild(this.prev);
      div.appendChild(this.curr);
      div.appendChild(this.next);
      

      this.seekTo = function(seektime) {
	var i;
	for (i=0; i < this.times.length; i++) {
          var time = this.times[i];
	  if (seektime-time<0) break;
	}
	var previ = i-2;
	var curri = i-1;
	var nexti = i;
	var self = this;
	this.prev.textContent = "";
	this.next.textContent = "";
	this.curr.textContent = "";

	if (curri>=0) {
	  this.curr.textContent = this.chapters.getChapter(this.times[curri]);
	}

	if (previ>=0) {
	  this.prev.textContent = "<";
	  this.prev.onclick = function() {
	    self.seekTo(self.times[previ])
            player.seekTo(self.times[previ]);
          }
	}

	if (nexti<times.length) {
	  this.next.textContent = ">";
	  this.next.onclick = function() {
	    self.seekTo(self.times[nexti])
            player.seekTo(self.times[nexti]);
          }
	}

      }
    }
    
  },
// BEGIN_INCLUDE(callback_array)
  // This is used to keep track of the callback functions that need to be invoked when the iframe
  // API has been loaded. It avoids a race condition that would lead to issues if multiple
  // ChapterMarkerPlayer.insert() calls are made before the API is available.
  onYouTubePlayerAPIReadyCallbacks: []
// END_INCLUDE(callback_array)
}
