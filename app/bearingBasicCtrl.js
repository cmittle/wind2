app.controller('bearingBasicCtrl', function ($scope, $uibModal, $filter, $http, $window, Data) {
    $scope.product = {};
    $scope.showActions = false; //hide edit/delete/copy actions column by default
    
    
    $scope.populateBearingList = function () {
    	//wrap this in a function so it can be called at any time
	    Data.get('bearing_basic').then(function(data){
	    	//	This requests the query '/bearing_basic' as declared in index.php
	        $scope.products = data.data;
	    });
    };
    
    //TODO This was working in Bearing SPecifics when I copied it I just need to modify for Bearing Basic
    $scope.open = function (p,size) {
        var modalInstance = $uibModal.open({
          templateUrl: 'partials/bearingBasicEdit.html',
          controller: 'bearingBasicEditCtrl',
          size: size,
          resolve: {
            item: function () {
              return p;
            }
          }
        });
        modalInstance.result.then(function(selectedObject) {//this block updates the view so I dont need to request the entire data set again.
            if(selectedObject.save == "insert"){  //this section adds the new product to the current product array
                $scope.products.push(selectedObject);
                $scope.products = $filter('orderBy')($scope.products, 'id', 'reverse');
            }else if(selectedObject.save == "update"){  //this section modifies the array shown with the changes made
                p.type = selectedObject.type;
                p.construction = selectedObject.construction;
                p.base_pn = selectedObject.base_pn;
            }
        });
    };
    
    
    $scope.deleteProduct = function(product){
        if(confirm("Are you sure to remove basic bearing:" + "\n ID: \t" + product.basic_id + "\n Type:\t" + product.type + "\n Construction:\t" + product.construction + "\n Base part number: \t" + product.base_pn)){
            
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
                        
        } else {
        	console.log("Else loop, $scope.deleteProduct, bearingbasicCtrl.js");
        }
    };
    
 $scope.columns = [ 
                    {text:"Basic ID",predicate:"basic_id",sortable:true},
                    {text:"Type",predicate:"type",sortable:true},
                    {text:"Construction",predicate:"construction",sortable:true},
                    {text:"Base PN",predicate:"base_pn",sortable:true}
                ];


	//functions to run when initialized
	$scope.populateBearingList(); 
	$scope.role = $window.sessionStorage.role=='MOTU';

});



app.controller('bearingBasicEditCtrl', function ($scope, $uibModalInstance, item, $http, Data) {

    $scope.product = angular.copy(item);
    $scope.submitted = false;
        
    $scope.cancel = function () {
        $uibModalInstance.dismiss('Close');
    };
    $scope.title = (item.basic_id > 0) ? 'Edit Product' : 'Add Product';
    $scope.buttonText = (item.basic_id > 0) ? 'Update Product' : 'Add New Product';

    var original = item;
    $scope.isClean = function() {
        return angular.equals(original, $scope.product);
    }
    $scope.saveProduct = function (product) {
        product.uid = $scope.uid;
        $scope.submitted = true; //this sets this to true so that the submit button can be turned in to a loading icon while this process to prevent duplicate submissions
        if(product.basic_id > 0){ // this is true if this editing a current product
            $http({
                    method: 'POST',
                    url: 'api/v1/bearingBasicEdit.php',
                    data: product
                }).then(function (data) {
                    var x = angular.copy(product);//copy current product with new information and send back to function that opened modal to update view
                    x.save = 'update';
                    $scope.submitted = false; //set back to false to show submit button again
                    $uibModalInstance.close(x); //close Edit modal when completed
                }) .catch(function (data) {
                    console.log(data.data);
                    console.log("FAILED save product in bearingBasicCtrl.js");
            });  
        }else{  //this is where it goes for a new product
            $scope.showSubmitButton = false;
            Data.post('bearing_basic', product).then(function (result) {
                if(result.status != 'error'){
                    //window.alert("Clicked 7");
                    var x = angular.copy(product);
                    x.save = 'insert';
                    x.id = result.data;
                    $scope.submitted = false; //set back to false to show submit button again
                    $uibModalInstance.close(x);
                }else{
                    window.alert("Clicked 8" + result);
                    console.log(result);
                }
            });
        }

    };
}); 