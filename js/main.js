$(document).ready(() => {
    $("#pick-up-datetimepicker, #return-datetimepicker").datetimepicker({
        minDate: true
    });

    $(".checkbox-container").click(function () {
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
        $(".custom-select-options span").removeClass('selected');
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
        $(`section[data-step="${step}"]`).show();
    });
});
