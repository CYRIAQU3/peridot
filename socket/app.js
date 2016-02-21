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

var rooms = {};

io.on('connection', function (socket) {
	var currentRoom;
	socket.user = {
		"nickname" : "Anonymous"
	};

	socket.on('disconnect', function()
	{
		socket.broadcast.to(currentRoom).emit("userLeave",{user:socket.user.id});
    if(rooms[currentRoom])
    {
      rooms[currentRoom].users.splice(rooms[currentRoom].users.indexOf(socket.user.id), 1);
    }
		console.log(socket.user.nickname+" leave "+currentRoom);
	});

  	socket.on("userAuth",function(d)
  	{
  		request.get(apiIndex+"/me?token="+d.auth_token, function (error, response, body) {
        if (!error && String(response.statusCode).charAt(0) == 2) {
          var r = JSON.parse(body);
          socket.user = r.me[0];
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

  	socket.on("joinRoomRequest",function(d)
  	{
  		currentRoom = d.room;

  		if(!rooms.hasOwnProperty(currentRoom))		//room doesnt exist : create it
  		{
  			rooms[currentRoom] = {
	  			"name" : currentRoom,
	  			users : new Array()
	  		};
  		}
  		

  		socket.join(currentRoom);
  		
  		if(rooms[currentRoom].users.length > 0)
  		{
  			for (var i = 0; i < rooms[currentRoom].users.length; i++)
  			{
  				
  				socket.emit("userJoin",{user:rooms[currentRoom].users[i]});
  			}
  		}
  		rooms[currentRoom].users.push(socket.user.id);

  		console.log(socket.user.nickname+" join "+currentRoom);
  		socket.broadcast.to(currentRoom).emit("userJoin",{user:socket.user.id});
  	});

  	socket.on("chat",function(data)
  	{
  		var message = data.message;
  		/* checking message content aud auth */
  		io.to(currentRoom).emit("chat",{event:data.event,message:message,user:socket.user});
  		console.log(socket.user.nickname+' (in '+currentRoom+') "'+message+'"');
  	});

    socket.on("subtitle",function(data)
    {
      var s = data.subtitle;
      var valid = true;

      subtitleManager[data.event](data,socket);
    });

    var subtitleManager = {
      add : function(data,socket)
      {
        var postData = data.subtitle;
        var uri = apiIndex+"/subtitles?token="+data.auth_token;
        request.post({url:uri, form: postData,json:true}, function(error,response,body){

          if (!error && String(response.statusCode).charAt(0) == 2) { //2XX
            
            // if subtitle added, retreive his informations and send them to all clients
            var subtitleId = body.message;
            request.get(apiIndex+"/subtitles/"+subtitleId,function(serror,sresponse,sbody){
              sbody = JSON.parse(sbody);
              if (!serror && String(sresponse.statusCode).charAt(0) == 2) //send all subtitle info
              {
                io.to(currentRoom).emit("subtitle",{event:data.event,subtitle:sbody.subtitles[0]});
              }
              else
              {
                console.log(uri);
                console.log("Api error "+sresponse.statusCode);
                console.log(sbody);
              }
            });            
          }
          else
          {
            console.log(uri);
            console.log("Api error "+response.statusCode);
            console.log(body);
          }
        });
      },
      remove : function(data,socket)
      {
        var subtitleId = data.id;
        var uri = apiIndex+"/subtitles/"+subtitleId+"?token="+data.auth_token;
        request.del({url:uri,json:true}, function(error,response,body){
          if (!error && String(response.statusCode).charAt(0) == 2) {
            socket.broadcast.to(currentRoom).emit("subtitle",{event:data.event,id:subtitleId});  //send a message to all user to remove the subtitle "x"            
          }
          else
          {
            console.log(uri);
            console.log("Api error "+response.statusCode);
            console.log(body);
          }
        });
      },
      edit : function(data,socket)
      {
        var postData = data;
        var uri = apiIndex+"/subtitles/"+postData.subtitle.id+"?token="+data.auth_token;
        request.put({url:uri, form: postData.subtitle,json:true}, function(error,response,body){
          if (!error && String(response.statusCode).charAt(0) == 2) {
            socket.broadcast.to(currentRoom).emit("subtitle",{event:data.event,subtitle:postData.subtitle});  //send a message to all user to remove the subtitle "x"            
          }
          else
          {
            console.log(uri);
            console.log("Api error "+response.statusCode);
            console.log(body);
          }
        });
      }
    };
});