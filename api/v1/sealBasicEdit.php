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
	$uid = $_POST['uid']; //unique id
	$inner_dia = $_POST['inner_dia']; //inner diameter
	$outer_dia = $_POST['outer_dia']; //outer diameter
	$width = $_POST['width']; //width
	$type = $_POST['type']; //seal type Radial / Axial
	$notes = $_POST['notes']; 

	//This pulls the header out of the request
    	$authHeader = $_SERVER["HTTP_AUTHORIZATION"];
    	//remove prefix "Bearer " from beginning of this header
    	$token = str_replace('Bearer ', '', $authHeader); //this appears to properly extract the string
	//check token for authorization
    	try {
	    $authPass = JWT::decode($token, SECRET_KEY);
    	} catch (Exception $e) {
    		$response['exception'] = $e->getMessage();
    		$response['status'] = 'failure in delete.php';
    		$response['message'] = 'The server has denied your request for this information. Please login and try again.';
    		header('X-PHP-Response-Code: 401', true, 401); //set header to 401 (unauthorized) if token decode fails
    		echo json_encode($response);
    	}

	//**begin empty check block**//
	//Check variables to see if they're blank
	if (!empty($errors)) {
	  $data['errors']  = $errors;
	} else {
		//this just returns an array so we can see if everything made it to the server
	  $data['message'] = 'Working so far';
	  $data['uid'] = $uid;
	  $data['inner_dia'] = $inner_dia;
	  $data['outer_dia'] = $outer_dia;
	  $data['width'] = $width;
	  $data['notes'] = $notes;
	  $data['type'] = $type;
	}
	// response back.
	echo json_encode($data);  //This just echos what was updated 
	//**end empty check block**//

	if ($authPass != null) {
    		$response['status'] = "success"; // from delete
        	$response['message'] = 'You are approved';
		$sql = "UPDATE seal_basic SET 
			inner_dia = :inner_dia,
			outer_dia = :outer_dia,
			width = :width,
			type = :type,
			notes = :notes
			WHERE uid = :uid";	
	
		// use prepared statements, even if not strictly required is good practice; this helps prevent sql injection attacks
		$stmt = $db->prepare( $sql );
		//this binds the input variables to php variables
		$stmt->bindValue(':uid', $uid, PDO::PARAM_INT);//Bind int variable
		$stmt->bindValue(':inner_dia', $inner_dia, PDO::PARAM_STR); //Bind String variable
		$stmt->bindValue(':outer_dia', $outer_dia, PDO::PARAM_STR);//Bind STR variable
		$stmt->bindValue(':width', $width, PDO::PARAM_STR);//Bind STR so it can hold decimal
		$stmt->bindValue(':type', $type, PDO::PARAM_STR);//Bind STR
		$stmt->bindValue(':notes', $notes, PDO::PARAM_STR);//Bind STR
	
		
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