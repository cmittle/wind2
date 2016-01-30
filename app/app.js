var app = angular.module('myApp', ['ngRoute', 'ui.bootstrap', 'ngAnimate', 'textAngular']);  //, 'ngAnimate'
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
      controller: 'bearingSpecificsCtrl',
      resolve:{  //this will at least check that the user has a token before loading the page.  Authentication of the token will have to be done separately
        "check":function($location){   
            if(window.sessionStorage.accessToken != null){   //not sure why but $window doesnt work, but window does...
                //Do something
                //console.log("You Shall Pass");
            }else{
            	window.sessionStorage.targetedLocation = $location.$$path;  //Save target location so after login user can be sent there
                $location.path('/login');    //redirect user to login
                alert("Don't be ridiculous, you need to login before going anywhere");
            }
        }
    }
    })
    .when('/bearing_basic', {
      title: 'Bearing Basic Page',
      templateUrl: 'partials/bearing_basic.html',
      controller: 'bearingBasicCtrl',
      resolve:{  //this will at least check that the user has a token before loading the page.  Authentication of the token will have to be done separately
        "check":function($location){   
            if(window.sessionStorage.accessToken != null){   //not sure why but $window doesnt work, but window does...
                //Do something
                //console.log("You Shall Pass");
            }else{
            	window.sessionStorage.targetedLocation = $location.$$path;  //Save target location so after login user can be sent there
                $location.path('/login');    //redirect user to login
                alert("Don't be ridiculous, you need to login before going anywhere");
            }
        }
    }
    })
    .when('/gearbox_specifics', {
      title: 'Gearbox Specifics Page',
      templateUrl: 'partials/gearbox_specifics.html',
      // Dont forget to add a comma "," when you uncomment the controller.
      controller: 'gearboxSpecificsCtrl2',  //may need to go back to old controller.
      resolve:{  //this will at least check that the user has a token before loading the page.  Authentication of the token will have to be done separately
        "check":function($location){   
            if(window.sessionStorage.accessToken != null){   //not sure why but $window doesnt work, but window does...
                //Do something
                //console.log("You Shall Pass");
            }else{
            	window.sessionStorage.targetedLocation = $location.$$path;  //Save target location so after login user can be sent there
                $location.path('/login');    //redirect user to login
                alert("Don't be ridiculous, you need to login before going anywhere");
            }
        }
    }
    })
    .when('/gearbox_specifics2', {
      title: 'Gearbox Specifics2 Page -Remap Database interface',
      templateUrl: 'partials/gearbox_specifics2.html',
      controller: 'gearboxSpecificsCtrl2' ,
      resolve:{  //this will at least check that the user has a token before loading the page.  Authentication of the token will have to be done separately
        "check":function($location){   
            if(window.sessionStorage.accessToken != null){   //not sure why but $window doesnt work, but window does...
                //Do something
                //console.log("You Shall Pass");
            }else{
            	window.sessionStorage.targetedLocation = $location.$$path;  //Save target location so after login user can be sent there
                $location.path('/login');    //redirect user to login
                alert("Don't be ridiculous, you need to login before going anywhere");
            }
        }
    }
    })
    .when('/gearbox_specifics_short', {
      title: 'Gearbox Specifics Page',
      templateUrl: 'partials/gearbox_specifics_short.html',
      // Dont forget to add a comma "," when you uncomment the controller.
      controller: 'gearboxSpecificsShortCtrl',
      resolve:{  //this will at least check that the user has a token before loading the page.  Authentication of the token will have to be done separately
        "check":function($location){   
            if(window.sessionStorage.accessToken != null){   //not sure why but $window doesnt work, but window does...
                //Do something
                //console.log("You Shall Pass");
            }else{
                console.log($location);
                window.sessionStorage.targetedLocation = $location.$$path;  //Save target location so after login user can be sent there
                $location.path('/login');    //redirect user to login
                alert("Don't be ridiculous, you need to login before going anywhere");
            }
        }
    }
    })
    .when('/gearbox_basic', {
      title: 'Gearbox Basic Page',
      templateUrl: 'partials/gearbox_basic.html',
      controller: 'gearboxBasicCtrl',
      resolve:{  //this will at least check that the user has a token before loading the page.  Authentication of the token will have to be done separately
        "check":function($location){   
            if(window.sessionStorage.accessToken != null){   //not sure why but $window doesnt work, but window does...
                //Do something
                //console.log("You Shall Pass");
            }else{
            	window.sessionStorage.targetedLocation = $location.$$path;  //Save target location so after login user can be sent there
                $location.path('/login');    //redirect user to login
                alert("Don't be ridiculous, you need to login before going anywhere");
            }
        }
    }
    })
    .when('/seal_basic', {
      title: 'Seal Basic Page',
      templateUrl: 'partials/seal_basic.html',
      controller: 'sealBasicCtrl',
      resolve:{  //this will at least check that the user has a token before loading the page.  Authentication of the token will have to be done separately
        "check":function($location){   
            if(window.sessionStorage.accessToken != null){   //not sure why but $window doesnt work, but window does...
                //Do something
                //console.log("You Shall Pass");
            }else{
            	window.sessionStorage.targetedLocation = $location.$$path;  //Save target location so after login user can be sent there
                $location.path('/login');    //redirect user to login
                alert("Don't be ridiculous, you need to login before going anywhere");
            }
        }
    }
    })
    /*.when('/seal_specifics', {
      title: 'Seal Specifics Page',
      //templateUrl: 'partials/gearbox_basic.html',
      //controller: 'gearboxBasicCtrl',
      resolve:{  //this will at least check that the user has a token before loading the page.  Authentication of the token will have to be done separately
        "check":function($location){   
            if(window.sessionStorage.accessToken != null){   //not sure why but $window doesnt work, but window does...
                //Do something
                //console.log("You Shall Pass");
            }else{
            	window.sessionStorage.targetedLocation = $location.$$path;  //Save target location so after login user can be sent there
                $location.path('/login');    //redirect user to login
                alert("Don't be ridiculous, you need to login before going anywhere");
            }
        }
    }
    })*/
    //This is the dynamic gearbox mfg / model page loader
    .when('/gearbox/:mfg/:model', {
      //templateUrl: 'partials/gearbox_specifics2.html', //old non-directive way of doing this
      templateUrl: 'partials/gearboxComplete.html', //new GearboxComplete html container.  Will turn this into GearboxComplete directive soon , then use template='<gearbox-complete></gearbox-complete>'
      //controller: 'gearboxSpecificsCtrl2',  //old non-directive way of doin this
      controller: 'gearboxCompleteCtrl',
      resolve:{  //this will at least check that the user has a token before loading the page.  Authentication of the token will have to be done separately
        "check":function($location){   
            if(window.sessionStorage.accessToken != null){   //not sure why but $window doesnt work, but window does...
                //Do something
                //console.log("You Shall Pass");
            }else{
            	window.sessionStorage.targetedLocation = $location.$$path;  //Save target location so after login user can be sent there
                $location.path('/login');    //redirect user to login
                alert("Don't be ridiculous, you need to login before going anywhere");
            }
          }
    	}
    })
    .when('/dashboard', {
      title: 'User Dashboard',
      templateUrl: 'partials/dashboard.html',
      // Dont forget to add a comma "," when you uncomment the controller.
      controller: 'authCtrl',
      resolve:{  //this will at least check that the user has a token before loading the page.  Authentication of the token will have to be done separately
        "check":function($location){   
            if(window.sessionStorage.accessToken != null){   //not sure why but $window doesnt work, but window does...
                //Do something
                //console.log("You Shall Pass");
            }else{
            	window.sessionStorage.targetedLocation = $location.$$path;  //Save target location so after login user can be sent there
                $location.path('/login');    //redirect user to login
                alert("Don't be ridiculous, you need to login before going anywhere");
            }
        }
    }
    })
    
    .otherwise({
      redirectTo: '/'
    });;
}]);

/*app.directive("testDirective", function () {
	return function () {
		console.log("HELLO ALL");
	}
});*/


app.factory('authInterceptor', function ($rootScope, $q, $window) {
  return {
    request: function (config) {
      config.headers = config.headers || {};
      if ($window.sessionStorage.accessToken) {
        config.headers.Authorization = 'Bearer ' + $window.sessionStorage.accessToken;
        //console.log(config.headers.Authorization);
      }
      return config;
    },
    response: function (response) {
      if (response.status === 401) {
        // handle the case where the user is not authenticated
      }
      return response || $q.when(response);
    }
  };
});

app.config(function ($httpProvider) {
  $httpProvider.interceptors.push('authInterceptor');
});



//    }(window.angular));