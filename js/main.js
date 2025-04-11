// Main JavaScript file for portfolio website

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize loading screen
    const loadingScreen = document.querySelector('.loading');
    
    // Hide loading screen after content loads
    window.addEventListener('load', function() {
        setTimeout(function() {
            loadingScreen.classList.add('hidden');
            setTimeout(function() {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 1000);
    });

    // Initialize particles.js for hero section
    if (document.getElementById('particles-js')) {
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: 80,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: "#00ffff"
                },
                shape: {
                    type: "circle",
                    stroke: {
                        width: 0,
                        color: "#000000"
                    },
                    polygon: {
                        nb_sides: 5
                    }
                },
                opacity: {
                    value: 0.5,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 1,
                        opacity_min: 0.1,
                        sync: false
                    }
                },
                size: {
                    value: 3,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 2,
                        size_min: 0.1,
                        sync: false
                    }
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: "#00ffff",
                    opacity: 0.4,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: "none",
                    random: true,
                    straight: false,
                    out_mode: "out",
                    bounce: false,
                    attract: {
                        enable: false,
                        rotateX: 600,
                        rotateY: 1200
                    }
                }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: {
                        enable: true,
                        mode: "grab"
                    },
                    onclick: {
                        enable: true,
                        mode: "push"
                    },
                    resize: true
                },
                modes: {
                    grab: {
                        distance: 140,
                        line_linked: {
                            opacity: 1
                        }
                    },
                    bubble: {
                        distance: 400,
                        size: 40,
                        duration: 2,
                        opacity: 8,
                        speed: 3
                    },
                    repulse: {
                        distance: 200,
                        duration: 0.4
                    },
                    push: {
                        particles_nb: 4
                    },
                    remove: {
                        particles_nb: 2
                    }
                }
            },
            retina_detect: true
        });
    }

    // Initialize AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: false
        });
    }

    // Custom cursor
    const cursor = document.querySelector('.custom-cursor');
    
    if (cursor) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });
        
        document.addEventListener('mousedown', () => {
            cursor.classList.add('active');
            playSound('click');
        });
        
        document.addEventListener('mouseup', () => {
            cursor.classList.remove('active');
        });
    }

    // Sound effects
    const sounds = {
        hover: new Audio('audio/hover.mp3'),
        click: new Audio('audio/click.mp3'),
        success: new Audio('audio/success.mp3')
    };

    // Preload sounds
    for (const sound in sounds) {
        sounds[sound].load();
        sounds[sound].volume = 0.2; // Set volume to 20%
    }

    // Function to play sound
    function playSound(soundName) {
        if (sounds[soundName]) {
            // Create a clone to allow overlapping sounds
            const soundClone = sounds[soundName].cloneNode();
            soundClone.volume = 0.2;
            soundClone.play().catch(e => console.log("Audio play failed:", e));
        }
    }

    // Add hover sound to interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .nav-link, .tech-button');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            playSound('hover');
        });
        
        element.addEventListener('click', () => {
            playSound('click');
        });
    });

    // Sticky navigation
    const navContainer = document.querySelector('.nav-container');
    
    if (navContainer) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navContainer.classList.add('scrolled');
            } else {
                navContainer.classList.remove('scrolled');
            }
        });
    }

    // Mobile navigation toggle
    const hamburger = document.getElementById('hamburger');
    const navList = document.getElementById('nav-list');
    
    if (hamburger && navList) {
        hamburger.addEventListener('click', () => {
            navList.classList.toggle('active');
            playSound('click');
        });
        
        // Close mobile menu when clicking on a link
        const navLinks = navList.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navList.classList.remove('active');
                playSound('success');
            });
        });
    }

    // Smooth scrolling for anchor links (only for links that start with # and are not just #)
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Play success sound when reaching the target
                setTimeout(() => {
                    playSound('success');
                }, 500);
            }
        });
    });

    // Glitch effect animation enhancement
    const glitchElements = document.querySelectorAll('.glitch');
    
    glitchElements.forEach(element => {
        // Set data-text attribute if not already set
        if (!element.getAttribute('data-text')) {
            element.setAttribute('data-text', element.textContent);
        }
        
        // Random glitch effect
        setInterval(() => {
            if (Math.random() > 0.95) {
                element.style.textShadow = `
                    ${Math.random() * 10 - 5}px ${Math.random() * 10 - 5}px 0 rgba(0, 255, 255, 0.7),
                    ${Math.random() * 10 - 5}px ${Math.random() * 10 - 5}px 0 rgba(255, 0, 255, 0.7)
                `;
                
                setTimeout(() => {
                    element.style.textShadow = '';
                }, 100);
            }
        }, 500);
    });

    // Project hover effects
    const projectSections = document.querySelectorAll('.project-section');
    
    projectSections.forEach(section => {
        section.addEventListener('mouseenter', () => {
            section.style.transform = 'translateY(-10px)';
            section.style.boxShadow = '0 0 30px rgba(0, 255, 255, 0.3)';
            section.style.border = '1px solid rgba(0, 255, 255, 0.5)';
        });
        
        section.addEventListener('mouseleave', () => {
            section.style.transform = '';
            section.style.boxShadow = '';
            section.style.border = '';
        });
    });

    // ThreeJS card hover effects
    const threejsCards = document.querySelectorAll('.threejs-card');
    
    threejsCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            playSound('hover');
        });
    });

    // Add neon trail effect
    if (cursor) {
        let trail = [];
        const trailLength = 20;
        
        for (let i = 0; i < trailLength; i++) {
            const trailDot = document.createElement('div');
            trailDot.className = 'trail-dot';
            trailDot.style.position = 'fixed';
            trailDot.style.width = '5px';
            trailDot.style.height = '5px';
            trailDot.style.borderRadius = '50%';
            trailDot.style.backgroundColor = 'rgba(0, 255, 255, 0.5)';
            trailDot.style.boxShadow = '0 0 10px rgba(0, 255, 255, 0.8)';
            trailDot.style.pointerEvents = 'none';
            trailDot.style.zIndex = '9998';
            trailDot.style.opacity = (1 - i / trailLength).toString();
            trailDot.style.transform = 'translate(-50%, -50%)';
            document.body.appendChild(trailDot);
            trail.push({
                element: trailDot,
                x: 0,
                y: 0
            });
        }
        
        let mouseX = 0;
        let mouseY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        
        function updateTrail() {
            trail.forEach((dot, index) => {
                if (index === 0) {
                    dot.x = mouseX;
                    dot.y = mouseY;
                } else {
                    dot.x += (trail[index - 1].x - dot.x) * 0.3;
                    dot.y += (trail[index - 1].y - dot.y) * 0.3;
                }
                
                dot.element.style.left = dot.x + 'px';
                dot.element.style.top = dot.y + 'px';
            });
            
            requestAnimationFrame(updateTrail);
        }
        
        updateTrail();
    }
});
