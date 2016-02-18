app.controller('logoutCtrl', function($scope, $http,$cookies)
{
  $scope.logout = function()
  {
    $cookies.remove('sbstr_token');
    document.location.href = './';
  };
});