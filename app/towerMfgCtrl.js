app.controller('towerMfgCtrl', function ($scope, $routeParams) {
    $scope.urlMfg = $routeParams.mfg;  //id number passed in url
    //$scope.urlModel = $routeParams.model;  //model number passed in url
    $scope.showText = true;

    
    $scope.switchShowText = function () {
    	$scope.showText = !$scope.showText;
    };

    $scope.switchShowMain = function () {
    	$scope.showMain = !$scope.showMain;
    };
    
});