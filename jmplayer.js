
var site;

var _site = function(opts) {
   var site = this;

   site.docRoot = window.location.pathname;

   $.extend(this, {}, opts);

   var mp3FileRegex = /.+\.mp3$/i;

   site.allPlayBtns = [];
   site.randomNext = false;
   site.randomFiles = []; 
   site.randomPlayIndex = 0;

   site.construct = function() {
      site.body = $(document.body);
      $(document.body).on({keypress: function(event) { if (event.keyCode==112) site.onPPressed(event) }});
      $(document.body).on({keypress: function(event) { if (event.keyCode==114) site.onRPressed(event) }});


      site.markSongTDs();
      site.player = new site._player();

      if (typeof getParams.play != "undefind") {
         var scanFor = getParams.play;
         site.allPlayBtns.forEach(function(b) {
            if (b.filename.toLowerCase().indexOf(scanFor)>-1) b.onClicked();
         });
      }

      site.generateRandomIndexes();
   }

   site.generateRandomIndexes = function() {
      site.randomFiles = [];

      for (var l=0;l<100;l++) {
         var tempSongs = files.concat();
         for (var i=tempSongs.length-1; i>=0; i--) {
            var randomIndex = parseInt((Math.random()*tempSongs.length-1)+1);
            site.randomFiles.push(tempSongs[randomIndex]);
            tempSongs.splice(randomIndex,1);
         }
      }

   }
   site.onRPressed = function(event) {
      site.randomNext = !site.randomNext;

      if (site.randomNext==true) {
         $("<h3 id=\"random\">Randomized</h3>").insertAfter(site.body.find("h2"));
      } else {
         site.body.find("#random").remove();
      }
      //site.body.find("h2")
   }
   site.onPPressed = function(event) {
      if (site.player.body[0].paused==false) {site.player.body[0].pause(); return;}
      if (site.player.body[0].paused==true) {site.player.body[0].play();}
   }

   site.playNextSong = function() {
      if (site.player.currentPlayIndex==-1) return;

      var nextPlayIndex;

      if (site.randomNext==true) {
         if (site.randomPlayIndex+1==site.randomFiles.length-1) {
            site.randomPlayIndex = 0;
            nextPlayIndex = 0;
         } else {
            do {
               nextPlayIndex = files.indexOf(site.randomFiles[site.randomPlayIndex++]); 
            } while (nextPlayIndex == site.player.currentPlayIndex);
         }
      }  else {
         if (site.player.currentPlayIndex==files.length-1) {
            nextPlayIndex = 0;
         } else {
            nextPlayIndex = site.player.currentPlayIndex+1;
         }
      }

      /*
      if (site.player.currentPlayIndex==files.length-1) {
         nextPlayIndex = 0;
      } else {
         nextPlayIndex = site.player.currentPlayIndex+1;
      }
      */

      site.player.playSong(files[nextPlayIndex]);
   }

   site.highLightTDByFilename = function(filename) {
      $("td.song-row").toggleClass("playing", false);
      $("td.song-row:contains(\""+filename+"\")").toggleClass("playing", true);
   }

   site.markSongTDs = function() {
      var allTDs = $("td");

      allTDs.each(function() {
         var td = $(this);
         
         if (mp3FileRegex.exec(td.text())!=null) {
            td.addClass("song-row");

            var newPlayBtn = new site._playBtn({
               filename: td.text(),
               container: td,
            });

            site.allPlayBtns.push(newPlayBtn);

         }
      });
   }

   site._playBtn = function(opts) {
      var pb = this;

      $.extend(this, {
         filename: undefined,
         container: undefined,
      }, opts);

      pb.construct = function() {
         pb.body = $("<div class=\"btn-wrap\"><div class=\"playbtn\">:PLAY:</div></div>");
         pb.body.appendTo(pb.container);

         pb.body.on({click: pb.onClicked});
      }

      pb.onClicked = function(event) {
         site.player.playSong(pb.filename);
      }

      pb.construct();
      return this;
   }

   site._player = function() {
      var player = this;

      player.currentPlayIndex = -1;
      player.currentPlayingFilename = "";

      player.construct = function() {
         player.body = $("<audio></audio>");
         player.body.appendTo(document.body);
         player.body.on({"ended": player.onEnded});
      }

      // events
      player.onEnded = function(event, a){
         site.playNextSong();
      }

      // methods
      player.playSong = function(filename) {
         player.body[0].pause();
         player.body.empty();
         player.body.append("<source src=\""+site.docRoot+encodeURIComponent(filename)+"\" type=\"audio/mpeg\">");
         player.body[0].load();
         player.body[0].play();
         player.currentPlayingFilename = filename;
         player.currentPlayIndex = files.indexOf(filename);
         site.highLightTDByFilename(filename);
         document.title = filename;
         
      }

      player.construct();
      return this;

   }

   site.construct();
   return this;

}

$("document").ready( function() {
   site = new _site();
});


