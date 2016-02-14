app.controller('productsCtrl', function ($scope, $modal, $filter, Data) {
    $scope.product = {};
    Data.get('bearing_specifics').then(function(data){
    	//	This requests the query '/bearing_specifics' as declared in index.php
        $scope.products = data.data;
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
        var modalInstance = $modal.open({
          templateUrl: 'partials/productEdit.html',
          controller: 'productEditCtrl',
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
    };*/
    
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
                    /*{text:"Status",predicate:"status",sortable:true},*/
                    /*{text:"Action",predicate:"",sortable:false}*/
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


/*app.controller('productEditCtrl', function ($scope, $modalInstance, item, Data) {

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