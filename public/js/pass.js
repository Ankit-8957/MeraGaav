const form = document.querySelector('.needs-validation');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');
const feedback = document.getElementById('password-feedback');

form.addEventListener('submit', function (event) {
    // Check if passwords match
    if (password.value !== confirmPassword.value) {
        event.preventDefault();
        event.stopPropagation();
        confirmPassword.classList.add('is-invalid'); // show red border
        feedback.style.display = 'block'; // show feedback
    } else {
        confirmPassword.classList.remove('is-invalid');
        feedback.style.display = 'none';
    }

    form.classList.add('was-validated');
}, false);