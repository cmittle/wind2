<?php
require '.././libs/Slim/Slim.php';
require_once 'dbHelper.php';

\Slim\Slim::registerAutoloader();
$app = new \Slim\Slim();
$app = \Slim\Slim::getInstance();
$db = new dbHelper();

/**
 * Database Helper Function templates
 */
/*
select(table name, where clause as associative array)
insert(table name, data as associative array, mandatory column names as array)
update(table name, column names as associative array, where clause as associative array, required columns as array)
delete(table name, where clause as array)
*/


// Products
/*$app->get('/products', function() { 
    global $db;
    $rows = $db->select("/bearing_specifics","Specific ID",array());
    echoResponse(200, $rows);
});*/


//Revise query here then add items to table in productCtrl.js plus....
//this appears to name the query '/bearing_specifics' which can then be called from Ctrl by 'bearing_specifics'
$app->get('/bearing_specifics', function() { 
    global $db;
    $rows = $db->select("bearing_specifics","specific_id,specific_pn,mfg,id,od,width,clearance,cage,inner_ring,outer_ring,rollers,notes,bearing_basic_id",array());
    echoResponse(200, $rows);
});

$app->get('/bearing_basic', function() { 
    global $db;
    $rows = $db->select("bearing_basic","basic_id,type,construction,base_pn",array());
    echoResponse(200, $rows);
});
$app->get('/gearbox_basic', function() { 
    global $db;
    $rows = $db->select("gearbox_basic","id,mfg,model,tower",array());
    echoResponse(200, $rows);
});
$app->get('/gearbox_specifics', function() { 
    global $db;
    $rows = $db->select("gearbox_specifics","id,position,bearing_basic_id,bearing_basic_pn,rec_clearance,qty_per_gb,gb_id,pos_id,notes",array());
    echoResponse(200, $rows);
});
/*
$app->get('/gearbox_specifics2', function() { 
    global $db;
    $rows = $db->query('SELECT * FROM  `gearbox_specifics` WHERE  `id` =22 LIMIT 0 , 30');
    echoResponse(200, $rows);
});
function getFruit() {
	global $db;
	$rows = $db->query('SELECT * FROM  `gearbox_specifics` WHERE  `id` =22 LIMIT 0 , 30');
	echoResponse(200, $rows);
}*/

//Add new works, need to verify if edit works
$app->post('/bearing_specifics', function() use ($app) { 
    $data = json_decode($app->request->getBody());
    //$mandatory = array('name');
    $mandatory = array(); //Must make array mandatory or angularjs complains, will eventually need to specify certain fields are in fact mandatory
    global $db;
    $rows = $db->insert("bearing_specifics", $data, $mandatory);
    if($rows["status"]=="success")
        $rows["message"] = "Product added successfully.";
    echoResponse(200, $rows);
});

//Add new works, need to verify if edit works
$app->post('/bearing_basic', function() use ($app) { 
    $data = json_decode($app->request->getBody());
    //$mandatory = array('name');
    $mandatory = array(); //Must make array mandatory or angularjs complains, will eventually need to specify certain fields are in fact mandatory
    global $db;
    $rows = $db->insert("bearing_basic", $data, $mandatory);
    if($rows["status"]=="success")
        $rows["message"] = "Product added successfully.";
    echoResponse(200, $rows);
});

$app->post('/gearbox_basic', function() use ($app) { 
    $data = json_decode($app->request->getBody());
    //$mandatory = array('name');
    $mandatory = array(); //Must make array mandatory or angularjs complains, will eventually need to specify certain fields are in fact mandatory
    global $db;
    $rows = $db->insert("gearbox_basic", $data, $mandatory);
    if($rows["status"]=="success")
        $rows["message"] = "Product added successfully.";
    echoResponse(200, $rows);
});

$app->post('/gearbox_specifics', function() use ($app) { 
    $data = json_decode($app->request->getBody());
    //$mandatory = array('name');
    $mandatory = array(); //Must make array mandatory or angularjs complains, will eventually need to specify certain fields are in fact mandatory
    global $db;
    $rows = $db->insert("gearbox_specifics", $data, $mandatory);
    if($rows["status"]=="success")
        $rows["message"] = "Product added successfully.";
    echoResponse(200, $rows);
});

/* OLD POST METHOD
$app->post('/products', function() use ($app) { 
    $data = json_decode($app->request->getBody());
    $mandatory = array('name');
    global $db;
    $rows = $db->insert("products", $data, $mandatory);
    if($rows["status"]=="success")
        $rows["message"] = "Product added successfully.";
    echoResponse(200, $rows);
});*/

//TODO none of these EDIT functions work
//ALl throw 501 error
$app->put('/bearing_specifics/:specific_id', function($specific_id) use ($app) { 
    $data = json_decode($app->request->getBody());
    $condition = array('specific_id'=>$specific_id);
    $mandatory = array();
    global $db;
    $rows = $db->update("bearing_specifics", $data, $condition, $mandatory);
    if($rows["status"]=="success")
        $rows["message"] = "Product information updated successfully.";
    echoResponse(200, $rows);
});

$app->put('/bearing_basic/:basic_id', function($id) use ($app) { 
    $data = json_decode($app->request->getBody());
    $condition = array('basic_id'=>$id);
    $mandatory = array();
    global $db;
    $rows = $db->update("bearing_basic", $data, $condition, $mandatory);
    if($rows["status"]=="success")
        $rows["message"] = "Product information updated successfully.";
    echoResponse(200, $rows);
});
$app->put('/gearbox_specifics/:id', function($id) use ($app) { 
    $data = json_decode($app->request->getBody());
    $condition = array('id'=>$id);
    $mandatory = array();
    global $db;
    $rows = $db->update("gearbox_specifics", $data, $condition, $mandatory);
    if($rows["status"]=="success")
        $rows["message"] = "Product information updated successfully.";
    echoResponse(200, $rows);
    
});

/* OLD PUT METHOD
$app->put('/products/:id', function($id) use ($app) { 
    $data = json_decode($app->request->getBody());
    $condition = array('id'=>$id);
    $mandatory = array();
    global $db;
    $rows = $db->update("products", $data, $condition, $mandatory);
    if($rows["status"]=="success")
        $rows["message"] = "Product information updated successfully.";
    echoResponse(200, $rows);
});
*/
/*
$app->delete('/products/:id', function($id) { 
    global $db;
    $rows = $db->delete("products", array('id'=>$id));
    if($rows["status"]=="success")
        $rows["message"] = "Product removed successfully.";
    echoResponse(200, $rows);
});*/

$app->delete('/products/:id', function($id) { 
    global $db;
    $rows = $db->delete("products", array('id'=>$id));
    if($rows["status"]=="success")
        $rows["message"] = "Product removed successfully.";
    echoResponse(200, $rows);
});

function echoResponse($status_code, $response) {
    global $app;
    $app->status($status_code);
    $app->contentType('application/json');
    echo json_encode($response,JSON_NUMERIC_CHECK);
}

$app->run();
?>