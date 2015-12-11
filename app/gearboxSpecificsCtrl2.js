app.controller('gearboxSpecificsCtrl2', function ($scope, $modal, $filter, $http, $routeParams, Data) {
    $scope.product = {};
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
    //$scope.concatGbArray = []; //empty array to hold concatenated bearing specifics data
    //look at AngularJS / MySQL / PHP tutorial here http://www.phpro.org/tutorials/Consume-Json-Results-From-PHP-MySQL-API-With-Angularjs-And-PDO.html
    //this calls the gearbox.php file I created
    

    $scope.changeShowPn = function () {
    //only turn on SKF, NSK, FAG automatically, Timken, Koyo, NTN, and Other are not going to be needed in most cases
            $scope.showSKF = $scope.showPartNumbers;
            $scope.showNSK = $scope.showPartNumbers;
            $scope.showFAG = $scope.showPartNumbers;
    };


    $scope.gbBasicList; //creat empty gbBasicList
    $scope.sortGbList; //create empty gb list
    $scope.concatGbArray = []; //empty array to hold concatenated data of gb mfg and model


    //make getgb a stand alone function so that my gb selection method, pulldown, or whatever can re-call this method any time it is changed
    $scope.getgb = function() {
        $http
                //gbid from URL only requests results from table that are used in that gearbox
            .get('api/v1/gearbox.php', {
                params: {
                    gbid: $scope.urlModel
                    }
             })
             .success(function (data) {
                  $scope.products = data;
                  //console.log("gb specifics");
                  //console.log(data);
                  $scope.getBearingSpecifics(data); //run this after I recieve this list
             }); 
                 //console.log("gb_id.id:" + $scope.gb_id.id + " d " + $scope.gb_id.name);
    };

    $scope.getBearingSpecifics = function (a) {
        //NEED TO write for each to loop through answers of each record in "a" array 
        //will build bearingSpecificsArray of objects which can be ng-repeated in view
        	
		angular.forEach (a, function (item, key) {
			//console.log("item = ");
	        	//console.log(item);	
			     	$http  //gbid from URL only requests results from table that are used in that gearbox
			            .get('api/v1/bearingSpecifics.php', {
			                params: {
			                    bearing_basic_id: item.bearing_basic_id
			                    }
			             })
			             .success(function (data) {
			                  $scope.bearingSpecifics = $scope.bearingSpecifics.concat(data);
			             });
	     	});
	     
	     
	     //FOR EACH example to steal from
	/*     angular.forEach (data.data, function (value, key){
		          	//this creates a temporary object with concatenated mfg ID and mfg Name
		          	//I will use this concatentated informaiton to create a sorted object which can be tied to the pulldown menu on this page
		          	//$scope.b= {model: (value['model']), mfg:(value['mfg'])}; // + ' ' + value['model']
		          	//$scope.b= {model: (value['model']), mfg:(value['mfg']), view:(false)};
		          	$scope.b= {model: (value['model']), mfg:(value['mfg']), id: (value['id']), view:(false)};
		          	//add new gb to array in forEach loop to gb master list to be sorted.
		          	$scope.gbModelArray = $scope.gbModelArray.concat($scope.b);
		          	//console.log($scope.gbObject);
		          	//Rather than make an array of objects I think I just need to make an Object, each id can correspond to a mode	          	
		          });*/
	     
	     
	     
	//THIS WORKED if I need to revert     
	/*        $http  //gbid from URL only requests results from table that are used in that gearbox
	            .get('api/v1/bearingSpecifics.php', {
	                params: {
	                    bearing_basic_id: a[9].bearing_basic_id
	                    }
	             })
	             .success(function (data) {
	                  $scope.bearingSpecifics = data;
	                  //$scope.products = data;
	                  //console.log("bearing specific find 1");
	                  //console.log($scope.bearingSpecifics);
	             }); */
	                 //console.log("gb_id.id:" + $scope.gb_id.id + " d " + $scope.gb_id.name);
    };
// I think I can remove this block this functionalit has been moved to homepage controller	
/*	$scope.getgbbasic = function() {
            //this gets the list of gearbox mfg names and model numbers to populate the sidebar menu
            $http
                    //poing to relative url of query and pass required params/variables.  This information can be used to constrain the query.
                .get('api/v1/gearboxBasic.php', {
                    params: {
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
                      console.log("getgbbasic()");
                      console.log($scope.concatGbArray);
                 }); 
    };*/

    $scope.deleteProduct = function(product){
        if(confirm("Are you sure to remove the product")){
            console.log("delete product = ");
            console.log(product);
            $http({
                    method: 'GET',
                    url: 'api/v1/delete.php',
                    params: {type: 'delete', t: 'gbs', id: product.id}
             }).then(function (data) {
                  //product.description = $scope.testVar; //update the view after database update is successful
                  //var x = angular.copy(product);//copy current product with new information and send back to function that opened modal to update view
                  //x.save = 'update';
                  //$modalInstance.close(x); //close Edit modal when completed
                  $scope.getgb(); //call this to update view on screen; there is probably a better way just to update 1 record, should look at this later
            }) .catch(function (data) {
                console.log(data.data);
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
        var modalInstance = $modal.open({
            templateUrl: 'partials/gearbox_specifics_edit.html',
            controller: 'gearboxSpecificsEditCtrl2',
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
                    //console.log("c = ");
                    //console.log(c);
                    //c = selectedObject;  //c represents the item in the view; this updates the view based on the change that was just submitted
                    //c.notes = selectedObject.notes;
                    $scope.getgb(); //call this to update view on screen; there is probably a better way just to update 1 record, should look at this later
                }
        });
    };



    //an initialization function so that getgb can be a separate function and called each time as necessary
    $scope.init = function () {
        //this runs the initial gb basic query when the page is loaded so I can populate the pulldown menu

//		$scope.getgbbasic();
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
        {text:"Qty",predicate:"qty_per_gb",sortable:true},
        {text:"Notes",predicate:"notes",sortable:true},
        {text:"",predicate:"",sortable:false}
    ];

//call init function at bottom to run initalization after everything is declared
//this initializes the display when the page is loaded
    $scope.init();

});

app.controller('gearboxSpecificsEditCtrl2', function ($scope, $modalInstance, $http, $routeParams, item, Data) {

  $scope.product = angular.copy(item);
  $scope.basicbrglist;
  $scope.urlModel = $routeParams.model;  //model number passed in url
  $scope.submitted = false;
       
    $scope.getbasicbrg = function () {
        Data.get('bearing_basic').then(function(data){
        //	This requests the query '/bearing_basic' as declared in index.php
        $scope.basicbrglist = data.data;
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
        $modalInstance.dismiss('Close');
    };
    $scope.title = (item.id > 0) ? 'Edit Product' : 'Add Product';
    $scope.buttonText = (item.id > 0) ? 'Update Product' : 'Add New Product';

    var original = item;
    $scope.isClean = function() { //not sure where this is used if it even is???
        return angular.equals(original, $scope.product);
    }
    $scope.saveProduct = function (product) {
        //product.uid = $scope.uid;  //doesnt seem to do anything now
        $scope.submitted = true; //this sets this to true so that the submit button can be turned in to a loading icon while this process to prevent duplicate submissions
        if(product.id > 0){ // this is true if this editing a current product
            $http({
                method: 'POST',
                url: 'api/v1/gearboxEdit.php',
                data: product
            }).then(function (data) {
                //product.description = $scope.testVar; //update the view after database update is successful
                var x = angular.copy(product);//copy current product with new information and send back to function that opened modal to update view
                x.save = 'update';
                $scope.submitted = false; //set back to false to show submit button again
                $modalInstance.close(x); //close Edit modal when completed
                console.log("SUCCESS  $scope.product = ");
                console.log($scope.product);
            }) .catch(function (data) {
                console.log(data.data);
                console.log("FAILED");
            });      
        }else{  //this is where it goes for a new product
            Data.post('gearbox_specifics', product).then(function (result) {
                if(result.status != 'error'){
                    var x = angular.copy(product);
                    x.save = 'insert';
                    x.id = result.data;
                    $scope.submitted = false; //set back to false to show submit button again
                    $modalInstance.close(x);
                }else{
                    //window.alert("Clicked 8" + result);
                    console.log("Data.post - else");
                    console.log(result);
                }
            });
        }

        //$scope.submitted = false; //set back to false to show submit button again
    };
    $scope.getbasicbrg();
    //$scope.loadModel();
        
});