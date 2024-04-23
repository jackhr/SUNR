<?php
session_start();

// Get the JSON data
$json = file_get_contents('php://input');
$data = json_decode($json, true);

$_SESSION['reservation'] = $data;

// Send back the data as JSON
echo json_encode($data ? $data : $_POST);
