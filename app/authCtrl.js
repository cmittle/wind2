app.controller('authCtrl', function ($scope, $rootScope, $routeParams, $location, $http, Data) {
    //initially set those objects to null to avoid undefined error
    $scope.login = {};
    $scope.signup = {};
    
    $scope.doLogin = function (customer) {
        console.log("customer:");
        console.log(customer);
        $http.post('api/v1/authentication.php', {
//        Data.post('login', {
            //customer: customer
            email: customer.email,
            password: customer.password
        }).then(function (results) {
           // Data.toast(results);
            if (results.status == "success") {
                //$location.path('dashboard');
                console.log("I am HERE");
            }
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