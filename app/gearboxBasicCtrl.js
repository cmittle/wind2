app.controller('gearboxBasicCtrl', function ($scope, $uibModal, $filter, $window, Data) {
    $scope.product = {};
    $scope.showActions = false; //hide edit/delete/copy actions column by default
    $scope.role;
    
    Data.get('gearbox_basic').then(function(data){
    	//	This requests the query '/gearbox_basic' as declared in index.php
        $scope.products = data.data;
        //console.log($scope.products);
    });
    
    //TODO This was working in Bearing SPecifics when I copied it I just need to modify for Bearing Basic
    $scope.open = function (p,size) {
        var modalInstance = $uibModal.open({
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
    
 $scope.columns = [ 
                    {text:"ID",predicate:"id",sortable:true},
                    {text:"Mfg",predicate:"mfg",sortable:true},
                    {text:"Model",predicate:"model",sortable:true},
                    {text:"Tower",predicate:"tower",sortable:true}
                ];

//methods to run at initialization
$scope.role = $window.sessionStorage.role=='MOTU';


});



    //TODO This was working in Bearing Basic when I copied it I just need to modify for Gearbox Basic

app.controller('gearboxBasicEditCtrl', function ($scope, $uibModalInstance, item, Data) {

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
            if(product.specific_id > 0){ // this is true if this editing a current product
                window.alert("Clicked 2 ");
                Data.put('gearbox_basic/'+product.specific_id, product).then(function (result) {
                    if(result.status != 'error'){
                        var x = angular.copy(product);
                        x.save = 'update';
                        $uibModalInstance.close(x);
                    }else{
                        console.log(result);
                    }
                });
            }else{  //this is where it goes for a new product
            	console.log(product);
                //product.status = 'Active';
                Data.post('gearbox_basic', product).then(function (result) {
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
});   
