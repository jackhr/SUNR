$(function () {
    $("#pick-up-datetimepicker, #return-datetimepicker").datetimepicker({
        minDate: true
    });

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
        const returnToSameLocation = $("#return-to-same-location").prop('checked');
        const pickUpDate = $('#pick-up-datetimepicker').datetimepicker('getValue');
        const returnDate = $('#return-datetimepicker').datetimepicker('getValue')
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

    $("#itinerary-section .continue-btn").on('click', function () {
        $(".reservation-step[data-step='2'] .header").click();
    });

    $("#vehicle-add-ons .continue-btn").on('click', function () {
        $(".reservation-step[data-step='3'] .header").click();
    });

    $(".reservation-flow-container .continue-btn").on('click', async function () {

        const returnToSameLocation = $("#return-to-same-location").prop('checked');
        const pickUpLocation = $(".reservation-flow-container .pick-up .custom-select-options span.selected").text();

        const data = {
            pickUpLocation,
            returnLocation: returnToSameLocation ? pickUpLocation : $(".reservation-flow-container .return .custom-select-options span.selected").text(),
            returnToSameLocation,
            pickUpDate: {
                date: $('#pick-up-datetimepicker').datetimepicker('getValue'),
                ts: $('#pick-up-datetimepicker').datetimepicker('getValue').getTime(),
                value: $('#pick-up-datetimepicker').val()
            },
            returnDate: {
                date: $('#return-datetimepicker').datetimepicker('getValue'),
                ts: $('#return-datetimepicker').datetimepicker('getValue').getTime(),
                value: $('#return-datetimepicker').val()
            }
        };

        const formDataIsValid = handleInvalidFormData(data, "itinerary");

        if (!formDataIsValid) return;

        const cartSessionRes = await fetch('/includes/cart.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',  // Set Content-Type to JSON
            },
            body: JSON.stringify(data)
        });

        const cartSessionData = await cartSessionRes.json();
        console.log("cartSessionData:", cartSessionData);

        // update itinerary section
        $(".reservation-step.itinerary .body>div:first-child p").text(`${data.pickUpLocation} - ${data.pickUpDate.value}`);
        $(".reservation-step.itinerary .body>div:last-child p").text(`${data.returnLocation} - ${data.returnDate.value}`);

        // head to vehicle selection section
        $(".reservation-step.vehicle-add-on .header").trigger('click');
    });

    $(".form-input").on('focus change input click', function () {
        $(this).removeClass('form-error');
    });

});

function handleInvalidFormData(data, section) {
    let text;

    if (section === "itinerary") {

        if (!isWithinBusinessHours(data.pickUpDate.date)) {
            text = 'Pick up time must be between 8am and 6pm.';
            element = $('#pick-up-datetimepicker');
        } else if (!isWithinBusinessHours(data.returnDate.date)) {
            text = 'Return time must be between 8am and 6pm.';
            element = $('#return-datetimepicker');
        } else if (pickUpDateIsSameAsReturnDate(data)) {
            text = 'Return date cannot be same as pick up date.';
            element = $('#pick-up-datetimepicker, #return-datetimepicker');
        } else if (pickUpDateIsAfterReturnDate(data)) {
            text = 'Return date must be after pick up date.';
            element = $('#pick-up-datetimepicker, #return-datetimepicker');
        } else if (data.pickUpLocation === 'Choose Office' || !data.pickUpLocation) {
            text = 'Please select a pick up location.';
            element = $('.custom-select.pick-up');
        } else if (data.pickUpDate.value === "") {
            text = 'Please select a pick up date.';
            element = $('#pick-up-datetimepicker');
        } else if (data.returnDate.value === "") {
            text = 'Please select a return date.';
            element = $('#return-datetimepicker');
        } else if (!data.returnToSameLocation && (data.returnLocation === 'Choose Office' || !data.returnLocation)) {
            text = 'Please select a return location.';
            element = $('.custom-select.return');
        }

    }

    if (text) {
        Swal.fire({
            text,
            title: "Incomplete form",
            icon: "warning",
            confirmButtonText: "Ok"
        });
        element.addClass('form-error');
    }

    return !text;
}

function isWithinBusinessHours(date) {
    const hour = date.getHours();
    return hour >= 8 && hour <= 18;
}

function pickUpDateIsSameAsReturnDate(data) {
    const pickUpDay = getDayFromDate(data.pickUpDate.value);
    const returnDay = getDayFromDate(data.returnDate.value);
    return pickUpDay === returnDay;
}

function pickUpDateIsAfterReturnDate(data) {
    const pickUpDay = getDayFromDate(data.pickUpDate.value);
    const returnDay = getDayFromDate(data.returnDate.value);
    return pickUpDay > returnDay;
}

function getDayFromDate(dateStr) {
    return dateStr.split(' ')[0].split('/').map(Number)[2];
}