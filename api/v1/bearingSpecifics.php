<?php


require_once 'config.php'; // Database setting constants [DB_HOST, DB_NAME, DB_USERNAME, DB_PASSWORD]

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
	$bearing_basic_id = $_GET['bearing_basic_id'];
	
/* this is essentially the query I need to run for this
	SELECT  `specific_pn` ,  `mfg` 
	FROM  `bearing_specifics` 
	WHERE  `bearing_basic_id` =1
	LIMIT 0 , 30
*/

	//If bearing_basic_id is null run query that returns all (first 300 lines) of the gearbox_specifics table
	if ($bearing_basic_id == null) {
		$sql = 'SELECT * FROM  bearing_specifics LIMIT 0 , 300';
	} else {
		//if bearing_basic_id is not null then run query that returns only lines (up to 30) with that bearing_basic_id
		//just select the specific_pn field from this table to show the user
		$sql = 'SELECT bearing_basic_id, mfg, specific_pn FROM  bearing_specifics WHERE  bearing_basic_id =:bearing_basic_id  LIMIT 0 , 30';
	}


        // use prepared statements, even if not strictly required is good practice
        //This works if I need to revert
        $stmt = $db->prepare( $sql );
	
	//this binds the $bearing_basic_id variable to ":bearing_basic_id" so I can use this as a variable directly in query statement written above
	//I got this information from here http://php.net/manual/en/pdostatement.bindparam.php
	$stmt->bindParam(':bearing_basic_id', $bearing_basic_id, PDO::PARAM_INT);

        // execute the query
        $stmt->execute();

        // fetch the results into an array
        $result = $stmt->fetchAll( PDO::FETCH_ASSOC );

        // convert to json
        $json = json_encode( $result );

        // echo the json string
        echo $json;
?>