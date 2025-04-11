// Enhanced animations and interactive effects for the portfolio website

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize sound effects
    initSounds();
    
    // Initialize custom cursor
    initCustomCursor();
    
    // Initialize page transition effects
    initPageTransitions();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize interactive elements
    initInteractiveElements();
    
    // Initialize neon text effects
    initNeonTextEffects();
    
    // Initialize background effects
    initBackgroundEffects();
    
    // Hide loading screen when everything is ready
    setTimeout(function() {
        document.querySelector('.loading').style.display = 'none';
    }, 500);
});

// Initialize sound effects
function initSounds() {
    // Create sound objects
    window.sounds = {
        hover: new Audio('/audio/hover.mp3'),
        click: new Audio('/audio/click.mp3'),
        success: new Audio('/audio/success.mp3')
    };
    
    // Set volume
    Object.values(window.sounds).forEach(sound => {
        sound.volume = 0.2;
    });
    
    // Add hover sound to all interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .project-card, .model-option, .nav-item, .btn');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            playSound('hover');
        });
        
        element.addEventListener('click', function() {
            playSound('click');
        });
    });
}

// Play sound effect
function playSound(soundName) {
    if (window.sounds && window.sounds[soundName]) {
        // Clone the audio to allow overlapping sounds
        const soundClone = window.sounds[soundName].cloneNode();
        soundClone.volume = 0.2;
        soundClone.play().catch(e => console.log("Audio play failed:", e));
    }
}

// Initialize custom cursor
function initCustomCursor() {
    const cursor = document.querySelector('.custom-cursor');
    const cursorTrail = document.createElement('div');
    cursorTrail.classList.add('cursor-trail');
    document.body.appendChild(cursorTrail);
    
    // Create trail elements
    const trailCount = 10;
    const trails = [];
    
    for (let i = 0; i < trailCount; i++) {
        const trail = document.createElement('div');
        trail.classList.add('trail');
        trail.style.width = `${8 - i * 0.5}px`;
        trail.style.height = `${8 - i * 0.5}px`;
        trail.style.opacity = `${1 - i * 0.1}`;
        cursorTrail.appendChild(trail);
        trails.push({
            element: trail,
            x: 0,
            y: 0
        });
    }
    
    // Update cursor position
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Show cursor and trail
        cursor.style.opacity = '1';
        cursorTrail.style.opacity = '1';
        
        // Check if hovering over interactive element
        const target = e.target;
        if (target.tagName === 'A' || 
            target.tagName === 'BUTTON' || 
            target.classList.contains('project-card') ||
            target.classList.contains('model-option') ||
            target.classList.contains('nav-item') ||
            target.classList.contains('btn')) {
            
            cursor.classList.add('cursor-hover');
        } else {
            cursor.classList.remove('cursor-hover');
        }
    });
    
    // Hide cursor when leaving window
    document.addEventListener('mouseleave', function() {
        cursor.style.opacity = '0';
        cursorTrail.style.opacity = '0';
    });
    
    // Animate cursor
    function animateCursor() {
        // Smooth cursor movement
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;
        
        // Update cursor position
        cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
        
        // Update trail positions with delay
        for (let i = 0; i < trails.length; i++) {
            const trail = trails[i];
            
            // Calculate target position (position of previous trail or cursor)
            const targetX = i === 0 ? cursorX : trails[i - 1].x;
            const targetY = i === 0 ? cursorY : trails[i - 1].y;
            
            // Smooth trail movement
            trail.x += (targetX - trail.x) * 0.3;
            trail.y += (targetY - trail.y) * 0.3;
            
            // Update trail position
            trail.element.style.transform = `translate(${trail.x}px, ${trail.y}px)`;
        }
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
}

// Initialize page transitions
function initPageTransitions() {
    // Add transition class to body
    document.body.classList.add('page-transition');
    
    // Add click event to all links
    const links = document.querySelectorAll('a:not([target="_blank"])');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            // Skip if modifier keys are pressed
            if (e.metaKey || e.ctrlKey) return;
            
            // Get href attribute
            const href = this.getAttribute('href');
            
            // Skip if href is not a relative URL or is an anchor
            if (!href || href.startsWith('#') || href.startsWith('http')) return;
            
            // Prevent default navigation
            e.preventDefault();
            
            // Play click sound
            playSound('click');
            
            // Add exit class to body
            document.body.classList.add('page-exit');
            
            // Navigate to new page after transition
            setTimeout(function() {
                window.location.href = href;
            }, 500);
        });
    });
    
    // Add enter class to body on page load
    window.addEventListener('load', function() {
        document.body.classList.add('page-enter');
    });
}

