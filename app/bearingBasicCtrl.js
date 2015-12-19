app.controller('bearingBasicCtrl', function ($scope, $modal, $filter, $http, Data) {
    $scope.product = {};
    $scope.showActions = true; //hide edit/delete/copy actions column by default
    
    
    $scope.populateBearingList = function () {
    	//wrap this in a function so it can be called at any time
	    Data.get('bearing_basic').then(function(data){
	    	//	This requests the query '/bearing_basic' as declared in index.php
	        $scope.products = data.data;
	        //console.log($scope.products);
	    });
    };
    
    //TODO This was working in Bearing SPecifics when I copied it I just need to modify for Bearing Basic
    $scope.open = function (p,size) {
        var modalInstance = $modal.open({
          templateUrl: 'partials/bearingBasicEdit.html',
          controller: 'bearingBasicEditCtrl',
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
    
    
    $scope.deleteProduct = function(product){
        if(confirm("Are you sure to remove basic bearing:" + "\n ID: \t" + product.basic_id + "\n Type:\t" + product.type + "\n Construction:\t" + product.construction + "\n Base part number: \t" + product.base_pn)){
            console.log("delete product = ");
            console.log(product);
            $http({
                    method: 'GET',
                    url: 'api/v1/delete.php',
                    params: {type: 'delete', t: 'bb', id: product.basic_id}
             }).then(function (data) {
        	//there is probably a better way to update what is on the screen, but this works.  The only downside I can see of this method is bandwidth
	            $scope.populateBearingList();  //update data on screen
            }) .catch(function (data) {
                console.log(data.data);
                console.log("Delete item FAILED, $scope.deleteProduct, bearingbasicCtrl.js");
            });
                        //original delete code..
                        //Data.delete("products/"+product.id).then(function(result){
                        //    $scope.products = _.without($scope.products, _.findWhere($scope.products, {id:product.id}));
                        //});
        } else {
        	console.log("Else loop, $scope.deleteProduct, bearingbasicCtrl.js");
        }
    };
    
 $scope.columns = [ 
                    {text:"Basic ID",predicate:"basic_id",sortable:true},
                    {text:"Type",predicate:"type",sortable:true},
                    {text:"Construction",predicate:"construction",sortable:true},
                    {text:"Base PN",predicate:"base_pn",sortable:true}//,
//                    {text:"Action",predicate:"",sortable:false}
                ];


	//functions to run when initialized
	$scope.populateBearingList(); 

});



app.controller('bearingBasicEditCtrl', function ($scope, $modalInstance, item, Data) {

  $scope.product = angular.copy(item);
  $scope.submitted = false;
        
        $scope.cancel = function () {
            $modalInstance.dismiss('Close');
        };
        $scope.title = (item.basic_id > 0) ? 'Edit Product' : 'Add Product';
        $scope.buttonText = (item.basic_id > 0) ? 'Update Product' : 'Add New Product';
        //$scope.buttonText = (item.id > 0) ? 'Update Product' : 'Add New Product';

        var original = item;
        $scope.isClean = function() {
            return angular.equals(original, $scope.product);
        }
        $scope.saveProduct = function (product) {
            product.uid = $scope.uid;
            $scope.submitted = true; //this sets this to true so that the submit button can be turned in to a loading icon while this process to prevent duplicate submissions
            if(product.basic_id > 0){ // this is true if this editing a current product
                Data.put('bearing_basic/'+product.basic_id, product).then(function (result) {
                    if(result.status != 'error'){
                        var x = angular.copy(product);
                        x.save = 'update';
                        $scope.submitted = false; //set back to false to show submit button again
                        $modalInstance.close(x);
                    }else{
                    	window.alert("Clicked 4");
                        console.log(result);
                    }
                });
            }else{  //this is where it goes for a new product
            	//window.alert("Clicked 6");
            	//console.log(product);
                //product.status = 'Active';
                $scope.showSubmitButton = false;
                Data.post('bearing_basic', product).then(function (result) {
                    if(result.status != 'error'){
                    	//window.alert("Clicked 7");
                        var x = angular.copy(product);
                        x.save = 'insert';
                        x.id = result.data;
                        $scope.submitted = false; //set back to false to show submit button again
                        $modalInstance.close(x);
                    }else{
                    	window.alert("Clicked 8" + result);
                        console.log(result);
                    }
                });
            }
            
            //$scope.submitted = false; //set back to false to show submit button again
        };
}); 

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