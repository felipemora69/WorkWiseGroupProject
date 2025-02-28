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

        // Display user profile data
        document.getElementById("name").textContent = userData.fullname;
        document.getElementById("email").textContent = userData.email;
        document.getElementById("phoneNumber").textContent = userData.phone;

        // Fetch user workspaces
        const workspaceResponse = await fetch('/api/myworkspaces');
        const workspaces = await workspaceResponse.json();

        function navigateGallery(workspaceElement, direction) {
            const images = workspaceElement.querySelectorAll('.image-gallery img');
            const currentImg = Array.from(images).find(img => img.style.display === 'block');
            if (!currentImg) {
                return;
            }
            let currentIndex = Array.from(images).indexOf(currentImg);
            let newIndex = (currentIndex + direction + images.length) % images.length;
        
            images[currentIndex].style.display = 'none';
            images[newIndex].style.display = 'block';
        }

        // Display user workspaces
        const workspaceContainer = document.getElementById("properties-container");
        workspaces.forEach(workspace => {
            // Create workspace container
            const workspaceElement = document.createElement('div');
            workspaceElement.classList.add('workspace');

            // Create title element
            const titleElement = document.createElement('h2');
            titleElement.classList.add('workspace-title'); 
            titleElement.textContent = workspace.name;
            workspaceElement.appendChild(titleElement);

            // Create image gallery
            const galleryElement = document.createElement('div');
            galleryElement.classList.add('image-gallery');
            workspace.images.forEach((image, index) => {
                const imgElement = document.createElement('img');
                imgElement.src = image;
                imgElement.style.display = index === 0 ? 'block' : 'none';
                galleryElement.appendChild(imgElement);
            });
            workspaceElement.appendChild(galleryElement);


            // Create navigation buttons
            const buttonContainer = document.createElement('div');
            buttonContainer.classList.add('gallery-buttons');

            // Create previous button
            const buttonPrev = document.createElement('button');
            buttonPrev.innerHTML = '<i class="bx bx-chevron-left"></i>';
            buttonPrev.classList.add('gallery-button', 'prev-button');
            buttonPrev.addEventListener('click', () => navigateGallery(workspaceElement, -1));
            buttonContainer.appendChild(buttonPrev);

            // Create next button
            const buttonNext = document.createElement('button');
            buttonNext.innerHTML = '<i class="bx bx-chevron-right"></i>';
            buttonNext.classList.add('gallery-button', 'next-button');
            buttonNext.addEventListener('click', () => navigateGallery(workspaceElement, 1));
            buttonContainer.appendChild(buttonNext);

            workspaceElement.appendChild(buttonContainer);

            const detailsElement = document.createElement('div');
            detailsElement.classList.add('workspace-details');


            // Create price element
            const priceElement = document.createElement('p');
            priceElement.textContent = `Price: $${workspace.price} /h`;
            detailsElement.appendChild(priceElement);

            // Create location element
            const locationElement = document.createElement('p');
            locationElement.textContent = `Location: ${workspace.location}`;
            detailsElement.appendChild(locationElement);

            // Create address element
            const addressElement = document.createElement('p');
            addressElement.textContent = `Address: ${workspace.address}`;
            detailsElement.appendChild(addressElement);

            // Create description element
            const descriptionElement = document.createElement('p');
            descriptionElement.textContent = `Description: ${workspace.description}`;
            detailsElement.appendChild(descriptionElement);

            const categoryElement = document.createElement('p');
            categoryElement.textContent = `Category: ${workspace.category}`;
            detailsElement.appendChild(categoryElement);

            // Create area element
        const areaElement = document.createElement('p');
        areaElement.textContent = `Area: ${workspace.area} sq.ft`;
        detailsElement.appendChild(areaElement);

            // Create capacity element
            const capacityElement = document.createElement('p');
            capacityElement.textContent = `Capacity: ${workspace.capacity}`;
            detailsElement.appendChild(capacityElement);

            // Create smoking element
            const smokingElement = document.createElement('p');
            smokingElement.textContent = `Smoking: ${workspace.smoking}`;
            detailsElement.appendChild(smokingElement);

            // Create parking element
            const parkingElement = document.createElement('p');
            parkingElement.textContent = `Parking: ${workspace.parking}`;
            detailsElement.appendChild(parkingElement);

            // Create distance to transport element
            const distanceElement = document.createElement('p');
            distanceElement.textContent = `Distance to Transport: ${workspace.distanceToTransport} .min`;
            detailsElement.appendChild(distanceElement);

            // Append details element to workspace element
            workspaceElement.appendChild(detailsElement);

            // Create edit button
            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.classList.add('edit-button');
            editButton.addEventListener('click', () => displayEditAlert(workspace));
            workspaceElement.appendChild(editButton);

            // Create delete button
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('delete-button');
            deleteButton.dataset.workspaceId = workspace._id;
            deleteButton.addEventListener('click', async () => {
                try {
                    const workspaceId = deleteButton.dataset.workspaceId;
                    const deleteResponse = await fetch(`/api/workspaces/${workspaceId}`, {
                        method: 'DELETE',
                        credentials: 'include'
                    });
                    if (deleteResponse.ok) {
                        workspaceContainer.removeChild(workspaceElement);
                    } else {
                        console.error('Error deleting workspace');
                    }
                } catch (error) {
                    console.error('Error deleting workspace:', error);
                }
            });
            workspaceElement.appendChild(deleteButton);

            // Append workspace element to workspace container
            workspaceContainer.appendChild(workspaceElement);
        });

        // Redirect to create workspace page
        document.getElementById("create-property").addEventListener("click", function() {
            window.location.href = "/createWorkspace.html";
        });
    } catch (error) {
        console.error('Error fetching user and workspace data:', error);
    }
});

