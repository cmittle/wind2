app.controller('homePageCtrl', function ($scope, $modal, $filter, $http, Data) {

$scope.concatGbArray = []; //empty array to hold concatenated data of gb mfg and model

$scope.gbMfgArray = [];  //move to here once I get the ng-repeat to work

$scope.tm = {
    "India": "2",
    "England": "2",
    "Brazil": "3",
    "UK": "1",
    "USA": "3",
    "Syria": "2"
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
		     .success(function (data) {
		          $scope.gbBasicList = data;
		          console.log("homePage basic");
		          console.log(data[0]);
		          //$scope.gb_id = data [0];
		          angular.forEach (data, function (value, key){
		          	//console.log(key + ':' + value['mfg'] + ' ' + value['model']);
		          	//this creates a new gbObject with concatenated mfg name and model number
		          	//I will use this concatentated informaiton to create a sorted object which can be tied to the pulldown menu on this page
		          	$scope.gbObject= {id: (value['id']), name:(value['mfg'])}; // + ' ' + value['model']
		          	//add new gb to array in forEach loop to gb master list to be sorted.
		          	$scope.concatGbArray = $scope.concatGbArray.concat($scope.gbObject);
		          	//console.log($scope.gbObject);
		          	//Rather than make an array of objects I think I just need to make an Object, each id can correspond to a model
		          	
		          	
		          });
		          console.log($scope.concatGbArray[0]);
		          console.log("test");
		          console.log($scope.concatGbArray);
		          $scope.gbMfgArray = $scope.concatGbArray;
		          console.log("gb mfg array");
		          console.log($scope.gbMfgArray);
		     }); 
	};

$scope.init = function () {
		//this runs the initial gb mfg query when the page is loaded so I can populate the pulldown menu
		
		$scope.getgbbasic();
                console.log("Home Page");
		
	};
        
$scope.init();

});