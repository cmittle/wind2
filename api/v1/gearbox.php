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
	$gbid = $_GET['gbid'];
	

        // a query get all the records from the users table
	//This very basic query works!!!  This 
	//$sql = 'SELECT * FROM  gearbox_specifics LIMIT 0 , 30';
	//This works for variable search.  Need to use ":xx" as variable in query statement
		//also need to do bindParam function below to tie $gbid to :gbid variable
			//$sql = 'SELECT * FROM  gearbox_specifics WHERE  gb_id =:gbid  LIMIT 0 , 30';  --delete

	//If gbid is null run query that returns all (first 300 lines) of the gearbox_specifics table
	if ($gbid == null) {
		$sql = 'SELECT * FROM  gearbox_specifics LIMIT 0 , 300';
	} else {
		//if gbid is not null then run query that returns only lines (up to 30) with that gbid
		$sql = 'SELECT * FROM  gearbox_specifics WHERE  gb_id =:gbid  LIMIT 0 , 30';
	}


        // use prepared statements, even if not strictly required is good practice
        //This works if I need to revert
        $stmt = $db->prepare( $sql );
	
	//this binds the $gbid variable to ":gbid" so I can use this as a variable directly in query statement written above
	//I got this information from here http://php.net/manual/en/pdostatement.bindparam.php
	$stmt->bindParam(':gbid', $gbid, PDO::PARAM_INT);

        // execute the query
        $stmt->execute();

        // fetch the results into an array
        $result = $stmt->fetchAll( PDO::FETCH_ASSOC );

        // convert to json
        $json = json_encode( $result );

        // echo the json string
        echo $json;
?>
