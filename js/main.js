const STATE = {
    configFP: {
        enableTime: true,
        altInput: true,
        altFormat: "F j, Y h:i K",
        dateFormat: "Y-m-d H:i",
        minDate: "today",
    },
    pickUpFP: null,
    returnFP: null
};

$(function () {
    STATE.pickUpFP = $("#pick-up-flatpickr").flatpickr(STATE.configFP);
    STATE.returnFP = $("#return-flatpickr").flatpickr(STATE.configFP);

    $(".checkbox-container").on('click', function () {
        const checkbox = $(this).find('input');
        const isChecked = checkbox.prop('checked');
        const onReservationPage = $('body').prop('id') === 'reservation-page';
        const elementToToggle = onReservationPage ? $('.custom-select.return').parent('div') : $('.custom-select.return');

        checkbox.prop('checked', !isChecked);
        elementToToggle.slideToggle(!isChecked);
    });

    $(".custom-select").on('click', function () {
        $(".custom-select").removeClass('active');
        $(this).addClass('active');
        $('html').addClass('viewing-custom-select-options');
    });

    $(".custom-select-options span").on('click', function (e) {
        e.stopPropagation();
        $('html').removeClass('viewing-custom-select-options');
        $(this).siblings().removeClass('selected');
        $(this).addClass('selected');
        const option = $(this).text();
        $(".custom-select.active > span").text(option);
        $(".custom-select").removeClass('active');
    });

    $("body .overlay").on('click', function () {
        if ($('html').hasClass('viewing-custom-select-options')) {
            $('html').removeClass('viewing-custom-select-options');
        }
        if ($('html').hasClass('viewing-hamburger-menu')) {
            $('html').removeClass('viewing-hamburger-menu');
        }
    });

    $("#intro-section form").on('submit', async function (e) {
        // prevent the form from submitting
        e.preventDefault();

        $(".form-input").removeClass('form-error');

        const returnToSameLocation = $("#return-to-same-location").prop('checked');
        const pickUpLocation = $(".reservation-flow-container .pick-up .custom-select-options span.selected").text();

        const data = {
            action: "itinerary",
            pickUpLocation,
            returnLocation: returnToSameLocation ? pickUpLocation : $(".reservation-flow-container .return .custom-select-options span.selected").text(),
            returnToSameLocation: {
                checked: returnToSameLocation,
                value: returnToSameLocation ? "on" : "off"
            },
            pickUpDate: {
                date: STATE.pickUpFP.selectedDates[0],
                ts: STATE.pickUpFP.selectedDates[0]?.getTime?.(),
                value: STATE.pickUpFP.input.value,
                altValue: STATE.pickUpFP.altInput.value
            },
            returnDate: {
                date: STATE.returnFP.selectedDates[0],
                ts: STATE.returnFP.selectedDates[0]?.getTime?.(),
                value: STATE.returnFP.input.value,
                altValue: STATE.returnFP.altInput.value
            },
            step: 2
        };

        const formDataIsValid = handleInvalidFormData(data, "itinerary");

        if (!formDataIsValid) return;

        const ReservationSessionRes = await fetch('/includes/reservation.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',  // Set Content-Type to JSON
            },
            body: JSON.stringify(data)
        });

        const reservationSessionData = await ReservationSessionRes.json();

        // update itinerary section
        $(".reservation-step.itinerary .body>div:first-child p").text(`${data.pickUpLocation} - ${data.pickUpDate.altValue}`);
        $(".reservation-step.itinerary .body>div:last-child p").text(`${data.returnLocation} - ${data.returnDate.altValue}`);

        // head to vehicle selection section
        Swal.fire({
            title: "Setting Itinerary...",
            timer: 1000,
            didOpen: () => Swal.showLoading()
        }).then(() => $(".reservation-step.vehicle-add-on .header").trigger('click'));
    });

    $(".faq").on('click', function () {
        $(this).toggleClass('open');
        $(this).find('.faq-answer').slideToggle();
    });

    $(".reservation-step").on('click', function () {
        if ($(this).hasClass('active')) return;
        const step = $(this).data('step');
        const currentStep = $(".reservation-step.active").data('step');
        $(".reservation-step").removeClass('active');
        $(this).addClass('active');

        $("section[data-step]").hide();
        $(`section[data-step="${step}"]`).first().show();
    });

    $(".vehicle-container .continue-btn").on('click', async function () {
        const vehicleContainer = $(this).closest('.vehicle-container');

        if (vehicleContainer.hasClass('active')) return goToAddOns();

        const id = vehicleContainer.data('vehicle-id');
        const name = vehicleContainer.find('.vehicle-name').text();
        const type = vehicleContainer.find('.vehicle-type').text();
        const imgSrc = vehicleContainer.children('img').attr('src');
        const data = {
            action: "vehicle",
            step: 2,
            id,
            name,
            type,
            imgSrc
        };

        const ReservationSessionRes = await fetch('/includes/reservation.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',  // Set Content-Type to JSON
            },
            body: JSON.stringify(data)
        });

        const reservation = await ReservationSessionRes.json();

        await Swal.fire({
            title: `Choosing ${name} (${type})...`,
            timer: 1500,
            didOpen: () => Swal.showLoading()
        });

        $('.vehicle-container').removeClass('active');
        vehicleContainer
            .addClass('active')
            .find('.continue-btn').text('CONTINUE');

        $(".reservation-step.vehicle-add-on .body>div:first h6, #reservation-summary>h5").text(name);
        $(".reservation-step.vehicle-add-on .body>div:first p, #reservation-summary>h6").text(type);

        $("#reservation-summary div.car.summary").html(`<img src="${imgSrc}" alt="${name}">`);

        const rate = {
            days: 1,
            rate: makePriceString(reservation.vehicle.price_day),
            subtotal: makePriceString(reservation.vehicle.price_day)
        };

        if (reservation.itinerary) {
            rate.days = getDifferenceInDays(reservation.itinerary.pickUpDate.ts, reservation.itinerary.returnDate.ts);
            rate.subtotal = makePriceString(reservation.vehicle.price_day, rate.days);
        }

        $("#reservation-summary div.rate.summary").html(`
            <h6>Rate</h6>
            <table>
                <thead>
                    <tr>
                        <th>Day(s)</th>
                        <th>Rate</th>
                        <th>Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>${rate.days}</td>
                        <td>${rate.rate}</td>
                        <td>${rate.subtotal}</td>
                    </tr>
                </tbody>
            </table>
        `);

        const totalAddOnsCost = reservation.add_ons ? Object.values(reservation.add_ons).reduce((sum, addOn) => sum + parseInt(addOn.cost), 0) : 0;

        $("#reservation-summary .estimated-total span:last-child").text(makePriceString(totalAddOnsCost + (reservation.vehicle.price_day * rate.days), getDifferenceInDays(reservation.itinerary.pickUpDate.ts, reservation.itinerary.returnDate.ts)));

        goToAddOns();

    });

    $(".more-add-on-info").on('click', function () {
        const container = $(this).closest('.add-on-container')
        const viewingInfo = container.hasClass('viewing-info');

        container.toggleClass('viewing-info', !viewingInfo);
        container.children('p').slideToggle(!viewingInfo);
    });

    $(".add-on-btn").on('click', async function () {
        const addOnContainer = $(this).closest('.add-on-container');
        const data = {
            action: $(this).hasClass('added') ? "remove_add_on" : "add_add_on",
            id: addOnContainer.data('id')
        };

        const ReservationSessionRes = await fetch('/includes/reservation.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',  // Set Content-Type to JSON
            },
            body: JSON.stringify(data)
        });

        const reservation = await ReservationSessionRes.json();

        let rows = '', spans = '', html = '', count = 0;

        for (const id in reservation.add_ons) {
            count++;
            const addOn = reservation.add_ons[id];
            rows += `
                <tr data-id="${addOn.id}">
                    <td>${addOn.name}</td>
                    <td>${makePriceString(addOn.cost)}</td>
                </tr>
            `;

            spans += `${count > 1 ? ", " : ""}<span data-id="${addOn.id}">${addOn.abbr}</span>`;
        }

        // Calculate and append the total cost row
        const totalAddOnsCost = reservation.add_ons ? Object.values(reservation.add_ons).reduce((sum, addOn) => sum + parseInt(addOn.cost), 0) : 0;

        if (rows.length) {
            html = `
                <h6>Add-ons</h6>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Cost</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rows}
                        <tr>
                            <td>Add-ons Charges Rate</td>
                            <td>${makePriceString(totalAddOnsCost)}</td>
                        </tr>
                    </tbody>
                </table>
            `
        } else {
            html = `
                <h6>Add-ons</h6>
                <div><span>--</span><span>--</span><span>--</span></div>
            `;
        }

        const rentalSubtotal = parseInt(reservation.vehicle.price_day) * getDifferenceInDays(reservation.itinerary.pickUpDate.ts, reservation.itinerary.returnDate.ts);

        $("#reservation-summary div.add-ons.summary").html(html);
        $(".reservation-step.vehicle-add-on .body > div:last-child p").html(spans || "--");
        $("#reservation-summary .estimated-total span:last-child").text(makePriceString(totalAddOnsCost + rentalSubtotal, getDifferenceInDays(reservation.itinerary.pickUpDate.ts, reservation.itinerary.returnDate.ts)));

        if ($(this).hasClass('added')) {
            $(this).removeClass('added');
            $(this).addClass('show-removed');
            setTimeout(() => $(this).removeClass('show-removed'), 1000);
        } else {
            $(this).addClass('added show-added');
            setTimeout(() => $(this).removeClass('show-added'), 1000);
        }
    });

    $(".change-car-btn").on('click', function () {
        $(".reservation-step.vehicle-add-on .header").trigger('click');
        $("section[data-step]").hide();
        $("#vehicle-selection-section").show();
    });

    $("#vehicle-add-ons .continue-btn:not(.change-car-btn)").on('click', function () {
        $(".reservation-step[data-step='3'] .header").click();
    });

    $("#itinerary-section .continue-btn:not(.change-car-btn)").on('click', async function () {

        $(".form-input").removeClass('form-error');

        const returnToSameLocation = $("#return-to-same-location").prop('checked');
        const pickUpLocation = $(".reservation-flow-container .pick-up .custom-select-options span.selected").text();

        const data = {
            action: "itinerary",
            pickUpLocation,
            returnLocation: returnToSameLocation ? pickUpLocation : $(".reservation-flow-container .return .custom-select-options span.selected").text(),
            returnToSameLocation: {
                checked: returnToSameLocation,
                value: returnToSameLocation ? "on" : "off"
            },
            pickUpDate: {
                date: STATE.pickUpFP.selectedDates[0],
                ts: STATE.pickUpFP.selectedDates[0]?.getTime?.(),
                value: STATE.pickUpFP.input.value,
                altValue: STATE.pickUpFP.altInput.value
            },
            returnDate: {
                date: STATE.returnFP.selectedDates[0],
                ts: STATE.returnFP.selectedDates[0]?.getTime?.(),
                value: STATE.returnFP.input.value,
                altValue: STATE.returnFP.altInput.value
            },
            step: 2
        };

        const formDataIsValid = handleInvalidFormData(data, "itinerary");

        if (!formDataIsValid) return;

        const ReservationSessionRes = await fetch('/includes/reservation.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',  // Set Content-Type to JSON
            },
            body: JSON.stringify(data)
        });

        const reservationSessionData = await ReservationSessionRes.json();

        // update itinerary section
        $(".reservation-step.itinerary .body>div:first-child p").text(`${data.pickUpLocation} - ${data.pickUpDate.altValue}`);
        $(".reservation-step.itinerary .body>div:last-child p").text(`${data.returnLocation} - ${data.returnDate.altValue}`);

        // head to vehicle selection section
        Swal.fire({
            title: "Setting Itinerary...",
            timer: 1000,
            didOpen: () => Swal.showLoading()
        }).then(() => $(".reservation-step.vehicle-add-on .header").trigger('click'));
    });

    $(".form-input").on('focus change input click', function () {
        $(this).removeClass('form-error');
    });

    $(".reset-data").on('click', async function () {
        const response = await Swal.fire({
            icon: 'warning',
            title: 'Are you sure you want to reset the form?',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        });

        if (response.isConfirmed) {
            await fetch('/includes/reservation.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',  // Set Content-Type to JSON
                },
                body: JSON.stringify({ action: "reset_reservation" })
            });

            location.reload();
        }
    });

    $("#hamburger-button").on('click', function () {
        $("html").addClass('viewing-hamburger-menu');
    });

    $("#close-hamburger").on('click', function () {
        $("html").removeClass('viewing-hamburger-menu');
    });

});

