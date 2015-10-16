app.controller('homePageCtrl', function ($scope, $modal, $filter, $http, Data) {

$scope.concatGbArray = []; //empty array to hold concatenated data of gb mfg and model

$scope.gbMfgArray = [];  //move to here once I get the ng-repeat to work
$scope.gbModelArray = [];  //load all of the gb model numbers at once then filter under each list item

/* DELETE these variables and functions they were only used for testing/implemntation
$scope.strict = true;
$scope.test = false;
$scope.check = function(z) {
	console.log("z is " + z);
	if (z == $scope.currentGb) {
		return true;
	} else {
	return false;
	};
};
$scope.showGearboxMfgList = true;
$scope.showHideGb = function () {
	$scope.showGearboxMfgList = false;
};*/


$scope.clicky = function (y) {
	console.log(y);	
	
};

$scope.showGbModels = function(x) {
	//this function takes the gbMfgId from the clicked mfg name on the page and changes the "view" property of that gb model to true if the gbmfg for that model matches
			//eg if gbMfg Hansen is selected (id = 5) then all models that list Hansen (id=5) in the mfg property have the view property changed to true
	angular.forEach($scope.gbModelArray, function (ea, key) {
	//this loops 
		if (ea.mfg == x) {
			ea.view = true;
		} else {
			ea.view = false;
		};
	});
	
	
};

/*Data.get('gearbox_basic').then(function(data){
    	//	This requests the query '/gearbox_basic' as declared in index.php
        $scope.gbModelArray = data.data;
        console.log("gb Model Array");
        console.log($scope.gbModelArray);
    });*/




$scope.getgbmodels = function() {
		//this gets the list of gearbox names from the gearbox_basic database table to give to the pulldown menu at the top of the page
		$http
			//poing to relative url of query and pass required params/variables.  This information can be used to constrain the query.
		    //.get('api/v1/gearboxBasic.php', {
		    .get('api/v1/gearboxBasic.php', { //calls specific php request for gbMfg list only
		        params: {
		            //can put 
		            //rather than filtering after we get all results
		            //gbid: $scope.gb_id
		            }
		        
		     })
                     //TODO change "data" to "response"
                     //     change names of objects and arrays to make more sense for this controller
		     .then(function (data) {
		          $scope.g = data;
		          //console.log("gb MODEL BASCI THEN");
		          //console.log(data.data[0]);
		          angular.forEach (data.data, function (value, key){
		          	//this creates a temporary object with concatenated mfg ID and mfg Name
		          	//I will use this concatentated informaiton to create a sorted object which can be tied to the pulldown menu on this page
		          	//$scope.b= {model: (value['model']), mfg:(value['mfg'])}; // + ' ' + value['model']
		          	$scope.b= {model: (value['model']), mfg:(value['mfg']), view:(false)};
		          	//add new gb to array in forEach loop to gb master list to be sorted.
		          	$scope.gbModelArray = $scope.gbModelArray.concat($scope.b);
		          	//console.log($scope.gbObject);
		          	//Rather than make an array of objects I think I just need to make an Object, each id can correspond to a model
		          	
		          	
		          });
		          console.log("look here for view variable in object");
		          console.log($scope.gbModelArray);
		     }, function (data) {
		     	console.log("failure of getmodellist function status:");
		     	console.log(data.status);
		     });
	};


//get gearbox mfg list so I can populate tab on left side of page
$scope.getgbbasic = function() {
		//this gets the list of gearbox names from the gearbox_basic database table to give to the pulldown menu at the top of the page
		$http
			//poing to relative url of query and pass required params/variables.  This information can be used to constrain the query.
		    //.get('api/v1/gearboxBasic.php', {
		    .get('api/v1/gearboxMfg.php', { //calls specific php request for gbMfg list only
		        params: {
		            //can put 
		            //rather than filtering after we get all results
		            //gbid: $scope.gb_id
		            }
		        
		     })
                     //TODO change "data" to "response"
                     //     change names of objects and arrays to make more sense for this controller
		     .then(function (data) {
		          $scope.gbBasicList = data;
		          console.log("gb basic THEN");
		          console.log(data.data[0]);
		          angular.forEach (data.data, function (value, key){
		          	//this creates a temporary object with concatenated mfg ID and mfg Name
		          	//I will use this concatentated informaiton to create a sorted object which can be tied to the pulldown menu on this page
		          	$scope.gbObject= {id: (value['id']), name:(value['mfg'])}; // + ' ' + value['model']
		          	//add new gb to array in forEach loop to gb master list to be sorted.
		          	$scope.concatGbArray = $scope.concatGbArray.concat($scope.gbObject);
		          	//console.log($scope.gbObject);
		          	//Rather than make an array of objects I think I just need to make an Object, each id can correspond to a model
		          	
		          	
		          });
		          console.log($scope.concatGbArray);
		     }, function (data) {
		     	console.log("failure of getgbbasic function status:");
		     	console.log(data.status);
		     });
	};

$scope.init = function () {
		//this runs the initial gb mfg query when the page is loaded so I can populate the pulldown menu
		
		$scope.getgbbasic();
		$scope.getgbmodels();
                console.log("Home Page");
		
	};
        
$scope.init();

});