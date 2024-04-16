$(document).ready(() => {
    $("#pick-up-datetimepicker, #return-datetimepicker").datetimepicker({
        minDate: true
    });

    $(".checkbox-container").click(function () {
        const checkbox = $(this).find('input');
        const isChecked = checkbox.prop('checked');
        checkbox.prop('checked', !isChecked);
        $('.custom-select.return').slideToggle(!isChecked);
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
});
