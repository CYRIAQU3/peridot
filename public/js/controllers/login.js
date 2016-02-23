app.controller('loginCtrl', ["$scope", "$http", "$cookies",function($scope, $http,$cookies)
{
  $scope.alertMsg = "";
  $scope.buttonLabel = "global.login";
  $scope.buttonDisabled = false;
  $scope.alertDisplay = false;
  $scope.alertType = "success";
  $scope.login = function()
  {
    var loginForm = {};
    $scope.buttonLabel = "global.pleaseWait";
    $scope.buttonDisabled = true;
    $("#login-form").find("input").each(function()
    {
      loginForm[$(this).attr("name")] = $(this).val();
    });
    $.ajax({
      type: "POST",
      url: apiIndex+"/login",
      data: loginForm,
      success: loginFormSuccess,
      error:loginFormError
    });
  }

  function loginFormSuccess(r)
  {
    if(r.success)  // login success
    {
      $cookies.put('pd_token',r.message.token, { expires : r.message.expire_date});
      setTimeout(function()
      {
        document.location.href = './';
      },1000);
    }
    else
    {
      setTimeout(function()
      {
        $scope.$apply(function()
        {
          $scope.alertDisplay = true;
          $scope.alertType = "danger";
          $scope.alertMsg = "error."+r.message;
          $scope.buttonDisabled = false;
          $scope.buttonLabel = "global.login";
        });
      },1000);
    }
  }

  function loginFormError(e)
  {
      $scope.alertDisplay = true;
      $scope.alertType = "danger";
      $scope.alertMsg = ("error."+e.statusText).replace(/ /g,"_");
      $scope.buttonDisabled = false;
      $scope.buttonLabel = "global.login";
  }

  $scope.$on('event:google-plus-signin-success', function (event,authResult){
    // Send login to server or save into cookie
    console.log(authResult);
  });
  $scope.$on('event:google-plus-signin-failure', function (event,authResult) {
    // Auth failure or signout detected
  });
}]);