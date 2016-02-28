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
    // got this code block from here http://tutsnare.com/post-form-data-using-angularjs/;  Also referenced here http://www.cleverweb.nl/javascript/a-simple-search-with-angularjs-and-php/
    $_POST = json_decode(file_get_contents('php://input'), true);
    //use this to extract variables from json package sent with $http.post request
    $uid = $_POST['uid']; //database table id
    $specific_pn = $_POST['specific_pn']; //specific part umber e.g. 710x760x20 HSS5 H
    $mfg = $_POST['mfg']; //brg specific mfg e.g 1 (for SKF), 2 (for WalkerSele), 3 (for Carco), etc...
    $inner_dia = $_POST['inner_dia']; //inner diameter e.g. 130(mm)
    $outer_dia = $_POST['outer_dia']; //outer diameter e.g. 280(mm)
    $width = $_POST['width']; //width e.g. 93(mm)
    $material = $_POST['material']; //material NBR, HNBR, VIton etc..
    $split = $_POST['split']; //split yes or no
    $profile = $_POST['profile']; //profile of seal
    $notes = $_POST['notes']; //notes
    $seal_basic_id = $_POST['seal_basic_id']; //id of seal basic
    //$uid = $_POST['uid']; //unique id of the seal record

    //Check variables to see if they're blank
/*    if (empty($_POST['id']))
        $errors['id'] = 'ID is required.';

    if (empty($_POST['bearing_basic_id']))
        $errors['bearing_basic_id'] = 'bearing_basic_id is required.';

    if (!empty($errors)) {
        $data['errors']  = $errors;
    } else {
        //this just returns an array so we can see if everything made it to the server
        $data['message'] = 'Working so far';
        $data['bearing_basic_id'] = $bearing_basic_id;
        $data['specific_pn'] = $specific_pn;
        $data['id'] = $id;
        $data['od'] = $od;
        $data['width'] = $width;
        $data['clearance'] = $clearance;
        $data['cage'] = $cage;
        $data['inner_ring'] = $inner_ring;
        $data['outer_ring'] = $outer_ring;
        //$data['type'] = $type;
    }*/
    // response back.
    //echo json_encode($data);  //This just echos what was updated

    //This pulls the header out of the request
    $authHeader = $_SERVER["HTTP_AUTHORIZATION"];
    //remove prefix "Bearer " from beginning of this header
    $token = str_replace('Bearer ', '', $authHeader); //this appears to properly extract the string
    //check token for authorization
    try {
        $authPass = JWT::decode($token, SECRET_KEY);
    } catch (Exception $e) {
        $response['exception'] = $e->getMessage();
        $response['status'] = 'failure in sealSpecificEdit.php';
        $response['message'] = 'The server has denied your request for this information. Please login and try again.';
        header('X-PHP-Response-Code: 401', true, 401); //set header to 401 (unauthorized) if token decode fails
        echo json_encode($response);
    }


    if ($authPass != null) {
        $response['status'] = "success"; 
        $response['message'] = 'You are approved';
        $response['data'] = $_POST;

	if ($uid == null) { //if $uid==null we're adding a new part
	        $response['uidNull'] = 'you are in $uid == null';
	        $response['uid$'] = $uid;
	        $sql = 'INSERT INTO seal_specifics 
				(seal_basic_id, specific_pn, mfg, inner_dia, outer_dia, width, material, profile, split, notes) 
			VALUES (:seal_basic_id, :specific_pn, :mfg, :inner_dia, :outer_dia, :width, :material, :profile, :split, :notes)';
	        // use prepared statements, even if not strictly required is good practice; this helps prevent sql injection attacks
	        $stmt = $db->prepare( $sql );
	
	        //this binds the input variables to php variables
	        //I got this information from here http://php.net/manual/en/pdostatement.bindparam.php
	        //bindValue instead of bindParam; bindValue binds immediately, where bindParam only evaluates on execute
	        $stmt->bindValue(':seal_basic_id', $seal_basic_id, PDO::PARAM_INT);//Bind int variable
	        $stmt->bindValue(':specific_pn', $specific_pn, PDO::PARAM_STR); //Bind String variable
	        $stmt->bindValue(':mfg', $mfg, PDO::PARAM_STR);//Bind STR variable
	        $stmt->bindValue(':inner_dia', $inner_dia, PDO::PARAM_STR);//Bind STR so it can hold decimal
	        $stmt->bindValue(':outer_dia', $outer_dia, PDO::PARAM_STR);//Bind STR so it can hold decimal
	        $stmt->bindValue(':width', $width, PDO::PARAM_STR);//Bind STR so it can hold decimal
	        $stmt->bindValue(':material', $material, PDO::PARAM_STR);//Bind str variable
	        $stmt->bindValue(':profile', $profile, PDO::PARAM_STR);//Bind str variable
	        $stmt->bindValue(':split', $split, PDO::PARAM_STR);//Bind str variable
	        $stmt->bindValue(':notes', $notes, PDO::PARAM_STR);//Bind str variable
	
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
	        
	        
	        
	} else {//if here ($id!==null) then we are editing an existing part
		$response['idNull'] = 'you are in else';
		//update all of these variables
	        $sql = "UPDATE  seal_specifics SET 
	                seal_basic_id = :seal_basic_id,
	                specific_pn = :specific_pn,
	                mfg = :mfg,
	                inner_dia = :inner_dia,
	                outer_dia = :outer_dia,
	                width = :width,
	                material = :material,
	                profile = :profile,
	                split = :split,
	                notes = :notes		 
	                WHERE  uid =:uid"; 
	
	        // use prepared statements, even if not strictly required is good practice; this helps prevent sql injection attacks
	        $stmt = $db->prepare( $sql );
	
	        //this binds the input variables to php variables
	        //I got this information from here http://php.net/manual/en/pdostatement.bindparam.php
	        //bindValue instead of bindParam; bindValue binds immediately, where bindParam only evaluates on execute
	        $stmt->bindValue(':seal_basic_id', $seal_basic_id, PDO::PARAM_INT);//Bind int variable
	        $stmt->bindValue(':specific_pn', $specific_pn, PDO::PARAM_STR); //Bind String variable
	        $stmt->bindValue(':mfg', $mfg, PDO::PARAM_STR);//Bind STR variable
	        $stmt->bindValue(':inner_dia', $inner_dia, PDO::PARAM_STR);//Bind STR so it can hold decimal
	        $stmt->bindValue(':outer_dia', $outer_dia, PDO::PARAM_STR);//Bind STR so it can hold decimal
	        $stmt->bindValue(':width', $width, PDO::PARAM_STR);//Bind STR so it can hold decimal
	        $stmt->bindValue(':material', $material, PDO::PARAM_STR);//Bind str variable
	        $stmt->bindValue(':profile', $profile, PDO::PARAM_STR);//Bind str variable
	        $stmt->bindValue(':split', $split, PDO::PARAM_STR);//Bind str variable
	        $stmt->bindValue(':notes', $notes, PDO::PARAM_STR);//Bind str variable
	        $stmt->bindValue(':uid', $uid, PDO::PARAM_INT);//Bind int variable
	
	
	        try {
			$stmt->execute();  // execute the query
			$response['status'] = "success";
			$response['message'] = 'Database record updated';
			$response['inner_dia'] = $inner_dia;
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