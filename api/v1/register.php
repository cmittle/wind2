<?php 

    require_once 'config.php'; // Database setting constants [DB_HOST, DB_NAME, DB_USERNAME, DB_PASSWORD]
    //require_once 'jwt_helper.php'; //Token helper class for access control
    //require_once '.././libs/jwt_helper.php';
    //require '.././libs/Slim/Slim.php'
    require_once 'passwordHash.php';
	
	//not sure why I have to do this first but puting these variables directly into the new PDO call below didn't work.
	$dsn = 'mysql:host='.DB_HOST.';dbname='.DB_NAME.';charset=utf8';
	
	// connect to the database
	$db = new PDO($dsn, DB_USERNAME, DB_PASSWORD);
        
        // got this code block from here http://tutsnare.com/post-form-data-using-angularjs/;  Also referenced here http://www.cleverweb.nl/javascript/a-simple-search-with-angularjs-and-php/
	$_POST = json_decode(file_get_contents('php://input'), true);
	//use this to extract variables from json package sent with $http.post request
	$email = $_POST['email']; 
	//$password = $_POST['password']; 
	$tmpPassword = $_POST['password'];
	
	//Hash password
	$password = passwordHash::hash($tmpPassword);
	
	//Check if username is already used
	$sql2 = "SELECT * FROM users_auth WHERE email=:email";
	$stm = $db ->prepare($sql2);
	$stm->bindParam(':email', $email, PDO::PARAM_INT);
	$stm->execute();
	// fetch the results into an array
	$userArray = $stm->fetchAll( PDO::FETCH_ASSOC );
	
	//$m2 = "There is no other user with that name";
	/*if($userExists){
		$m2 = "There is another user by this name";
	};*/
	
	
	if(!$userArray) { //if $userArray evaluates true, there is another user with this name, if false this username is available.
		//build SQL script
		//Store password in tmp field of database, when I approve I will login and copy this value to the other cell which should let the user login
		$sql = "INSERT INTO users_auth (email, temp) VALUES (:email, :password)";  
		
		// use prepared statements, even if not strictly required is good practice; this helps prevent sql injection attacks
		$stmt = $db->prepare( $sql );
		
		//this binds the input variables to php variables
		//I got this information from here http://php.net/manual/en/pdostatement.bindparam.php
		//bindValue instead of bindParam; bindValue binds immediately, where bindParam only evaluates on execute
		$stmt->bindValue(':email', $email, PDO::PARAM_STR); //Bind String variable
		$stmt->bindValue(':password', $password, PDO::PARAM_STR); //Bind String variable
		
		// execute the query
	        $stmt->execute();
	        
	        $response['status'] = "success";
		$response['message'] = 'Added user to queue for Cory to approve!';
	} else {
		$response['m2'] = "There is another user by this name";
		$response['message'] = 'You need to pick a unique username.';
		$response['status'] = "failed";
	};
        
        //$response['status'] = "success";
	//$response['message'] = 'Added user to queue for Cory to approve!';
        $response['user'] = $userArray;
        //$response['m2'] = $m2;
        
        
	echo json_encode($response);
    
    
?>