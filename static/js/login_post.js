const form = document.querySelector('form');
form.addEventListener('submit', (e) => {

    const email = form.email.value;
    const password = form.password.value;

    console.log(email, password);
});
