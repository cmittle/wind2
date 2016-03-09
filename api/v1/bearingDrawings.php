<?php


require_once 'config.php'; // Database setting constants [DB_HOST, DB_NAME, DB_USERNAME, DB_PASSWORD]
require_once '.././libs/jwt_helper.php';
    //not sure why I have to do this first but puting these variables directly into the new PDO call below didn't work.
    $dsn = 'mysql:host='.DB_HOST.';dbname='.DB_NAME.';charset=utf8';

    // connect to the database
    $db = new PDO($dsn, DB_USERNAME, DB_PASSWORD);

    //This recieves the variables sent with the AngularJS Get request.
    //this variable can now be used to in the query structure to allow us to only get the correct results from the query
    //rather than getting all results and filtering later
    $bearing_specific_id = $_GET['bearing_specific_id'];

    //echo json_encode($bearing_specific_id);

    //This pulls the header out of the request
    $authHeader = $_SERVER["HTTP_AUTHORIZATION"];
    //remove prefix "Bearer " from beginning of this header
    $token = str_replace('Bearer ', '', $authHeader); //this appears to properly extract the string
    //check token for authorization
    try {
	    $authPass = JWT::decode($token, SECRET_KEY);
    } catch (Exception $e) {
    	$response['exception'] = $e->getMessage();
    	$response['status'] = 'failure in bearingDrawings.php';
    	$response['message'] = 'The server has denied your request for this information. Please login and try again.';
    	header('X-PHP-Response-Code: 401', true, 401); //set header to 401 (unauthorized) if token decode fails
    	echo json_encode($response);
    }


    if ($authPass != null) {
    	$response['status'] = "success"; // from bearingBasicEdit
        $response['message'] = 'You are approved';
    	//If bearing_basic_id is null run query that returns all (first 300 lines) of the gearbox_specifics table
    	/*if ($bearing_basic_id == null) {
            $sql = 'SELECT * FROM  bearing_drawings LIMIT 0 , 750';
    	} else {*/
            //if bearing_basic_id is not null then run query that returns only lines (up to 30) with that bearing_basic_id
            $sql = 'SELECT drawing_location 
                    FROM  bearing_drawings 
                    WHERE  bearing_spec_id =:bearing_specific_id  
                    LIMIT 0 , 10';
    	//}

    	// use prepared statements, even if not strictly required is good practice
    	$stmt = $db->prepare( $sql );
    	//this binds the $bearing_basic_id variable to ":bearing_basic_id" so I can use this as a variable directly in query statement written above
    	$stmt->bindParam(':bearing_specific_id', $bearing_specific_id, PDO::PARAM_INT);
    	// execute the query
    	$stmt->execute();
    	// fetch the results into an array
    	$result = $stmt->fetch( PDO::FETCH_ASSOC );  //fetch just 1, if I need an array, need to fetchAll
    	// convert to json
    	$json = json_encode( $result );
    	// echo the json string
    	echo $json;
    } else {
		//send this back into $results for failure status
		//Not sure if I really need this Else loop any longer... I've moved the failure of token:decode to the try / catch bock above
		//$response['status'] = 'failure in gearbox.php';
        	//$response['message'] = 'You are NOT approved';
        	//echo json_encode($response);
    } 
	    
?>