app.controller('studioCtrl', function($scope, $http,$cookies)
{
  $scope.channelId = 1;
  $scope.player = undefined;
  $scope.channel = {};
  $scope.chatInputActive = false;
  $scope.chatInputMessage = "";
  $scope.ready = false;

  var defaultBroadcastModel = {
    online : false,
    file : {
      url : "",
      time:0
    }
  };

  $http.get(apiIndex+"/channels/"+$scope.channelId)
  .then(function(r) {
      $scope.channel = r.data.channels[0];
      $scope.channel.broadcast = defaultBroadcastModel;
      $http.get(apiIndex+"/channels/"+$scope.channelId+"/files")
    .then(function(ra) {
        $scope.channel.files = ra.data.files;
        $scope.socketManager.initializeServerConnect($scope.channel.id);
        $scope.player = videojs("studio-player", {"controls": true, "autoplay": true, "preload": "auto",techOrder: ["html5", "youtube", "flash"]});
    });
  });

  $scope.setCurrentFile = function(url){
    $scope.player.src(url);
    $scope.channel.broadcast.online = true;
    $scope.channel.broadcast.file.url = url;
    $scope.socketManager.channel.emit.broadcast();
  }

    setInterval(function()    //ping to all clients (via the socket server)
    {
      $scope.socketManager.channel.emit.broadcast();
    },5000);

    $scope.addFile = function(url,name,channelId)
    {
        var data = {
            url : url,
            name : name,
            channel_id : $scope.channelId
        }

        $http.post(apiIndex+'/files?token='+$cookies.get("pd_token")+'&channel_id='+$scope.channelId, data).then(function(r){
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
            channel_id : $scope.channelId
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
                  if($scope.socketManager.messages.length > 10){
                    $scope.socketManager.messages.shift();
                  }
                  $scope.$apply();
              }
          }
      },

      channel : {
          emit : {
           broadcast : function(){
              console.log($scope.channel);
              $scope.channel.broadcast.file.time = $scope.player.currentTime();
              $scope.socket.emit('channel',{ event : "broadcast",broadcast:$scope.channel.broadcast,auth_token : $cookies.get("pd_token") });
           }
        }
      }
  };
});