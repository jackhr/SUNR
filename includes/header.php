<?php

include 'connection.php';

$description = isset($description) ? $description : "Welcome to Shaquan's Car Rental. We offer a wide selection of vehicles for rent. Book your car today!";

$base_title = "Shaquan's Car Rental";

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
    <!-- favicon begin -->
    <link rel="apple-touch-icon" sizes="180x180" href="/assets/images/favicon/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/assets/images/favicon/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/assets/images/favicon/favicon-16x16.png">
    <link rel="manifest" href="/assets/images/favicon/site.webmanifest">
    <!-- favicon end -->
    <title><?php echo $title ?></title>
    <link type="text/css" rel="stylesheet" href="/styles/main.css">
    <link type="text/css" rel="stylesheet" href="/js/datetimepicker-master/build/jquery.datetimepicker.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <?php if (isset($page) && file_exists("styles/{$page}.css")) { ?>
        <link type="text/css" rel="stylesheet" href="/styles/<?php echo $page ?>.css">
    <?php } ?>
    <script src="/js/jquery-3.7.1.min.js"></script>
    <script src="/js/datetimepicker-master/build/jquery.datetimepicker.full.min.js"></script>
    <script defer src="/js/main.js"></script>
</head>

<body id="<?php echo $page ?>-page">

    <div class="overlay"></div>

    <header>
        <div class="inner">

            <a href="/">
                <img src="/assets/images/logo.png" alt="Website logo">
            </a>

            <nav>
                <a href="/">Home</a>
                <a href="/about.php">About</a>
                <a href="/vehicles.php">Vehicles</a>
                <a href="/faq.php">FAQ</a>
                <a href="/contact.php">Contact</a>
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