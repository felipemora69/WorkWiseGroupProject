document.querySelector('.login-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent default form submission

    // Get the username (email) and password entered by the user
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        // Send login credentials to server for authentication
        const response = await fetch('https://work-wise-group-project-fefndwv6u-felipemora69s-projects.vercel.app/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email, password})
        });

        const data = await response.json();

        console.log(data);

        // Redirect based on server response (userType)
        if (response.ok) {
            // Store the token in localStorage or a cookie
            localStorage.setItem('token', data.token);
            console.log('Login successful. Redirecting...');

            // Redirect based on userType
            if (data.userType === 'owner') {
                window.location.href = '/owner.html';
            } else if (data.userType === 'coworker') {
                window.location.href = '/co-worker.html';
            } else {
                console.log('Invalid user type');
            }
        } else {
            console.error('Login failed:', data.error);
        }

    } catch (error) {
        console.error('Login error:', error);
    }
});