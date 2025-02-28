document.addEventListener("DOMContentLoaded", async () => {

    const params = new URLSearchParams(window.location.search);
    const workspaceTitle = params.get('name');
    const category = params.get('category');
    const price = parseFloat(params.get('price'));
    const description = params.get('description');
    const location = params.get('location');
    const address = params.get('address');
    const area = params.get('area');
    const capacity = params.get('capacity');
    const smoking = params.get('smoking');
    const parking = params.get('parking');
    const distanceToTransport = params.get('distanceToTransport');
    const images = JSON.parse(params.get('images'));
    const userName = localStorage.getItem('userName');

    document.getElementById('workspace-title').textContent = workspaceTitle;
    document.getElementById('price').textContent = `Price: $${price} /h`;
    document.getElementById('description').textContent = description;
    document.getElementById('location').textContent = `Location: ${location}`;
    document.getElementById('address').textContent = address;
    document.getElementById('area').textContent = area + " m2";
    document.getElementById('capacity').textContent = capacity;
    const galleryElement = document.getElementById('image-gallery');

    let currentIndex = 0;

    // Show initial image
    const showImage = (index) => {
        galleryElement.innerHTML = ''; // Clear previous images
        const imgElement = document.createElement('img');
        imgElement.src = images[index];
        galleryElement.appendChild(imgElement);
    };

    // Show initial image
    showImage(currentIndex);

    // Next button 
    document.getElementById('nextButton').addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % images.length;
        showImage(currentIndex);
    });

    // Previous button
    document.getElementById('prevButton').addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        showImage(currentIndex);
    });

    // Calculate total price
    const calculateTotalPrice = () => {
        const startDate = new Date(document.querySelector('input[type="date"]').value);
        const endDate = new Date(document.querySelectorAll('input[type="date"]')[1].value);
        const startTime = new Date(`1970-01-01T${document.querySelectorAll('input[type="time"]')[0].value}`);
        const endTime = new Date(`1970-01-01T${document.querySelectorAll('input[type="time"]')[1].value}`);

        const startDateTime = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), startTime.getHours(), startTime.getMinutes());
        const endDateTime = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), endTime.getHours(), endTime.getMinutes());

        // Check if start date is before end date
        if (startDateTime >= endDateTime) {
            document.getElementById('total').textContent = 'Invalid dates';
            alert('Invalid dates')
            return;
        }

        const currentDate = new Date();
        if (startDate <= currentDate || endDate <= currentDate) {
            document.getElementById('total').textContent = 'Cannot book past dates';
            alert('Cannot book past dates')
            return;
        }

        const hoursDifference = (endDateTime - startDateTime) / (1000 * 60 * 60); // Difference in hours

        if (hoursDifference >= 0) {
            const totalPrice = price * hoursDifference;
            document.getElementById('total').textContent = `$${totalPrice.toFixed(2)}`;
        } else {
            document.getElementById('total').textContent = 'Invalid dates or times';
        }
    };

    // Calculate total price when any date or time input changes
    document.querySelectorAll('input[type="date"], input[type="time"]').forEach(input => {
        input.addEventListener('change', calculateTotalPrice);
    });

    // Initial total calculation
    calculateTotalPrice();

    /*
    async function checkAuthentication() {
        try {
            const response = await fetch('/user/check-authentication');
            const data = await response.json();
            return data.isAuthenticated;
        } catch (error) {
            console.error('Error checking authentication:', error);
            return false;
        }
    }
    */

    const servicesElement = document.getElementById('services');
    const servicesList = document.createElement('ul');

    const smokingItem = document.createElement('li');
    smokingItem.textContent = `Smoking: ${smoking === 'yes' ? 'Yes' : 'No'}`;
    servicesList.appendChild(smokingItem);

    const parkingItem = document.createElement('li');
    parkingItem.textContent = `Parking: ${parking === 'yes' ? 'Yes' : 'No'}`;
    servicesList.appendChild(parkingItem);

    const distanceToTransportItem = document.createElement('li');
    distanceToTransportItem.textContent = `Distance from public transportation: ${distanceToTransport} minutes walk`;
    servicesList.appendChild(distanceToTransportItem);

    servicesElement.appendChild(servicesList);

    // Function to open the modal
    const openModal = () => {
        document.getElementById('myModal').style.display = "block";
    };

    // Function to close the modal
    const closeModal = () => {
        document.getElementById('myModal').style.display = "none";
    };

    // Rent Now button click event listener
    document.getElementById('rentNow').addEventListener('click', async () => {
/*
        const isAuthenticated = await checkAuthentication();
    if (!isAuthenticated) {
        // Redirect the user to the login page
        window.location.href = '/login.html';
        return;
    } 
    */
    
        const startDate = document.querySelector('input[type="date"]').value;
        const endDate = document.querySelectorAll('input[type="date"]')[1].value;
        const startTime = document.querySelectorAll('input[type="time"]')[0].value;
        const endTime = document.querySelectorAll('input[type="time"]')[1].value;

        const newBooking = {
            startDate,
            endDate,
            startTime,
            endTime,
            workspaceTitle,
        };
        try {
            const response = await fetch('/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newBooking)
            });

            if (!response.ok) {
                throw new Error('Failed to create booking');
            }

            // Show modal
            openModal();
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to create booking. Please try again later.');
        }
    });

    // Close modal button click event listener
    document.getElementById('closeModal').addEventListener('click', () => {
        closeModal();
    });

    // Back button click event listener
    document.getElementById('backButton').addEventListener('click', () => {
        window.location.href = 'sections.html'; 
    });
});