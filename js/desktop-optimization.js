/* Desktop and cross-browser optimizations for the portfolio website */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Detect browser
    detectBrowser();
    
    // Add desktop optimizations
    optimizeForDesktop();
    
    // Add cross-browser compatibility fixes
    addCrossBrowserFixes();
    
    // Add high-resolution display support
    addHighResolutionSupport();
});

// Detect browser
function detectBrowser() {
    // Get user agent
    const userAgent = navigator.userAgent;
    
    // Detect browser
    let browserName = 'unknown';
    
    if (userAgent.match(/chrome|chromium|crios/i)) {
        browserName = 'chrome';
    } else if (userAgent.match(/firefox|fxios/i)) {
        browserName = 'firefox';
    } else if (userAgent.match(/safari/i)) {
        browserName = 'safari';
    } else if (userAgent.match(/opr\//i)) {
        browserName = 'opera';
    } else if (userAgent.match(/edg/i)) {
        browserName = 'edge';
    } else if (userAgent.match(/trident/i)) {
        browserName = 'ie';
    }
    
    // Add browser class to body
    document.body.classList.add(`browser-${browserName}`);
    
    // Log browser detection
    console.log(`Browser detected: ${browserName}`);
    
    return browserName;
}

// Optimize for desktop viewing
function optimizeForDesktop() {
    // Check if desktop
    const isDesktop = window.matchMedia('(min-width: 992px)').matches;
    
    if (isDesktop) {
        // Add desktop-specific enhancements
        
        // Enhanced hover effects for desktop
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                // Add 3D tilt effect on desktop
                addTiltEffect(this);
            });
            
            card.addEventListener('mouseleave', function() {
                // Remove tilt effect
                removeTiltEffect(this);
            });
        });
        
        // Add parallax scrolling for desktop
        addParallaxScrolling();
        
        // Add smooth scrolling for anchor links
        addSmoothScrolling();
        
        // Add keyboard navigation
        addKeyboardNavigation();
    }
}

