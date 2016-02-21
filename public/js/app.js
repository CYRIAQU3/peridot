var apiIndex = "http://localhost:3000";
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

}]);