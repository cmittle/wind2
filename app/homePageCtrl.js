app.controller('homePageCtrl', function ($scope, $uibModal, $filter, $http, Data) {

$scope.concatGbArray = []; //empty array to hold concatenated data of gb mfg and model
$scope.concatTowerArray = []; //empty array to hold concatenated data of tower mfg and model
$scope.showGenMfgList = false;


$scope.gbMfgArray = [];  //move to here once I get the ng-repeat to work
$scope.towerMfgArray = [];
$scope.gbModelArray = [];  //load all of the gb model numbers at once then filter under each list item
$scope.towerModelArray = [];  //load all of the tower model numbers at once then filter under each list item
$scope.showGbMfgList = false;  //this is used to show/hide the list of gb mfgs below the "Gearbox" heading
$scope.showTowerMfgList = false;  //this is used to show/hide the list of gb mfgs below the "Gearbox" heading
$scope.showMasterEdit = false; //this is used to show/hide the Master Edit list of links to add/edit/remove items from the database


// expand/collapse model list below selected gearbox mfg
$scope.showGbModels = function(x) {
	//this function takes the gbMfgId from the clicked mfg name on the page and changes the "view" property of that gb model to true if the gbmfg for that model matches
			//eg if gbMfg Hansen is selected (id = 5) then all models that list Hansen (id=5) in the mfg property have the view property changed to true
	angular.forEach($scope.gbModelArray, function (ea, key) {
		if (ea.mfg == x) {
			//This toggles the view property of the list of models under the gb mfg just clicked
			//doing it this way allows several or no gb mfg list of models to be shown at one time.
			ea.view = !ea.view;
		};
	});
};

// expand/collapse model list below selected tower mfg
$scope.showTowerModels = function(x) {
	//this function takes the towerMfgId from the clicked mfg name on the page and changes the "view" property of that tower model to true if the towermfg for that model matches
	//eg if towerMfg Siemens is selected (id = 9) then all models that list Siemens (id=9) in the mfg property have the view property changed to true
	angular.forEach($scope.towerModelArray, function (ea, key) {
		if (ea.mfg == x) {
			//This toggles the view property of the list of models under the tower mfg just clicked
			//doing it this way allows several or no tower mfg list of models to be shown at one time.
			console.log("ea.mfg = " + ea.mfg);
			ea.view = !ea.view;
		};
	});
};


// expand/collapse top level "Gearbox" label in sidebar
$scope.toggleGbMfgList = function () {
	//This is used to toggle showGbMfgList variable
	$scope.showGbMfgList = !$scope.showGbMfgList;	
};

// expand/collapse top level "Tower" label in sidebar
$scope.toggleTowerMfgList = function () {
	//This is used to toggle showGbMfgList variable
	$scope.showTowerMfgList = !$scope.showTowerMfgList;
	//console.log("TOGGLE TOWER MFG");	
};

$scope.toggleMasterEdit = function () {
	//This is used to toggle showMasterEdit variable
	$scope.showMasterEdit = !$scope.showMasterEdit;	
};




$scope.getgbmodels = function() {
		//this gets the list of gearbox names from the gearbox_basic database table to give to the pulldown menu at the top of the page
		$http
			//poing to relative url of query and pass required params/variables.  This information can be used to constrain the query.
		    .get('api/v1/gearboxBasic.php', { //calls specific php request for gbMfg list only
		        params: {
		            //no params on this one.
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
		          	$scope.b= {model: (value['model']), mfg:(value['mfg']), id: (value['id']), view:(false)};
		          	//add new gb to array in forEach loop to gb master list to be sorted.
		          	$scope.gbModelArray = $scope.gbModelArray.concat($scope.b);
		          });
		     }, function (data) {
		     	console.log("failure of getmodellist function status:");
		     });
	};

$scope.getTowerModels = function() {
		//this gets the list of tower model names from the tower_models database table to give to the pulldown menu at the top of the page
		$http
		    .get('api/v1/towerModels.php', { //calls specific php request for gbMfg list only
		        params: {
		            //no params on this one.
		            }
		     })
                     //TODO change "data" to "response"
                     //     change names of objects and arrays to make more sense for this controller
		     .then(function (results) {
		          $scope.g = results;
		          console.log("TOWER MODEL BASIC THEN");
		          console.log(results.data[0]);
		          angular.forEach (results.data, function (value, key){
		          	//this creates a temporary object with concatenated mfg ID and mfg Name
		          	//I will use this concatentated informaiton to create a sorted object which can be tied to the pulldown menu on this page
		          	$scope.b= {model: (value['model']), mfg:(value['mfg']), id: (value['uid']), view:(false)};
		          	//add new gb to array in forEach loop to gb master list to be sorted.
		          	$scope.towerModelArray = $scope.towerModelArray.concat($scope.b);
		          });
		     }, function (results) {
		     	console.log("failure of getmodellist function status:");
		     });
	};


//get gearbox mfg list so I can populate tab on left side of page
$scope.getgbbasic = function() {
		//this gets the list of gearbox names from the gearbox_basic database table to give to the pulldown menu at the top of the page
		$http
			//poing to relative url of query and pass required params/variables.  This information can be used to constrain the query.
		    .get('api/v1/gearboxMfg.php', { //calls specific php request for gbMfg list only
		        params: {
		            //no params
		            }
		     })
                     //TODO change "data" to "response"
                     //     change names of objects and arrays to make more sense for this controller
		     .then(function (data) {
		          $scope.gbBasicList = data;
		          angular.forEach (data.data, function (value, key){
		          	//this creates a temporary object with concatenated mfg ID and mfg Name
		          	//I will use this concatentated informaiton to create a sorted object which can be tied to the pulldown menu on this page
		          	$scope.gbObject= {id: (value['id']), name:(value['mfg'])}; // + ' ' + value['model'], view:(true)
		          	//add new gb to array in forEach loop to gb master list to be sorted.
		          	$scope.concatGbArray = $scope.concatGbArray.concat($scope.gbObject);
		          });
		          //console.log($scope.concatGbArray);
		     }, function (data) {
		     	console.log("failure of getgbbasic function status:");
		     });
	};

//get tower mfg list so I can populate tab on left side of page
$scope.getTowerBasic = function() {
		//this gets the list of gearbox names from the tower_mfg database table to give to the pulldown menu at the top of the page
		$http
			//poing to relative url of query and pass required params/variables.  This information can be used to constrain the query.
		    .get('api/v1/towerMfg.php', { //calls specific php request for gbMfg list only
		        params: {
		            //no parms
		            }
		     })
		     .then(function (response) {
		          $scope.towerBasicList = response;
		          angular.forEach (response.data, function (value, key){
		          	//this creates a temporary object with concatenated mfg ID and mfg Name
		          	//I will use this concatentated informaiton to create a sorted object which can be tied to the pulldown menu on this page
		          	$scope.towerObject= {id: (value['uid']), name:(value['mfg'])}; 
		          	//add new gb to array in forEach loop to gb master list to be sorted.
		          	$scope.concatTowerArray = $scope.concatTowerArray.concat($scope.towerObject);
		          });
		     }, function (response) {
		     	console.log("failure of gettowerbasic function status:");
		     	console.log(response.data);
		     });
	};

$scope.init = function () {
		//this runs the initial gb mfg query when the page is loaded so I can populate the pulldown menu
		
		$scope.getgbbasic();
		$scope.getTowerBasic();
		$scope.getgbmodels();
		$scope.getTowerModels();
                //console.log("Home Page");
		
	};
        
$scope.init();

});