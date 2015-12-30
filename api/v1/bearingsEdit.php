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
	$specific_id = $_POST['specific_id']; //database table id
	$specific_pn = $_POST['specific_pn']; //specific part umber e.g. NU 2326 ECML/L4BC3
	$mfg = $_POST['mfg']; //brg specific mfg e.g 1 (for SKF), 2 (for NSK), 3 (for Schaeffler), etc...
	$id = $_POST['id']; //inner diameter e.g. 130(mm)
	$od = $_POST['od']; //outer diameter e.g. 280(mm)
	$width = $_POST['width']; //width e.g. 93(mm)
	$clearance = $_POST['clearance']; //clearance e.g. C3, C0, or range for tapered set e.g. .615-.665mm
	$cage = $_POST['cage']; //cage e.g. steel, brass, none
	$inner_ring = $_POST['inner_ring']; //material/treatment of inner ring e.g. black oxide, steel, supertough etc..
	$outer_ring = $_POST['outer_ring']; //material/treatment of outer ring e.g. black oxide, steel, supertough etc..
	$rollers = $_POST['rollers']; //material/treatment of rollers e.g. black oxide, steel, supertough etc..
	$notes = $_POST['notes']; //notes
	$bearing_basic_id = $_POST['bearing_basic_id']; //id of basic bearing e.g 1 for NU 2326

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
	  $data['specific_pn'] = $specific_pn;
	  $data['id'] = $id;
	  $data['od'] = $od;
	  $data['width'] = $width;
	  $data['clearance'] = $clearance;
	  $data['cage'] = $cage;
	  $data['inner_ring'] = $inner_ring;
	  $data['outer_ring'] = $outer_ring;
	  //$data['type'] = $type;
	}
	// response back.
	echo json_encode($data);  //This just echos what was updated


//push all variables into database 
	//update all of these variables
	//$sql = "UPDATE  products SET  description = :description, price = :price, stock = :stock, packing = :packing WHERE  id =:pid"; 
	//Maybe I shouldn't update the gb_id, this would change what gearbox the bearing is listed in.
	$sql = "UPDATE  bearing_specifics SET 
		bearing_basic_id = :bearing_basic_id,
		specific_pn = :specific_pn,
		mfg = :mfg,
		id = :id,
		od = :od,
		width = :width,
		clearance = :clearance,
		cage = :cage,
		inner_ring = :inner_ring,
		outer_ring = :outer_ring,
		rollers = :rollers,
		notes = :notes		 
		WHERE  specific_id =:specific_id"; 
	
	// use prepared statements, even if not strictly required is good practice; this helps prevent sql injection attacks
	$stmt = $db->prepare( $sql );
	
	//this binds the input variables to php variables
	//I got this information from here http://php.net/manual/en/pdostatement.bindparam.php
	//bindValue instead of bindParam; bindValue binds immediately, where bindParam only evaluates on execute
	$stmt->bindValue(':bearing_basic_id', $bearing_basic_id, PDO::PARAM_INT);//Bind int variable
	$stmt->bindValue(':specific_pn', $specific_pn, PDO::PARAM_STR); //Bind String variable
	$stmt->bindValue(':mfg', $mfg, PDO::PARAM_STR);//Bind STR variable
	$stmt->bindValue(':id', $id, PDO::PARAM_STR);//Bind STR so it can hold decimal
	$stmt->bindValue(':od', $od, PDO::PARAM_STR);//Bind STR so it can hold decimal
	$stmt->bindValue(':width', $width, PDO::PARAM_STR);//Bind STR so it can hold decimal
	$stmt->bindValue(':clearance', $clearance, PDO::PARAM_STR);//Bind str variable
	$stmt->bindValue(':cage', $cage, PDO::PARAM_STR);//Bind str variable
	$stmt->bindValue(':inner_ring', $inner_ring, PDO::PARAM_STR);//Bind str variable
	$stmt->bindValue(':outer_ring', $outer_ring, PDO::PARAM_STR);//Bind str variable
	$stmt->bindValue(':rollers', $rollers, PDO::PARAM_STR);//Bind str variable
	$stmt->bindValue(':notes', $notes, PDO::PARAM_STR);//Bind str variable
	$stmt->bindValue(':specific_id', $specific_id, PDO::PARAM_INT);//Bind int variable

	
        // execute the query
        $stmt->execute();

        
?>