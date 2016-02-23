global.port = 3000;
global.config = require('./config.json');
global.fs = require('fs');
global.request = require('request');
global.validator = require('validator');
global.randtoken = require('rand-token');
global.moment = require('moment');
global.async = require('async');
global.passwordHash = require('password-hash');
global.bodyParser = require('body-parser');	//for post req
global.cookieParser = require('cookie-parser');	// for cookie req
global.express = require('express');  
global.app = express();  
global.path = require('path');
global.appRoot = path.resolve(__dirname);
global.server = require('http').createServer(app);
eval(fs.readFileSync(appRoot+'/db.js')+'');    //retreive the db config and functions
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

global.include = function(path) {
  require(path);
}

// Add headers
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:8080');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

include(appRoot+'/routes.js');    //retreive routes

server.listen(port,function()
{
	console.log('Peridot API Listening on port '+port);
});
