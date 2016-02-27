<?php


require_once 'config.php'; // Database setting constants [DB_HOST, DB_NAME, DB_USERNAME, DB_PASSWORD]
    require_once '.././libs/jwt_helper.php';//Token helper class for access control
	//database setup
	$dsn = 'mysql:host='.DB_HOST.';dbname='.DB_NAME.';charset=utf8';
        // connect to the database
        $db = new PDO($dsn, DB_USERNAME, DB_PASSWORD);
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        //json_decode (file_get_contents('php://input') is how I have to handle angular js $http.post requests; not sure what the "true" is for.
	// got this code block from here http://tutsnare.com/post-form-data-using-angularjs/;  Also referenced here http://www.cleverweb.nl/javascript/a-simple-search-with-angularjs-and-php/
	$_POST = json_decode(file_get_contents('php://input'), true);
	//This recieves the variables sent with the AngularJS Get request.
	$id = $_POST['id']; //seal id
	$position = $_POST['position']; //position of seal
	$seal_basic_id = $_POST['seal_basic_id']; 
	$seal_basic_pn = $_POST['seal_basic_pn']; 
	$rec_material = $_POST['rec_material']; 
	$qty = $_POST['qty']; 
	$gb_id = $_POST['gb_id']; 
	$pos_id = $_POST['pos_id']; 
	$notes = $_POST['notes'];
	
	//This pulls the header out of the request
	$authHeader = $_SERVER["HTTP_AUTHORIZATION"];	
	//remove prefix "Bearer " from beginning of this header
	$token = str_replace('Bearer ', '', $authHeader); //this appears to properly extract the string
	//Decode token and return array of contents
	
	try {
	    $authPass = JWT::decode($token, SECRET_KEY);
	} catch (Exception $e) {
	    $response['exception'] = $e->getMessage();
	    $response['status'] = 'failure in gearboxText.php';
            $response['message'] = 'The server has denied your request for this information. Please login and try again.';
	    header('X-PHP-Response-Code: 401', true, 401); //set header to 401 (unauthorized) if token decode fails
	    echo json_encode($response);
	    //echo 'Caught exception in gearboxBasicSeals.php: ',  $e->getMessage(), "\n";
	}
	
	
	if ($authPass != null) {
		
		//$sql =null;
        	$response['message1'] = 'You are approved';
		$response['authPass'] = 'you are in authPass';
		
		if ($id == null) { //if $id==null we're adding a new part
			$response['idNull'] = 'you are in id = null';
			//echo json_encode($notes);
			$sql = 'INSERT INTO gearbox_seal_specifics 
				(position, seal_basic_id, seal_basic_pn, rec_material, qty, gb_id, pos_id, notes) 
			VALUES (:position, :seal_basic_id, :seal_basic_pn, :rec_material, :qty, :gb_id, :pos_id, :notes)';
			
			// use prepared statements, even if not strictly required is good practice
			$stmt = $db->prepare( $sql );
			//bind variables
			//$stmt->bindParam(':id', $id, PDO::PARAM_INT);
			$stmt->bindParam(':seal_basic_id', $seal_basic_id, PDO::PARAM_INT);
			$stmt->bindParam(':seal_basic_pn', $seal_basic_pn, PDO::PARAM_STR);
			$stmt->bindParam(':position', $position, PDO::PARAM_STR);
			$stmt->bindParam(':qty', $qty, PDO::PARAM_INT);
			$stmt->bindParam(':rec_material', $rec_material, PDO::PARAM_STR);
			$stmt->bindParam(':gb_id', $gb_id, PDO::PARAM_STR);
			$stmt->bindParam(':pos_id', $pos_id, PDO::PARAM_STR);
			$stmt->bindParam(':notes', $notes, PDO::PARAM_STR);
			
			try {
				$stmt->execute();  // execute the query
				$response['status'] = "success";
				$response['message'] = 'New information posted to database.';
				echo json_encode($response);
			} catch (Exception $e) { //in order for this to work see setAttribute above that turned on PDO debugging
				$response['status'] = "FAILED";
	        		$response['message'] = 'PDO statement problem.  Dig deeper';
				echo json_encode($response);
			};
			
		} else { //if here ($id!==null) then we are editing an existing part
			$response['idNull'] = 'you are in else';
			$sql = 'UPDATE gearbox_seal_specifics SET
				position = :position,
				seal_basic_id = :seal_basic_id,
				seal_basic_pn = :seal_basic_pn,
				rec_material = :rec_material,
				qty = :qty,
				gb_id = :gb_id,
				pos_id = :pos_id,
				notes = :notes
				WHERE id = :id';
				
			
			// use prepared statements, even if not strictly required is good practice
			$stmt = $db->prepare( $sql );
			//bind variables
			$stmt->bindParam(':id', $id, PDO::PARAM_INT);
			$stmt->bindParam(':seal_basic_id', $seal_basic_id, PDO::PARAM_INT);
			$stmt->bindParam(':seal_basic_pn', $seal_basic_pn, PDO::PARAM_STR);
			$stmt->bindParam(':position', $position, PDO::PARAM_STR);
			$stmt->bindParam(':qty', $qty, PDO::PARAM_INT);
			$stmt->bindParam(':rec_material', $rec_material, PDO::PARAM_STR);
			$stmt->bindParam(':gb_id', $gb_id, PDO::PARAM_STR);
			$stmt->bindParam(':pos_id', $pos_id, PDO::PARAM_STR);
			$stmt->bindParam(':notes', $notes, PDO::PARAM_STR);
			
			try {
				$stmt->execute();  // execute the query
				$response['status'] = "success";
				$response['message'] = 'New information posted to database.';
				echo json_encode($response);
			} catch (Exception $e) { //in order for this to work see setAttribute above that turned on PDO debugging
				$response['status'] = "FAILED";
	        		$response['message'] = 'PDO statement problem.  Dig deeper';
	        		//$response['message3'] = $e;
				echo json_encode($response);
			};
		
		}
		
		
	} else {
		//send this back into $results for failure status
		//Not sure if I really need this Else loop any longer... I've moved the failure of token:decode to the try / catch bock above
		//$response['status'] = 'failure in gearbox.php';
        	//$response['message'] = 'You are NOT approved';
        	//echo json_encode($response);
	}
?>