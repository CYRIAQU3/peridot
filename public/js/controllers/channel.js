app.controller('channelCtrl', function($scope, $http,$stateParams,$cookies)
{

	$scope.channelId = $stateParams.channelId;
	$scope.chatInputActive = false;
	$scope.chatInputMessage = "";
	$scope.ready = false;

	$http.get(apiIndex+"/channels/"+$scope.channelId).then(function(r)
	{
		$scope.channel = r.data.channels[0];
		$scope.socketManager.initializeServerConnect($scope.channel.id);
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
});