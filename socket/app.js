var port = 5000;
var http = require('http');
var request = require('request');
var apiIndex = "http://127.0.0.1:3000";
var cookieParser = require('cookie-parser');  // for cookie req

var app = require('http').createServer();
var io = require('socket.io')(app);
var fs = require('fs');

app.listen(port,function(){
  console.log("Socket server listening on port "+port);
});

var channels = {};

io.on('connection', function (socket) {
	var currentChannel;
	socket.user = {
		"nickname" : "Anonymous"
	};

	socket.on('disconnect', function()
	{
		socket.broadcast.to(currentChannel).emit("userLeave",{user:socket.user.id});
    if(channels[currentChannel])
    {
      channels[currentChannel].users.splice(channels[currentChannel].users.indexOf(socket.user.id), 1);
    }
		console.log(socket.user.nickname+" leave "+currentChannel);
	});

  	socket.on("userAuth",function(d)
  	{
  		request.get(apiIndex+"/me?token="+d.auth_token, function (error, response, body) {
        if (!error && String(response.statusCode).charAt(0) == 2) {
          var r = JSON.parse(body);
          socket.user = r.me[0];
          console.log(socket.user.nickname+" joined "+currentChannel);
          socket.emit("authConfirm");
        }
        else
        {
          console.log("Api error "+response.statusCode);
          console.log(body);
        }
		  });
  	});

  	socket.on('error', function (err) {
  		console.log(err);
  	});

  	socket.on("joinChannel",function(d)
  	{
  		currentChannel = d.channel;

  		if(!channels.hasOwnProperty(currentChannel))		//room doesnt exist : create it
  		{
  			channels[currentChannel] = {
	  			"name" : currentChannel,
	  			users : new Array()
	  		};
  		}
  		

  		socket.join(currentChannel);
  		
  		if(channels[currentChannel].users.length > 0)
  		{
  			for (var i = 0; i < channels[currentChannel].users.length; i++)
  			{
  				socket.emit("userJoin",{user:channels[currentChannel].users[i]});
  			}
  		}
  		channels[currentChannel].users.push(socket.user.id);

  		console.log(socket.user.nickname+" join "+currentChannel);
  		socket.broadcast.to(currentChannel).emit("userJoin",{user:socket.user.id});
  	});

  	socket.on("chat",function(data)
  	{
  		var message = data.message;
  		/* checking message content aud auth */
  		io.to(currentChannel).emit("chat",{event:data.event,message:message,user:socket.user});
  		console.log(socket.user.nickname+' (in '+currentChannel+') "'+message+'"');
  	});

    socket.on("channel",function(data,channelId)   //send an event to all clients connected to the channel
    {
      channelManager[data.event](data,socket);
    });

    var channelManager = {
      file : function(data)
      {
        console.log(data);
        console.log("received for channel "+currentChannel);
        socket.broadcast.to(currentChannel).emit("channel",{event:data.event,url:data.url,time:data.time});
      },

      banner : function(data)
      {
        io.to(currentChannel).emit("channel",{event:data.event,text:data.text,show:data.show});
      }

    }
});