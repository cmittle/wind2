<?php
	//I got the base of this file from http://www.phpro.org/tutorials/Consume-Json-Results-From-PHP-MySQL-API-With-Angularjs-And-PDO.html
	//this set up the basic db variables, connection, query, prepare statement, execute, fetchAll and json encode
	//I've added to it from other sources as I learn more
        // set up the connection variables
        //TODO need to move these external and call them...
        $db_name  = 'corysc5_wind2';
        $hostname = 'localhost';
        $username = 'corysc5_wind2';
        $password = 'cm259925';

	//$postdata = file_get_contents("php://input");
	//$request = json_decode($postdata);
	//$dt = $request.params.dt;
	//echo $request;

        // connect to the database
        $dbh = new PDO("mysql:host=$hostname;dbname=$db_name", $username, $password);
	
	//TODO will use this for variable that is passed into php; hard coded int for testing until I can figure out how to pass in variable to php
	//variable will be gearbox id# so you can see the list of bearings in a selected gearbox
	//$dt = 6;
	
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
        $stmt = $dbh->prepare( $sql );
	
	//this binds the $gbid variable to ":gbid" so I can use this as a variable directly in query statement written above
	//I got this information from here http://php.net/manual/en/pdostatement.bindparam.php
	//TODO I don't think I need this bidning in this script
        $stmt->bindParam(':gbid', $gbid, PDO::PARAM_INT);

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