app.controller('homePageCtrl', function ($scope, $modal, $filter, $http, Data) {

$scope.concatGbArray = []; //empty array to hold concatenated data of gb mfg and model

$scope.gbMfgArray = [];  //move to here once I get the ng-repeat to work
$scope.gbModelArray = [];  //load all of the gb model numbers at once then filter under each list item
$scope.strict = true;

$scope.tm = {
    "India": "2",
    "England": "2",
    "Brazil": "3",
    "UK": "1",
    "USA": "3",
    "Syria": "2"
};

$scope.clicky = function () {
	console.log("CLICKY");
};
$scope.getGearboxModels = function(x) {
	console.log("get gb models");
	console.log(x);
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
		          console.log("gb MODEL BASCI THEN");
		          console.log(data.data[0]);
		          angular.forEach (data.data, function (value, key){
		          	//this creates a temporary object with concatenated mfg ID and mfg Name
		          	//I will use this concatentated informaiton to create a sorted object which can be tied to the pulldown menu on this page
		          	$scope.b= {model: (value['model']), mfg:(value['mfg'])}; // + ' ' + value['model']
		          	//add new gb to array in forEach loop to gb master list to be sorted.
		          	$scope.gbModelArray = $scope.gbModelArray.concat($scope.b);
		          	//console.log($scope.gbObject);
		          	//Rather than make an array of objects I think I just need to make an Object, each id can correspond to a model
		          	
		          	
		          });
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