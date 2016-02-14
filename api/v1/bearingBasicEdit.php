<?php

require_once 'config.php'; // Database setting constants [DB_HOST, DB_NAME, DB_USERNAME, DB_PASSWORD]

    //not sure why I have to do this first but puting these variables directly into the new PDO call below didn't work.
    $dsn = 'mysql:host='.DB_HOST.';dbname='.DB_NAME.';charset=utf8';

    // connect to the database
    $db = new PDO($dsn, DB_USERNAME, DB_PASSWORD);

    //arrays used for error (blank variable) checking to be returned later
    $errors = array();
    $data = array();

    //json_decode (file_get_contents('php://input') is how I have to handle angular js $http.post requests; not sure what the "true" is for.
    $_POST = json_decode(file_get_contents('php://input'), true);
    //use this to extract variables from json package sent with $http.post request
    $basic_id = $_POST['basic_id']; //basic bearing id
    $type = $_POST['type']; // bearing type, TRB, CRB, ACBB etc...
    $construction = $_POST['construction']; //construction NU, NJ, NCF, SRB, etc...
    $base_pn = $_POST['base_pn']; //base part number ie 2968 (for NF 2968)

    //Check variables to see if they're blank
/*	if (empty($_POST['id']))
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
*/

    //update all of these variables
    $sql = "UPDATE  bearing_basic SET 
            type = :type,
            base_pn = :base_pn,
            construction = :construction 
            WHERE  basic_id =:basic_id"; 



    // use prepared statements, even if not strictly required is good practice; this helps prevent sql injection attacks
    $stmt = $db->prepare( $sql );

    //this binds the input variables to php variables
    $stmt->bindValue(':basic_id', $basic_id, PDO::PARAM_INT);//Bind int variable
    $stmt->bindValue(':type', $type, PDO::PARAM_STR); //Bind String variable
    $stmt->bindValue(':construction', $construction, PDO::PARAM_STR);//Bind STR variable
    $stmt->bindValue(':base_pn', $base_pn, PDO::PARAM_STR);//Bind STR variable


    // execute the query
    $stmt->execute();

        
?>