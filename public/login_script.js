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

        const text = await response.text();  // Read the raw response text
        console.log('Raw response:', text);  // Log the raw response for debugging

        const data = JSON.parse(text);  // Try to parse the response as JSON
        console.log('Parsed data:', data);

        if (response.ok) {
            // Handle successful login
            localStorage.setItem('token', data.token);
            if (data.userType === 'owner') {
                window.location.href = '/owner.html';
            } else if (data.userType === 'coworker') {
                window.location.href = '/co-worker.html';
            }
        } else {
            console.error('Login failed:', data.error);
        }
    } catch (error) {
        console.error('Login error:', error);
    }
});