// Initialize scroll animations
function initScrollAnimations() {
    // Get all elements to animate
    const animateElements = document.querySelectorAll('.project-card, .section-title, .demo-info, .controls-panel, .canvas-container');
    
    // Create intersection observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });
    
    // Observe each element
    animateElements.forEach(element => {
        observer.observe(element);
    });
    
    // Add scroll-triggered animations to header
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header-container');
        const scrollPosition = window.scrollY;
        
        if (header) {
            // Parallax effect for header
            header.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
            
            // Add class when scrolled
            if (scrollPosition > 50) {
                header.classList.add('header-scrolled');
            } else {
                header.classList.remove('header-scrolled');
            }
        }
    });
}

// Initialize interactive elements
function initInteractiveElements() {
    // Add hover effects to project cards
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.classList.add('card-hover');
            
            // Create floating particles
            createParticles(this);
        });
        
        card.addEventListener('mouseleave', function() {
            this.classList.remove('card-hover');
        });
        
        card.addEventListener('click', function() {
            this.classList.add('card-click');
            
            setTimeout(() => {
                this.classList.remove('card-click');
            }, 300);
        });
    });
    
    // Add click animations to buttons
    const buttons = document.querySelectorAll('.btn, button');
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            this.classList.add('btn-click');
            
            setTimeout(() => {
                this.classList.remove('btn-click');
            }, 300);
        });
    });
    
    // Add ripple effect to interactive elements
    const rippleElements = document.querySelectorAll('.btn, button, .nav-item, .model-option');
    
    rippleElements.forEach(element => {
        element.addEventListener('click', function(e) {
            // Create ripple element
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            this.appendChild(ripple);
            
            // Set ripple position
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
            ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
            
            // Remove ripple after animation
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Initialize hamburger menu
    const hamburger = document.getElementById('hamburger');
    const navList = document.getElementById('nav-list');
    
    if (hamburger && navList) {
        hamburger.addEventListener('click', function() {
            navList.classList.toggle('show');
            this.classList.toggle('active');
            playSound('click');
        });
    }
}

// Create floating particles for element
function createParticles(element) {
    // Get element position
    const rect = element.getBoundingClientRect();
    
    // Create particles container
    const particlesContainer = document.createElement('div');
    particlesContainer.classList.add('particles-container');
    particlesContainer.style.position = 'absolute';
    particlesContainer.style.left = `${rect.left}px`;
    particlesContainer.style.top = `${rect.top}px`;
    particlesContainer.style.width = `${rect.width}px`;
    particlesContainer.style.height = `${rect.height}px`;
    particlesContainer.style.pointerEvents = 'none';
    particlesContainer.style.zIndex = '1000';
    document.body.appendChild(particlesContainer);
    
    // Create particles
    const particleCount = 10;
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
        // Create particle element
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Set random position
        const x = Math.random() * rect.width;
        const y = Math.random() * rect.height;
        
        // Set random size
        const size = Math.random() * 5 + 2;
        
        // Set random color
        const colors = ['#00ffff', '#ff00ff', '#ffff00'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        // Set styles
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.backgroundColor = color;
        particle.style.boxShadow = `0 0 ${size}px ${color}`;
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        
        // Add to container
        particlesContainer.appendChild(particle);
        
        // Store particle data
        particles.push({
            element: particle,
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            size: size,
            alpha: 1
        });
    }
    
    // Animate particles
    let animationId;
    
    function animateParticles() {
        let allDone = true;
        
        particles.forEach(particle => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Update alpha
            particle.alpha -= 0.01;
            
            // Update element
            particle.element.style.left = `${particle.x}px`;
            particle.element.style.top = `${particle.y}px`;
            particle.element.style.opacity = particle.alpha;
            
            // Check if particle is still visible
            if (particle.alpha > 0) {
                allDone = false;
            }
        });
        
        // Remove container if all particles are done
        if (allDone) {
            cancelAnimationFrame(animationId);
            particlesContainer.remove();
        } else {
            animationId = requestAnimationFrame(animateParticles);
        }
    }
    
    animationId = requestAnimationFrame(animateParticles);
    
    // Remove container when mouse leaves element
    element.addEventListener('mouseleave', function() {
        setTimeout(() => {
            cancelAnimationFrame(animationId);
            particlesContainer.remove();
        }, 500);
    });
}

// Initialize neon text effects
function initNeonTextEffects() {
    // Add glitch effect to glitch text
    const glitchTexts = document.querySelectorAll('.glitch');
    
    glitchTexts.forEach(text => {
        // Get text content
        const textContent = text.getAttribute('data-text') || text.textContent;
        
        // Create glitch layers
        const before = document.createElement('span');
        before.classList.add('glitch-before');
        before.setAttribute('data-text', textContent);
        
        const after = document.createElement('span');
        after.classList.add('glitch-after');
        after.setAttribute('data-text', textContent);
        
        // Add layers to text
        text.appendChild(before);
        text.appendChild(after);
        
        // Add random glitch animation
        setInterval(() => {
            // Random chance to trigger glitch
            if (Math.random() < 0.1) {
                text.classList.add('glitching');
                
                setTimeout(() => {
                    text.classList.remove('glitching');
                }, 200);
            }
        }, 2000);
    });
    
    // Add typing effect to section titles
    const sectionTitles = document.querySelectorAll('.section-title');
    
    sectionTitles.forEach(title => {
        // Get text content
        const textContent = title.textContent;
        
        // Clear text content
        title.textContent = '';
        
        // Create typing container
        const typingContainer = document.createElement('span');
        typingContainer.classList.add('typing-text');
        title.appendChild(typingContainer);
        
        // Create cursor
        const cursor = document.createElement('span');
        cursor.classList.add('typing-cursor');
        cursor.textContent = '|';
        title.appendChild(cursor);
        
        // Add intersection observer to trigger typing animation
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Start typing animation
                    let i = 0;
                    const typingInterval = setInterval(() => {
                        if (i < textContent.length) {
                            typingContainer.textContent += textContent.charAt(i);
                            i++;
                        } else {
                            clearInterval(typingInterval);
                        }
                    }, 100);
                    
                    observer.unobserve(title);
                }
            });
        }, {
            threshold: 0.5
        });
        
        observer.observe(title);
    });
}

