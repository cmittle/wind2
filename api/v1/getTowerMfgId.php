<?php


require_once 'config.php'; // Database setting constants [DB_HOST, DB_NAME, DB_USERNAME, DB_PASSWORD]
    require_once '.././libs/jwt_helper.php';//Token helper class for access control
	//Database setup
	$dsn = 'mysql:host='.DB_HOST.';dbname='.DB_NAME.';charset=utf8';
        // connect to the database
        $db = new PDO($dsn, DB_USERNAME, DB_PASSWORD);
	//This recieves the variables sent with the AngularJS Get request.
	$mfg = $_GET['mfg']; //mfg name e.g. GE, Acciona, Siemens, etc...
	
	//This pulls the header out of the request
	$authHeader = $_SERVER["HTTP_AUTHORIZATION"];
	//remove prefix "Bearer " from beginning of this header
	$token = str_replace('Bearer ', '', $authHeader); //this appears to properly extract the string
	//Decode token and return array of contents
	try {
	    $authPass = JWT::decode($token, SECRET_KEY);
	} catch (Exception $e) {
	    $response['exception'] = $e->getMessage();
	    $response['status'] = 'failure in getTowerMfgId.php';
            $response['message'] = 'The server has denied your request for this information. Please login and try again.';
	    header('X-PHP-Response-Code: 401', true, 401); //set header to 401 (unauthorized) if token decode fails
	    echo json_encode($response);
	    //echo 'Caught exception in gearboxBasicSeals.php: ',  $e->getMessage(), "\n";
	}
	
	
	if ($authPass != null) {
		$response['status'] = "success from getTowerMfgId.php";
        	$response['message'] = 'You are approved';
        	//this returns all (first 100) records where the gb id matches, sorted in DESCending order of the value in the version column
        	//then the controller can continue to use the [0] position of the return array to populate display
		//$sql = 'SELECT * FROM  tower_text WHERE  tid =:tid ORDER BY version DESC LIMIT 0 , 5';
		//$sql = 'SELECT * FROM  tower_mfg WHERE mfg LIKE :mfg LIMIT 0 , 30';
		
		//SELECT Orders.OrderID, Customers.CustomerName, Orders.OrderDate FROM Orders INNER JOIN Customers ON Orders.CustomerID=Customers.CustomerID;
		$sql = 'SELECT * FROM tower_mfg WHERE mfg LIKE :mfg';	

		// use prepared statements, even if not strictly required is good practice
		$stmt = $db->prepare( $sql );
		//this binds the $gbid variable to ":gbid" so I can use this as a variable directly in query statement written above
		$stmt->bindParam(':mfg', $mfg, PDO::PARAM_STR);
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