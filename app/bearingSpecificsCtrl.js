app.controller('bearingSpecificsCtrl', function ($scope, $modal, $filter, $http, Data) {
    $scope.product = {};
    $scope.showActions = true; //hide edit/delete/copy actions column by default
    
/*    $scope.populateBearingList = function () {
    	//wrap this in a function so it can be called at any time
	    Data.get('bearing_specifics').then(function(data){
	    	//	This requests the query '/bearing_specifics' as declared in index.php
	        $scope.products = data.data;
	        //console.log("bearingSpecificsCtrl.js populateBearingList()");
	    });
    };*/
    
    $scope.populateBearingList = function () {
             $http({
                    method: 'GET',
                    url: 'api/v1/bearingSpecifics.php'
             })
             .then(function (data) {
                  //$scope.bearingSpecifics = $scope.bearingSpecifics.concat(data);
                  $scope.products = data.data;
             });
    };
    
    
    
    
    
    $scope.open = function (p,size) {
    	console.log("scope.open from brg spec ctrl");
    	console.log(p);
    	console.log($scope.product.bearing_basic_id);
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
            }else if(selectedObject.save == "update"){
                p.bearing_basic_id = selectedObject.bearing_basic_id;  //this block updates the view so I dont need to request the entire data set again.
                p.specific_pn = selectedObject.specific_pn;
                p.clearance = selectedObject.clearance;
                p.mfg = selectedObject.mfg;
                p.id = selectedObject.id;
                p.od = selectedObject.od;
                p.width = selectedObject.width;
                p.cage = selectedObject.cage;
                p.inner_ring = selectedObject.inner_ring;
                p.outer_ring = selectedObject.outer_ring;
                p.rollers = selectedObject.rollers;
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
        if(confirm("Are you sure to remove: \n Specific PN:\t" + product.specific_pn +  "\n Specific ID: \t" + product.specific_id + "\n Bearing basic ID:\t" + product.bearing_basic_id + "\n Notes: \t" + product.notes)){
            console.log("delete product = ");
            console.log(product);
            $http({
                    method: 'GET',
                    url: 'api/v1/delete.php',
                    params: {type: 'delete', t: 'bs', id: product.specific_id}
             }).then(function (data) {
        	//there is probably a better way to update what is on the screen, but this works.  The only downside I can see of this method is bandwidth
	            $scope.populateBearingList();  //update data on screen
            }) .catch(function (data) {
                console.log(data.data);
                console.log("Delete item FAILED, $scope.deleteProduct, bearingSpecificsCtrl.js");
            });
                        //original delete code..
                        //Data.delete("products/"+product.id).then(function(result){
                        //    $scope.products = _.without($scope.products, _.findWhere($scope.products, {id:product.id}));
                        //});
        } else {
        	console.log("Else loop, $scope.deleteProduct, bearingSpecificsCtrl.js");
        }
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
                    {text:"Notes",predicate:"notes",sortable:true}//,
//                    {text:"Action",predicate:"",sortable:false}
                ];

	//functions to run when initialized
	$scope.populateBearingList(); 


});


app.controller('bearingSpecificsEditCtrl', function ($scope, $modalInstance, item, $http, Data) {

	console.log("item:::: from bearingSpecificsCtrl.js");
	console.log(item);

  $scope.product = angular.copy(item);
  $scope.basicbrglist;
  $scope.submitted = false;
        
        $scope.getbasicbrg = function () { //this is used to populate the pulldown menu
	        Data.get('bearing_basic').then(function(data){
	        //	This requests the query '/bearing_basic' as declared in index.php
	        $scope.basicbrglist = data.data;
	        console.log("bearing specifics edit controller basic brg list = ");
	        console.log($scope.basicbrglist);
	        });
	    };
        
        
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
        
        
        //This runs when the modal is initiated
        $scope.getbasicbrg();
});