function displayEditAlert(workspace) {
    // Display prompts for editing workspace attributes
    const inputName = prompt("Enter new name:", workspace.name);
    const inputPrice = prompt("Enter new price:", workspace.price);
    const inputLocation = prompt("Enter new location:", workspace.location);
    const inputAddress = prompt("Enter new address:", workspace.address);
    const inputDescription = prompt("Enter new description:", workspace.description);
    const inputCategory = prompt("Enter new category:", workspace.category);
    const inputArea = prompt("Enter new area:", workspace.area);
    const inputCapacity = prompt("Enter new capacity:", workspace.capacity);
    const inputSmoking = prompt("Enter new smoking preference:", workspace.smoking);
    const inputParking = prompt("Enter new parking availability:", workspace.parking);
    const inputDistanceToTransport = prompt("Enter new distance to transport:", workspace.distanceToTransport);

    // Construct the updated workspace object
    const updatedWorkspace = {
        name: inputName || workspace.name,
        price: parseFloat(inputPrice) || workspace.price,
        location: inputLocation || workspace.location,
        address: inputAddress || workspace.address,
        description: inputDescription || workspace.description,
        category: inputCategory || workspace.category,
        area: parseFloat(inputArea) || workspace.area,
        capacity: inputCapacity || workspace.capacity,
        smoking: inputSmoking || workspace.smoking,
        parking: inputParking || workspace.parking,
        distanceToTransport: parseFloat(inputDistanceToTransport) || workspace.distanceToTransport
    };

    // Send the updated workspace object to the server for updating
    updateWorkspace(workspace._id, updatedWorkspace);
}

async function updateWorkspace(workspaceId, updatedWorkspace) {
    try {
        const response = await fetch(`/api/workspaces/${workspaceId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedWorkspace)
        });
        if (response.ok) {
            console.log('Workspace updated successfully');
        } else {
            console.error('Error updating workspace:', response.statusText);
        }
    } catch (error) {
        console.error('Error updating workspace:', error);
    }
}