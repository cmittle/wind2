<?php


require_once 'config.php'; // Database setting constants [DB_HOST, DB_NAME, DB_USERNAME, DB_PASSWORD]
   require_once '.././libs/jwt_helper.php';
	//database config
	$dsn = 'mysql:host='.DB_HOST.';dbname='.DB_NAME.';charset=utf8';
        // connect to the database
        $db = new PDO($dsn, DB_USERNAME, DB_PASSWORD);
        
	//This recieves the variables sent with the AngularJS Get request.
	$tuid = $_GET['tuid'];
	//This pulls the header out of the request
	$authHeader = $_SERVER["HTTP_AUTHORIZATION"];
	//remove prefix "Bearer " from beginning of this header
	$token = str_replace('Bearer ', '', $authHeader); //this appears to properly extract the string
	
	//Decode token and return array of contents
	try {
	    $authPass = JWT::decode($token, SECRET_KEY);
	} catch (Exception $e) {
	    $response['exception'] = $e->getMessage();
	    $response['status'] = 'failure in towerMain.php';
            $response['message'] = 'The server has denied your request for this information. Please login and try again.';
	    header('X-PHP-Response-Code: 401', true, 401); //set header to 401 (unauthorized) if token decode fails
	    echo json_encode($response);
	    //echo 'Caught exception in towerMain.php: ',  $e->getMessage(), "\n";
	}
	
	//If tuid is null run query that returns all (first 300 lines) of the gearbox_specifics table
	//$response = array();
	
	if ($authPass != null) {
		$response['status'] = "success from towerMain.php";
        	$response['message'] = 'You are approved';
		if ($tuid == null) {
		$sql = 'SELECT * FROM  tower_main LIMIT 0 , 1000';
		} else {
			//if tuid is not null then run query that returns only lines (up to 30) with that tuid
			$sql = 'SELECT * FROM  tower_main WHERE  tuid =:tuid  LIMIT 0 , 30';
			//echo json_encode(SECRET_KEY);
			//echo json_encode($a);
			//echo json_encode($token);
			//echo json_encode($authPass);
			//echo json_encode($response);
		}
		// use prepared statements, even if not strictly required is good practice
		$stmt = $db->prepare( $sql );
		//this binds the $tuid variable to ":tuid" so I can use this as a variable directly in query statement written above
		$stmt->bindParam(':tuid', $tuid, PDO::PARAM_INT);
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
	
?>  