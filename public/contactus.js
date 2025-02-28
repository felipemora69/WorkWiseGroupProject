document.addEventListener('DOMContentLoaded', function () {
    // Toggle menu functionality
    const menuToggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.menu');

    menuToggle.addEventListener('click', function () {
        menu.classList.toggle('open');
    });

    // Input focus and blur functionality
    const inputs = document.querySelectorAll(".input");

    function focusInput() {
        let parent = this.parentNode;
        parent.classList.add("focus");
    }

    function blurInput() {
        let parent = this.parentNode;
        if (this.value == "") {
            parent.classList.remove("focus");
        }
    }

    inputs.forEach((input) => {
        input.addEventListener("focus", focusInput);
        input.addEventListener("blur", blurInput);
    });

    // Form submission functionality
    const contactForm = document.querySelector('.contact-form form');

    function submitForm(event) {
        event.preventDefault(); // Prevent the form from submitting

        // Perform form validation here
        const formData = new FormData(contactForm);

        // For demonstration, let's log the form data
        for (let pair of formData.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
        }

        // Clear the form fields after submission (optional)
        contactForm.reset();

        // Display a success message or perform any other action
        console.log('Form submitted successfully!');
    }

    contactForm.addEventListener('submit', submitForm);
});