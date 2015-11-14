app.controller('bearingSpecificsCtrl', function ($scope, $modal, $filter, Data) {
    $scope.product = {};
    Data.get('bearing_specifics').then(function(data){
    	//	This requests the query '/bearing_specifics' as declared in index.php
        $scope.products = data.data;
    });
    
    $scope.open = function (p,size) {
    	console.log("scope.open");
    	console.log(p);
        var modalInstance = $modal.open({
          templateUrl: 'partials/bearing_specifics_edit.html',
          controller: 'bearingSpecificsEditCtrl',
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
                /*$scope.products = $filter('orderBy')($scope.products, 'id', 'reverse');*/
            }else if(selectedObject.save == "update"){
                p.description = selectedObject.description;
                p.price = selectedObject.price;
                p.stock = selectedObject.stock;
                p.packing = selectedObject.packing;
            }
        });
    };
    
 $scope.columns = [ 
                    {text:"Brg Basic ID",predicate:"bearing_basic_id",sortable:true},
                    {text:"Specific ID",predicate:"specific_id",sortable:true,dataType:"number"},
                    {text:"Specific PN",predicate:"specific_pn",sortable:true},
                    {text:"MFG",predicate:"mfg",sortable:true},
                    {text:"ID",predicate:"id",sortable:true},
                    {text:"OD",predicate:"od",sortable:true},
                    {text:"Width",predicate:"width",sortable:true},
                    {text:"Clearance",predicate:"clearance",reverse:true,sortable:true,dataType:"number"},
                    {text:"Cage",predicate:"cage",sortable:true},
                    {text:"Inner Ring",predicate:"inner_ring",sortable:true},
                    {text:"Outer Ring",predicate:"outer_ring",sortable:true},
                    {text:"Rollers",predicate:"rollers",sortable:true},
                    {text:"Notes",predicate:"notes",sortable:true},
                    {text:"Action",predicate:"",sortable:false}
                ];

});


app.controller('bearingSpecificsEditCtrl', function ($scope, $modalInstance, item, $http, Data) {

  $scope.product = angular.copy(item);
  $scope.submitted = false;
        
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
            $scope.submitted = true; //this sets this to true so that the submit button can be turned in to a loading icon while this process to prevent duplicate submissions
            if(product.specific_id > 0){ // this is true if this editing a current product
                $http({
			    method: 'POST',
			    url: 'api/v1/bearingsEdit.php',
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
                
                
                
                
                /*Data.put('bearing_specifics/'+product.specific_id, product).then(function (result) {
                    if(result.status != 'error'){
                        var x = angular.copy(product);
                        x.save = 'update';
                        $scope.submitted = false; //set back to false to show submit button again
                        $modalInstance.close(x);
                    }else{
                        console.log(result);
                    }
                });*/
            }else{  //this is where it goes for a new product
            	console.log(product);
                //product.status = 'Active';
                Data.post('bearing_specifics', product).then(function (result) {
                    if(result.status != 'error'){
                        var x = angular.copy(product);
                        x.save = 'insert';
                        x.id = result.data;
                        $scope.submitted = false; //set back to false to show submit button again
                        $modalInstance.close(x);
                    }else{
                        console.log(result);
                    }
                });
            }
        };
});