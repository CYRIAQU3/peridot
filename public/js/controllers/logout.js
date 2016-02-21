app.controller('logoutCtrl', function($scope, $http,$cookies)
{
  $scope.logout = function()
  {
    $cookies.remove('pd_token');
    document.location.href = './';
  };
});