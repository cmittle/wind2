app.controller('gearboxSpecificsCtrl', function ($scope, $uibModal, $filter, Data) {
    $scope.product = {};
    Data.get('gearbox_specifics').then(function(data){
    	//	This requests the query '/gearbox_specifics' as declared in index.php
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
    };*/
    
    $scope.open = function (p,size) {
    	console.log("scope.open");
        var modalInstance = $uibModal.open({
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
    };
    
    
    /*  OLD VERSION OF OPEN command
    $scope.open = function (p,size) {
        var modalInstance = $uibModal.open({
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
/* $scope.columns = [
                    {text:"ID",predicate:"id",sortable:true,dataType:"number"},
                    {text:"Name",predicate:"name",sortable:true},
                    {text:"Price",predicate:"price",sortable:true},
                    {text:"Stock",predicate:"stock",sortable:true},
                    {text:"Packing",predicate:"packing",reverse:true,sortable:true,dataType:"number"},
                    {text:"Description",predicate:"description",sortable:true},
                    {text:"Status",predicate:"status",sortable:true},
                    {text:"Action",predicate:"",sortable:false}
                ];*/

});


app.controller('gearboxSpecificsEditCtrl', function ($scope, $uibModalInstance, item, Data) {

  $scope.product = angular.copy(item);
        
        $scope.cancel = function () {
            $uibModalInstance.dismiss('Close');
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
                        $uibModalInstance.close(x);
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
                        $uibModalInstance.close(x);
                    }else{
                    	//window.alert("Clicked 8" + result);
                        console.log("Data.post - else");
                        console.log(result);
                    }
                });
            }
        };
});

/* OLD VERSION EDIT CONTROLLER
app.controller('productEditCtrl', function ($scope, $uibModalInstance, item, Data) {

  $scope.product = angular.copy(item);
        
        $scope.cancel = function () {
            $uibModalInstance.dismiss('Close');
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
                        $uibModalInstance.close(x);
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
                        $uibModalInstance.close(x);
                    }else{
                        console.log(result);
                    }
                });
            }
        };
});*/

app.controller('gearboxSpecificsShortCtrl', function ($scope, $uibModal, $filter, Data, $http) {
    $scope.product = {};
    Data.get('gearbox_specifics').then(function(data){
    	//	This requests the query '/gearbox_specifics' as declared in index.php
        console.log("data-get");
        console.log(data);
        $scope.products = data.data;
        //console.log($scope.products);
    });
   
  /*  $scope.getgbbasic = function() {
    	console.log("hello");
		//this gets the list of gearbox names from the gearbox_basic database table to give to the pulldown menu at the top of the page
		$http
			//poing to relative url of query and pass required params/variables.  This information can be used to constrain the query.
		    .get('api/v1/gearboxBasic.php', {
		        params: {
		            //gearbox id number to be displayed on this page pass this variable to php file so our query only returns appropriate results
		            //rather than filtering after we get all results
		            //gbid: $scope.gb_id
		            }
		        
		     })
		     .success(function (data) {
		          $scope.products = data;
		          console.log("gb basic");
		          console.log(data);
		     }); 
	}; */
    
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
    };*/
    
    /*$scope.init = function () {
    	$scope.getgbbasic();
    };*/
    
    $scope.open = function (p,size) {
    	console.log("scope.open");
    	console.log(p);
        var modalInstance = $uibModal.open({
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


//$scope.init();

});