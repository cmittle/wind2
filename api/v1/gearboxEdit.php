<?php


require_once 'config.php'; // Database setting constants [DB_HOST, DB_NAME, DB_USERNAME, DB_PASSWORD]
require_once '.././libs/jwt_helper.php';

	//I got the base of this file from http://www.phpro.org/tutorials/Consume-Json-Results-From-PHP-MySQL-API-With-Angularjs-And-PDO.html
	//this set up the basic db variables, connection, query, prepare statement, execute, fetchAll and json encode
	//I've added to it from other sources as I learn more

	//not sure why I have to do this first but puting these variables directly into the new PDO call below didn't work.
	$dsn = 'mysql:host='.DB_HOST.';dbname='.DB_NAME.';charset=utf8';
	
        // connect to the database
        $db = new PDO($dsn, DB_USERNAME, DB_PASSWORD);
        
	//arrays used for error (blank variable) checking to be returned later
        $errors = array();
   	$data = array();
        
	//json_decode (file_get_contents('php://input') is how I have to handle angular js $http.post requests; not sure what the "true" is for.
	// got this code block from here http://tutsnare.com/post-form-data-using-angularjs/;  Also referenced here http://www.cleverweb.nl/javascript/a-simple-search-with-angularjs-and-php/
	$_POST = json_decode(file_get_contents('php://input'), true);
	//use this to extract variables from json package sent with $http.post request
	$id = $_POST['id']; //database table id
	$bearing_basic_id = $_POST['bearing_basic_id']; //brg basic id e.g. 12
	$bearing_basic_pn = $_POST['bearing_basic_pn']; //br basic pn e.g. NU 2326
	$gb_id = $_POST['gb_id']; //gb id e.g. 1100
	$notes = $_POST['notes']; //notes on line of gb
	$pos_id = $_POST['pos_id']; //positio id used for sorting in display e.g. 110, 120, 130, 140, etc...
	$position = $_POST['position']; //human readable position
	$qty_per_gb = $_POST['qty_per_gb']; //qty per gb e.g. 1, or 3
	$rec_clearance = $_POST['rec_clearance']; //recommended clearance e.g. C0, C3, CNL, etc..
	//$type = $_GET['type'];

	//Check variables to see if they're blank
	if (empty($_POST['id']))
	  $errors['id'] = 'ID is required.';
	
	if (empty($_POST['bearing_basic_id']))
	  $errors['bearing_basic_id'] = 'bearing_basic_id is required.';
	
	if (!empty($errors)) {
	  $data['errors']  = $errors;
	} else {
		//this just returns an array so we can see if everything made it to the server
	  $data['message'] = 'Working so far';
	  $data['bearing_basic_id'] = $bearing_basic_id;
	  $data['bearing_basic_pn'] = $bearing_basic_pn;
	  $data['gb_id'] = $gb_id;
	  $data['notes'] = $notes;
	  $data['position'] = $position;
	  $data['pos_id'] = $pos_id;
	  $data['qty_per_gb'] = $qty_per_gb;
	  $data['rec_clearance'] = $rec_clearance;
	  //$data['type'] = $type;
	}
	// response back.
	echo json_encode($data);  //This just echos what was updated

	//This pulls the header out of the request
    	$authHeader = $_SERVER["HTTP_AUTHORIZATION"];
    	//remove prefix "Bearer " from beginning of this header
    	$token = str_replace('Bearer ', '', $authHeader); //this appears to properly extract the string
	//check token for authorization
    	try {
	    $authPass = JWT::decode($token, SECRET_KEY);
    	} catch (Exception $e) {
    		$response['exception'] = $e->getMessage();
    		$response['status'] = 'failure in bearingSpecifics.php';
    		$response['message'] = 'The server has denied your request for this information. Please login and try again.';
    		header('X-PHP-Response-Code: 401', true, 401); //set header to 401 (unauthorized) if token decode fails
    		echo json_encode($response);
    	}


	if ($authPass != null) {
    		$response['status'] = "success"; // from delete
        	$response['message'] = 'You are approved';
		//update all of these variables
		//Maybe I shouldn't update the gb_id, this would change what gearbox the bearing is listed in.
		$sql = "UPDATE  gearbox_specifics SET  
			position = :position, 
			bearing_basic_id = :bearing_basic_id,
			bearing_basic_pn = :bearing_basic_pn,
			rec_clearance = :rec_clearance,
			qty_per_gb = :qty_per_gb,
			gb_id = :gb_id,
			pos_id = :pos_id,
			notes = :notes		 
			WHERE  id =:id"; 
	
		// use prepared statements, even if not strictly required is good practice; this helps prevent sql injection attacks
		$stmt = $db->prepare( $sql );
	
		//this binds the input variables to php variables
		//I got this information from here http://php.net/manual/en/pdostatement.bindparam.php
		//bindValue instead of bindParam; bindValue binds immediately, where bindParam only evaluates on execute
		$stmt->bindValue(':id', $id, PDO::PARAM_INT);//Bind int variable
		$stmt->bindValue(':bearing_basic_id', $bearing_basic_id, PDO::PARAM_STR); //Bind String variable
		$stmt->bindValue(':bearing_basic_pn', $bearing_basic_pn, PDO::PARAM_STR);//Bind STR variable
		$stmt->bindValue(':gb_id', $gb_id, PDO::PARAM_STR);//Bind str variable
		$stmt->bindValue(':notes', $notes, PDO::PARAM_STR);//Bind str variable
		$stmt->bindValue(':pos_id', $pos_id, PDO::PARAM_STR);//Bind str variable
		$stmt->bindValue(':position', $position, PDO::PARAM_STR);//Bind str variable
		$stmt->bindValue(':qty_per_gb', $qty_per_gb, PDO::PARAM_STR);//Bind str variable
		$stmt->bindValue(':rec_clearance', $rec_clearance, PDO::PARAM_STR);//Bind str variable
	
        	// execute the query
        	$stmt->execute();
	} else {
	//send this back into $results for failure status
	//Not sure if I really need this Else loop any longer... I've moved the failure of token:decode to the try / catch bock above
	//$response['status'] = 'failure in gearbox.php';
        //$response['message'] = 'You are NOT approved';
        //echo json_encode($response);
    } 
        
?>