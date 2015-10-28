app.controller('gearboxSpecificsCtrl2', function ($scope, $modal, $filter, $http, $routeParams, Data) {
    $scope.product = {};
    $scope.urlMfg = $routeParams.mfg;  //id number passed in url
    $scope.urlModel = $routeParams.model;  //model number passed in url
    $scope.urlModelName;
    //look at AngularJS / MySQL / PHP tutorial here http://www.phpro.org/tutorials/Consume-Json-Results-From-PHP-MySQL-API-With-Angularjs-And-PDO.html
    //this calls the gearbox.php file I created
    

    //This works if I need to revert back to this
   /* $http.get('api/v1/gearbox.php?dt=3').
        success(function(data) {
        //console.log("test 4444");
            $scope.products = data;
            console.log(data);
            //console.log("it worked");
        }); */

	
	//$scope.gb_id = 3; //only need this if I want a default gearbox to load on this screen
	$scope.gbBasicList;
	$scope.sortGbList; //create empty gb list
	$scope.concatGbArray = []; //empty array to hold concatenated data of gb mfg and model
	
	
	//make getgb a stand alone function so that my gb selection method, pulldown, or whatever can re-call this method any time it is changed
	$scope.getgb = function() {
	
		$http
			//poing to relative url of query and pass required params/variables.  This information can be used to constrain the query.
		    .get('api/v1/gearbox.php', {
		        params: {
		            //gearbox id number to request only correct results from the database
		            gbid: $scope.urlModel
		            //gbid: $scope.gb_id.id
		            }
		        
		     })
		     .success(function (data) {
		          $scope.products = data;
		          console.log("gb specifics");
		          //console.log($scope.concatGbArray.id);
		          console.log(data);
		          
		     }); 
		     //console.log("gb_id.id:" + $scope.gb_id.id + " d " + $scope.gb_id.name);
	};
	
	$scope.getgbbasic = function() {
		//this gets the list of gearbox names from the gearbox_basic database table to give to the pulldown menu at the top of the page
		$http
			//poing to relative url of query and pass required params/variables.  This information can be used to constrain the query.
		    .get('api/v1/gearboxBasic.php', {
		        params: {
		            //can put 
		            //rather than filtering after we get all results
		            //gbid: $scope.gb_id
		            }
		        
		     })
		     .success(function (data) {
		          $scope.gbBasicList = data;
		          console.log("gb basic");
		          console.log(data);
		          //$scope.gb_id = data [0];
		          angular.forEach (data, function (value, key){
		          	//console.log(key + ':' + value['mfg'] + ' ' + value['model']);
		          	//this creates a new gbObject with concatenated mfg name and model number
		          	//I will use this concatentated informaiton to create a sorted object which can be tied to the pulldown menu on this page
		          	$scope.gbObject= {id: (value['id']), name:(value['mfg'] + ' ' + value['model'])};
		          	//add new gb to array in forEach loop to gb master list to be sorted.
		          	$scope.concatGbArray = $scope.concatGbArray.concat($scope.gbObject);
		          	//console.log($scope.gbObject);
		          	//Rather than make an array of objects I think I just need to make an Object, each id can correspond to a model
		          	
		          	
		          });
		          console.log($scope.concatGbArray[0]);
		     }); 
	};
	

	
	
	
	//an initialization function so that getgb can be a separate function and called each time as necessary
	$scope.init = function () {
		//this runs the initial gb basic query when the page is loaded so I can populate the pulldown menu
		
		$scope.getgbbasic();
		$scope.getgb();
                //console.log("Init display route params");
                //console.log("URL Mfg = " + $scope.urlMfg);
                //console.log("URL Model = " + $scope.urlModel);
		//this runs the initial gb specifics query when the page is loaded
				
		//DO NOT run this function on init().  as gb_id.id is not valid until selected from the pulldown menu
		//TODO fix this so when page is initiaated it either loads all, or loads only a particular gearbox
		//$scope.getgb();
		
	};
   
    
    
 $scope.columns = [ 
                    //{text:"ID",predicate:"id",sortable:true},
                    //{text:"GB ID",predicate:"gb_id",sortable:true},
                    //{text:"Pos ID",predicate:"pos_id",sortable:true},
                    {text:"Position",predicate:"position",sortable:true,},
                    //{text:"Brg Basic ID",predicate:"bearing_basic_id",sortable:true},
                    {text:"Brg Basic PN",predicate:"bearing_basic_pn",sortable:true},
                    {text:"Rec Clearance",predicate:"rec_clearance",sortable:true},
                    {text:"Qty/GB",predicate:"qty_per_gb",sortable:true},
                    {text:"Notes",predicate:"notes",sortable:true},
                    {text:"Action",predicate:"",sortable:false}
                ];

//call init function at bottom to run initalization after everything is declared
//this initializes the display when the page is loaded
$scope.init();

});
