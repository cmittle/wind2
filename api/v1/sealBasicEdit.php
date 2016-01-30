<?php


require_once 'config.php'; // Database setting constants [DB_HOST, DB_NAME, DB_USERNAME, DB_PASSWORD]

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
	//I got this information from here http://php.net/manual/en/pdostatement.bindparam.php
	//bindValue instead of bindParam; bindValue binds immediately, where bindParam only evaluates on execute
	$stmt->bindValue(':uid', $uid, PDO::PARAM_INT);//Bind int variable
	$stmt->bindValue(':inner_dia', $inner_dia, PDO::PARAM_STR); //Bind String variable
	$stmt->bindValue(':outer_dia', $outer_dia, PDO::PARAM_STR);//Bind STR variable
	$stmt->bindValue(':width', $width, PDO::PARAM_STR);//Bind STR so it can hold decimal
	$stmt->bindValue(':type', $type, PDO::PARAM_STR);//Bind STR
	$stmt->bindValue(':notes', $notes, PDO::PARAM_STR);//Bind STR

	
        // execute the query
        $stmt->execute();

        
?>