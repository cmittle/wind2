var app = angular.module('myApp', ['ngRoute', 'ui.bootstrap', 'ngAnimate']);
//(function (angular) {
//    angular.module('myApp', ['ngRoute', 'ui.bootstrap', 'ngAnimate'])

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider
    
    .when('/', {
      title: 'Home Page',
      templateUrl: 'partials/home.html',
      controller: 'homePageCtrl'
    })
    //This is the beginning of the login page implementation
    .when('/login', {
      title: 'Login',
      templateUrl: 'partials/login.html',
      controller: 'authCtrl'  //need to import in index.html when ready
    })
    .when('/bearing_specifics', {
      title: 'Bearings Specifics',
      /*templateUrl: 'partials/products.html',*/
      templateUrl: 'partials/bearing_specifics.html',
      controller: 'bearingSpecificsCtrl'
      /*controller: 'productsCtrl2'*/
    })
    .when('/bearing_basic', {
      title: 'Bearing Basic Page',
      templateUrl: 'partials/bearing_basic.html',
      controller: 'bearingBasicCtrl'
      /*controller: 'productsCtrl2'*/
    })
    .when('/gearbox_specifics', {
      title: 'Gearbox Specifics Page',
      templateUrl: 'partials/gearbox_specifics.html',
      // Dont forget to add a comma "," when you uncomment the controller.
      controller: 'gearboxSpecificsCtrl2'
    })
    .when('/gearbox_specifics2', {
      title: 'Gearbox Specifics2 Page -Remap Database interface',
      templateUrl: 'partials/gearbox_specifics2.html',
      controller: 'gearboxSpecificsCtrl2'//,
      //init: 'getgb()'
    })
    .when('/gearbox_specifics_short', {
      title: 'Gearbox Specifics Page',
      templateUrl: 'partials/gearbox_specifics_short.html',
      // Dont forget to add a comma "," when you uncomment the controller.
      controller: 'gearboxSpecificsShortCtrl'
      //controller: 'gearboxSpecificsCtrl2'
    })
    .when('/gearbox_basic', {
      title: 'Gearbox Basic Page',
      templateUrl: 'partials/gearbox_basic.html',
      controller: 'gearboxBasicCtrl'
    })
    //This is the dynamic gearbox mfg / model page loader
    .when('/gearbox/:mfg/:model', {
      templateUrl: 'partials/gearbox_specifics2.html',
      controller: 'gearboxSpecificsCtrl2'
      //title: 'Gearbox model xx',
      //controller: 'testRouteCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });;
}]);
//    }(window.angular));