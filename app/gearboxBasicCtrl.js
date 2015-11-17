app.controller('gearboxBasicCtrl', function ($scope, $modal, $filter, Data) {
    $scope.product = {};
    $scope.showActions = true; //hide edit/delete/copy actions column by default
    Data.get('gearbox_basic').then(function(data){
    	//	This requests the query '/gearbox_basic' as declared in index.php
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
    
    //TODO This was working in Bearing SPecifics when I copied it I just need to modify for Bearing Basic
    $scope.open = function (p,size) {
        var modalInstance = $modal.open({
          templateUrl: 'partials/gearbox_basic_edit.html',
          controller: 'gearboxBasicEditCtrl',
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
                    {text:"ID",predicate:"id",sortable:true},
                    {text:"Mfg",predicate:"mfg",sortable:true},
                    {text:"Model",predicate:"model",sortable:true},
                    {text:"Tower",predicate:"tower",sortable:true}//,
                    //{text:"Action",predicate:"",sortable:false}
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



    //TODO This was working in Bearing Basic when I copied it I just need to modify for Gearbox Basic

app.controller('gearboxBasicEditCtrl', function ($scope, $modalInstance, item, Data) {

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
            if(product.specific_id > 0){ // this is true if this editing a current product
                window.alert("Clicked 2 ");
                Data.put('gearbox_basic/'+product.specific_id, product).then(function (result) {
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
                Data.post('gearbox_basic', product).then(function (result) {
                    if(result.status != 'error'){
                    	//window.alert("Clicked 7");
                        var x = angular.copy(product);
                        x.save = 'insert';
                        x.id = result.data;
                        $modalInstance.close(x);
                    }else{
                    	//window.alert("Clicked 8" + result);
                        console.log(result);
                    }
                });
            }
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