// Demo 2 - Particle System JavaScript

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // ThreeJS Variables
    let scene, camera, renderer, controls;
    let particles, particleSystem;
    let mouseX = 0, mouseY = 0;
    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;
    let clock = new THREE.Clock();
    
    // Settings
    const settings = {
        particles: {
            count: 5000,
            size: 0.1,
            opacity: 0.8
        },
        colors: {
            mode: 'rainbow',
            color1: '#00ffff',
            color2: '#ff00ff'
        },
        physics: {
            simulationType: 'swarm',
            speed: 1.0,
            turbulence: 0.2,
            mouseInteraction: true
        },
        environment: {
            backgroundColor: '#0d0d0d',
            showTrails: true
        }
    };
    
    // DOM Elements
    const canvasContainer = document.getElementById('canvas-container');
    
    // Initialize the scene
    function init() {
        // Create scene
        scene = new THREE.Scene();
        scene.background = new THREE.Color(settings.environment.backgroundColor);
        
        // Create camera
        camera = new THREE.PerspectiveCamera(75, canvasContainer.clientWidth / canvasContainer.clientHeight, 0.1, 1000);
        camera.position.z = 30;
        
        // Create renderer
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        canvasContainer.appendChild(renderer.domElement);
        
        // Add orbit controls
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.enableZoom = true;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.5;
        
        // Create particles
        createParticles();
        
        // Add event listeners
        addEventListeners();
        
        // Start animation loop
        animate();
        
        // Handle window resize
        window.addEventListener('resize', onWindowResize);
        
        // Mouse move event for interaction
        document.addEventListener('mousemove', onDocumentMouseMove);
    }
    
    // Create particles
    function createParticles() {
        // Remove current particles if they exist
        if (particleSystem) {
            scene.remove(particleSystem);
        }
        
        // Create geometry
        particles = new THREE.BufferGeometry();
        
        // Create arrays for positions, colors, and velocities
        const positions = new Float32Array(settings.particles.count * 3);
        const colors = new Float32Array(settings.particles.count * 3);
        const velocities = new Float32Array(settings.particles.count * 3);
        
        // Initialize particles based on simulation type
        switch (settings.physics.simulationType) {
            case 'swarm':
                initSwarmParticles(positions, colors, velocities);
                break;
            case 'galaxy':
                initGalaxyParticles(positions, colors, velocities);
                break;
            case 'fountain':
                initFountainParticles(positions, colors, velocities);
                break;
            case 'wave':
                initWaveParticles(positions, colors, velocities);
                break;
            default:
                initSwarmParticles(positions, colors, velocities);
        }
        
        // Add attributes to geometry
        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        // Store velocities in userData
        particles.userData = {
            velocities: velocities
        };
        
        // Create material
        const material = new THREE.PointsMaterial({
            size: settings.particles.size,
            vertexColors: true,
            transparent: true,
            opacity: settings.particles.opacity,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        
        // Create particle system
        particleSystem = new THREE.Points(particles, material);
        scene.add(particleSystem);
        
        playSound('uccess');
    }
    
    // Initialize swarm particles
    function initSwarmParticles(positions, colors, velocities) {
        for (let i = 0; i < settings.particles.count; i++) {
            const i3 = i * 3;
            
            // Position
            positions[i3] = (Math.random() - 0.5) * 50;
            positions[i3 + 1] = (Math.random() - 0.5) * 50;
            positions[i3 + 2] = (Math.random() - 0.5) * 50;
            
            // Velocity
            velocities[i3] = (Math.random() - 0.5) * 0.2;
            velocities[i3 + 1] = (Math.random() - 0.5) * 0.2;
            velocities[i3 + 2] = (Math.random() - 0.5) * 0.2;
            
            // Color
            setParticleColor(i, colors);
        }
    }
    
    // Initialize galaxy particles
    function initGalaxyParticles(positions, colors, velocities) {
        for (let i = 0; i < settings.particles.count; i++) {
            const i3 = i * 3;
            
            // Create galaxy spiral
            const radius = Math.random() * 20 + 5;
            const angle = Math.random() * Math.PI * 2;
            const height = (Math.random() - 0.5) * 5;
            
            positions[i3] = Math.cos(angle) * radius;
            positions[i3 + 1] = height;
            positions[i3 + 2] = Math.sin(angle) * radius;
            
            // Velocity (orbital)
            const speed = 0.02 * (1 / Math.sqrt(radius));
            velocities[i3] = -Math.sin(angle) * speed;
            velocities[i3 + 1] = (Math.random() - 0.5) * 0.01;
            velocities[i3 + 2] = Math.cos(angle) * speed;
            
            // Color
            setParticleColor(i, colors);
        }
    }
    
    // Initialize fountain particles
    function initFountainParticles(positions, colors, velocities) {
        for (let i = 0; i < settings.particles.count; i++) {
            const i3 = i * 3;
            
            // Position (start at bottom)
            positions[i3] = (Math.random() - 0.5) * 10;
            positions[i3 + 1] = -20 + Math.random() * 40; // Distribute vertically
            positions[i3 + 2] = (Math.random() - 0.5) * 10;
            
            // Velocity (upward with spread)
            velocities[i3] = (Math.random() - 0.5) * 0.1;
            velocities[i3 + 1] = Math.random() * 0.2 + 0.1;
            velocities[i3 + 2] = (Math.random() - 0.5) * 0.1;
            
            // Color
            setParticleColor(i, colors);
        }
    }
    
    // Initialize wave particles
    function initWaveParticles(positions, colors, velocities) {
        const gridSize = Math.ceil(Math.sqrt(settings.particles.count));
        const spacing = 40 / gridSize;
        
        for (let i = 0; i < settings.particles.count; i++) {
            const i3 = i * 3;
            
            // Create grid
            const x = (i % gridSize) * spacing - 20;
            const z = Math.floor(i / gridSize) * spacing - 20;
            
            positions[i3] = x;
            positions[i3 + 1] = 0;
            positions[i3 + 2] = z;
            
            // Velocity (minimal for wave effect)
            velocities[i3] = 0;
            velocities[i3 + 1] = 0;
            velocities[i3 + 2] = 0;
            
            // Color
            setParticleColor(i, colors);
        }
    }
    
    // Set particle color based on color mode
    function setParticleColor(index, colors) {
        const i3 = index * 3;
        
        switch (settings.colors.mode) {
            case 'rainbow':
                // HSL to RGB conversion for rainbow effect
                const hue = (index / settings.particles.count) * 360;
                const color = new THREE.Color();
                color.setHSL(hue / 360, 1, 0.5);
                
                colors[i3] = color.r;
                colors[i3 + 1] = color.g;
                colors[i3 + 2] = color.b;
                break;
                
            case 'gradient':
                // Gradient between two colors
                const ratio = index / settings.particles.count;
                const color1 = new THREE.Color(settings.colors.color1);
                const color2 = new THREE.Color(settings.colors.color2);
                const mixedColor = new THREE.Color().lerpColors(color1, color2, ratio);
                
                colors[i3] = mixedColor.r;
                colors[i3 + 1] = mixedColor.g;
                colors[i3 + 2] = mixedColor.b;
                break;
                
            case 'single':
                // Single color
                const singleColor = new THREE.Color(settings.colors.color1);
                
                colors[i3] = singleColor.r;
                colors[i3 + 1] = singleColor.g;
                colors[i3 + 2] = singleColor.b;
                break;
                
            default:
                // Default to rainbow
                const defaultHue = (index / settings.particles.count) * 360;
                const defaultColor = new THREE.Color();
                defaultColor.setHSL(defaultHue / 360, 1, 0.5);
                
                colors[i3] = defaultColor.r;
                colors[i3 + 1] = defaultColor.g;
                colors[i3 + 2] = defaultColor.b;
        }
    }
    
    // Update particle positions based on simulation type
    function updateParticles(deltaTime) {
        if (!particles || !particleSystem) return;
        
        const positions = particles.attributes.position.array;
        const velocities = particles.userData.velocities;
        const speedFactor = settings.physics.speed * deltaTime * 60;
        
        switch (settings.physics.simulationType) {
            case 'swarm':
                updateSwarmParticles(positions, velocities, speedFactor);
                break;
            case 'galaxy':
                updateGalaxyParticles(positions, velocities, speedFactor);
                break;
            case 'fountain':
                updateFountainParticles(positions, velocities, speedFactor);
                break;
            case 'wave':
                updateWaveParticles(positions, velocities, speedFactor);
                break;
            default:
                updateSwarmParticles(positions, velocities, speedFactor);
        }
        
        particles.attributes.position.needsUpdate = true;
    }
    
    // Update swarm particles
    function updateSwarmParticles(positions, velocities, speedFactor) {
        for (let i = 0; i < settings.particles.count; i++) {
            const i3 = i * 3;
            
            // Apply velocity
            positions[i3] += velocities[i3] * speedFactor;
            positions[i3 + 1] += velocities[i3 + 1] * speedFactor;
            positions[i3 + 2] += velocities[i3 + 2] * speedFactor;
            
            // Apply turbulence
            velocities[i3] += (Math.random() - 0.5) * 0.01 * settings.physics.turbulence;
            velocities[i3 + 1] += (Math.random() - 0.5) * 0.01 * settings.physics.turbulence;
            velocities[i3 + 2] += (Math.random() - 0.5) * 0.01 * settings.physics.turbulence;
            
            // Apply mouse interaction
            if (settings.physics.mouseInteraction) {
                const mouseInfluence = 0.001 * speedFactor;
                velocities[i3] += (mouseX - positions[i3]) * mouseInfluence;
                velocities[i3 + 1] += (mouseY - positions[i3 + 1]) * mouseInfluence;
            }
            
            // Boundary check
            const boundaryForce = 0.05 * speedFactor;
            if (Math.abs(positions[i3]) > 25) velocities[i3] -= positions[i3] * boundaryForce;
            if (Math.abs(positions[i3 + 1]) > 25) velocities[i3 + 1] -= positions[i3 + 1] * boundaryForce;
            if (Math.abs(positions[i3 + 2]) > 25) velocities[i3 + 2] -= positions[i3 + 2] * boundaryForce;
            
            // Damping
            velocities[i3] *= 0.99;
            velocities[i3 + 1] *= 0.99;
            velocities[i3 + 2] *= 0.99;
        }
    }
    
    // Update galaxy particles
    function updateGalaxyParticles(positions, velocities, speedFactor) {
        for (let i = 0; i < settings.particles.count; i++) {
            const i3 = i * 3;
            
            // Apply orbital velocity
            const x = positions[i3];
            const z = positions[i3 + 2];
            
            // Calculate distance from center
            const distance = Math.sqrt(x * x + z * z);
            
            // Apply velocity
            positions[i3] += velocities[i3] * speedFactor * distance;
            positions[i3 + 1] += velocities[i3 + 1] * speedFactor;
            positions[i3 + 2] += velocities[i3 + 2] * speedFactor * distance;
            
            // Apply turbulence
            velocities[i3 + 1] += (Math.random() - 0.5) * 0.001 * settings.physics.turbulence;
            
            // Apply mouse interaction
            if (settings.physics.mouseInteraction) {
                const mouseInfluence = 0.0001 * speedFactor;
                velocities[i3 + 1] += (mouseY - positions[i3 + 1]) * mouseInfluence;
            }
            
            // Height boundary
            if (Math.abs(positions[i3 + 1]) > 5) {
                velocities[i3 + 1] -= positions[i3 + 1] * 0.01 * speedFactor;
            }
        }
    }
    
    // Update fountain particles
    function updateFountainParticles(positions, velocities, speedFactor) {
        for (let i = 0; i < settings.particles.count; i++) {
            const i3 = i * 3;
            
            // Apply velocity
            positions[i3] += velocities[i3] * speedFactor;
            positions[i3 + 1] += velocities[i3 + 1] * speedFactor;
            positions[i3 + 2] += velocities[i3 + 2] * speedFactor;
            
            // Apply gravity
            velocities[i3 + 1] -= 0.01 * speedFactor;
            
            // Apply turbulence
            velocities[i3] += (Math.random() - 0.5) * 0.01 * settings.physics.turbulence;
            velocities[i3 + 2] += (Math.random() - 0.5) * 0.01 * settings.physics.turbulence;
            
            // Apply mouse interaction
            if (settings.physics.mouseInteraction) {
                const mouseInfluence = 0.0005 * speedFactor;
                velocities[i3] += (mouseX - positions[i3]) * mouseInfluence;
                velocities[i3 + 2] += (mouseY - positions[i3 + 2]) * mouseInfluence;
            }
            
            // Reset particles that fall below boundary
            if (positions[i3 + 1] < -20) {
                positions[i3] = (Math.random() - 0.5) * 10;
                positions[i3 + 1] = -20;
                positions[i3 + 2] = (Math.random() - 0.5) * 10;
                
                velocities[i3] = (Math.random() - 0.5) * 0.1;
                velocities[i3 + 1] = Math.random() * 0.2 + 0.1;
                velocities[i3 + 2] = (Math.random() - 0.5) * 0.1;
            }
            
            // Horizontal boundary
            const boundaryForce = 0.01 * speedFactor;
            if (Math.abs(positions[i3]) > 20) velocities[i3] -= positions[i3] * boundaryForce;
            if (Math.abs(positions[i3 + 2]) > 20) velocities[i3 + 2] -= positions[i3 + 2] * boundaryForce;
        }
    }
    
    // Update wave particles
    function updateWaveParticles(positions, velocities, speedFactor) {
        const time = Date.now() * 0.001;
        
        for (let i = 0; i < settings.particles.count; i++) {
            const i3 = i * 3;
            
            // Get original x and z
            const x = positions[i3];
            const z = positions[i3 + 2];
            
            // Create wave pattern
            const distance = Math.sqrt(x * x + z * z);
            const amplitude = 5 * settings.physics.speed;
            const frequency = 0.2;
            const phase = time * 2;
            
            // Set y position based on wave equation
            positions[i3 + 1] = Math.sin(distance * frequency + phase) * amplitude;
            
            // Apply turbulence
            if (settings.physics.turbulence > 0) {
                positions[i3 + 1] += (Math.random() - 0.5) * settings.physics.turbulence;
            }
            
            // Apply mouse interaction
            if (settings.physics.mouseInteraction) {
                const dx = mouseX - x;
                const dz = mouseY - z;
                const mouseDistance = Math.sqrt(dx * dx + dz * dz);
                
                if (mouseDistance < 10) {
                    positions[i3 + 1] += (10 - mouseDistance) * 0.2;
                }
            }
        }
    }
    
    // Handle mouse movement
    function onDocumentMouseMove(event) {
        // Calculate mouse position in normalized device coordinates (-1 to +1)
        const rect = renderer.domElement.getBoundingClientRect();
        mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        // Convert to world coordinates
        mouseX *= 20;
        mouseY *= 20;
    }
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Get delta time
        const deltaTime = clock.getDelta();
        
        // Update particles
        updateParticles(deltaTime);
        
        // Update controls
        controls.update();
        
        // Clear renderer if trails are disabled
        if (!settings.environment.showTrails) {
            renderer.clear();
        }
        
        // Render scene
        renderer.render(scene, camera);
    }
    
    // Handle window resize
    function onWindowResize() {
        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;
        
        camera.aspect = canvasContainer.clientWidth / canvasContainer.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
    }
    
    // Add event listeners for controls
    function addEventListeners() {
        // Particle Count Slider
        document.getElementById('particle-count-slider').addEventListener('input', function(e) {
            settings.particles.count = parseInt(e.target.value);
            document.getElementById('particle-count-value').textContent = settings.particles.count;
            createParticles();
        });
        
        // Particle Size Slider
        document.getElementById('particle-size-slider').addEventListener('input', function(e) {
            settings.particles.size = parseFloat(e.target.value);
            document.getElementById('particle-size-value').textContent = settings.particles.size.toFixed(2);
            if (particleSystem) {
                particleSystem.material.size = settings.particles.size;
            }
        });
        
        // Particle Opacity Slider
        document.getElementById('particle-opacity-slider').addEventListener('input', function(e) {
            settings.particles.opacity = parseFloat(e.target.value);
            document.getElementById('particle-opacity-value').textContent = settings.particles.opacity.toFixed(2);
            if (particleSystem) {
                particleSystem.material.opacity = settings.particles.opacity;
            }
        });
        
        // Color Mode
        document.getElementById('color-mode').addEventListener('change', function(e) {
            settings.colors.mode = e.target.value;
            createParticles();
            playSound('click');
        });
        
        // Color 1 Picker
        document.getElementById('color-1').addEventListener('input', function(e) {
            settings.colors.color1 = e.target.value;
            if (settings.colors.mode !== 'rainbow') {
                createParticles();
            }
        });
        
        // Color 2 Picker
        document.getElementById('color-2').addEventListener('input', function(e) {
            settings.colors.color2 = e.target.value;
            if (settings.colors.mode === 'gradient') {
                createParticles();
            }
        });
        
        // Simulation Type
        document.getElementById('simulation-type').addEventListener('change', function(e) {
            settings.physics.simulationType = e.target.value;
            createParticles();
            playSound('click');
        });
        
        // Speed Slider
        document.getElementById('speed-slider').addEventListener('input', function(e) {
            settings.physics.speed = parseFloat(e.target.value);
            document.getElementById('speed-value').textContent = settings.physics.speed.toFixed(1);
        });
        
        // Turbulence Slider
        document.getElementById('turbulence-slider').addEventListener('input', function(e) {
            settings.physics.turbulence = parseFloat(e.target.value);
            document.getElementById('turbulence-value').textContent = settings.physics.turbulence.toFixed(2);
        });
        
        // Mouse Interaction Toggle
        document.getElementById('mouse-interaction').addEventListener('change', function(e) {
            settings.physics.mouseInteraction = e.target.checked;
            playSound('click');
        });
        
        // Background Color Picker
        document.getElementById('background-color-picker').addEventListener('input', function(e) {
            settings.environment.backgroundColor = e.target.value;
            scene.background = new THREE.Color(settings.environment.backgroundColor);
        });
        
        // Show Trails Toggle
        document.getElementById('show-trails').addEventListener('change', function(e) {
            settings.environment.showTrails = e.target.checked;
            playSound('click');
            
            // Clear renderer when turning trails off
            if (!settings.environment.showTrails) {
                renderer.clear();
            }
        });
        
        // Reset Button
        document.getElementById('reset-button').addEventListener('click', function() {
            // Reset settings to defaults
            settings.particles.count = 5000;
            settings.particles.size = 0.1;
            settings.particles.opacity = 0.8;
            settings.colors.mode = 'rainbow';
            settings.colors.color1 = '#00ffff';
            settings.colors.color2 = '#ff00ff';
            settings.physics.simulationType = 'swarm';
            settings.physics.speed = 1.0;
            settings.physics.turbulence = 0.2;
            settings.physics.mouseInteraction = true;
            settings.environment.backgroundColor = '#0d0d0d';
            settings.environment.showTrails = true;
            
            // Update UI
            document.getElementById('particle-count-slider').value = settings.particles.count;
            document.getElementById('particle-count-value').textContent = settings.particles.count;
            document.getElementById('particle-size-slider').value = settings.particles.size;
            document.getElementById('particle-size-value').textContent = settings.particles.size.toFixed(2);
            document.getElementById('particle-opacity-slider').value = settings.particles.opacity;
            document.getElementById('particle-opacity-value').textContent = settings.particles.opacity.toFixed(2);
            document.getElementById('color-mode').value = settings.colors.mode;
            document.getElementById('color-1').value = settings.colors.color1;
            document.getElementById('color-2').value = settings.colors.color2;
            document.getElementById('simulation-type').value = settings.physics.simulationType;
            document.getElementById('speed-slider').value = settings.physics.speed;
            document.getElementById('speed-value').textContent = settings.physics.speed.toFixed(1);
            document.getElementById('turbulence-slider').value = settings.physics.turbulence;
            document.getElementById('turbulence-value').textContent = settings.physics.turbulence.toFixed(2);
            document.getElementById('mouse-interaction').checked = settings.physics.mouseInteraction;
            document.getElementById('background-color-picker').value = settings.environment.backgroundColor;
            document.getElementById('show-trails').checked = settings.environment.showTrails;
            
            // Update scene
            scene.background = new THREE.Color(settings.environment.backgroundColor);
            createParticles();
            
            playSound('success');
        });
        
        // Screenshot Button
        document.getElementById('screenshot-button').addEventListener('click', function() {
            // Render scene
            renderer.render(scene, camera);
            
            // Get canvas data URL
            const dataURL = renderer.domElement.toDataURL('image/png');
            
            // Create download link
            const link = document.createElement('a');
            link.href = dataURL;
            link.download = 'particle-system-screenshot.png';
            link.click();
            
            playSound('success');
        });
    }
    
    // Sound effects
    function playSound(soundName) {
        // Check if window.sounds exists (from main.js)
        if (window.sounds && window.sounds[soundName]) {
            const soundClone = window.sounds[soundName].cloneNode();
            soundClone.volume = 0.2;
            soundClone.play().catch(e => console.log("Audio play failed:", e));
        }
    }
    
    // Initialize the scene
    init();
});
