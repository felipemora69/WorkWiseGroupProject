document.addEventListener("DOMContentLoaded", () => {
    const backButton = document.getElementById('backButton');

    backButton.addEventListener('click', () => {
        window.location.href = 'FindaWorkspace.html'; 
    });
});

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const selectedCategory = urlParams.get('category');
        const selectedLocation = urlParams.get('location');
        const selectedPriceSort = urlParams.get('price');

        const workspaceContainer = document.getElementById('workspace-container');
        const searchInput = document.getElementById('searchInput');
        const locationFilter = document.getElementById('locationFilter');
        const priceSort = document.getElementById('priceSort');

        let workspaces = [];

        const response = await fetch('/api/workspaces');
        if (!response.ok) {
            throw new Error('Failed to fetch workspaces');
        }
        workspaces = await response.json();

        let data = workspaces;

        if (selectedCategory) {
            data = data.filter(workspace => workspace.category === selectedCategory);
        }

        // Sorting by price
        data.sort((a, b) => a.price - b.price);

        renderWorkspaces(data);
        renderTitle(selectedCategory);

        // Search functionality
        searchInput.addEventListener('input', () => {
            applyFilters(data);
        });

        // Filtering and sorting
        locationFilter.addEventListener('change', () => {
            applyFilters(data);
        });
        priceSort.addEventListener('change', () => {
            applyFilters(data);
        });

        const workspaceTitles = document.querySelectorAll('.workspace-title');

        workspaceTitles.forEach(title => {
            title.addEventListener('click', () => {
                const workspaceName = title.textContent;
                const workspace = data.find(workspace => workspace.name === workspaceName);
                const params = new URLSearchParams({
                    name: workspace.name,
                    category: workspace.category,
                    price: workspace.price,
                    description: workspace.description,
                    location: workspace.location,
                    images: JSON.stringify(workspace.images),
                    address: workspace.address,
                    area: workspace.area,
                    capacity: workspace.capacity,
                    distanceToTransport: workspace.distanceToTransport
                });
                window.location.href = `product.html?${params.toString()}`;
            });
        });

    } catch (error) {
        console.error('Error rendering data.', error);
    }
});

function renderTitle(category) {
    const titleContainer = document.getElementById('section-title');
    titleContainer.textContent = getCategoryTitle(category);
}

function getCategoryTitle(category) {
    switch (category) {
        case 'personal-desktop':
            return 'Personal Desktops';
        case 'private-office':
            return 'Private Offices';
        case 'small-meeting-room':
            return 'Small Meeting Rooms';
        case 'big-meeting-room':
            return 'Big Meeting Rooms';
        case 'whole-floor-office':
            return 'Whole Floor Offices';
        case 'for-events':
            return 'Venues';
        default:
            return 'All Workspaces';
    }
}

function applyFilters(data) {
    let filteredData = [...data];

    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const selectedLocation = document.getElementById('locationFilter').value;
    const selectedOption = document.getElementById('priceSort').value;

    // Search filtering
    filteredData = filteredData.filter(workspace => {
        const searchTerms = searchInput.split(' ');
        return searchTerms.some(term => workspace.name.toLowerCase().includes(term));
    });

    // Location filtering
    if (selectedLocation) {
        filteredData = filteredData.filter(workspace => workspace.location === selectedLocation);
    }

    // Sorting by price
    if (selectedOption === 'asc') {
        filteredData.sort((a, b) => a.price - b.price);
    } else if (selectedOption === 'desc') {
        filteredData.sort((a, b) => b.price - a.price);
    }

    renderWorkspaces(filteredData);
}

function renderWorkspaces(workspaces) {
    const workspaceContainer = document.getElementById('workspace-container');
    workspaceContainer.innerHTML = '';

    if (workspaces.length === 0) {
        renderNoResults(workspaceContainer);
        return;
    }

    workspaces.forEach(workspace => {
        // Create workspace container
        const workspaceElement = document.createElement('div');
        workspaceElement.classList.add('workspace');

        // Create title element
        const titleElement = document.createElement('h2');
        titleElement.textContent = workspace.name;
        titleElement.classList.add('workspace-title'); 
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
        const buttonPrev = document.createElement('button');
        buttonPrev.innerHTML = '<i class="bx bx-chevron-left"></i>';
        buttonPrev.classList.add('gallery-button', 'prev-button');
        buttonPrev.addEventListener('click', () => navigateGallery(workspaceElement, -1));
        workspaceElement.appendChild(buttonPrev);

        const buttonNext = document.createElement('button');
        buttonNext.innerHTML = '<i class="bx bx-chevron-right"></i>';
        buttonNext.classList.add('gallery-button', 'next-button');
        buttonNext.addEventListener('click', () => navigateGallery(workspaceElement, 1));
        workspaceElement.appendChild(buttonNext);

        // Create price element
        const priceElement = document.createElement('p');
        priceElement.textContent = `Price: $${workspace.price} /h`;
        workspaceElement.appendChild(priceElement);

        // Create location element
        const locationElement = document.createElement('p');
        locationElement.textContent = `Location: ${workspace.location}`;
        workspaceElement.appendChild(locationElement);

        // Append workspace element to workspace container
        workspaceContainer.appendChild(workspaceElement);
    });
}

function navigateGallery(workspaceElement, direction) {
    const images = workspaceElement.querySelectorAll('.image-gallery img');
    const currentImg = Array.from(images).find(img => img.style.display === 'block');

    // If currentImg is null, no image is currently displayed, so return early
    if (!currentImg) {
        return;
    }

    let currentIndex = Array.from(images).indexOf(currentImg);
    let newIndex = (currentIndex + direction + images.length) % images.length;

    // Hide current image and display the new one
    currentImg.style.display = 'none';
    images[newIndex].style.display = 'block';
}

function renderNoResults(container) {
    const noResultsMessage = document.createElement('p');
    noResultsMessage.textContent = 'No workspaces found.';
    container.appendChild(noResultsMessage);
}

document.addEventListener("scroll", function() {
    var scrollTop = window.scrollY;
    var windowHeight = window.innerHeight;
    var documentHeight = document.body.clientHeight;

    // If the user scrolls to the bottom of the page, show the footer
    if (scrollTop + windowHeight >= documentHeight) {
        document.getElementById("mainFooter").classList.remove("hidden");
    } else {
        // Otherwise, hide the footer
        document.getElementById("mainFooter").classList.add("hidden");
    }
});