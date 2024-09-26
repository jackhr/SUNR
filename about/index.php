<?php

$title_override = "About Shaquan's Car Rental: Your Trusted Partner for Island Adventures";
$page = "about";
$description = "Learn about Shaquan's Car Rental. We offer quality vehicles and reliable rentals for a convenient stay. Learn our history and commitment to customer satisfaction.";
$structured_data = [
    [
        "@context" => "https://schema.org",
        "@type" => "AboutPage",
        "name" => "Shaquan's Car Rental | About",
        "description" => $description,
        "url" => "https://www.shaquanscarrental.com/about/",
        "publisher" => [
            "@type" => "Organization",
            "name" => "Shaquan's Car Rental",
            "logo" => "https://www.shaquanscarrental.com/logo.avif",
            "url" => "https://www.shaquanscarrental.com/"
        ]
    ]
];

include_once '../includes/header.php';

?>

<section class="general-header">
    <h1>About</h1>
</section>

<section id="about-section">
    <div class="inner">
        <div class="about-panel">
            <img src="/assets/images/misc/smiley-couple-traveling-by-car.jpg" alt="Smiling couple traveling by car.">
            <div>
                <h2>WELCOME TO SHAQUAN's CAR RENTAL</h2>
                <p>Shaquan's Car Rental has been servicing the transport industry in Antigua for years and we are dedicated to growing our company as the tourism sector and economy of Antigua & Barbuda expands.</p>
                <p>Whether you’re a new visitor to our islands or a national returning for a family gathering, we welcome all. Shaquan's Car Rental is here to provide quality transportation services customized to your specific needs.</p>
                <em>— Shaquan, Owner of Shaquan's Car Rental</em>
            </div>
        </div>

        <div class="about-panel">
            <img src="/assets/images/misc/scenic-view-sea-against-clear-sky.jpg" alt="Scenic view sea against clear sky.">
            <div>
                <h2>WELCOME TO ANTIGUA</h2>
                <p>Antigua has so much to offer our visitors. We at Keys Car Rental want to make your visit one of discovery and exploration. Please don’t hesitate to ask us for guidance – we will do our best to point you in the right direction.</p>
                <ul>
                    <li>365 Beaches to explore</li>
                    <li>World Renowned Nelson’s Dockyard National Park</li>
                    <li>Fig Tree Drive & The Rainforest</li>
                    <li>Nightlife & Entertainment</li>
                    <li>So much more…</li>
                </ul>
            </div>
        </div>
    </div>
</section>


<?php include_once '../includes/footer.php'; ?>