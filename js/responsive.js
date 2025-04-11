/* Enhanced responsive design for the portfolio website */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize responsive features
    initResponsiveFeatures();
    
    // Add device-specific optimizations
    addDeviceOptimizations();
    
    // Add responsive navigation handling
    enhanceResponsiveNavigation();
    
    // Add touch support for mobile devices
    addTouchSupport();
});

// Initialize responsive features
function initResponsiveFeatures() {
    // Add viewport meta tag if not present
    if (!document.querySelector('meta[name="viewport"]')) {
        const viewportMeta = document.createElement('meta');
        viewportMeta.name = 'viewport';
        viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
        document.head.appendChild(viewportMeta);
    }
    
    // Add responsive classes to main containers
    const containers = document.querySelectorAll('.container');
    containers.forEach(container => {
        container.classList.add('responsive-container');
    });
    
    // Make images responsive
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.classList.add('img-fluid');
    });
    
    // Add responsive table handling
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
        const wrapper = document.createElement('div');
        wrapper.classList.add('table-responsive');
        table.parentNode.insertBefore(wrapper, table);
        wrapper.appendChild(table);
    });
}

// Add device-specific optimizations
function addDeviceOptimizations() {
    // Detect device type
    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    const isTablet = window.matchMedia('(min-width: 768px) and (max-width: 991px)').matches;
    
    // Add device class to body
    if (isMobile) {
        document.body.classList.add('mobile-device');
    } else if (isTablet) {
        document.body.classList.add('tablet-device');
    } else {
        document.body.classList.add('desktop-device');
    }
    
    // Optimize ThreeJS performance on mobile
    if (isMobile || isTablet) {
        // Reduce particle count and effects on mobile
        window.addEventListener('load', function() {
            if (window.reduceParticleCount) {
                window.reduceParticleCount();
            }
            
            // Disable some heavy animations on mobile
            const heavyAnimations = document.querySelectorAll('.background-canvas');
            heavyAnimations.forEach(animation => {
                animation.style.opacity = '0.3';
            });
        });
    }
    
    // Adjust font sizes for better readability on small screens
    if (isMobile) {
        const style = document.createElement('style');
        style.textContent = `
            @media (max-width: 767px) {
                body {
                    font-size: 14px;
                }
                h1 {
                    font-size: 1.8rem;
                }
                h2 {
                    font-size: 1.5rem;
                }
                h3 {
                    font-size: 1.3rem;
                }
                .project-card {
                    margin-bottom: 1.5rem;
                }
                .footer-content {
                    flex-direction: column;
                    text-align: center;
                }
                .footer-section {
                    margin-bottom: 1.5rem;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Enhance responsive navigation
function enhanceResponsiveNavigation() {
    // Get navigation elements
    const hamburger = document.getElementById('hamburger');
    const navList = document.getElementById('nav-list');
    
    if (hamburger && navList) {
        // Add touch-friendly navigation
        hamburger.addEventListener('click', function() {
            navList.classList.toggle('show');
            this.classList.toggle('active');
            
            // Play sound if available
            if (window.soundSystem) {
                window.soundSystem.playSound('click');
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!hamburger.contains(event.target) && !navList.contains(event.target) && navList.classList.contains('show')) {
                navList.classList.remove('show');
                hamburger.classList.remove('active');
            }
        });
        
        // Close menu when clicking a nav link on mobile
        const navLinks = navList.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.matchMedia('(max-width: 991px)').matches) {
                    navList.classList.remove('show');
                    hamburger.classList.remove('active');
                }
            });
        });
    }
    
    // Add sticky header on scroll for better mobile navigation
    const header = document.querySelector('.nav-container');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.classList.add('sticky-nav');
            } else {
                header.classList.remove('sticky-nav');
            }
        });
    }
}

// Add touch support for mobile devices
function addTouchSupport() {
    // Check if device supports touch
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (isTouchDevice) {
        // Add touch class to body
        document.body.classList.add('touch-device');
        
        // Disable custom cursor on touch devices
        const customCursor = document.querySelector('.custom-cursor');
        const cursorTrail = document.querySelector('.cursor-trail');
        
        if (customCursor) {
            customCursor.style.display = 'none';
        }
        
        if (cursorTrail) {
            cursorTrail.style.display = 'none';
        }
        
        // Convert hover effects to tap effects
        const hoverElements = document.querySelectorAll('.project-card, .btn, .nav-item');
        
        hoverElements.forEach(element => {
            element.addEventListener('touchstart', function() {
                this.classList.add('touch-active');
            });
            
            element.addEventListener('touchend', function() {
                this.classList.remove('touch-active');
            });
        });
        
        // Add swipe navigation for ThreeJS demos
        const demoContainer = document.querySelector('.demo-container');
        
        if (demoContainer) {
            let touchStartX = 0;
            let touchEndX = 0;
            
            demoContainer.addEventListener('touchstart', function(e) {
                touchStartX = e.changedTouches[0].screenX;
            });
            
            demoContainer.addEventListener('touchend', function(e) {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            });
            
            function handleSwipe() {
                const swipeThreshold = 100;
                
                if (touchEndX < touchStartX - swipeThreshold) {
                    // Swipe left - next demo
                    navigateToNextDemo();
                }
                
                if (touchEndX > touchStartX + swipeThreshold) {
                    // Swipe right - previous demo
                    navigateToPreviousDemo();
                }
            }
            
            function navigateToNextDemo() {
                // Find next demo link
                const demoLinks = document.querySelectorAll('.nav-link');
                let currentIndex = -1;
                let nextLink = null;
                
                demoLinks.forEach((link, index) => {
                    if (link.href === window.location.href) {
                        currentIndex = index;
                    }
                });
                
                if (currentIndex !== -1 && currentIndex < demoLinks.length - 1) {
                    nextLink = demoLinks[currentIndex + 1];
                    if (nextLink) {
                        window.location.href = nextLink.href;
                    }
                }
            }
            
            function navigateToPreviousDemo() {
                // Find previous demo link
                const demoLinks = document.querySelectorAll('.nav-link');
                let currentIndex = -1;
                let prevLink = null;
                
                demoLinks.forEach((link, index) => {
                    if (link.href === window.location.href) {
                        currentIndex = index;
                    }
                });
                
                if (currentIndex > 0) {
                    prevLink = demoLinks[currentIndex - 1];
                    if (prevLink) {
                        window.location.href = prevLink.href;
                    }
                }
            }
        }
    }
}

// Add responsive CSS
function addResponsiveCSS() {
    const style = document.createElement('style');
    style.textContent = `
        /* Responsive Container */
        .responsive-container {
            width: 100%;
            padding-right: 15px;
            padding-left: 15px;
            margin-right: auto;
            margin-left: auto;
        }
        
        @media (min-width: 576px) {
            .responsive-container {
                max-width: 540px;
            }
        }
        
        @media (min-width: 768px) {
            .responsive-container {
                max-width: 720px;
            }
        }
        
        @media (min-width: 992px) {
            .responsive-container {
                max-width: 960px;
            }
        }
        
        @media (min-width: 1200px) {
            .responsive-container {
                max-width: 1140px;
            }
        }
        
        /* Responsive Navigation */
        .nav-container {
            transition: all 0.3s ease;
        }
        
        .sticky-nav {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            z-index: 1000;
            background-color: rgba(13, 13, 13, 0.9);
            box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
            animation: slideDown 0.3s ease;
        }
        
        @keyframes slideDown {
            from {
                transform: translateY(-100%);
            }
            to {
                transform: translateY(0);
            }
        }
        
        /* Mobile Navigation */
        @media (max-width: 991px) {
            .nav-list {
                position: fixed;
                top: 60px;
                right: -100%;
                width: 80%;
                max-width: 300px;
                height: calc(100vh - 60px);
                background-color: rgba(13, 13, 13, 0.95);
                flex-direction: column;
                align-items: center;
                padding: 2rem;
                transition: right 0.3s ease;
                z-index: 1000;
                box-shadow: -5px 0 20px rgba(0, 0, 0, 0.5);
                overflow-y: auto;
            }
            
            .nav-list.show {
                right: 0;
            }
            
            .nav-item {
                margin: 1rem 0;
                width: 100%;
                text-align: center;
            }
            
            .hamburger {
                display: block;
                cursor: pointer;
                z-index: 1001;
            }
            
            .hamburger i {
                font-size: 1.5rem;
                color: var(--primary-neon);
                transition: all 0.3s ease;
            }
            
            .hamburger.active i {
                color: var(--secondary-neon);
                transform: rotate(90deg);
            }
        }
        
        /* Responsive Project Cards */
        @media (max-width: 767px) {
            .project-card {
                height: auto;
                min-height: 200px;
            }
            
            .project-card-content {
                padding: 1rem;
            }
            
            .project-card h3 {
                font-size: 1.2rem;
            }
            
            .project-technologies {
                flex-wrap: wrap;
            }
            
            .project-technology {
                margin-bottom: 0.5rem;
            }
        }
        
        /* Responsive ThreeJS Demo Pages */
        @media (max-width: 991px) {
            .canvas-container {
                height: 350px !important;
            }
            
            .controls-panel {
                height: auto !important;
                max-height: 400px !important;
                margin-top: 1.5rem !important;
            }
            
            .panel-section {
                padding-bottom: 1rem !important;
                margin-bottom: 1rem !important;
            }
            
            .control-group {
                margin-bottom: 1rem !important;
            }
        }
        
        @media (max-width: 767px) {
            .canvas-container {
                height: 300px !important;
            }
            
            .terrain-control-group {
                flex-direction: column !important;
            }
            
            .terrain-control-group .btn {
                margin-bottom: 0.5rem !important;
                max-width: none !important;
            }
            
            .color-pickers {
                flex-direction: column !important;
            }
            
            .color-picker-container {
                margin-bottom: 1rem !important;
            }
        }
        
        /* Touch Device Optimizations */
        .touch-device .project-card:hover,
        .touch-device .btn:hover {
            transform: none !important;
        }
        
        .touch-active {
            transform: translateY(-5px) !important;
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3) !important;
        }
        
        /* Table Responsive */
        .table-responsive {
            display: block;
            width: 100%;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
        }
        
        /* Sound Toggle Responsive */
        .sound-toggle {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 40px;
            height: 40px;
            background-color: rgba(13, 13, 13, 0.7);
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            z-index: 1000;
            box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
            border: 1px solid var(--primary-neon);
            transition: all 0.3s ease;
        }
        
        .sound-toggle i {
            color: var(--primary-neon);
            font-size: 1.2rem;
        }
        
        .sound-toggle:hover {
            transform: scale(1.1);
            box-shadow: 0 0 15px rgba(0, 255, 255, 0.8);
        }
        
        @media (max-width: 767px) {
            .sound-toggle {
                bottom: 10px;
                right: 10px;
                width: 35px;
                height: 35px;
            }
            
            .sound-toggle i {
                font-size: 1rem;
            }
        }
    `;
    
    document.head.appendChild(style);
}

// Add responsive CSS
addResponsiveCSS();
