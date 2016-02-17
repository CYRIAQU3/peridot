var app = angular.module('peridot', [
'ui.router'
    ]);

app.config(['$httpProvider',
function($httpProvider) {
    $httpProvider.defaults.withCredentials = true;
}]);

app.config(function($stateProvider, $urlRouterProvider) {
  //
  // For any unmatched url, redirect to /
  $urlRouterProvider.otherwise("/");
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
    .state('room',{
      url : "/{roomId:int}",
      templateUrl:"views/room.html",
      controller:"roomCtrl"
    });
});

app.controller('mainCtrl', ['$scope', '$http','$rootScope','$cookies', function($scope, $http,$rootScope,$cookies)
{
  
  $http.get(apiIndex+"/me?token="+$cookies.get("sbstr_token"))
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

}]);