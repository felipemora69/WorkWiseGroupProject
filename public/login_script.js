document.querySelector('.login-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent default form submission

    // Get the username (email) and password entered by the user
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        // Send login credentials to server for authentication
        const response = await fetch('/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email, password})
        });

        const data = await response.json();
        console.log(data); // Log response from server

        // Redirect based on server response (userType)
        if (data.userType === 'owner') {
            window.location.href = '/owner.html';
        } else if (data.userType === 'coworker') {
            window.location.href = '/co-worker.html';
        } else {
            console.log('Invalid user type');
        }

    } catch (error) {
        console.error('Login error:', error);
    }
});