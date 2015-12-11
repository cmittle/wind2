app.controller('authCtrl', function ($scope, $rootScope, $routeParams, $location, $http, $window, Data) {
    //initially set those objects to null to avoid undefined error
    $scope.login = {};
    $scope.signup = {};
    
    $scope.doLogin = function (customer) {
        //console.log("customer:");
        //console.log(customer);
        //when performing another login first wipe previous token
        //$window.sessionStorage.accessToken = 0;
        $http.post('api/v1/authentication.php', {
            email: customer.email,
            password: customer.password
        }).then(function successCallback(results) { //succesful HTTP response now check for successful login/token creation
            if (results.data.status == "success") { //successful login and token retreival
                $window.sessionStorage.accessToken = results.data.token;
                //console.log("I am HERE");
            } else {
            	console.log("authCtrl.js doLogin() php error or login error");
            };
        }, function errorCallback(response) {
	    console.log("authCtrl.js doLogin() HTTP error");
	  });
    };
    
     
/* Original doLogin code    
    $scope.doLogin = function (customer) {
        console.log("customer:");
        console.log(customer);
        Data.post('login', {
            customer: customer
        }).then(function (results) {
            Data.toast(results);
            if (results.status == "success") {
                $location.path('dashboard');
            }
        });
    }; */
    $scope.signup = {email:'',password:'',name:'',phone:'',address:''};
    $scope.signUp = function (customer) {
        Data.post('signUp', {
            customer: customer
        }).then(function (results) {
            Data.toast(results);
            if (results.status == "success") {
                $location.path('dashboard');
            }
        });
    };
    $scope.logout = function () {
        Data.get('logout').then(function (results) {
            Data.toast(results);
            $location.path('login');
        });
    }
});