function handleInvalidFormData(data, section) {
    let text;

    if (section === "itinerary") {

        if (data.pickUpLocation === 'Choose Office' || !data.pickUpLocation) {
            text = 'Please select a pick up location.';
            element = $('.custom-select.pick-up');
        } else if (!data.pickUpDate.date) {
            text = 'Please select a pick up date.';
            element = $('#pick-up-flatpickr + input');
        } else if (!isWithinBusinessHours(data.pickUpDate.date)) {
            text = 'Pick up time must be between 8am and 6pm.';
            element = $('#pick-up-flatpickr + input');
        } else if (!data.returnToSameLocation.checked && (data.returnLocation === 'Choose Office' || !data.returnLocation)) {
            text = 'Please select a return location.';
            element = $('.custom-select.return');
        } else if (!data.returnDate.date) {
            text = 'Please select a return date.';
            element = $('#return-flatpickr + input');
        } else if (!isWithinBusinessHours(data.returnDate.date)) {
            text = 'Return time must be between 8am and 6pm.';
            element = $('#return-flatpickr + input');
        } else if (pickUpDateIsSameAsReturnDate(data)) {
            text = 'You cannot pick up and return the car on the same day.';
            element = $('#pick-up-flatpickr + input, #return-flatpickr + input');
        } else if (pickUpDateIsAfterReturnDate(data)) {
            text = 'You have to return the car at least one day after pick up.';
            element = $('#pick-up-flatpickr + input, #return-flatpickr + input');
        }

    }

    if (text) {
        Swal.fire({
            text,
            title: "Incomplete form",
            icon: "warning",
            confirmButtonText: "Ok",
        });
        element.addClass('form-error');
    }

    return !text;
}

