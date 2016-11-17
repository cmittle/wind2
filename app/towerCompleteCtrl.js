app.controller('towerCompleteCtrl', function ($scope, $routeParams) {
    $scope.urlMfg = $routeParams.mfg;  //id number passed in url
    $scope.urlModel = $routeParams.model;  //model number passed in url
    $scope.showText = false;
    $scope.showMain = false;
    $scope.showSeals = true;

    
    $scope.switchShowText = function () {
    	$scope.showText = !$scope.showText;
    };

    $scope.switchShowMain = function () {
    	$scope.showMain = !$scope.showMain;
    };
    
    $scope.switchShowSeals = function () {
    	$scope.showSeals = !$scope.showSeals;
    };
    
});