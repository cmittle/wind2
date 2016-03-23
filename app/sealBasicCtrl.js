app.controller('sealBasicCtrl', function ($scope, $uibModal, $filter, $http, $window) {
    $scope.product = {};
    $scope.showActions = true; //hide edit/delete/copy actions column by default
    $scope.role;
    

    //This gets the basic seal list for this gearbox on page load
    $scope.populateSealList = function() {
    	$http
    	   .get('api/v1/sealBasic.php', {
    	      params: {
    	          }
    	   }).then(function successCallback(results) { //succesful HTTP response 
            	//this is the list of generic bearing part numbers with positions and display sequence etc... for this gearbox (gbid sent in GET parameters)
            	$scope.products = results.data;
        }, function errorCallback(results) { //need 400 series header returned to engage error callback
            $scope.products = '0'; //stops loading icon from spinning on page
	    console.log("$http.get in sealBasicCtrl.js $scope.populateSealList function recieved an error");
	  });
    };
    
    
    
    //TODO This was working in Bearing SPecifics when I copied it I just need to modify for Bearing Basic
    $scope.open = function (p,size) {
        var modalInstance = $uibModal.open({
          templateUrl: 'partials/sealBasicEdit.html',
          controller: 'sealBasicEditCtrl',
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
                p.inner_dia = selectedObject.inner_dia;
                p.outer_dia = selectedObject.outer_dia;
                p.width = selectedObject.width;
                p.type = selectedObject.type;
                p.notes = selectedObject.notes;
            }
        });
    };
    
    
    $scope.deleteProduct = function(product){
        if(confirm("Are you sure you want to remove basic seal:" + "\n ID: \t" + product.uid + "\n Inner Dia:\t" + product.inner_dia + "\n Outer Dia:\t" + product.outer_dia + "\n Width: \t" + product.width + "\n Type: \t" + product.type + "\n Notes: \t" + product.notes)){
            $http({
                    method: 'GET',
                    url: 'api/v1/delete.php',
                    params: {type: 'delete', t: 'sb', id: product.uid}
             }).then(function (results) {
        	//there is probably a better way to update what is on the screen, but this works.  The only downside I can see of this method is bandwidth
	            $scope.populateSealList();  //update data on screen
            }) .catch(function (results) {
                console.log("Delete item FAILED, $scope.deleteProduct, sealbasicCtrl.js");
            });
        } else {
        	console.log("Else loop, $scope.deleteProduct, sealbasicCtrl.js");
        }
    };
    
 $scope.columns = [ 
                    {text:"Basic ID",predicate:"uid",sortable:true},
                    {text:"Inner Dia",predicate:"inner_dia",sortable:true},
                    {text:"Outer Dia",predicate:"outer_dia",sortable:true},
                    {text:"Width",predicate:"width",sortable:true},
                    {text:"Type",predicate:"type",sortable:true},
                    {text:"Notes",predicate:"notes",sortable:true}
                ];


	//functions to run when initialized
	$scope.populateSealList(); 
	$scope.role = $window.sessionStorage.role=='MOTU';

});



app.controller('sealBasicEditCtrl', function ($scope, $uibModalInstance, item, $http) {

  $scope.product = angular.copy(item);
  $scope.submitted = false;
        
        $scope.cancel = function () {
            $uibModalInstance.dismiss('Close');
        };
        $scope.title = (item.uid > 0) ? 'Edit Product' : 'Add Product';
        $scope.buttonText = (item.uid > 0) ? 'Update Product' : 'Add New Product';

        var original = item;
        $scope.isClean = function() {
            return angular.equals(original, $scope.product);
        }
        $scope.saveProduct = function (product) {
            //product.uid = $scope.uid;  //NOT SURE WHY this was here.  It breaks functionality
            $scope.product = product;
            $scope.submitted = true; //this sets this to true so that the submit button can be turned in to a loading icon while this process to prevent duplicate submissions
            console.log("product.uid = ");
            console.log(product.uid);
            if(product.uid > 0){ // this is true if this editing a current product
                $http({
			    method: 'POST',
			    url: 'api/v1/sealBasicEdit.php',
			    data: product
		     }).then(function (results) {
		          //product.description = $scope.testVar; //update the view after database update is successful
		          var x = angular.copy(product);//copy current product with new information and send back to function that opened modal to update view
		          x.save = 'update';
		          $scope.submitted = false; //set back to false to show submit button again
		          $uibModalInstance.close(x); //close Edit modal when completed
		          
		          console.log("SUCCESS  $scope.product = ");
		          console.log($scope.product);
		          
		     }) .catch(function (results) {
		     	console.log("save product if in seal basic controller has FAILED");
	     	});
            }else{  //this is where it goes for a new product
                $scope.showSubmitButton = false;
                $http({
			    method: 'POST',
			    url: 'api/v1/sealBasicNew.php',
			    data: product
		     }).then(function (results) {
		          var x = angular.copy(product);//copy current product with new information and send back to function that opened modal to update view
		          x.save = 'update';
		          $scope.submitted = false; //set back to false to show submit button again
		          $uibModalInstance.close(x); //close Edit modal when completed
		     }) .catch(function (results) {
		     	console.log("save product else in seal basic controller has FAILED");
	     	});
            }
        };
}); 