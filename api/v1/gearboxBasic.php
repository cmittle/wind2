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
	//This allows for variables passed to the server to be extracted; at this point I don't need to pass any variables
	//$gbid = $_GET['gbid'];
	

        // a query get all the records from the users table
	//If a variable search is required.  Need to use ":xx" as variable in query statement
		//also need to do bindParam function below to tie $xxid to :xxid variable
	$sql = 'SELECT * FROM  gearbox_basic LIMIT 0 , 100';


        // use prepared statements, even if not strictly required is good practice
        //This works if I need to revert
        $stmt = $db->prepare( $sql );
	
	//this binds the $gbid variable to ":gbid" so I can use this as a variable directly in query statement written above
	//I got this information from here http://php.net/manual/en/pdostatement.bindparam.php
	//TODO I don't think I need this bidning in this script
 //       $stmt->bindParam(':gbid', $gbid, PDO::PARAM_INT);

        // execute the query
        $stmt->execute();

        // fetch the results into an array
        $result = $stmt->fetchAll( PDO::FETCH_ASSOC );
	

	//$sortedResult = asort($result);

        // convert to json
        $json = json_encode( $result );

        // echo the json string
        echo $json;
?>