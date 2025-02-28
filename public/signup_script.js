// Function to validate password
function isValidPassword(password) {
    console.log("Validating password:", password);
    // Password must contain at least one capital letter, one lowercase letter, one number, and be at least 8 characters long
    var capitalRegex = /[A-Z]/;
    var lowercaseRegex = /[a-z]/;
    var numberRegex = /[0-9]/;
    var isValid = password.length >= 8 && capitalRegex.test(password) && lowercaseRegex.test(password) && numberRegex.test(password);
    console.log("Password is valid:", isValid);
    console.log("Length:", password.length);
    console.log("Capital:", capitalRegex.test(password));
    console.log("Lowercase:", lowercaseRegex.test(password));
    console.log("Number:", numberRegex.test(password));
    return isValid;
}

// form submission
document.getElementById("signup-form").addEventListener("submit", async function(event) {
    event.preventDefault();

    var fullname = document.getElementById("fullname").value;
    var email = document.getElementById("email").value;
    var phone = document.getElementById("phone").value;
    var password = document.getElementById("password").value;
    var userType = document.getElementById("userType").value;

    // Validate password
    if (!isValidPassword(password)) {
        document.getElementById("password-error").textContent = "Password must contain at least one capital letter, one lowercase letter, one number, and be at least 8 characters long.";
        return; // Stop form submission
    }

    // Store user information in localStorage
    var userData = {
        fullname: fullname,
        email: email,
        phone: phone,
        password: password,
        userType: userType
    };

    try {
        // Send signup data to server
        const response = await fetch('/user/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

    const data = await response.json(); // Read the response as text
    console.log(data); 

        // Redirect based on server response (userType)
        if (userData.userType === 'owner') {
            window.location.href = '/owner.html';
        } else if (userData.userType === 'coworker') {
            window.location.href = '/co-worker.html';
        } else {
            console.log('Invalid user type');
        }
    } catch (error) {
        console.error('Signup error:', error);
        // Handle signup error (e.g., display error message)
    }

    /*// Convert userData to JSON and store it in localStorage
    localStorage.setItem(email, JSON.stringify(userData));

    // Set user email for retrieval in owner.html
    localStorage.setItem("userEmail", email);
    var redirectUrl = userType === 'owner' ? 'owner.html' : 'co-worker.html';
    window.location.href = redirectUrl;]*/
});