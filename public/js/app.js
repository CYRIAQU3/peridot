var apiIndex = "http://localhost:3000";
var socketIndex = "http://localhost:5000";
var app = angular.module('peridot', [
'ui.router',
'ngCookies'
    ]);

app.config(['$httpProvider',
function($httpProvider) {
    $httpProvider.defaults.withCredentials = true;
}]);

app.config(function($stateProvider, $urlRouterProvider) {

  //
  // For any unmatched url, redirect to /
  $urlRouterProvider.otherwise("/");
  $urlRouterProvider.when('/studio', '/studio/files');
  //
  // Now set up the states
  $stateProvider
    .state('index', {
      url: "/",
      templateUrl: "views/index.html"
    })
    .state('login', {
      url: "/login",
      templateUrl: "views/login.html",
      controller: "loginCtrl"
    })
    .state('signup', {
      url: "/signup",
      templateUrl: "views/signup.html",
      controller: "signUpCtrl"
    })
    .state('channel',{
      url : "/{channelId:int}",
      templateUrl:"views/channel.html",
      controller:"channelCtrl"
    })
    .state('studio',{
      url : "/studio",
      templateUrl:"views/studio.html",
      controller:"studioCtrl"
    })
    .state('studio.files',{
      url : "/files",
      templateUrl:"views/studio/files.html"
    })
    .state('studio.settings',{
      url : "/settings",
      templateUrl:"views/studio/settings.html"
    });
});

app.controller('mainCtrl', ['$scope', '$http','$rootScope','$cookies', function($scope, $http,$rootScope,$cookies)
{
  
  $http.get(apiIndex+"/me?token="+$cookies.get("pd_token"))
  .then(function(r)
  {
    if(r.data.success)
    {
      $scope.headerUserView = "views/header/logged.html";
      
      $scope.user = r.data.me[0];
      $scope.me = r.data.me[0];
    }
    else
    {
      $scope.headerUserView = "views/header/not_logged.html";
    }
  },function(r)
  {
  	$scope.headerUserView = "views/header/not_logged.html";
  });

  $rootScope.$on('$stateChangeStart', 
  function(event, toState, toParams, fromState, fromParams)
  {
    // begin load event
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

          $scope.socket.on("subtitle",function(r)
          {
              $scope.socketManager.subtitles.receive[r.event](r);
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

}]);