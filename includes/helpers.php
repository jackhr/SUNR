<?php

function getDifferenceInDays($pickUpDate, $returnDate)
{
    $start = new DateTime($pickUpDate);
    $end = new DateTime($returnDate);
    $diff = $start->diff($end);
    return $diff->days;
}

function makePriceString($rate, $days = 1)
{
    return '$EC' . ((int)$rate * $days);
}
