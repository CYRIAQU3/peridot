app.controller('channelCtrl', function($scope, $http,$stateParams,$cookies)
{

	$scope.channelId = $stateParams.channelId;
	$scope.player = undefined;
	$scope.chatInputActive = false;
	$scope.chatInputMessage = "";
	$scope.ready = false;

	$http.get(apiIndex+"/channels/"+$scope.channelId).then(function(r)
	{
		$scope.channel = r.data.channels[0];
		$scope.socketManager.initializeServerConnect($scope.channel.id);
		$scope.player = videojs("channel-player", {"controls": false, "autoplay": true, "preload": "auto",techOrder: ["html5", "youtube", "flash"]});
	},function(r)
	{
		console.log("Error wrong channel");
	});


	// toggle chat input
	$(document).keypress(function(event){
	    var keycode = (event.keyCode ? event.keyCode : event.which);
	    if(keycode == '13'){	//enter
	        $scope.chatInputActive = true;
	        $scope.$apply();
	        $(".room-chat-input").focus();
	    }
	    if(keycode == '27'){		//esc
	    	$scope.chatInputActive = false;
	        $scope.$apply();
	        $(".room-chat-input").blur();
	    }
	});

	$(document).dblclick(function(){	//dbclick for fullscreen
		if (!document.fullscreenElement &&    // alternative standard method
	      !document.mozFullScreenElement && !document.webkitFullscreenElement) {  // current working methods
	    if (document.documentElement.requestFullscreen) {
	      document.documentElement.requestFullscreen();
	    } else if (document.documentElement.mozRequestFullScreen) {
	      document.documentElement.mozRequestFullScreen();
	    } else if (document.documentElement.webkitRequestFullscreen) {
	      document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
	    }
	  } else {
	    if (document.cancelFullScreen) {
	      document.cancelFullScreen();
	    } else if (document.mozCancelFullScreen) {
	      document.mozCancelFullScreen();
	    } else if (document.webkitCancelFullScreen) {
	      document.webkitCancelFullScreen();
	    }
	  }
	});

	$scope.socketManager = {
      connected : false,
      users : [],
      messages : [],
      initializeServerConnect : function(channelId)
      {
        console.log("Connection to the socket server...");
          $scope.loadingMessage = "Connecting to the server...";
          $scope.socket = io(socketIndex);
          $scope.socket.on('connect', function()
          {
            console.log("... connected !");
            $scope.socket.emit('userAuth',{ auth_token : $cookies.get("pd_token")});
          });

          $scope.socket.on('authConfirm', function()
          {
              $scope.socket.emit('joinChannel', { channel: channelId });
              $scope.socketManager.connected = true;
              $scope.ready = true;
              $scope.$apply();
          });

          $scope.socket.on('disconnect',function()
          {
              $scope.timeLineEnabled = false;
              $scope.socketManager.connected = false;
              console.log("Lost connection to the server !");
          });

          $scope.socket.on('reconnecting',function()
          {
              console.log("Reconnecting...");
          });

          $scope.socket.on('reconnect',function()
          {
              console.log("...success ! (reconnected to the socket server)");
              $scope.timeLineEnabled = true;
              $scope.socketManager.connected = true;
          });

          $scope.socket.on('userJoin', function(r)
          {
              $scope.socketManager.addUser(r.user);
          });

          $scope.socket.on('userLeave', function(r)
          {
              $scope.socketManager.removeUser(r.user);
          });

          $scope.socket.on("channel",function(r)
          {
              $scope.socketManager.channel.receive[r.event](r);
              console.log(r);
          });

          $scope.socket.on("chat",function(r)
          {
              $scope.socketManager.chat.receive[r.event](r);
          });
      },

      addUser : function(u)
      {
          console.log(u+" join");
          $http.get(apiIndex+"/users/"+u)
          .success(function(r)
          {
              $scope.socketManager.users.push(r.users[0]);
          });
      },

      removeUser : function(u)
      {
          console.log(u+" left");
          $scope.socketManager.users = _.without($scope.socketManager.users, _.findWhere($scope.socketManager.users, {id: u}));
          console.log($scope.socketManager.users);
          $scope.$apply();
      },

      chat : {
          emit : {
              message : function(data){
                  if(data == "" || data == " " || data == " "){
                      return
                  }
                  $scope.socket.emit('chat',{ event : "message",message : data,auth_token : $cookies.get("pd_token") });
                  $scope.chatInputMessage = "";
                  $scope.chatInputActive = false;
              }
          },
          receive : {
              message : function(data){
                  $scope.socketManager.messages.push(data);
                  $scope.$apply();
              }
          }
      },

      channel : {
          receive : {
              file : function(data){
                  console.log("Signal received :");
                  console.log(data);
                  $scope.player.src(data.url);
              }
          },
          emit : {
             file : function(data){ // send play file signal
                console.log(data);
                $scope.socket.emit('channel',{ event : "file",url : data.url,time:0,auth_token : $cookies.get("pd_token") });
             }
          }
      }
  };
});