app.controller('studioCtrl', function($scope, $http,$cookies)
{
	var channelId = 1;
    $http.get(apiIndex+"/channels/"+channelId)
    .then(function(r) {
        $scope.channel = r.data.channels[0];
        $http.get(apiIndex+"/channels/"+channelId+"/files")
	    .then(function(ra) {
	        $scope.channel.files = ra.data.files;
	    });
    });

    $scope.addFile = function(url,name,channelId)
    {
        var data = {
            url : url,
            name : name,
            channel_id : channelId
        }

        $http.post(apiIndex+'/files?token='+$cookies.get("pd_token")+'&channel_id='+channelId, data).then(function(r){
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
            channel_id : channelId
        }

        $http.put(apiIndex+'/files/'+fileId+'+?token='+$cookies.get("pd_token"), data).then(function(r){
            location.reload();
        }, function(r)
        {
            console.log("error");
            console.log(r);
        });
    }
});