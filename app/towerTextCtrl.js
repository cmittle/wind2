app.controller('towerTextCtrl', function ($scope, $uibModal, $filter, $http, $routeParams, $window, $sce) {
    $scope.urlMfg = $scope.towerMfg;
    $scope.urlModel = $scope.towerModel;
    $scope.towerText;
    $scope.towerTextVersion; //pull version from database results, if does not exist start with 1
    $scope.editTowerText = false;
    $scope.tempTowerText;  //temp hold tower text
    $scope.towerTextExists = false;
    $scope.textLoaded;
    $scope.role;
    $scope.tuid; //tower unique ID ie GE 1.5MW is different from Acciona 1.5MW

    //This gets
    $scope.getTower = function(tuid) {
        $scope.textLoaded = false;
        //console.log("here is the make and model");
        //console.log($scope.urlMfg);
        //console.log($scope.urlModel);
    	$http
    	   .get('api/v1/towerText.php', {
    	      params: {
	    	          tuid: tuid  //tuid from URL only requests results from table that are used in that tower
    	          }
    	   }).then(function successCallback(results) { //succesful HTTP response 
    	   	$scope.textLoaded = true;
            	//NEED to either catch if value is blank on client side or server side.
            	if (results.data.length >0) { //if no results are returned dont try to set variable as it will error out.
	            	$scope.towerText = results.data[0].text;  //because results from towerText.php are sorted in desc order position[0] will be newest version
	            	$scope.towerTextVersion = results.data[0].version;  //because results from towerText.php are sorted in desc order position[0] will be newest version
            	} else { //if no results are returned show error in console
            		console.log("towerText.php returned no results");
            		$scope.towerTextVersion = 0; //if no text exists lets start at 0, so increment during post will make first version 1 for each new text
            	};
            	
        }, function errorCallback(data) { //need 400 series header returned to engage error callback
            alert("failed!" + data.data.message);  //display alert box saying the eror recieved from the server
	    console.log("$http.get in towerTextCtrl.js $scope.gettower function recieved an error");
	    console.log(data); //show data returned from server about error
	  });
    };
    $scope.tinymceOptions = {
	    onChange: function(e) {
	      // put logic here for keypress and cut/paste changes
	    },
	    //inline: false,
	    plugins : 'advlist autolink link image lists charmap print preview code autoresize table wordcount noneditable visualchars',
	    browser_spellcheck: 'true',
	    //noneditable_noneditable_class: "mceNonEditable",
	    skin: 'lightgray',
	    theme : 'modern'
    };

    $scope.hideEditor = function() {
    	$scope.editTowerText = !$scope.editTowerText;
    	$scope.tempTowerText = $scope.towerText; //temporarily store tower text here in case the user cancels then I can restore
    };
    
    $scope.saveText = function () {
    //should add if statement before to see if towerText is to long before proceeding.
	    if ($scope.towerText.length <= 3000) {
	    	$scope.editTowerText = false;
    		$scope.towerTextVersion ++;  //increment version # before saving to server
	    	$http({
	                method: 'POST',
	                url: 'api/v1/towerTextEdit.php',
	                params: {tuid: $scope.tuid, text: $scope.towerText, version: $scope.towerTextVersion}
	            }).then(function (data) {
	                $scope.tempTowerText = null; //clear temp storage if successful
	                if (data.data.status != "success") {
	                	console.log("PHP code problem on this attempt!");
	                	alert("There was a problem saving this data to the server");
	                };
	            }) .catch(function (data) {
	                console.log(data.data);
	                console.log("FAILED $scope.saveText() in towerTextCtrl $http post failed.");
	            });
	        } else {
	        	alert("Too many characters in tower text.  Current limit is 3000");
	        }; 
    };
    
    $scope.cancelEditText = function () {
    	console.log("Do something to put original data back here after cancelled");
    	$scope.editTowerText = false;
    	$scope.towerText = $scope.tempTowerText;  //restore original text if cancelled
    	$scope.tempTowerText = null;
    };

    //this flags any html fed to it as trusted.
    $scope.getHtml = function(html){
        return $sce.trustAsHtml(html);
    };
    
    $scope.getTuid = function () {
    	//console.log("mfg uid number");
        //console.log($scope.urlMfg);
        //console.log($scope.urlModel);
    	$http
    	   .get('api/v1/getTuid.php', {
    	      params: {
    	          mfg: $scope.urlMfg,  //mfg name from url of tower
    	          model: $scope.urlModel //model of the tower
    	          }
    	   }).then(function successCallback(results) { //succesful HTTP response 
    	   	//$scope.textLoaded = true;
            	//NEED to either catch if value is blank on client side or server side.
            	if (results.data.length >0) { //if no results are returned dont try to set variable as it will error out.
	            	$scope.tuid = results.data[0].uid; //put tuid (tower unique id) into variable, this will be used to load tower text
	            	$scope.getTower($scope.tuid);
            	} else { //if no results are returned show error in console
            		console.log("getTuid.php returned no results");//I should not get blank...
            	};
            	
        }, function errorCallback(data) { //need 400 series header returned to engage error callback
            alert("failed!" + data.data.message);  //display alert box saying the eror recieved from the server
	    console.log("$http.get in towerTextCtrl.js $scope.getTuid function recieved an error");
	    console.log(data); //show data returned from server about error
	  });
    };

    //an initialization function so that getTower can be a separate function and called each time as necessary
    $scope.init = function () {
        //this runs the initial gb basic query when the page is loaded so I can populate the pulldown menu
        //console.log("gearboxSealssCtrl.js works");
        //console.log("scope.gbxModel  = ");
        //console.log($scope.gbxModel);
        $scope.getTuid(); //get towermfg number first
        //$scope.getTower();
        $scope.role = $window.sessionStorage.role == 'MOTU';

    };
   
    //call init function at bottom to run initalization after everything is declared
    //this initializes the display when the page is loaded
    $scope.init();

});