// Add tilt effect to element
function addTiltEffect(element) {
    // Add mousemove event listener
    element.addEventListener('mousemove', handleTilt);
    
    function handleTilt(e) {
        // Get element dimensions
        const rect = element.getBoundingClientRect();
        
        // Calculate mouse position relative to element
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Calculate tilt
        const tiltX = (y / rect.height - 0.5) * 10;
        const tiltY = (x / rect.width - 0.5) * -10;
        
        // Apply tilt
        element.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.05, 1.05, 1.05)`;
    }
    
    // Store handler for removal
    element._tiltHandler = handleTilt;
}

// Remove tilt effect from element
function removeTiltEffect(element) {
    // Remove mousemove event listener
    element.removeEventListener('mousemove', element._tiltHandler);
    
    // Reset transform
    element.style.transform = '';
}

// Add parallax scrolling
function addParallaxScrolling() {
    // Get header background
    const headerBg = document.querySelector('.header-bg');
    
    if (headerBg) {
        window.addEventListener('scroll', function() {
            const scrollY = window.scrollY;
            headerBg.style.transform = `translateY(${scrollY * 0.4}px)`;
        });
    }
    
    // Add parallax to project cards
    const projectCards = document.querySelectorAll('.project-card');
    
    window.addEventListener('scroll', function() {
        projectCards.forEach((card, index) => {
            const rect = card.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            if (rect.top < windowHeight && rect.bottom > 0) {
                const scrollProgress = (windowHeight - rect.top) / (windowHeight + rect.height);
                const translateY = (scrollProgress - 0.5) * 20;
                
                card.style.transform = `translateY(${translateY}px)`;
            }
        });
    });
}

// Add smooth scrolling for anchor links
function addSmoothScrolling() {
    // Get all anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Get target element
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                // Scroll to target
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Add keyboard navigation
function addKeyboardNavigation() {
    // Add keyboard event listener
    document.addEventListener('keydown', function(e) {
        // Check if in ThreeJS demo
        const isInDemo = window.location.href.includes('/threejs/demo');
        
        if (isInDemo) {
            // Navigate between demos with arrow keys
            if (e.key === 'ArrowRight') {
                navigateToNextDemo();
            } else if (e.key === 'ArrowLeft') {
                navigateToPreviousDemo();
            }
        }
        
        // Toggle wireframe with 'W' key in ThreeJS demos
        if (isInDemo && e.key.toLowerCase() === 'w') {
            const wireframeButton = document.getElementById('toggle-wireframe');
            if (wireframeButton) {
                wireframeButton.click();
            }
        }
        
        // Take screenshot with 'S' key in ThreeJS demos
        if (isInDemo && e.key.toLowerCase() === 's') {
            const screenshotButton = document.getElementById('screenshot-button');
            if (screenshotButton) {
                screenshotButton.click();
            }
        }
        
        // Toggle fly mode with 'F' key in terrain demo
        if (window.location.href.includes('/threejs/demo4') && e.key.toLowerCase() === 'f') {
            const flyButton = document.getElementById('toggle-fly');
            if (flyButton) {
                flyButton.click();
            }
        }
    });
    
    // Navigate to next demo
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
    
    // Navigate to previous demo
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

// Add cross-browser compatibility fixes
function addCrossBrowserFixes() {
    // Get browser
    const browser = detectBrowser();
    
    // Add browser-specific CSS
    const style = document.createElement('style');
    
    // Safari-specific fixes
    if (browser === 'safari') {
        style.textContent += `
            /* Safari-specific fixes */
            .project-card {
                -webkit-backdrop-filter: blur(10px);
                backdrop-filter: blur(10px);
            }
            
            .custom-cursor {
                -webkit-backdrop-filter: none;
                backdrop-filter: none;
            }
            
            @supports (-webkit-backdrop-filter: none) {
                .nav-container {
                    -webkit-backdrop-filter: blur(10px);
                    backdrop-filter: blur(10px);
                    background-color: rgba(13, 13, 13, 0.7);
                }
            }
            
            /* Fix for Safari flexbox issues */
            .project-technologies {
                display: -webkit-box;
                display: -webkit-flex;
                display: flex;
                -webkit-flex-wrap: wrap;
                flex-wrap: wrap;
            }
        `;
    }
    
    // Firefox-specific fixes
    if (browser === 'firefox') {
        style.textContent += `
            /* Firefox-specific fixes */
            .neon-text {
                text-shadow: 0 0 5px var(--primary-neon), 0 0 10px var(--primary-neon);
            }
            
            /* Fix for Firefox scrollbar */
            * {
                scrollbar-width: thin;
                scrollbar-color: var(--primary-neon) rgba(13, 13, 13, 0.5);
            }
            
            /* Fix for Firefox animation performance */
            @keyframes neon-pulse {
                0%, 100% {
                    text-shadow: 0 0 5px var(--primary-neon), 0 0 10px var(--primary-neon);
                }
                50% {
                    text-shadow: 0 0 10px var(--primary-neon), 0 0 20px var(--primary-neon), 0 0 30px var(--primary-neon);
                }
            }
        `;
    }
    
    // Edge/IE-specific fixes
    if (browser === 'edge' || browser === 'ie') {
        style.textContent += `
            /* Edge/IE-specific fixes */
            .project-card {
                background-color: rgba(13, 13, 13, 0.9);
            }
            
            /* Fix for Edge/IE flexbox issues */
            .footer-content {
                display: -ms-flexbox;
                display: flex;
                -ms-flex-wrap: wrap;
                flex-wrap: wrap;
            }
            
            .footer-section {
                -ms-flex: 1 1 30%;
                flex: 1 1 30%;
            }
        `;
    }
    
    // Add style to head
    document.head.appendChild(style);
    
    // Add polyfills for older browsers
    if (browser === 'ie') {
        // Add IntersectionObserver polyfill
        const script = document.createElement('script');
        script.src = 'https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver';
        document.head.appendChild(script);
    }
}

// Add high-resolution display support
function addHighResolutionSupport() {
    // Check if high-resolution display
    const isHighRes = window.devicePixelRatio > 1;
    
    if (isHighRes) {
        // Add high-resolution class to body
        document.body.classList.add('high-res-display');
        
        // Adjust ThreeJS renderer pixel ratio
        window.addEventListener('load', function() {
            // Find all ThreeJS canvases
            const canvases = document.querySelectorAll('canvas');
            
            canvases.forEach(canvas => {
                // Check if canvas has renderer
                if (canvas.renderer) {
                    // Set pixel ratio
                    canvas.renderer.setPixelRatio(window.devicePixelRatio);
                }
            });
        });
        
        // Add high-resolution CSS
        const style = document.createElement('style');
        style.textContent = `
            /* High-resolution display optimizations */
            .high-res-display .neon-text {
                text-shadow: 0 0 2px var(--primary-neon), 0 0 5px var(--primary-neon), 0 0 10px var(--primary-neon);
            }
            
            .high-res-display .project-card {
                box-shadow: 0 0 5px rgba(0, 255, 255, 0.2), 0 0 10px rgba(0, 255, 255, 0.1);
            }
            
            .high-res-display .project-card:hover {
                box-shadow: 0 0 10px rgba(0, 255, 255, 0.3), 0 0 20px rgba(0, 255, 255, 0.2);
            }
            
            .high-res-display .btn {
                box-shadow: 0 0 5px rgba(0, 255, 255, 0.2);
            }
            
            .high-res-display .btn:hover {
                box-shadow: 0 0 10px rgba(0, 255, 255, 0.4);
            }
        `;
        
        document.head.appendChild(style);
    }
}