function isWithinBusinessHours(date) {
    const hour = date?.getHours?.();
    return hour >= 8 && hour <= 18;
}

function pickUpDateIsSameAsReturnDate(data) {
    const pickUpDay = getDayFromDate(data.pickUpDate.altValue);
    const returnDay = getDayFromDate(data.returnDate.altValue);
    return pickUpDay === returnDay && (data.pickUpDate.ts + 86400000 > data.returnDate.ts); // could be same day but different month
}

function pickUpDateIsAfterReturnDate(data) {
    const pickUpDay = getDayFromDate(data.pickUpDate.altValue);
    const returnDay = getDayFromDate(data.returnDate.altValue);
    return pickUpDay > returnDay && (data.pickUpDate.ts - 86400000 > data.returnDate.ts); // could be same day but different month;
}

function getDayFromDate(dateStr) {
    // dateStr = "April 24, 2024 10:00 am"
    if (!dateStr) return;
    return Number(dateStr.split(',')[0].split(' ')[1]);
}

function goToAddOns() {
    $("#vehicle-selection-section").hide();
    $("#vehicle-add-ons").show();
}

function customSerialize(obj) {
    const queryParams = [];

    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const value = obj[key];

            // Handle nested objects recursively
            if (typeof value === 'object' && !Array.isArray(value)) {
                for (const nestedKey in value) {
                    if (value.hasOwnProperty(nestedKey)) {
                        const nestedValue = value[nestedKey];
                        queryParams.push(`${key}[${nestedKey}]=${encodeURIComponent(nestedValue)}`);
                    }
                }
            } else {
                queryParams.push(`${key}=${encodeURIComponent(value)}`);
            }
        }
    }

    return queryParams.join('&');  // Join with '&' to create the query parameter string
}


function getDifferenceInDays(pickUpDate, returnDate) {
    const start = new Date(pickUpDate);
    const end = new Date(returnDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
    return diffDays;
}

function makePriceString(rate, days = 1) {
    return `$EC${parseInt(rate) * days}`;
}
