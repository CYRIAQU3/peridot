app.controller('studioCtrl', function($scope, $http,$cookies)
{
	var channelId = 1;
    $http.get(apiIndex+"/channels/"+channelId)
    .then(function(r) {
        $scope.channel = r.data.channels[0];
            	console.log($scope.channel);
        $http.get(apiIndex+"/channels/"+channelId+"/channel_files")
	    .then(function(ra) {
	        $scope.channel.files = ra.data.channel_files;
	    });
    });

    $scope.addFile = function(url,name,channelId)
    {
        console.log('dd');
        var data = {
            url : url,
            name : name,
            channel_id : channelId
        }

        $http.post(apiIndex+'/channel_files?token='+$cookies.get("pd_token")+'&channel_id='+channelId, data).then(function(r){
            console.log(r);
        }, function(r)
        {
            console.log("error");
            console.log(r);
        });
    }
});