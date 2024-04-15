<?php

include 'connection.php';

$description = isset($description) ? $description : "Welcome to Shaq's Car Rental. We offer a wide selection of vehicles for rent. Book your car today!";

$base_title = "Shaq's Car Rental";

$title = isset($title_suffix) ? $base_title .= " | " . $title_suffix : $title;

?>

<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1">
    <meta name="robots" content="noindex">
    <meta name="keywords" content="car rental, affordable car rentals, car hire, vehicle rental, rent a car, car rental near me, airport car rental, luxury car hire, cheap car rental, car booking, online car rental, city car rental, car rental services, weekend car rental, business car hire, caribbean rentals, antigua, antigua and barbuda, antigua rentals">
    <meta name="description" content="<?php echo $description ?>">
    <meta property="og:title" content="<?php echo $base_title ?>">
    <meta property="og:description" content="<?php echo $description; ?>">
    <title><?php echo $title ?></title>
    <link type="text/css" rel="stylesheet" href="/styles/main.css">
    <?php if (isset($page) && file_exists("/styles/{$page}.css")) { ?>
        <link type="text/css" rel="stylesheet" href="/styles/<?php echo $page ?>.css">
    <?php } ?>
    <script src="/js/jquery-3.7.1.min.js"></script>
</head>

<body id="<?php echo $page ?>-page">

    <header>
        <div class="inner">

            <a href="/">
                <img src="/assets/images/logo.png" alt="Website logo">
            </a>

            <nav>
                <a href="/">Home</a>
                <a href="/about">About</a>
                <a href="/vehicles">Vehicles</a>
                <a href="/contact">Contact</a>
            </nav>

            <div id="hamburger-button">
                <div id="hamburger-icon">
                    <div class="hamburger-line"></div>
                    <div class="hamburger-line"></div>
                    <div class="hamburger-line"></div>
                </div>
            </div>

        </div>
    </header>