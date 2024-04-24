<?php
session_start();

// Get the JSON data
$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (isset($data['step'])) {
    $_SESSION['reservation']['step'] = $data['step'];
    unset($data['step']);
}

if ($data['action'] === 'itinerary') {
    unset($data['action']);
    $_SESSION['reservation']['itinerary'] = $data;
}

if ($data['action'] === 'reset_reservation') {
    unset($_SESSION['reservation']);
}

if ($data['action'] === 'reset_itinerary') {
    unset($_SESSION['reservation']['itinerary']);
}

if ($data['action'] === 'reset_car_selection') {
    unset($_SESSION['reservation']['car']);
}

if ($data['action'] === 'reset_add_ons') {
    unset($_SESSION['reservation']['add_ons']);
}

if ($data['action'] === 'reset_contact_info') {
    unset($_SESSION['reservation']['contact_info']);
}

// Send back the data as JSON
echo json_encode($data ? $data : $_POST);
