app.controller('gearboxTextCtrl', function ($scope, $uibModal, $filter, $http, $routeParams, $window) {
    $scope.product = {};  //not sure if this is confused with products or if this is correct.
    $scope.urlMfg = $scope.gbxMfg;  //model number passed in attribute of directive element  //$routeParams.mfg;  //id number passed in url
    $scope.urlModel = $scope.gbxModel; //model number passed in attribute of directive element     //$routeParams.model;  //model number passed in url
    $scope.gearboxText;

    //This gets the basic seal list for this gearbox on page load
    $scope.getgb = function() {
    	$http
    	   .get('api/v1/gearboxText.php', {
    	      params: {
    	          gbid: $scope.urlModel  //gbid from URL only requests results from table that are used in that gearbox
    	          }
    	   }).then(function successCallback(results) { //succesful HTTP response 
            	//NEED to either catch if value is blank on client side or server side.  Also only looking for one answer, dont need to leave this open for several answers... unless I do revisions?
            	if (results.data.length >0) { //if no results are returned dont try to set variable as it will error out.
	            	$scope.gearboxText = results.data[0].text;
            	} else { //if no results are returned show error in console
            		console.log("gearboxText.php returned no results");
            	};
        }, function errorCallback(data) { //need 400 series header returned to engage error callback
            alert(data.data.message);  //display alert box saying the eror recieved from the server
            $scope.products = '0'; //stops loading icon from spinning on page
	    console.log("$http.get in gearboxTextCtrl.js $scope.getgb function recieved an error");
	    console.log(data); //show data returned from server about error
	  });
    };


    //an initialization function so that getgb can be a separate function and called each time as necessary
    $scope.init = function () {
        //this runs the initial gb basic query when the page is loaded so I can populate the pulldown menu
        //console.log("gearboxSealssCtrl.js works");
        //console.log("scope.gbxModel  = ");
        //console.log($scope.gbxModel);
        $scope.getgb();

    };
   
    //call init function at bottom to run initalization after everything is declared
    //this initializes the display when the page is loaded
    $scope.init();

});



