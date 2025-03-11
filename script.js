document.addEventListener("DOMContentLoaded", function() {
    const projectContainer = document.getElementById("projects");
    
    portfolioSettings.projects.forEach((project, index) => {
        let orderClass = index % 2 === 0 ? "" : "flex-row-reverse";
        
        let safeTitle = project.title.replace(/\s+/g, "-").toLowerCase();
        
        let projectCard = `
            <div class="row align-items-center ${orderClass}">
                <div class="col-md-6">
                    <div id="carousel-${index}" class="carousel slide" data-bs-ride="carousel">
                        <div class="carousel-inner">
                            <div class="carousel-item active">
                                <img src="img/${safeTitle}/img_carousel1.webp" class="d-block w-100 project-img" alt="${project.title} image">
                            </div>
                            <div class="carousel-item">
                                <img src="img/${safeTitle}/img_carousel2.webp" class="d-block w-100 project-img" alt="${project.title} image">
                            </div>
                            <div class="carousel-item">
                                <img src="img/${safeTitle}/img_carousel3.webp" class="d-block w-100 project-img" alt="${project.title} image">
                            </div>
                        </div>
                        <button class="carousel-control-prev" type="button" data-bs-target="#carousel-${index}" data-bs-slide="prev">
                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        </button>
                        <button class="carousel-control-next" type="button" data-bs-target="#carousel-${index}" data-bs-slide="next">
                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        </button>
                    </div>
                </div>
                <div class="col-md-6">
                    <h2>${project.title}</h2>
                    <p>${project.description}</p>
                    <p><strong>Tech Used:</strong> ${project.technologies.join(", ")}</p>
                    <a href="${project.repoLink}" target="_blank" class="btn btn-primary">GitHub Repo</a>
                    <a href="${project.liveLink}" target="_blank" class="btn btn-secondary">Live Demo</a>
                </div>
            </div>
            <hr>
        `;
        
        projectContainer.innerHTML += projectCard;
    });
    
    document.querySelectorAll(".project-img").forEach(img => {
        let originalSrc = img.src;
        let hoverSrc = img.src.replace("img_carousel1.webp", "img_carousel2.webp");
        
        img.addEventListener("mouseenter", () => img.src = hoverSrc);
        img.addEventListener("mouseleave", () => img.src = originalSrc);
    });
});

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("site-title").textContent = portfolioSettings.siteTitle;
});
