document.querySelector('.login-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent default form submission

    // Get the username (email) and password entered by the user
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        // Send login credentials to server for authentication
        const response = await fetch('https://work-wise-group-project.vercel.app/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email, password})
        });

        if (!response.ok) {
            // Handle unsuccessful responses (non-2xx HTTP statuses)
            const errorData = await response.json();  // Use .json() to parse the response
            console.error('Login failed:', errorData.error || 'Unknown error');
            alert(errorData.error || 'Unknown error');
            return;
        }

        const data = await response.json();
        console.log('Parsed data:', data);

        // Handle successful login
        localStorage.setItem('token', data.token);
        if (data.userType === 'owner') {
            window.location.href = '/owner.html';
        } else if (data.userType === 'coworker') {
            window.location.href = '/co-worker.html';
        }

    } catch (error) {
        console.error('Login error:', error);
        alert('An error occurred during login. Please try again.');
    }
});