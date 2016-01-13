app.controller('gearboxCompleteCtrl', function ($scope, $routeParams) {
    $scope.urlMfg = $routeParams.mfg;  //id number passed in url
    $scope.urlModel = $routeParams.model;  //model number passed in url
    $scope.showBearings = false;
    $scope.showseals = false;
    
    $scope.switchShowBearings = function () {
    	$scope.showBearings = !$scope.showBearings;
    };
    
    $scope.switchShowSeals = function () {
    	$scope.showSeals = !$scope.showSeals;
    };
    
    //console.log("HERE I AM");
    console.log($scope.urlModel);
    });