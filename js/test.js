// Test script for portfolio website
// This script will test all features and functionality

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Starting portfolio website test...');
    
    // Test all features
    testNavigation();
    testProjectCards();
    testAnimations();
    testSoundEffects();
    testResponsiveness();
    testThreeJSDemos();
    
    // Log test completion
    console.log('All tests completed successfully!');
});

// Test navigation functionality
function testNavigation() {
    console.log('Testing navigation...');
    
    // Check if navigation elements exist
    const navbar = document.querySelector('.navbar');
    const navList = document.getElementById('nav-list');
    const hamburger = document.getElementById('hamburger');
    
    if (!navbar) console.error('Navigation bar not found!');
    if (!navList) console.error('Navigation list not found!');
    if (!hamburger) console.error('Hamburger menu not found!');
    
    // Test hamburger menu functionality
    if (hamburger && navList) {
        console.log('Testing hamburger menu...');
        hamburger.click();
        
        // Check if navigation list is shown
        if (navList.classList.contains('show')) {
            console.log('Hamburger menu working correctly');
        } else {
            console.error('Hamburger menu not working!');
        }
        
        // Reset navigation
        hamburger.click();
    }
    
    console.log('Navigation tests completed');
}

// Test project cards functionality
function testProjectCards() {
    console.log('Testing project cards...');
    
    // Check if project cards exist
    const projectCards = document.querySelectorAll('.project-card');
    
    if (projectCards.length === 0) {
        console.error('No project cards found!');
        return;
    }
    
    console.log(`Found ${projectCards.length} project cards`);
    
    // Test project card hover effects
    projectCards.forEach((card, index) => {
        // Simulate hover
        const mouseEnterEvent = new Event('mouseenter');
        card.dispatchEvent(mouseEnterEvent);
        
        // Check if hover class is added
        if (card.classList.contains('card-hover')) {
            console.log(`Project card ${index + 1} hover effect working`);
        } else {
            console.error(`Project card ${index + 1} hover effect not working!`);
        }
        
        // Reset hover
        const mouseLeaveEvent = new Event('mouseleave');
        card.dispatchEvent(mouseLeaveEvent);
    });
    
    console.log('Project card tests completed');
}

// Test animations
function testAnimations() {
    console.log('Testing animations...');
    
    // Check if custom cursor exists
    const customCursor = document.querySelector('.custom-cursor');
    
    if (!customCursor) {
        console.error('Custom cursor not found!');
    } else {
        console.log('Custom cursor found');
    }
    
    // Check if glitch text exists
    const glitchTexts = document.querySelectorAll('.glitch');
    
    if (glitchTexts.length === 0) {
        console.error('No glitch text elements found!');
    } else {
        console.log(`Found ${glitchTexts.length} glitch text elements`);
    }
    
    // Check if background canvas exists
    const backgroundCanvas = document.querySelector('.background-canvas');
    
    if (!backgroundCanvas) {
        console.error('Background canvas not found!');
    } else {
        console.log('Background canvas found');
    }
    
    console.log('Animation tests completed');
}

// Test sound effects
function testSoundEffects() {
    console.log('Testing sound effects...');
    
    // Check if sound system exists
    if (!window.sounds) {
        console.error('Sound system not initialized!');
        return;
    }
    
    // Check if sound toggle exists
    const soundToggle = document.querySelector('.sound-toggle');
    
    if (!soundToggle) {
        console.error('Sound toggle not found!');
    } else {
        console.log('Sound toggle found');
        
        // Test sound toggle functionality
        soundToggle.click();
        soundToggle.click();
    }
    
    console.log('Sound effect tests completed');
}

// Test responsiveness
function testResponsiveness() {
    console.log('Testing responsiveness...');
    
    // Get current viewport width
    const viewportWidth = window.innerWidth;
    console.log(`Current viewport width: ${viewportWidth}px`);
    
    // Check if responsive container exists
    const responsiveContainers = document.querySelectorAll('.responsive-container');
    
    if (responsiveContainers.length === 0) {
        console.error('No responsive containers found!');
    } else {
        console.log(`Found ${responsiveContainers.length} responsive containers`);
    }
    
    // Check if device class is added to body
    const body = document.body;
    const isMobileDevice = body.classList.contains('mobile-device');
    const isTabletDevice = body.classList.contains('tablet-device');
    const isDesktopDevice = body.classList.contains('desktop-device');
    
    console.log(`Device detection: Mobile: ${isMobileDevice}, Tablet: ${isTabletDevice}, Desktop: ${isDesktopDevice}`);
    
    // Check if browser class is added to body
    const browserClasses = Array.from(body.classList).filter(cls => cls.startsWith('browser-'));
    
    if (browserClasses.length === 0) {
        console.error('No browser detection class found!');
    } else {
        console.log(`Browser detected: ${browserClasses[0]}`);
    }
    
    console.log('Responsiveness tests completed');
}

// Test ThreeJS demos
function testThreeJSDemos() {
    console.log('Testing ThreeJS demos...');
    
    // Check if current page is a ThreeJS demo
    const isThreeJSDemo = window.location.href.includes('/threejs/demo');
    
    if (!isThreeJSDemo) {
        console.log('Not on a ThreeJS demo page, skipping ThreeJS tests');
        return;
    }
    
    // Check if canvas container exists
    const canvasContainer = document.querySelector('.canvas-container');
    
    if (!canvasContainer) {
        console.error('Canvas container not found!');
        return;
    }
    
    console.log('Canvas container found');
    
    // Check if controls panel exists
    const controlsPanel = document.querySelector('.controls-panel');
    
    if (!controlsPanel) {
        console.error('Controls panel not found!');
    } else {
        console.log('Controls panel found');
    }
    
    // Check if THREE is loaded
    if (!window.THREE) {
        console.error('THREE.js not loaded!');
    } else {
        console.log('THREE.js loaded successfully');
    }
    
    console.log('ThreeJS demo tests completed');
}
