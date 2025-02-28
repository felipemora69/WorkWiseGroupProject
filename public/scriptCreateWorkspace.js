document.addEventListener('DOMContentLoaded', () => {
    const workspaceForm = document.getElementById('workspaceForm');
 
    workspaceForm.addEventListener('submit', async (event) => {
    event.preventDefault();
 
    //get elements from form
    var name = document.getElementById("name").value;
    var category = document.getElementById("category").value;
    var price = document.getElementById("price").value;
    var description = document.getElementById("description").value;
    var location = document.getElementById("location").value;
    var address = document.getElementById("address").value;
    var area = document.getElementById("area").value;
    var capacity = document.getElementById("capacity").value;
    var smoking = document.getElementById("smoking").value;
    var parking = document.getElementById("parking").value;
    var distanceToTransport = document.getElementById("distanceToTransport").value;
    const images = document.getElementById('images').files;
 
    // Create workspace object
    const formData = new FormData();
        formData.append('name', name);
        formData.append('category', category);
        formData.append('price', price);
        formData.append('description', description);
        formData.append('location', location);
        formData.append('address', address);
        formData.append('area', area);
        formData.append('capacity', capacity);
        formData.append('smoking', smoking);
        formData.append('parking', parking);
        formData.append('distanceToTransport', distanceToTransport);
  
    for (let i = 0; i < images.length; i++) {
        formData.append('images', images[i]);
    }
 
    try {
        const response = await fetch('/api/workspaces', {
            method: 'POST',
            body: formData
        });
 
        if (!response.ok) {
            throw new Error('Failed to create workspace');
        }
 
        const result = await response.json();
        console.log('Workspace created:', result);
 
        // Reset the form
        workspaceForm.reset();
        localStorage.clear();
 
        // Reset the form after successful creation
        this.reset();
 
        alert("Workspace created successfully!");
    } catch (error) {
        console.error('Error creating workspace:', error);
        alert("Failed to create workspace. Please try again.");
    }
  });
});