/** 
 * AJAX call for sign up. 
 * 
 * @author Jimun Jang
 * @date May 10, 2021
*/

const form = $('form')[0];
const error = $('.error')[0];
const confirm_button = $('#confirm');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    error.textContent = '';

    const email = form.email.value.strip();
    const password = form.password.value;
    const name = form.name.value.strip();
    const longitude = form.longitude.value;
    const latitude = form.latitude.value;


    $.ajax({
        url: '/signup',
        dataType: "json",
        type: "POST",
        data: {
            email,
            longitude,
            latitude,
            password,
            name
        },
        success: function (data) {
            $('#pop-up-background').css("visibility", "visible");
            $('#pop-up-menu').css("visibility", "visible");
            $('#pop-up-menu p').text('Your account is successfully created!');
        },
        error: function (data) {
            error.textContent = data.responseJSON.error;
        }
    })
})

confirm_button.click(() => {
    window.location.href = '/template';
})