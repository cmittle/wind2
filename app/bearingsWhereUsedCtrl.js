app.controller('bearingsWhereUsedCtrl', function ($scope, $uibModal, $filter, $http, $routeParams, $window, Data) {
    $scope.product = {};  //not sure if this is confused with products or if this is correct.
    $scope.urlMfg = $routeParams.mfg;  //id number passed in url
    $scope.urlModel = $routeParams.model;  //model number passed in url
    $scope.urlModelName;
    $scope.showActions = false; //hide edit/delete/copy actions column by default
    $scope.showPartNumbers = false; //hide bearing specific part numbers column by default
    $scope.showSKF = false; //
    $scope.showNSK = false; //
    $scope.showFAG = false; //
    $scope.showTimken = false; // initially false for Timken
    $scope.showKoyo = false; // initially false for Koyo
    $scope.showNTN = false; // initially false for NTN
    $scope.showOther = false; //initially false for Other
    $scope.bearingSpecifics = []; //empty array will hold bearing specifics data
    $scope.bearingBasicIdArray = [];
    $scope.gbBasicList; //creat empty gbBasicList
    $scope.sortGbList; //create empty gb list
    $scope.concatGbArray = []; //empty array to hold concatenated data of gb mfg and model
    $scope.singleDetail; //create empty item detail object
    //look at AngularJS / MySQL / PHP tutorial here http://www.phpro.org/tutorials/Consume-Json-Results-From-PHP-MySQL-API-With-Angularjs-And-PDO.html
    

    $scope.changeShowPn = function () {
    //only turn on SKF, NSK, FAG automatically, Timken, Koyo, NTN, and Other are not going to be needed in most cases
            if ($scope.showPartNumbers === false) {
	    	$scope.showSKF = true;
            	$scope.showNSK = true;
            	$scope.showFAG = true;
            } else {
            	$scope.showSKF = false;
            	$scope.showNSK = false;
            	$scope.showFAG = false;
            	$scope.showTimken = false;
            	$scope.showKoyo = false;
            	$scope.showNTN = false;
            	$scope.showOther = false;
            };
    };

    
    $scope.getgb = function() {
    	$http
    	   .get('api/v1/gearbox.php', {
    	      params: {
    	          gbid: $scope.urlModel  //gbid from URL only requests results from table that are used in that gearbox
    	          }
    	   }).then(function successCallback(results) { //succesful HTTP response 
            	//this is the list of generic bearing part numbers with positions and display sequence etc... for this gearbox (gbid sent in GET parameters)
            	$scope.products = results.data;
            	//this removes duplicates and reduces to an array with only unique bearing_basic_id
            	$scope.removeDuplicates(results.data);  
                //after cleaning list of duplicates above run this to retrieve bearing specific part numbers
                $scope.getBearingSpecifics(); 
        }, function errorCallback(data) { //need 400 series header returned to engage error callback
            alert(data.data.message);  //display alert box saying the eror recieved from the server
            $scope.products = '0'; //stops loading icon from spinning on page
	    console.log("$http.get in gearboxSpecificsCtrl2.js $scope.getgb function recieved an error");
	    console.log(data); //show data returned from server about error
	  });
    };

	$scope.removeDuplicates = function (a) {
	        
	        //This will check each basic ID on the list used in this gearbox before requesting specifics
	        angular.forEach (a, function (value, key){
		          	//this creates a temporary array for storing bearing_basic_ids that are used in this gearbox
		          	$scope.b= {id: (value['bearing_basic_id'])};
		          	//add new gb to array in forEach loop to gb master list to be sorted.
		          	$scope.bearingBasicIdArray = $scope.bearingBasicIdArray.concat($scope.b.id);
		          	//console.log($scope.b.id);          	
		          });	
	        //this trims duplicates and makes a clean set without duplicates
		$scope.bearingBasicIdArray = new Set($scope.bearingBasicIdArray);  
	};


    $scope.getBearingSpecifics = function () {
        //get specific part numbers and details for all of the basic IDs in this gearbox
                angular.forEach ($scope.bearingBasicIdArray, function (item, key) {
		     	$http  //gbid from URL only requests results from table that are used in that gearbox
		            .get('api/v1/bearingSpecifics.php', {
		                params: {
		                    bearing_basic_id: item
		                    }
		             })
		             .success(function (data) {
		                  $scope.bearingSpecifics = $scope.bearingSpecifics.concat(data);
		             });
	     	});
    };

    //an initialization function so that getgb can be a separate function and called each time as necessary
    $scope.init = function () {
        //this runs the initial gb basic query when the page is loaded so I can populate the pulldown menu
        $scope.getgb();
    };
   
    
    $scope.columns = [ 
        {text:"Record ID",predicate:"id",sortable:true},
        {text:"GB ID",predicate:"gb_id",sortable:true},
        {text:"Pos ID",predicate:"pos_id",sortable:true},
        {text:"Position",predicate:"position",sortable:true,},
        {text:"Brg Basic ID",predicate:"bearing_basic_id",sortable:true},
        {text:"Brg Basic PN",predicate:"bearing_basic_pn",sortable:true},
        {text:"Rec Clearance",predicate:"rec_clearance",sortable:true},
        {text:"Qty",predicate:"qty_per_gb",sortable:true},
        {text:"Notes",predicate:"notes",sortable:true},
        {text:"",predicate:"",sortable:false}
    ];

    //call init function at bottom to run initalization after everything is declared
    //this initializes the display when the page is loaded
    $scope.init();

});