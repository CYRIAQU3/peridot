app.controller('signUpCtrl', function($scope, $http)
{
  $scope.alertMsg = "";
  $scope.buttonLabel = "global.signUp";
  $scope.buttonDisabled = false;
  $scope.alertDisplay = false;
  $scope.alertType = "success";
  $scope.signUp = function()
    {
      var signUpForm = {};
      $scope.buttonLabel = "global.pleaseWait";
      $scope.buttonDisabled = true;
      $("#signup-form").find("input").each(function()
      {
        signUpForm[$(this).attr("name")] = $(this).val();
      });
      $.ajax({
        type: "POST",
        url: apiIndex+"/signup",
        data: signUpForm,
        success: signUpFormSuccess,
        error:signUpFormError
      });
    }

    function signUpFormSuccess(r)
    {
      if(r.success)  // signUp success
      {
        setTimeout(function()
        {
          $scope.$apply(function()
          {
            document.location.href = "./";
          });
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
            $scope.buttonLabel = "global.signUp";
          });
        },1000);
      }
    }

    function signUpFormError(e)
    {
        $scope.alertDisplay = true;
        $scope.alertType = "danger";
        $scope.alertMsg = ("error."+e.statusText).replace(/ /g,"_");
        $scope.buttonDisabled = false;
        $scope.buttonLabel = "global.signUp";
    }
});