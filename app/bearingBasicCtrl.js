app.controller('bearingBasicCtrl', function ($scope, $modal, $filter, Data) {
    $scope.product = {};
    Data.get('bearing_basic').then(function(data){
    	//	This requests the query '/bearing_basic' as declared in index.php
        $scope.products = data.data;
        //console.log($scope.products);
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
                    {text:"Basic ID",predicate:"basic_id",sortable:true},
                    {text:"Type",predicate:"type",sortable:true},
                    {text:"Construction",predicate:"construction",sortable:true},
                    {text:"Base PN",predicate:"base_pn",sortable:true},
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



    //TODO This was working in Bearing SPecifics when I copied it I just need to modify for Bearing Basic

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
            //console.log("submitted = ");
            //console.log($scope.submitted);
            if(product.basic_id > 0){ // this is true if this editing a current product
                //window.alert("Clicked 2 ");
                console.log(product);
                Data.put('bearing_basic/'+product.basic_id, product).then(function (result) {
                    if(result.status != 'error'){
                    //window.alert("Clicked 3 ");
                        var x = angular.copy(product);
                        x.save = 'update';
                        $scope.submitted = false; //set back to false to show submit button again
                        $modalInstance.close(x);
                    }else{
                    	window.alert("Clicked 4");
                        console.log(result);
                    }
                    //window.alert("Clicked 5 " + basic_id);
                });
            }else{  //this is where it goes for a new product
            	//window.alert("Clicked 6");
            	//console.log(product);
                //product.status = 'Active';
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