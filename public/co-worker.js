document.addEventListener("DOMContentLoaded", async function() {
    try {
        // Fetch user data from the server
        const response = await fetch('/user/profile');
        const userData = await response.json();

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