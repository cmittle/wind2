app.controller('gearboxSpecificsCtrl2', function ($scope, $modal, $filter, $http, Data) {
    $scope.product = {};
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
		            //gearbox id number to be displayed on this page pass this variable to php file so our query only returns appropriate results
		            //rather than filtering after we get all results
		            //gbid: $scope.gb_id
		            gbid: $scope.gb_id.id
		            //gbid: $scope.concatGbArray.id
		            }
		        
		     })
		     .success(function (data) {
		          $scope.products = data;
		          console.log("gb specifics");
		          //console.log($scope.concatGbArray.id);
		          //console.log(data);
		          //console.log("gb_id:");
		          //console.log($scope.gb_id);
		          //console.log("gb_id.id:" + $scope.gb_id.id + " d " + $scope.gb_id.name);
		          //console.log($scope.gb_id.id);
		          //console.log($scope.concatGbArray);
		          //console.log($scope.gb_id.model);
		          //console.log($scope.gb_id.id);
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
		          console.log(data[0]);
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
		//this runs the initial gb specifics query when the page is loaded
		
		//DO NOT run this function on init().  as gb_id.id is not valid until selected from the pulldown menu
		//TODO fix this so when page is initiaated it either loads all, or loads only a particular gearbox
		//$scope.getgb();
		
	};
   /* 
    $scope.deleteProduct = function(product){
        if(confirm("Are you sure to remove the product")){
            Data.delete("products/"+product.id).then(function(result){
                $scope.products = _.without($scope.products, _.findWhere($scope.products, {id:product.id}));
            });
        }
    };*/
    /*
    $scope.open = function (p,size) {
    	console.log("scope.open");
        var modalInstance = $modal.open({
          templateUrl: 'partials/gearbox_specifics_edit.html',
          controller: 'gearboxSpecificsEditCtrl',
          size: size,
          resolve: {
            item: function () {
              return p;
            }
          }
        });
        modalInstance.result.then(function(selectedObject) {
            if(selectedObject.save == "insert"){
                $scope.products.push(selectedObject);
                $scope.products = $filter('orderBy')($scope.products, 'id', 'reverse');
                //$scope.products = $filter('orderBy')($scope.products, 'id', 'reverse');
            }else if(selectedObject.save == "update"){
                p.description = selectedObject.description;
                p.price = selectedObject.price;
                p.stock = selectedObject.stock;
                p.packing = selectedObject.packing;
            }
        });
    };*/
    
    
    /*  OLD VERSION OF OPEN command
    $scope.open = function (p,size) {
        var modalInstance = $modal.open({
          templateUrl: 'partials/productEdit.html',
          controller: 'productEditCtrl',
          //controller: 'bearingSpecificsEditCtrl',
          size: size,
          resolve: {
            item: function () {
              return p;
            }
          }
        });
        modalInstance.result.then(function(selectedObject) {
            if(selectedObject.save == "insert"){
                $scope.products.push(selectedObject);
                $scope.products = $filter('orderBy')($scope.products, 'id', 'reverse');
            }else if(selectedObject.save == "update"){
                p.description = selectedObject.description;
                p.price = selectedObject.price;
                p.stock = selectedObject.stock;
                p.packing = selectedObject.packing;
            }
        });
    };
    */
    
    
 $scope.columns = [ 
                    {text:"ID",predicate:"id",sortable:true},
                    {text:"GB ID",predicate:"gb_id",sortable:true},
                    {text:"Pos ID",predicate:"pos_id",sortable:true},
                    {text:"Position",predicate:"position",sortable:true,},
                    {text:"Brg Basic ID",predicate:"bearing_basic_id",sortable:true},
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

/*
app.controller('gearboxSpecificsEditCtrl', function ($scope, $modalInstance, item, Data) {

  $scope.product = angular.copy(item);
        
        $scope.cancel = function () {
            $modalInstance.dismiss('Close');
        };
        $scope.title = (item.id > 0) ? 'Edit Product' : 'Add Product';
        $scope.buttonText = (item.id > 0) ? 'Update Product' : 'Add New Product';

        var original = item;
        $scope.isClean = function() {
            return angular.equals(original, $scope.product);
        }
        $scope.saveProduct = function (product) {
            product.uid = $scope.uid;
            //window.alert("Clicked1 ");
            console.log("save button clicked");
            if(product.specific_id > 0){ // this is true if this editing a current product
                window.alert("Clicked 2 ");
                Data.put('gearbox_specifics/'+product.specific_id, product).then(function (result) {
                    if(result.status != 'error'){
                    //window.alert("Clicked 3 ");
                        var x = angular.copy(product);
                        x.save = 'update';
                        $modalInstance.close(x);
                    }else{
                    	//window.alert("Clicked 4");
                        console.log(result);
                    }
                    //window.alert("Clicked 5 " + specific_id);
                });
            }else{  //this is where it goes for a new product
            	//window.alert("Clicked 6");
            	console.log(product);
                //product.status = 'Active';
                Data.post('gearbox_specifics', product).then(function (result) {
                    if(result.status != 'error'){
                    	//window.alert("Clicked 7");
                        var x = angular.copy(product);
                        x.save = 'insert';
                        x.id = result.data;
                        $modalInstance.close(x);
                    }else{
                    	//window.alert("Clicked 8" + result);
                        console.log("Data.post - else");
                        console.log(result);
                    }
                });
            }
        };
});*/

/* OLD VERSION EDIT CONTROLLER
app.controller('productEditCtrl', function ($scope, $modalInstance, item, Data) {

  $scope.product = angular.copy(item);
        
        $scope.cancel = function () {
            $modalInstance.dismiss('Close');
        };
        $scope.title = (item.id > 0) ? 'Edit Product' : 'Add Product';
        $scope.buttonText = (item.id > 0) ? 'Update Product' : 'Add New Product';

        var original = item;
        $scope.isClean = function() {
            return angular.equals(original, $scope.product);
        }
        $scope.saveProduct = function (product) {
            product.uid = $scope.uid;
            if(product.id > 0){
                Data.put('products/'+product.id, product).then(function (result) {
                    if(result.status != 'error'){
                        var x = angular.copy(product);
                        x.save = 'update';
                        $modalInstance.close(x);
                    }else{
                        console.log(result);
                    }
                });
            }else{
                product.status = 'Active';
                Data.post('products', product).then(function (result) {
                    if(result.status != 'error'){
                        var x = angular.copy(product);
                        x.save = 'insert';
                        x.id = result.data;
                        $modalInstance.close(x);
                    }else{
                        console.log(result);
                    }
                });
            }
        };
});*/
/*
app.controller('gearboxSpecificsShortCtrl', function ($scope, $modal, $filter, Data) {
    $scope.product = {};
    Data.get('gearbox_specifics').then(function(data){
    	//	This requests the query '/gearbox_specifics' as declared in index.php
        console.log("data-get");
        console.log(data);
        $scope.products = data.data;
        console.log($scope.products);
    });
   
    
    
    //  change table reference above and in index.php
    
   /* $scope.changeProductStatus = function(product){
        product.status = (product.status=="Active" ? "Inactive" : "Active");
        Data.put("products/"+product.id,{status:product.status});
    };
    $scope.deleteProduct = function(product){
        if(confirm("Are you sure to remove the product")){
            Data.delete("products/"+product.id).then(function(result){
                $scope.products = _.without($scope.products, _.findWhere($scope.products, {id:product.id}));
            });
        }
    };
    
    $scope.open = function (p,size) {
    	console.log("scope.open");
    	console.log(p);
        var modalInstance = $modal.open({
          templateUrl: 'partials/gearbox_specifics_edit.html',
          controller: 'gearboxSpecificsEditCtrl',
          size: size,
          resolve: {
            item: function () {
              return p;
            }
          }
        });
        modalInstance.result.then(function(selectedObject) {
        	console.log("modal instance");
            if(selectedObject.save == "insert"){
                $scope.products.push(selectedObject);
                $scope.products = $filter('orderBy')($scope.products, 'id', 'reverse');
                //$scope.products = $filter('orderBy')($scope.products, 'id', 'reverse');
            }else if(selectedObject.save == "update"){
                p.description = selectedObject.description;
                p.price = selectedObject.price;
                p.stock = selectedObject.stock;
                p.packing = selectedObject.packing;
            }
        });
    };
    

    
    
 $scope.columns = [ 
                    
                    {text:"GB ID",predicate:"gb_id",sortable:true},
                    
                    {text:"Position",predicate:"position",sortable:true,},
                    {text:"Brg Basic PN",predicate:"bearing_basic_pn",sortable:true},
                    {text:"Rec Clearance",predicate:"rec_clearance",sortable:true},
                    {text:"Qty/GB",predicate:"qty_per_gb",sortable:true},
                    {text:"Notes",predicate:"notes",sortable:true},
                    {text:"Action",predicate:"",sortable:false}
                ];

});*/