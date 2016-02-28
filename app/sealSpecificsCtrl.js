app.controller('sealSpecificsCtrl', function ($scope, $uibModal, $filter, $http) {
    $scope.product = {};
    $scope.showActions = true; //hide edit/delete/copy actions column by default

    
    $scope.populateSealList = function () {
             $http({
                    method: 'GET',
                    url: 'api/v1/sealSpecifics.php'
             })
             .then(function (result) {
                  //$scope.bearingSpecifics = $scope.bearingSpecifics.concat(result);
                  $scope.products = result.data;
             });
    };
    
    
    $scope.open = function (p,size) {
    	console.log("scope.open from seal spec ctrl");
    	console.log(p);
    	console.log($scope.product.seal_basic_id);
        var modalInstance = $uibModal.open({
          templateUrl: 'partials/seal_specifics_edit.html',
          controller: 'sealSpecificsEditCtrl',
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
                p.seal_basic_id = selectedObject.seal_basic_id;  //this block updates the view so I dont need to request the entire data set again.
                p.specific_pn = selectedObject.specific_pn;
                p.material = selectedObject.material;
                p.mfg = selectedObject.mfg;
                p.inner_dia = selectedObject.inner_dia;
                p.outer_dia = selectedObject.outer_dia;
                p.width = selectedObject.width;
                p.profile = selectedObject.profile;
                p.split = selectedObject.split;
                p.notes = selectedObject.notes;
            }
        });
    };
    
    $scope.copyProduct = function (p) {
    //copy current product, nullify specific_id field, then send to save.  This will make save treat as new addition to the database but modal will be preloaded with data from copied part
        $scope.tempProduct = p;
        $scope.tempProduct.specific_id = null;
        $scope.open($scope.tempProduct); 
    };
    
    
    
    $scope.deleteProduct = function(product){
        if(confirm("Are you sure to remove: \n Specific PN:\t" + product.specific_pn +  "\n Specific ID: \t" + product.uid + "\n Seal basic ID:\t" + product.seal_basic_id + "\n Notes: \t" + product.notes)){
            $http({
                    method: 'GET',
                    url: 'api/v1/delete.php',
                    params: {type: 'delete', t: 'ss', id: product.uid}
             }).then(function (result) {
        	//there is probably a better way to update what is on the screen, but this works.  The only downside I can see of this method is bandwidth
	            $scope.populateSealList();  //update data on screen
            }) .catch(function (result) {
                console.log(result.data);
                console.log("Delete item FAILED, $scope.deleteProduct, SealSpecificsCtrl.js");
            });
        } else {
        	console.log("Else loop, $scope.deleteProduct, SealSpecificsCtrl.js");
        }
    };
    
 $scope.columns = [ 
                    {text:"Seal Basic ID",predicate:"bearing_basic_id",sortable:true},
                    {text:"Specific ID",predicate:"specific_id",sortable:true,dataType:"number"},
                    {text:"Specific PN",predicate:"specific_pn",sortable:true},
                    {text:"MFG",predicate:"mfg",sortable:true},
                    {text:"ID",predicate:"id",sortable:true},
                    {text:"OD",predicate:"od",sortable:true},
                    {text:"Width",predicate:"width",sortable:true},
                    {text:"Material",predicate:"material",reverse:true,sortable:true},
                    {text:"Profile",predicate:"profile",sortable:true},
                    {text:"Split",predicate:"split",sortable:true},
                    {text:"Notes",predicate:"notes",sortable:true}//
                ];

	//functions to run when initialized
	$scope.populateSealList(); 


});


app.controller('sealSpecificsEditCtrl', function ($scope, $uibModalInstance, item, $http) {

  $scope.product = angular.copy(item);
  $scope.basicSealList;
  $scope.submitted = false;
        
        $scope.getBasicSeal = function () { //this is used to populate the pulldown menu
	        $http
	    	   .get('api/v1/sealBasic.php', {
	    	      params: {
	    	          }
	    	   }).then(function successCallback(results) { //succesful HTTP response 
	            	//this is the list of generic bearing part numbers with positions and display sequence etc... for this gearbox (gbid sent in GET parameters)
	            	$scope.basicSealList = results.data;
	        }, function errorCallback(result) { //need 400 series header returned to engage error callback
	            $scope.products = '0'; //stops loading icon from spinning on page
		    console.log("$http.get in sealSpecificsCtrl.js $scope.getBasicSeal function recieved an error");
		  });
	    };
        
        
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
            $scope.submitted = true; //this sets this to true so that the submit button can be turned in to a loading icon while this process to prevent duplicate submissions
            if(product.uid > 0){ // this is true if this editing a current product
                $http({
			    method: 'POST',
			    url: 'api/v1/sealSpecificEdit.php',
			    data: product
		     }).then(function (result) {
		        	console.log("positive response");
		          //product.description = $scope.testVar; //update the view after database update is successful
		          var x = angular.copy(product);//copy current product with new information and send back to function that opened modal to update view
		          x.save = 'update';
		          $scope.submitted = false; //set back to false to show submit button again
		          $uibModalInstance.close(x); //close Edit modal when completed
		     }) .catch(function (result) {
		     	console.log(result.data);
		     	console.log("saveProduct if function in seal specifics controller FAILED");
	     	}); 
                
            }else{  //this is where it goes for a new product
            	console.log(product);
            	$http({
			    method: 'POST',
			    url: 'api/v1/sealSpecificEdit.php',
			    data: product
		     }).then(function (result) {
		          var x = angular.copy(product);//copy current product with new information and send back to function that opened modal to update view
		          x.save = 'insert';
                          x.id = result.data;
		          $scope.submitted = false; //set back to false to show submit button again
		          $uibModalInstance.close(x); //close Edit modal when completed
		     }) .catch(function (result) {
		     	console.log("saveProduct else function in seal specifics controller FAILED");
	     	}); 
            }
        };
        
        //This runs when the modal is initiated
        $scope.getBasicSeal();
});