<?php


require_once 'config.php'; // Database setting constants [DB_HOST, DB_NAME, DB_USERNAME, DB_PASSWORD]
    require_once '.././libs/jwt_helper.php';//Token helper class for access control
	//I got the base of this file from http://www.phpro.org/tutorials/Consume-Json-Results-From-PHP-MySQL-API-With-Angularjs-And-PDO.html
	//this set up the basic db variables, connection, query, prepare statement, execute, fetchAll and json encode
	//I've added to it from other sources as I learn more

	//not sure why I have to do this first but puting these variables directly into the new PDO call below didn't work.
	$dsn = 'mysql:host='.DB_HOST.';dbname='.DB_NAME.';charset=utf8';
	
        // connect to the database
        $db = new PDO($dsn, DB_USERNAME, DB_PASSWORD);
        
	//This recieves the variables sent with the AngularJS Get request.
	//this variable can now be used to in the query structure to allow us to only get the correct results from the query
	//rather than getting all results and filtering later
	$gbid = $_GET['gbid'];
	//$response['status'] = "hello";
	
	//This http://stackoverflow.com/questions/2916232/call-to-undefined-function-apache-request-headers helped me figure out to add a line in .htaccess to make this work.
	//This pulls the header out of the request
	$authHeader = $_SERVER["HTTP_AUTHORIZATION"];
	
	//remove prefix "Bearer " from beginning of this header
	$token = str_replace('Bearer ', '', $authHeader); //this appears to properly extract the string
	
	//Decode token and return array of contents
	
	try {
	    $authPass = JWT::decode($token, SECRET_KEY);
	} catch (Exception $e) {
	    $response['exception'] = $e->getMessage();
	    $response['status'] = 'failure in gearbox.php';
            $response['message'] = 'The server has denied your request for this information. Please login and try again.';
	    header('X-PHP-Response-Code: 401', true, 401); //set header to 401 (unauthorized) if token decode fails
	    echo json_encode($response);
	    //echo 'Caught exception in gearboxBasicSeals.php: ',  $e->getMessage(), "\n";
	}
	
	
	//If gbid is null run query that returns all (first 300 lines) of the gearbox_specifics table
	$response = array();
	
	
	if ($authPass != null) {
		$response['status'] = "success from gearbox.php";
        	$response['message'] = 'You are approved';
		if ($gbid == null) {
		$sql = 'SELECT * FROM  gearbox_seal_specifics LIMIT 0 , 300';
		} else {
			//if gbid is not null then run query that returns only lines (up to 30) with that gbid
			$sql = 'SELECT * FROM  gearbox_seal_specifics WHERE  gb_id =:gbid  LIMIT 0 , 30';
			//echo json_encode(SECRET_KEY);
			//echo json_encode($a);
			//echo json_encode($token);
			//echo json_encode($authPass);
			//echo json_encode($response);
		}
		// use prepared statements, even if not strictly required is good practice
		$stmt = $db->prepare( $sql );
		//this binds the $gbid variable to ":gbid" so I can use this as a variable directly in query statement written above
		$stmt->bindParam(':gbid', $gbid, PDO::PARAM_INT);
		// execute the query
		$stmt->execute();
		// fetch the results into an array
		$result = $stmt->fetchAll( PDO::FETCH_ASSOC );
		// convert to json
        	$json = json_encode( $result );
		// echo the json string
        	echo $json;
		
		//echo json_encode($response);
	} else {
		//send this back into $results for failure status
		//Not sure if I really need this Else loop any longer... I've moved the failure of token:decode to the try / catch bock above
		//$response['status'] = 'failure in gearbox.php';
        	//$response['message'] = 'You are NOT approved';
        	//echo json_encode($response);
	}
	


        // use prepared statements, even if not strictly required is good practice
        //This works if I need to revert
//        $stmt = $db->prepare( $sql );
	
	//this binds the $gbid variable to ":gbid" so I can use this as a variable directly in query statement written above
	//I got this information from here http://php.net/manual/en/pdostatement.bindparam.php
//	$stmt->bindParam(':gbid', $gbid, PDO::PARAM_INT);

        // execute the query
//        $stmt->execute();

        // fetch the results into an array
//        $result = $stmt->fetchAll( PDO::FETCH_ASSOC );

        // convert to json
//        $json = json_encode( $result );

        // echo the json string
 //       echo $json;
?>