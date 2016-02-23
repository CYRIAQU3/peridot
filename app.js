var http = require('http');
var port = 8080;
var express = require('express');
app = module.exports.app = express();
var server = http.createServer(app);
var request = require('request');
var fs = require('fs');

app.use('/', express.static(__dirname + '/public/'));

app.listen(port, function () {
  console.log('Peridot is active on port '+port);
});

var fork = require('child_process').fork;
var api = fork('./api/app.js');	// load the api
var socket = fork('./socket/app.js'); // load the socket server