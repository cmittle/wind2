app.controller('gearboxCompleteCtrl', function ($scope, $routeParams) {
    $scope.urlMfg = $routeParams.mfg;  //id number passed in url
    $scope.urlModel = $routeParams.model;  //model number passed in url
    
    console.log("HERE I AM");
    console.log($scope.urlModel);
    });