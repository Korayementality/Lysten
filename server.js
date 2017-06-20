var express = require('express');
var fs = require('fs');
var ytdl = require('ytdl-core');
var path = require('path');

var app = express();
app.use(express.static(__dirname + '/public'));

var filepath = path.join(__dirname, 'song.mp3');

app.get('/music/:q', function(req, res){
  //console.log(req);
    var audio = ytdl('https://www.youtube.com/watch?v='+req.params.q, {filter: "audioonly"});
    //var video = ytdl('https://www.youtube.com/watch?v='+req.params.q);
    ytdl.getInfo(req.params.q, function(err, info) {
      if (err) throw err;
      console.log('Requesting video:' + info.title + " at " + new Date().toUTCString());
    });
    //video.pipe(fs.createWriteStream('video.flv'));
    audio.pipe(fs.createWriteStream('song.mp3'));
    audio.on('progress',  function(chunkLength, downloaded, total) {
      //console.log((downloaded / total * 100).toFixed(2) + '% ');
    });
    audio.on('end', function() {
      res.set({'Content-Type': 'audio/mpeg'});
      var readStream = fs.createReadStream(filepath);
      readStream.pipe(res);
    });
    
});

app.listen(process.env.PORT, function() {
  
  console.log("Port: " + process.env.PORT);
  
});