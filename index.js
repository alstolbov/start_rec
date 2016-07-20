
// var url = 'http://live-1180.gv2.edge.filmon.com/live/93.low.stream/playlist.m3u8?id=035bca1a71b11fce016d28acd3dbea51cbc96ddfe5b9ed3f8fe3286df6a738d3bfe5410cadd4ae0c9efdb293a46107d98fe18e9272001275404d8f0ac5ec656e7939b0dcf03dd755c7fc6aa34e12f551dbba2720eca224f70cc83712184c7fd688baac63a8aad1b306f0d23033d174bbb6134ae04d7fdbceb21ef1638809eccf936ee744b6b1793e814e35e93e785b3dc8c8fa5372f3e40f';
//
// var output = 'content/manifest.mpd';
//
// var callSimple = 'ffmpeg -i ' + url + ' -f dash ' + output;

var fs = require('fs');
var port = 3000;



var express = require('express');
var app = express();
var bodyParser = require('body-parser')

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.use('/content', express.static('content'));
app.use('/libs', express.static('libs'));

app.get('/', function (req, res) {
  res.sendfile('html/index.html');
});

app.post('/addStream', function (req, res) {
  var streamUrl = req.body.stream;
  var streamManif = req.body.manifest;

  startRec(streamUrl, streamManif);
  res.send('Start rec. streamUrl ' + streamUrl + ', streamManif ' + streamManif);
});

app.post('/stopRec', function (req, res) {

  stopRec();
  res.send('STOP REC!');
});

app.listen(port, function () {
  console.log('App listening on port', port);
});

var exec = require('child_process').exec;

var startRec = function (url, output) {
  fs.mkdirSync("content/" + output);
  var call = 'ffmpeg -i ' + url + " -x264opts 'keyint=25:scenecut=-1' -b:v 1000k -f dash content/" + output + '/' + output + '.mpd';
  console.log('start rec.');
  exec(call, function(error, stdout, stderr) {
    console.log(error, stdout, stderr);
  });

};

var stopRec = function () {
  console.log('STOP REC.');
  exec('pkill ffmpeg', function(error, stdout, stderr) {
    console.log(error, stdout, stderr);
  });

};

// console.log('run FFMPEG...');
// startRec();
// stopRec();
