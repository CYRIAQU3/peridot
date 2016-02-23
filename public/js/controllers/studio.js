app.controller('studioCtrl', function($scope, $http,$cookies)
{
    $scope.channel = {};
    var channelId = 1;
    $http.get(apiIndex+"/channels/"+channelId)
    .then(function(r) {
        $scope.channel = r.data.channels[0];
        console.log($scope.channel);
        $http.get(apiIndex+"/channels/"+channelId+"/files")
	    .then(function(ra) {
	        $scope.channel.files = ra.data.files;
            $scope.socketManager.initializeServerConnect($scope.channel.id);
	    });
    });

    $scope.addFile = function(url,name,channelId)
    {
        var data = {
            url : url,
            name : name,
            channel_id : channelId
        }

        $http.post(apiIndex+'/files?token='+$cookies.get("pd_token")+'&channel_id='+channelId, data).then(function(r){
            location.reload();
        }, function(r)
        {
            console.log("error");
            console.log(r);
        });
    }

    $scope.removeFile = function(fileId)
    {
        $http.delete(apiIndex+'/files/'+fileId+'?token='+$cookies.get("pd_token")).then(function(r){
            location.reload();
        }, function(r)
        {
            console.log("error");
            console.log(r);
        });
    }

    $scope.editFile = function(url,name,fileId)
    {
        var data = {
            url : url,
            name : name,
            channel_id : channelId
        }

        $http.put(apiIndex+'/files/'+fileId+'+?token='+$cookies.get("pd_token"), data).then(function(r){
            location.reload();
        }, function(r)
        {
            console.log("error");
            console.log(r);
        });
    }

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
                  $scope.socket.emit('chat',{ event : "message",message : data,auth_token : $cookies.get("sbstr_token") });
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
                  $scope.player.src({ type: "video/mp4", src: data.url });
              }
          },
          emit : {
             file : function(data){ // send play file signal
                console.log(data);
                $scope.socket.emit('channel',{ event : "file",url : data.url,time:0,auth_token : $cookies.get("sbstr_token") });
             }
          }
      }
  };
});