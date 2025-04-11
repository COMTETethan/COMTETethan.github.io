/* Loading animations for the portfolio website */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize loading animations
    initLoadingAnimations();
});

// Initialize loading animations
function initLoadingAnimations() {
    // Get loading screen element
    const loadingScreen = document.querySelector('.loading');
    
    // Create neon particles for loading screen
    if (loadingScreen) {
        createLoadingParticles(loadingScreen);
    }
    
    // Add loading animation to all sections
    const sections = document.querySelectorAll('main > .container > .row');
    
    sections.forEach((section, index) => {
        // Add loading class
        section.classList.add('loading-section');
        
        // Set delay based on index
        section.style.animationDelay = `${index * 0.2}s`;
    });
    
    // Add loading animation to ThreeJS canvases
    const canvasContainers = document.querySelectorAll('.canvas-container');
    
    canvasContainers.forEach(container => {
        // Create loading overlay
        const overlay = document.createElement('div');
        overlay.classList.add('canvas-loading-overlay');
        
        // Create loading spinner
        const spinner = document.createElement('div');
        spinner.classList.add('canvas-loading-spinner');
        overlay.appendChild(spinner);
        
        // Add loading text
        const text = document.createElement('div');
        text.classList.add('canvas-loading-text');
        text.textContent = 'Initializing 3D Environment...';
        overlay.appendChild(text);
        
        // Add overlay to container
        container.appendChild(overlay);
        
        // Remove overlay after delay
        setTimeout(() => {
            overlay.classList.add('fade-out');
            
            setTimeout(() => {
                overlay.remove();
            }, 500);
        }, 2000);
    });
    
    // Hide main loading screen after delay
    setTimeout(() => {
        if (loadingScreen) {
            loadingScreen.classList.add('fade-out');
            
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }, 1000);
}

// Create neon particles for loading screen
function createLoadingParticles(container) {
    // Create particles container
    const particlesContainer = document.createElement('div');
    particlesContainer.classList.add('loading-particles');
    container.appendChild(particlesContainer);
    
    // Create particles
    const particleCount = 20;
    
    for (let i = 0; i < particleCount; i++) {
        // Create particle
        const particle = document.createElement('div');
        particle.classList.add('loading-particle');
        
        // Set random position
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        
        // Set random size
        const size = Math.random() * 10 + 5;
        
        // Set random color
        const colors = ['#00ffff', '#ff00ff', '#ffff00'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        // Set random animation duration
        const duration = Math.random() * 3 + 2;
        
        // Set random animation delay
        const delay = Math.random() * 2;
        
        // Set styles
        particle.style.left = `${x}%`;
        particle.style.top = `${y}%`;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.backgroundColor = color;
        particle.style.boxShadow = `0 0 ${size}px ${color}`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;
        
        // Add to container
        particlesContainer.appendChild(particle);
    }
}

// Add CSS for loading animations
function addLoadingStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Loading Screen */
        .loading {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: #0d0d0d;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            transition: opacity 0.5s ease;
        }
        
        .loading.fade-out {
            opacity: 0;
        }
        
        .loading-spinner {
            width: 50px;
            height: 50px;
            border: 3px solid rgba(0, 255, 255, 0.3);
            border-radius: 50%;
            border-top-color: #00ffff;
            animation: spin 1s ease-in-out infinite;
            box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
        }
        
        @keyframes spin {
            to {
                transform: rotate(360deg);
            }
        }
        
        /* Loading Particles */
        .loading-particles {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
        }
        
        .loading-particle {
            position: absolute;
            border-radius: 50%;
            opacity: 0;
            animation: particle-fade 3s ease-in-out infinite;
        }
        
        @keyframes particle-fade {
            0%, 100% {
                opacity: 0;
                transform: scale(0.5);
            }
            50% {
                opacity: 0.8;
                transform: scale(1);
            }
        }
        
        /* Section Loading Animation */
        .loading-section {
            opacity: 0;
            transform: translateY(20px);
            animation: section-fade-in 0.8s ease forwards;
        }
        
        @keyframes section-fade-in {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        /* Canvas Loading Overlay */
        .canvas-loading-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(13, 13, 13, 0.8);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 10;
            transition: opacity 0.5s ease;
        }
        
        .canvas-loading-overlay.fade-out {
            opacity: 0;
        }
        
        .canvas-loading-spinner {
            width: 40px;
            height: 40px;
            border: 2px solid rgba(0, 255, 255, 0.3);
            border-radius: 50%;
            border-top-color: #00ffff;
            animation: spin 1s ease-in-out infinite;
            box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
            margin-bottom: 15px;
        }
        
        .canvas-loading-text {
            color: #00ffff;
            font-size: 14px;
            text-shadow: 0 0 5px rgba(0, 255, 255, 0.5);
        }
    `;
    
    document.head.appendChild(style);
}

// Add loading styles
addLoadingStyles();
