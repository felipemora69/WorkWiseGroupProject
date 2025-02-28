document.addEventListener("DOMContentLoaded", function() {
    
    const solutionsContainer = document.querySelector(".scrolling-wrapper");
    const spacesContainer = document.querySelector(".highlight-wrapper");

    document.addEventListener("wheel", function(event) {
        if (isMouseInElement(event, solutionsContainer)) {
            event.preventDefault();
            if (event.deltaX !== 0) {
                solutionsContainer.scrollLeft += event.deltaX;
            }
        } else if (isMouseInElement(event, spacesContainer)) {
            event.preventDefault();
            if (event.deltaX !== 0) {
                spacesContainer.scrollLeft += event.deltaX;
            }
        }
    });

    function isMouseInElement(event, element) {
        const rect = element.getBoundingClientRect();
        const mouseX = event.clientX;
        const mouseY = event.clientY;
        return mouseX >= rect.left && mouseX <= rect.right && mouseY >= rect.top && mouseY <= rect.bottom;
    }
});

//Resnponsive design
//Dropdown Menu
document.querySelector('.menu-toggle').addEventListener('click', function() {
    document.querySelector('.menu').classList.toggle('show');
    this.classList.toggle('open');
});

document.addEventListener("DOMContentLoaded", () => {
    const workspaceCategories = document.querySelectorAll('.workspace-category');

    workspaceCategories.forEach(category => {
        category.addEventListener('click', function() {
            const categoryName = category.id;
            // Redirect to sections page with category parameter
            window.location.href = `sections.html?category=${categoryName}`;
        });
    });
});