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
        $('body').addClass('viewing-custom-select-options');
    });

    $(".custom-select-options span").on('click', function (e) {
        e.stopPropagation();
        $('body').removeClass('viewing-custom-select-options');
        $(this).siblings().removeClass('selected');
        $(this).addClass('selected');
        const option = $(this).text();
        $(".custom-select.active > span").text(option);
        $(".custom-select").removeClass('active');
    });

    $("body .overlay").on('click', function () {
        if ($('body').hasClass('viewing-custom-select-options')) {
            $('body').removeClass('viewing-custom-select-options');
        }
    });

    $("#intro-section form").on('submit', function (e) {
        // prevent the form from submitting
        e.preventDefault();
        // get values form form
        const form = $(this);
        const pickUpLocation = $('.custom-select.pick-up>span').text();
        const returnLocation = $('.custom-select.return>span').text();
        const returnToSameLocation = $("#return-to-same-location").prop('checked') + 0; // convert boolean to integer
        const pickUpDate = $('#pick-up-flatpickr').flatpickr('getValue');
        const returnDate = $('#return-flatpickr').flatpickr('getValue')
        // append values to the action of the form
        const action = form.attr('action');
        const newAction = `${action}?pick-up-location=${pickUpLocation}&return-location=${returnLocation}&return-to-same-location=${returnToSameLocation}&pick-up-date=${pickUpDate}&return-date=${returnDate}`;
        form.attr('action', newAction);
        // submit the form
        window.location.href = newAction;
    });

    $(".faq").on('click', function () {
        $(this).toggleClass('open');
        $(this).find('.faq-answer').slideToggle();
    });

    $(".reservation-step .header").on('click', function () {
        const container = $(this).parent('.reservation-step');
        if (container.hasClass('active')) return;
        const step = container.data('step');
        const currentStep = $(".reservation-step.active").data('step');
        $(".reservation-step").removeClass('active');
        container.addClass('active');

        $("section[data-step]").hide();
        $(`section[data-step="${step}"]`).first().show();
    });

    $(".vehicle-container .continue-btn").on('click', function () {
        $("#vehicle-selection-section").hide();
        $("#vehicle-add-ons").show();
    });

    $(".more-add-on-info").on('click', function () {
        const container = $(this).closest('.add-on-container')
        const viewingInfo = container.hasClass('viewing-info');

        container.toggleClass('viewing-info', !viewingInfo);
        container.children('p').slideToggle(!viewingInfo);
    });

    $(".add-on-btn").on('click', function () {
        $(this).toggleClass('added');
    });

    $("#vehicle-add-ons .continue-btn").on('click', function () {
        $(".reservation-step[data-step='3'] .header").click();
    });

    $("#itinerary-section .continue-btn").on('click', async function () {

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
        $(".reservation-step.itinerary .body>div:first-child p").text(`${data.pickUpLocation} - ${data.pickUpDate.value}`);
        $(".reservation-step.itinerary .body>div:last-child p").text(`${data.returnLocation} - ${data.returnDate.value}`);

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
            const ReservationSessionRes = await fetch('/includes/reservation.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',  // Set Content-Type to JSON
                },
                body: JSON.stringify({ action: "reset_reservation" })
            });

            const reservationSessionData = await ReservationSessionRes.json();
        }
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
    return pickUpDay === returnDay;
}

function pickUpDateIsAfterReturnDate(data) {
    const pickUpDay = getDayFromDate(data.pickUpDate.altValue);
    const returnDay = getDayFromDate(data.returnDate.altValue);
    return pickUpDay > returnDay;
}

function getDayFromDate(dateStr) {
    // dateStr = "April 24, 2024 10:00 am"
    if (!dateStr) return;
    return Number(dateStr.split(',')[0].split(' ')[1]);
}