<?php 
/*$app->get('/session', function() {
    $db = new DbHandler();
    $session = $db->getSession();
    $response["uid"] = $session['uid'];
    $response["email"] = $session['email'];
    $response["name"] = $session['name'];
    echoResponse(200, $session);
});*/

    require_once 'config.php'; // Database setting constants [DB_HOST, DB_NAME, DB_USERNAME, DB_PASSWORD]
    //require_once 'jwt_helper.php'; //Token helper class for access control
    require_once '.././libs/jwt_helper.php';
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
    $password = $_POST['password']; 


    // response back to client  //Diagnotstics
    //echo json_encode($email);
    //echo json_encode($password);
    //echo json_encode($customer);

    //build SQL script
    $sql = "SELECT * FROM  users_auth WHERE email =:email LIMIT 0 , 30";

    // use prepared statements, even if not strictly required is good practice; this helps prevent sql injection attacks
    $stmt = $db->prepare( $sql );

    //this binds the input variables to php variables
    //I got this information from here http://php.net/manual/en/pdostatement.bindparam.php
    //bindValue instead of bindParam; bindValue binds immediately, where bindParam only evaluates on execute
    $stmt->bindValue(':email', $email, PDO::PARAM_STR); //Bind String variable

    // execute the query
    $stmt->execute();

    //PDO method to fetch
    $user = $stmt->fetch();

        // convert to json
       // $json = json_encode( $user );  //diagnostic to see which user was selected
       // echo $json;
	
	//start to evaluate if password is correct
    if ($user != NULL) {
        if(passwordHash::check_password($user['password'],$password)){
            //$date = new DateTime();
            //$_SESSION['secret_server_key'] = $date->format('U'); //need to figure out how to time out using serverside (PHP)
            $response['status'] = "success";
            $response['message'] = 'Logged in successfully.';
            $response['name'] = $user['name'];
            $response['uid'] = $user['uid'];
            $response['email'] = $user['email'];
            $response['createdAt'] = $user['created'];
            //create Token for access control
            //from example here https://coderwall.com/p/8wrxfw/goodbye-php-sessions-hello-json-web-tokens
            $token = array();
            $token['id'] = $id;
            $token['expiresAt'] = 6;
            //echo JWT::encode($token, 'secret_server_key');
            //Use SECRET_KEY defined in config.php file.  Still think I should use something unique to the session generated at time of login for highest security, will look at this later
            //Need to figure out how to make token expire after....maybe 10 minutes or something.
            $response['token'] = JWT::encode($token, SECRET_KEY); //send token back as part of success response for client local storage
            //echo json_encode($_SESSION['secret_server_key']);
            //echo json_encode(SECRET_KEY);

          //  if (!isset($_SESSION)) {
          //      session_start();
          //  }
          //  $_SESSION['uid'] = $user['uid'];
          //  $_SESSION['email'] = $email;
          //  $_SESSION['name'] = $user['name'];
        } else {
            $response['status'] = "error";
            $response['message'] = 'Login failed. Incorrect credentials';
            //$response['hash'] = passwordHash::hash($password);
        }
    }else {
        $response['status'] = "error";
        $response['message'] = 'No such user is registered';
    }

    echo json_encode($response);





//Original post 'login' function
/*$app->post('/login', function() use ($app) {
    require_once 'passwordHash.php';
    $r = json_decode($app->request->getBody());
    verifyRequiredParams(array('email', 'password'),$r->customer);
    $response = array();
    $db = new DbHandler();
    $password = $r->customer->password;
    $email = $r->customer->email;
    $user = $db->getOneRecord("select uid,name,password,email,created from customers_auth where phone='$email' or email='$email'");
    if ($user != NULL) {
        if(passwordHash::check_password($user['password'],$password)){
        $response['status'] = "success";
        $response['message'] = 'Logged in successfully.';
        $response['name'] = $user['name'];
        $response['uid'] = $user['uid'];
        $response['email'] = $user['email'];
        $response['createdAt'] = $user['created'];
        if (!isset($_SESSION)) {
            session_start();
        }
        $_SESSION['uid'] = $user['uid'];
        $_SESSION['email'] = $email;
        $_SESSION['name'] = $user['name'];
        } else {
            $response['status'] = "error";
            $response['message'] = 'Login failed. Incorrect credentials';
        }
    }else {
            $response['status'] = "error";
            $response['message'] = 'No such user is registered';
        }
    echoResponse(200, $response);
});*/

/*$app->post('/signUp', function() use ($app) {
    $response = array();
    $r = json_decode($app->request->getBody());
    verifyRequiredParams(array('email', 'name', 'password'),$r->customer);
    require_once 'passwordHash.php';
    $db = new DbHandler();
    $phone = $r->customer->phone;
    $name = $r->customer->name;
    $email = $r->customer->email;
    $address = $r->customer->address;
    $password = $r->customer->password;
    $isUserExists = $db->getOneRecord("select 1 from customers_auth where phone='$phone' or email='$email'");
    if(!$isUserExists){
        $r->customer->password = passwordHash::hash($password);
        $tabble_name = "customers_auth";
        $column_names = array('phone', 'name', 'email', 'password', 'city', 'address');
        $result = $db->insertIntoTable($r->customer, $column_names, $tabble_name);
        if ($result != NULL) {
            $response["status"] = "success";
            $response["message"] = "User account created successfully";
            $response["uid"] = $result;
            if (!isset($_SESSION)) {
                session_start();
            }
            $_SESSION['uid'] = $response["uid"];
            $_SESSION['phone'] = $phone;
            $_SESSION['name'] = $name;
            $_SESSION['email'] = $email;
            echoResponse(200, $response);
        } else {
            $response["status"] = "error";
            $response["message"] = "Failed to create customer. Please try again";
            echoResponse(201, $response);
        }            
    }else{
        $response["status"] = "error";
        $response["message"] = "An user with the provided phone or email exists!";
        echoResponse(201, $response);
    }
});*/

/*$app->get('/logout', function() {
    $db = new DbHandler();
    $session = $db->destroySession();
    $response["status"] = "info";
    $response["message"] = "Logged out successfully";
    echoResponse(200, $response);
});*/
?>