// Initialize background effects
function initBackgroundEffects() {
    // Create canvas for background effect
    const canvas = document.createElement('canvas');
    canvas.classList.add('background-canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '-1';
    document.body.appendChild(canvas);
    
    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Get context
    const ctx = canvas.getContext('2d');
    
    // Create grid points
    const gridSize = 20;
    const points = [];
    
    for (let x = 0; x < canvas.width; x += gridSize) {
        for (let y = 0; y < canvas.height; y += gridSize) {
            points.push({
                x: x,
                y: y,
                originX: x,
                originY: y,
                vx: 0,
                vy: 0
            });
        }
    }
    
    // Mouse position
    let mouseX = 0;
    let mouseY = 0;
    
    // Update mouse position
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Animate grid
    function animateGrid() {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update points
        points.forEach(point => {
            // Calculate distance to mouse
            const dx = mouseX - point.x;
            const dy = mouseY - point.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Calculate force
            const force = Math.max(0, 100 - distance) / 10;
            
            // Apply force
            point.vx += (dx / distance) * force * 0.1;
            point.vy += (dy / distance) * force * 0.1;
            
            // Apply spring force
            point.vx += (point.originX - point.x) * 0.05;
            point.vy += (point.originY - point.y) * 0.05;
            
            // Apply damping
            point.vx *= 0.9;
            point.vy *= 0.9;
            
            // Update position
            point.x += point.vx;
            point.y += point.vy;
        });
        
        // Draw grid
        ctx.strokeStyle = 'rgba(0, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        
        for (let i = 0; i < points.length; i++) {
            const point = points[i];
            
            // Draw connections to nearby points
            for (let j = i + 1; j < points.length; j++) {
                const neighbor = points[j];
                const dx = neighbor.x - point.x;
                const dy = neighbor.y - point.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < gridSize * 2) {
                    ctx.beginPath();
                    ctx.moveTo(point.x, point.y);
                    ctx.lineTo(neighbor.x, neighbor.y);
                    ctx.stroke();
                }
            }
        }
        
        requestAnimationFrame(animateGrid);
    }
    
    // Start animation
    animateGrid();
    
    // Handle window resize
    window.addEventListener('resize', function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}
