app.controller('gearboxTextCtrl', function ($scope, $uibModal, $filter, $http, $routeParams, $window, $sce) {
    // DELETE $scope.product = {};  //not sure if this is confused with products or if this is correct.
    $scope.urlMfg = $scope.gbxMfg;  //model number passed in attribute of directive element  //$routeParams.mfg;  //id number passed in url
    $scope.urlModel = $scope.gbxModel; //model number passed in attribute of directive element     //$routeParams.model;  //model number passed in url
    $scope.gearboxText;
    $scope.gearboxTextVersion; //pull version from database results, if does not exist start with 1
    $scope.editGearboxText = false;
    $scope.tempGearboxText;
    $scope.gearboxTextExists = false;
    $scope.textLoaded;

    //This gets the basic seal list for this gearbox on page load
    $scope.getgb = function() {
        $scope.textLoaded = false;
    	$http
    	   .get('api/v1/gearboxText.php', {
    	      params: {
    	          gbid: $scope.urlModel  //gbid from URL only requests results from table that are used in that gearbox
    	          }
    	   }).then(function successCallback(results) { //succesful HTTP response 
    	   	$scope.textLoaded = true;
            	//NEED to either catch if value is blank on client side or server side.  Also only looking for one answer, dont need to leave this open for several answers... unless I do revisions?
            	if (results.data.length >0) { //if no results are returned dont try to set variable as it will error out.
	            	$scope.gearboxText = results.data[0].text;  //because results from gearboxText.php are sorted in desc order position[0] will be newest version
	            	$scope.gearboxTextVersion = results.data[0].version;  //because results from gearboxText.php are sorted in desc order position[0] will be newest version
            	} else { //if no results are returned show error in console
            		console.log("gearboxText.php returned no results");
            		$scope.gearboxTextVersion = 0; //if no text exists lets start at 0, so increment during post will make first version 1 for each new text
            	};
            	
        }, function errorCallback(data) { //need 400 series header returned to engage error callback
            alert(data.data.message);  //display alert box saying the eror recieved from the server
            //$scope.products = '0'; //stops loading icon from spinning on page
	    console.log("$http.get in gearboxTextCtrl.js $scope.getgb function recieved an error");
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
    	$scope.editGearboxText = !$scope.editGearboxText;
    	$scope.tempGearboxText = $scope.gearboxText; //temporarily store gearbox text here in case the user cancels then I can restore
    };
    
    $scope.saveText = function () {
    //should add if statement before to see if gearboxText is to long before proceeding.
	    if ($scope.gearboxText.length <= 3000) {
	    	$scope.editGearboxText = false;
    		$scope.gearboxTextVersion ++;  //increment version # before saving to server
	    	$http({
	                method: 'POST',
	                url: 'api/v1/gearboxTextEdit.php',
	                params: {gbid: $scope.urlModel, text: $scope.gearboxText, version: $scope.gearboxTextVersion}
	            }).then(function (data) {
	                $scope.tempGearboxText = null; //clear temp storage if successful
	                if (data.data.status != "success") {
	                	console.log("PHP code problem on this attempt!");
	                	alert("There was a problem saving this data to the server");
	                };
	            }) .catch(function (data) {
	                console.log(data.data);
	                console.log("FAILED $scope.saveText() in gearboxTextCtrl $http post failed.");
	            });
	        } else {
	        	alert("Too many characters in gearbox text.  Current limit is 3000");
	        }; 
    };
    
    $scope.cancelEditText = function () {
    	console.log("Do something to put original data back here after cancelled");
    	$scope.editGearboxText = false;
    	$scope.gearboxText = $scope.tempGearboxText;  //restore original text if cancelled
    	$scope.tempGearboxText = null;
    };

    //this flags any html fed to it as trusted.
    $scope.getHtml = function(html){
        return $sce.trustAsHtml(html);
    };

    //an initialization function so that getgb can be a separate function and called each time as necessary
    $scope.init = function () {
        //this runs the initial gb basic query when the page is loaded so I can populate the pulldown menu
        //console.log("gearboxSealssCtrl.js works");
        //console.log("scope.gbxModel  = ");
        //console.log($scope.gbxModel);
        $scope.getgb();
        $scope.role = $window.sessionStorage.role=='MOTU';

    };
   
    //call init function at bottom to run initalization after everything is declared
    //this initializes the display when the page is loaded
    $scope.init();

});