/** 
 * AJAX call for login. 
 * it sends the data of email and password input.
 * 
 * @author Jimun Jang
 * @date May 10, 2021
*/
const form = $('form')[0];
const error = $('.error')[0];

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    error.textContent = '';

    const email = form.email.value;
    const password = form.password.value;

    $.ajax({
        url: '/login',
        dataType: "json",
        type: "POST",
        data: {
            email,
            password
        },
        success: function (data) {
            window.location.href = '/feed';
        },
        error: function (data) {
            error.textContent = data.responseJSON.error;
        }
    })
})