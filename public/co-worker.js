document.addEventListener("DOMContentLoaded", async function() {
    try {

        // Retrieve the token from localStorage
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/login.html'; // Redirect to login if no token found
            return;
        }
        
        // Fetch user profile data
        const userResponse = await fetch('/user/profile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const userData = await userResponse.json();

        // Fill out user fields
        document.getElementById("name").textContent = userData.fullname;
        document.getElementById("email").textContent = userData.email;
        document.getElementById("phoneNumber").textContent = userData.phone;

        // Fetch rented workspaces for the user
        const bookingsResponse = await fetch('/bookings/' + userData.username);
        const bookings = await bookingsResponse.json();

        // Display rented workspaces
        const rentalsContainer = document.getElementById("rentals-container");
        bookings.forEach(function(booking) {
            const workspaceItem = document.createElement("div");
            workspaceItem.classList.add("workspace-item");
            workspaceItem.innerHTML = `
                <p><strong>Workspace:</strong> ${booking.workspaceTitle}</p>
                <p><strong>Start Date:</strong> ${new Date(booking.startDate).toLocaleDateString()}</p>
                <p><strong>End Date:</strong> ${new Date(booking.endDate).toLocaleDateString()}</p>
            `;
            rentalsContainer.appendChild(workspaceItem);
        });
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
});