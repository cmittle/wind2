app.controller('mainBearingSpecificCtrl', function ($scope, $uibModal, $filter, $http, $routeParams, $window) {
    $scope.product = {};  //not sure if this is confused with products or if this is correct.
    $scope.urlMfg = $scope.towerMfg;  //$routeParams.mfg;  //id number passed in url
    $scope.urlModel = $scope.towerModel; //model number passed in attribute of directive element     //$routeParams.model;  //model number passed in url
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
    $scope.role;

    $scope.changeShowPn = function () {
    //only turn on SKF, NSK, FAG automatically, Timken, Koyo, NTN, and Other are not going to be needed in most cases
            if ($scope.showPartNumbers === true) {
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

    
    $scope.getTower = function() {
    	$http
    	   .get('api/v1/towerMain.php', {
    	      params: {
    	          tid: $scope.urlModel  //tid from URL only requests results from table that are used in that gearbox
    	          }
    	   }).then(function successCallback(results) { //succesful HTTP response 
            	//this is the list of generic bearing part numbers with positions and display sequence etc... for this tower (tid sent in GET parameters)
            	$scope.products = results.data;
            	//this removes duplicates and reduces to an array with only unique bearing_basic_id
            	$scope.removeDuplicates(results.data);  
                //after cleaning list of duplicates above run this to retrieve bearing specific part numbers
                $scope.getBearingSpecifics(); 
        }, function errorCallback(results) { //need 400 series header returned to engage error callback
            alert(results.data.message);  //display alert box saying the eror recieved from the server
            $scope.products = '0'; //stops loading icon from spinning on page
	    console.log("$http.get in mainBearingSpecificCtrl.js $scope.getTower function recieved an error");
	    //console.log(results); //show data returned from server about error
	  });
    };

    $scope.removeDuplicates = function (a) {
        //This will check each basic ID on the list used in this gearbox before requesting specifics
        angular.forEach (a, function (value, key){
                //this creates a temporary array for storing bearing_basic_ids that are used in this gearbox
                $scope.b= {id: (value['bearing_basic_id'])};
                //add new gb to array in forEach loop to gb master list to be sorted.
                $scope.bearingBasicIdArray = $scope.bearingBasicIdArray.concat($scope.b.id);   	
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
                 .success(function (results) {
                      $scope.bearingSpecifics = $scope.bearingSpecifics.concat(results);
            });
        });
    };

    $scope.deleteProduct = function(product){
        if(confirm("Are you sure to remove the product")){
            console.log("delete product = ");
            console.log(product);
            $http({
                method: 'GET',
                url: 'api/v1/delete.php',
                params: {type: 'delete', t: 'tm', id: product.uid}
             }).then(function (results) {
                  $scope.getTower(); //call this to update view on screen; there is probably a better way just to update 1 record, should look at this later
            }) .catch(function (results) {
                console.log(results.data);
                console.log("Delete item FAILED");
            });
                        //original delete code..
                        //Data.delete("products/"+product.id).then(function(result){
                        //    $scope.products = _.without($scope.products, _.findWhere($scope.products, {id:product.id}));
                        //});
        }
    };

//This opens the modal to add a new item to this gearbox.
//TODO figure out how to pre-load current gearbox model on modal
    $scope.open = function (p,size) {
        var modalInstance = $uibModal.open({
            templateUrl: 'partials/tower_main_edit.html',
            controller: 'mainBearingSpecificEditCtrl',
            size: size,
            resolve: {
                item: function () {
                    return p;
                }
            }
        });
        modalInstance.result.then(function(selectedObject) {
            console.log("Modal Result");
                if(selectedObject.save == "insert"){
                    console.log("Insert");
                    $scope.products.push(selectedObject);
                    $scope.products = $filter('orderBy')($scope.products, 'id', 'reverse');
                }else if(selectedObject.save == "update"){
                    //This should update the view but does not yet.  Compare to products page to see if I did something differently
                    $scope.getTower(); //call this to update view on screen; there is probably a better way just to update 1 record, should look at this later
                }
        });
    };



    //an initialization function so that getTower can be a separate function and called each time as necessary
    $scope.init = function () {
        $scope.getTower();
        //$scope.role = $window.sessionStorage.role == 'MOTU';
    };
   
    
    $scope.columns = [ 
        {text:"Position",predicate:"position",sortable:true,},
        {text:"Brg Basic PN",predicate:"bearing_basic_pn",sortable:true},
        {text:"Rec Clearance",predicate:"rec_clearance",sortable:true},
        {text:"Notes",predicate:"notes",sortable:true},
        {text:"",predicate:"",sortable:false}
    ];

    //call init function at bottom to run initalization after everything is declared
    //this initializes the display when the page is loaded
    $scope.init();

});

app.controller('mainBearingSpecificEditCtrl', function ($scope, $uibModalInstance, $http, $routeParams, item, Data) {

  $scope.product = angular.copy(item);
  $scope.basicbrglist;
  $scope.urlModel =  $routeParams.model;  //model number passed in url
  $scope.submitted = false;
       
    $scope.getbasicbrg = function () {
        Data.get('bearing_basic').then(function(results){
        //	This requests the query '/bearing_basic' as declared in index.php
        $scope.basicbrglist = results.data;
        console.log("basic brg list = ");
        console.log($scope.basicbrglist);
        console.log("current model is =");
        console.log($scope.urlModel);
        });
    };

    $scope.loadModel = function() {
        console.log("TEST 1");
        console.log(item.id);
        if (item.id>0) {
            console.log("TEST 2");
            product.gb_id = $scope.urlModel;
            //console.log("product.gb_id = ");
            //console.log(product.gb_id);
        };
    };
        
    $scope.cancel = function () {
        $uibModalInstance.dismiss('Close');
    };
    $scope.title = (item.id > 0) ? 'Edit Product' : 'Add Product';
    $scope.buttonText = (item.id > 0) ? 'Update Product' : 'Add New Product';

    /*var original = item;
    $scope.isClean = function() { //not sure where this is used if it even is???
        return angular.equals(original, $scope.product);
    }*/
    $scope.saveProduct = function (product) {
        //product.uid = $scope.uid;  //doesnt seem to do anything now
        $scope.submitted = true; //this sets this to true so that the submit button can be turned in to a loading icon while this process to prevent duplicate submissions
        if(product.uid > 0){ // this is true if this editing a current product
            $http({
                method: 'POST',
                url: 'api/v1/towerMainEdit.php',
                data: product
            }).then(function (results) {
                var x = angular.copy(product);//copy current product with new information and send back to function that opened modal to update view
                x.save = 'update';
                $scope.submitted = false; //set back to false to show submit button again
                $uibModalInstance.close(x); //close Edit modal when completed
                console.log("SUCCESS  $scope.product = ");
                console.log($scope.product);
            }) .catch(function (results) {
                console.log(results.data);
                console.log("FAILED");
            });      
        }else{  //this is where it goes for a new product
            $http({
                method: 'POST',
                url: 'api/v1/towerMainAdd.php',
                data: product
            }).then(function (results) {
                var x = angular.copy(product);//copy current product with new information and send back to function that opened modal to update view
                x.save = 'update';
                $scope.submitted = false; //set back to false to show submit button again
                $uibModalInstance.close(x); //close Edit modal when completed
                console.log("SUCCESS  $scope.product = ");
                console.log($scope.product);
            }) .catch(function (results) {
                console.log(results.data);
                console.log("FAILED");
            });
        }
    };
    $scope.getbasicbrg();
        
});