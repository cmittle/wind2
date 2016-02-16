<?php

require_once 'config.php'; // Database setting constants [DB_HOST, DB_NAME, DB_USERNAME, DB_PASSWORD]
require_once '.././libs/jwt_helper.php';
    //not sure why I have to do this first but puting these variables directly into the new PDO call below didn't work.
    $dsn = 'mysql:host='.DB_HOST.';dbname='.DB_NAME.';charset=utf8';

    // connect to the database
    $db = new PDO($dsn, DB_USERNAME, DB_PASSWORD);

    //arrays used for error (blank variable) checking to be returned later
    $errors = array();
    $data = array();

    //json_decode (file_get_contents('php://input') is how I have to handle angular js $http.post requests; not sure what the "true" is for.
    $_POST = json_decode(file_get_contents('php://input'), true);
    //use this to extract variables from json package sent with $http.post request
    $basic_id = $_POST['basic_id']; //basic bearing id
    $type = $_POST['type']; // bearing type, TRB, CRB, ACBB etc...
    $construction = $_POST['construction']; //construction NU, NJ, NCF, SRB, etc...
    $base_pn = $_POST['base_pn']; //base part number ie 2968 (for NF 2968)

    //This pulls the header out of the request
    $authHeader = $_SERVER["HTTP_AUTHORIZATION"];
    //remove prefix "Bearer " from beginning of this header
    $token = str_replace('Bearer ', '', $authHeader); //this appears to properly extract the string
    //check token for authorization
    try {
	    $authPass = JWT::decode($token, SECRET_KEY);
	} catch (Exception $e) {
	    $response['exception'] = $e->getMessage();
	    $response['status'] = 'failure in bearingBasicEdit.php';
            $response['message'] = 'The server has denied your request for this information. Please login and try again.';
	    header('X-PHP-Response-Code: 401', true, 401); //set header to 401 (unauthorized) if token decode fails
	    echo json_encode($response);
	    //echo 'Caught exception in gearbox.php: ',  $e->getMessage(), "\n";
	}

    //verify if token is authenticated, then allow edit
    if ($authPass != null) {
    	$response['status'] = "success"; // from bearingBasicEdit
        $response['message'] = 'You are approved';
    	//update all of these variables
    	$sql = "UPDATE  bearing_basic SET 
            	type = :type,
            	base_pn = :base_pn,
            	construction = :construction 
            	WHERE  basic_id =:basic_id"; 

    	// use prepared statements, even if not strictly required is good practice; this helps prevent sql injection attacks
    	$stmt = $db->prepare( $sql );

    	//this binds the input variables to php variables
    	$stmt->bindValue(':basic_id', $basic_id, PDO::PARAM_INT);//Bind int variable
    	$stmt->bindValue(':type', $type, PDO::PARAM_STR); //Bind String variable
    	$stmt->bindValue(':construction', $construction, PDO::PARAM_STR);//Bind STR variable
    	$stmt->bindValue(':base_pn', $base_pn, PDO::PARAM_STR);//Bind STR variable

    	// execute the query
    	$stmt->execute();
    	echo json_encode($response);
    } else {
		//send this back into $results for failure status
		//Not sure if I really need this Else loop any longer... I've moved the failure of token:decode to the try / catch bock above
		//$response['status'] = 'failure in gearbox.php';
        	//$response['message'] = 'You are NOT approved';
        	//echo json_encode($response);
    }

        
?>