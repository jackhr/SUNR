<?php

$title_suffix = "Reservation";
$page = "reservation";
$description = "Book a car rental with Shaquan's Car Rental. Choose from a variety of vehicles and rental options. Reserve your car today.";

include_once 'includes/header.php';

?>

<section class="general-header">
    <h1>Reservation</h1>

    <div id="reservation-steps">
        <div class="reservation-step itinerary">
            <div class="header">
                <span>1</span>
                <h2>Your Itinerary</h2>
            </div>
            <div class="body">
                <div>
                    <h6>Pick Up</h6>
                    <p>--</p>
                </div>
                <div>
                    <h6>Drop Off</h6>
                    <p>--</p>
                </div>
            </div>
        </div>
        <div class="reservation-step vehicle-add-on">
            <div class="header">
                <span>2</span>
                <h2>Select Vehicle/Add-ons</h2>
            </div>
            <div class="body">
                <div>
                    <h6>Type</h6>
                    <p>--</p>
                </div>
                <div>
                    <h6>Add-ons</h6>
                    <p>--</p>
                </div>
            </div>
        </div>
        <div class="reservation-step reservation">
            <div class="header">
                <span>3</span>
                <h2>Reserve Your Vehicle</h2>
            </div>
            <div class="body">
                <div>
                    <h6>Your Information</h6>
                    <p>--</p>
                </div>
                <div>
                    <h6>Payment Information</h6>
                    <p>--</p>
                </div>
            </div>
        </div>
    </div>
</section>

<section id="itinerary-section">
    <div class="inner">
        <h1>Reserve Your Vehicle</h1>
        <div class="reservation-flow-container">
            <div class="left">
                <div>
                    <h2>Pick Up</h2>
                    <div class="main-itinerary-box">
                        <div>
                            <h6>Place to pick up the Car*</h6>
                            <div class="custom-select pick-up">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
                                    <path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" />
                                </svg>
                                <span>Choose Office</span>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
                                    <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                                </svg>
                                <div class="custom-select-options">
                                    <span class="selected">Choose Office</span>
                                    <span>Airport</span>
                                    <span>Main Office</span>
                                </div>
                            </div>
                        </div>
                        <div class="checkbox-container">
                            <input id="return-to-same-location" type="checkbox" class="hidden-checkbox" hidden checked aria-checked="true" />
                            <div class="custom-checkbox"></div>
                            <label class="custom-checkbox-label">Return to the same location</label>
                        </div>
                        <div>
                            <h6>Pick-up Date/Time*</h6>
                            <input type="text" id="pick-up-datetimepicker" placeholder="Pickup Date">
                        </div>
                    </div>
                    <h2>Return</h2>
                    <div class="main-itinerary-box">
                        <div style="display: none;">
                            <h6>Place to drop the Car*</h6>
                            <div class="custom-select return">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
                                    <path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" />
                                </svg>
                                <span>Choose Office</span>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
                                    <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                                </svg>
                                <div class="custom-select-options">
                                    <span class="selected">Choose Office</span>
                                    <span>Airport</span>
                                    <span>Main Office</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h6>Drop Date/Time*</h6>
                            <input type="text" id="return-datetimepicker" placeholder="Return Date">
                        </div>
                    </div>
                    <div class="continue-btn">Continue Reservation</div>
                </div>
            </div>
            <?php include_once 'includes/reservation-summary.php'; ?>
        </div>
    </div>
</section>


<?php include_once 'includes/footer.php'; ?>