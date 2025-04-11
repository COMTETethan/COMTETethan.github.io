// Virtual World Explorer - Advanced ThreeJS Demo
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const canvasContainer = document.getElementById('canvas-container');
    const loadingScreen = document.querySelector('.loading');
    const loadingPercentage = document.getElementById('loading-percentage');
    const fpsValue = document.getElementById('fps-value');
    const coordX = document.getElementById('coord-x');
    const coordY = document.getElementById('coord-y');
    const coordZ = document.getElementById('coord-z');
    const worldTime = document.getElementById('world-time');
    const healthFill = document.getElementById('health-fill');
    const interactionPrompt = document.getElementById('interaction-prompt');
    const screenshotBtn = document.getElementById('screenshot-btn');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const togglePanelBtn = document.getElementById('toggle-panel');
    const controlsPanel = document.querySelector('.controls-panel');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const worldTypeSelect = document.getElementById('world-type');
    const timeSlider = document.getElementById('time-slider');
    const weatherTypeSelect = document.getElementById('weather-type');
    const autoCycleCheckbox = document.getElementById('auto-cycle');
    const gravitySlider = document.getElementById('gravity-slider');
    const windSlider = document.getElementById('wind-slider');
    const waterLevelSlider = document.getElementById('water-level');
    const enableCollisionsCheckbox = document.getElementById('enable-collisions');
    const particlesSlider = document.getElementById('particles-slider');
    const bloomSlider = document.getElementById('bloom-slider');
    const colorSchemeSelect = document.getElementById('color-scheme');
    const enableShadowsCheckbox = document.getElementById('enable-shadows');
    const movementSpeedSlider = document.getElementById('movement-speed');
    const viewModeSelect = document.getElementById('view-mode');
    const entityDensitySlider = document.getElementById('entity-density');
    const enableFlightCheckbox = document.getElementById('enable-flight');
    const resetWorldBtn = document.getElementById('reset-world');
    const generateWorldBtn = document.getElementById('generate-world');
    const pauseMenu = document.getElementById('pause-menu');
    const resumeBtn = document.getElementById('resume-btn');
    const settingsBtn = document.getElementById('settings-btn');
    const exitBtn = document.getElementById('exit-btn');
    const screenshotModal = document.getElementById('screenshot-modal');
    const screenshotImage = document.getElementById('screenshot-image');
    const downloadScreenshotBtn = document.getElementById('download-screenshot');
    const closeScreenshotBtn = document.getElementById('close-screenshot');
    const screenshotCloseBtn = document.getElementById('screenshot-close');
    
    // Three.js Variables
    let scene, camera, renderer, controls;
    let composer, bloomPass, renderPass;
    let clock, delta, interval;
    let terrain, water, sky, sun;
    let player, playerVelocity, playerDirection;
    let worldObjects = [];
    let particles = [];
    let lights = [];
    let raycaster, mouse;
    let isPointerLocked = false;
    let moveForward = false;
    let moveBackward = false;
    let moveLeft = false;
    let moveRight = false;
    let canJump = false;
    let isCrouching = false;
    let isFlying = false;
    let isPaused = false;
    let worldTime = 12; // 12:00
    let worldType = 'neon-city';
    let weatherType = 'clear';
    let colorScheme = 'cyberpunk';
    let viewMode = 'first-person';
    let gravity = 1;
    let windStrength = 0.5;
    let waterLevel = 0.3;
    let particleDensity = 0.5;
    let bloomIntensity = 1;
    let movementSpeed = 1;
    let entityDensity = 0.5;
    let enableCollisions = true;
    let enableShadows = true;
    let enableFlight = true;
    let autoCycle = true;
    let health = 100;
    let fps = 60;
    let lastFrameTime = 0;
    let frameCount = 0;
    let lastFpsUpdate = 0;
    
    // Color Schemes
    const colorSchemes = {
        cyberpunk: {
            primary: 0x00ffff,
            secondary: 0xff00ff,
            tertiary: 0xffff00,
            background: 0x000033,
            fog: 0x000033
        },
        synthwave: {
            primary: 0xff00ff,
            secondary: 0x00ffff,
            tertiary: 0xff8800,
            background: 0x330066,
            fog: 0x330066
        },
        matrix: {
            primary: 0x00ff00,
            secondary: 0x88ff88,
            tertiary: 0x003300,
            background: 0x000000,
            fog: 0x001100
        },
        vaporwave: {
            primary: 0xff88ff,
            secondary: 0x88ffff,
            tertiary: 0xffff88,
            background: 0x553388,
            fog: 0x553388
        }
    };
    
    // Noise Generator
    let simplex = new SimplexNoise();
    
    // Initialize
    init();
    
    function init() {
        // Simulate loading progress
        simulateLoading();
        
        // Setup event listeners
        setupEventListeners();
        
        // Initialize Three.js scene
        initThreeJS();
        
        // Create world
        createWorld();
        
        // Start animation loop
        animate();
    }
    
    function simulateLoading() {
        let progress = 0;
        const loadingInterval = setInterval(() => {
            progress += Math.random() * 10;
            if (progress >= 100) {
                progress = 100;
                clearInterval(loadingInterval);
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }
            loadingPercentage.textContent = Math.floor(progress) + '%';
        }, 200);
    }
    
    function setupEventListeners() {
        // Tab switching
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                btn.classList.add('active');
                document.getElementById(btn.dataset.tab + '-tab').classList.add('active');
            });
        });
        
        // Toggle panel
        togglePanelBtn.addEventListener('click', () => {
            const panelContent = controlsPanel.querySelector('.panel-content');
            if (panelContent.style.display === 'none') {
                panelContent.style.display = 'block';
                togglePanelBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
            } else {
                panelContent.style.display = 'none';
                togglePanelBtn.innerHTML = '<i class="fas fa-chevron-down"></i>';
            }
        });
        
        // World type change
        worldTypeSelect.addEventListener('change', () => {
            worldType = worldTypeSelect.value;
            updateWorld();
        });
        
        // Time slider
        timeSlider.addEventListener('input', () => {
            worldTime = parseFloat(timeSlider.value);
            updateDayNightCycle();
        });
        
        // Weather type change
        weatherTypeSelect.addEventListener('change', () => {
            weatherType = weatherTypeSelect.value;
            updateWeather();
        });
        
        // Auto cycle toggle
        autoCycleCheckbox.addEventListener('change', () => {
            autoCycle = autoCycleCheckbox.checked;
        });
        
        // Gravity slider
        gravitySlider.addEventListener('input', () => {
            gravity = parseFloat(gravitySlider.value);
            updatePhysics();
        });
        
        // Wind slider
        windSlider.addEventListener('input', () => {
            windStrength = parseFloat(windSlider.value);
            updatePhysics();
        });
        
        // Water level slider
        waterLevelSlider.addEventListener('input', () => {
            waterLevel = parseFloat(waterLevelSlider.value);
            updateWater();
        });
        
        // Collisions toggle
        enableCollisionsCheckbox.addEventListener('change', () => {
            enableCollisions = enableCollisionsCheckbox.checked;
        });
        
        // Particles slider
        particlesSlider.addEventListener('input', () => {
            particleDensity = parseFloat(particlesSlider.value);
            updateParticles();
        });
        
        // Bloom slider
        bloomSlider.addEventListener('input', () => {
            bloomIntensity = parseFloat(bloomSlider.value);
            updatePostProcessing();
        });
        
        // Color scheme change
        colorSchemeSelect.addEventListener('change', () => {
            colorScheme = colorSchemeSelect.value;
            updateColorScheme();
        });
        
        // Shadows toggle
        enableShadowsCheckbox.addEventListener('change', () => {
            enableShadows = enableShadowsCheckbox.checked;
            updateShadows();
        });
        
        // Movement speed slider
        movementSpeedSlider.addEventListener('input', () => {
            movementSpeed = parseFloat(movementSpeedSlider.value);
        });
        
        // View mode change
        viewModeSelect.addEventListener('change', () => {
            viewMode = viewModeSelect.value;
            updateCamera();
        });
        
        // Entity density slider
        entityDensitySlider.addEventListener('input', () => {
            entityDensity = parseFloat(entityDensitySlider.value);
            updateEntities();
        });
        
        // Flight toggle
        enableFlightCheckbox.addEventListener('change', () => {
            enableFlight = enableFlightCheckbox.checked;
        });
        
        // Reset world button
        resetWorldBtn.addEventListener('click', resetWorld);
        
        // Generate world button
        generateWorldBtn.addEventListener('click', generateNewWorld);
        
        // Screenshot button
        screenshotBtn.addEventListener('click', takeScreenshot);
        
        // Fullscreen button
        fullscreenBtn.addEventListener('click', toggleFullscreen);
        
        // Resume button
        resumeBtn.addEventListener('click', resumeGame);
        
        // Settings button
        settingsBtn.addEventListener('click', () => {
            pauseMenu.style.display = 'none';
            controlsPanel.scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => {
                isPaused = false;
                if (viewMode === 'first-person' || viewMode === 'third-person') {
                    lockPointer();
                }
            }, 500);
        });
        
        // Exit button
        exitBtn.addEventListener('click', () => {
            window.location.href = '../index.html';
        });
        
        // Download screenshot button
        downloadScreenshotBtn.addEventListener('click', downloadScreenshot);
        
        // Close screenshot buttons
        closeScreenshotBtn.addEventListener('click', closeScreenshot);
        screenshotCloseBtn.addEventListener('click', closeScreenshot);
        
        // Keyboard controls
        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('keyup', onKeyUp);
        
        // Pointer lock events
        document.addEventListener('pointerlockchange', onPointerLockChange);
        
        // Window resize
        window.addEventListener('resize', onWindowResize);
    }
    
    function initThreeJS() {
        // Create scene
        scene = new THREE.Scene();
        scene.background = new THREE.Color(colorSchemes[colorScheme].background);
        scene.fog = new THREE.FogExp2(colorSchemes[colorScheme].fog, 0.005);
        
        // Create camera
        camera = new THREE.PerspectiveCamera(75, canvasContainer.clientWidth / canvasContainer.clientHeight, 0.1, 1000);
        camera.position.set(0, 5, 10);
        
        // Create renderer
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        canvasContainer.appendChild(renderer.domElement);
        
        // Create clock
        clock = new THREE.Clock();
        delta = 0;
        interval = 1 / 60; // 60 fps
        
        // Create raycaster and mouse
        raycaster = new THREE.Raycaster();
        mouse = new THREE.Vector2();
        
        // Create controls based on view mode
        updateCamera();
        
        // Setup post-processing
        setupPostProcessing();
    }
    
    function setupPostProcessing() {
        // Create composer
        composer = new THREE.EffectComposer(renderer);
        
        // Add render pass
        renderPass = new THREE.RenderPass(scene, camera);
        composer.addPass(renderPass);
        
        // Add bloom pass
        bloomPass = new THREE.UnrealBloomPass(
            new THREE.Vector2(canvasContainer.clientWidth, canvasContainer.clientHeight),
            bloomIntensity, // strength
            0.5, // radius
            0.7 // threshold
        );
        composer.addPass(bloomPass);
    }
    
    function createWorld() {
        // Create terrain
        createTerrain();
        
        // Create water
        createWater();
        
        // Create sky
        createSky();
        
        // Create lights
        createLights();
        
        // Create objects
        createObjects();
        
        // Create particles
        createParticles();
        
        // Create player
        createPlayer();
        
        // Update color scheme
        updateColorScheme();
        
        // Update day/night cycle
        updateDayNightCycle();
        
        // Update weather
        updateWeather();
    }
    
    function createTerrain() {
        // Create terrain geometry
        const geometry = new THREE.PlaneGeometry(200, 200, 100, 100);
        geometry.rotateX(-Math.PI / 2);
        
        // Apply height map
        const vertices = geometry.attributes.position.array;
        for (let i = 0; i < vertices.length; i += 3) {
            const x = vertices[i];
            const z = vertices[i + 2];
            
            // Use simplex noise for height
            let height = 0;
            
            // Large scale terrain features
            height += simplex.noise2D(x * 0.01, z * 0.01) * 15;
            
            // Medium scale terrain features
            height += simplex.noise2D(x * 0.03, z * 0.03) * 5;
            
            // Small scale terrain features
            height += simplex.noise2D(x * 0.1, z * 0.1) * 1;
            
            // Set height
            vertices[i + 1] = height;
        }
        
        // Update geometry
        geometry.computeVertexNormals();
        
        // Create material based on world type
        let material;
        
        switch (worldType) {
            case 'neon-city':
                material = new THREE.MeshStandardMaterial({
                    color: 0x000000,
                    metalness: 0.8,
                    roughness: 0.2,
                    wireframe: false
                });
                break;
            case 'alien-landscape':
                material = new THREE.MeshStandardMaterial({
                    color: 0x330033,
                    metalness: 0.5,
                    roughness: 0.5,
                    wireframe: false
                });
                break;
            case 'cyber-ocean':
                material = new THREE.MeshStandardMaterial({
                    color: 0x000066,
                    metalness: 0.7,
                    roughness: 0.3,
                    wireframe: false
                });
                break;
            case 'abstract-void':
                material = new THREE.MeshStandardMaterial({
                    color: 0x000000,
                    metalness: 0.9,
                    roughness: 0.1,
                    wireframe: true
                });
                break;
            default:
                material = new THREE.MeshStandardMaterial({
                    color: 0x000000,
                    metalness: 0.8,
                    roughness: 0.2,
                    wireframe: false
                });
        }
        
        // Create terrain mesh
        terrain = new THREE.Mesh(geometry, material);
        terrain.receiveShadow = true;
        scene.add(terrain);
        
        // Add grid overlay for neon effect
        const gridHelper = new THREE.GridHelper(200, 100, colorSchemes[colorScheme].primary, colorSchemes[colorScheme].secondary);
        gridHelper.position.y = 0.1;
        scene.add(gridHelper);
    }
    
    function createWater() {
        // Create water geometry
        const waterGeometry = new THREE.PlaneGeometry(200, 200);
        
        // Create water
        water = new THREE.Water(
            waterGeometry,
            {
                textureWidth: 512,
                textureHeight: 512,
                waterNormals: new THREE.TextureLoader().load('', function(texture) {
                    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                }),
                sunDirection: new THREE.Vector3(),
                sunColor: 0xffffff,
                waterColor: colorSchemes[colorScheme].primary,
                distortionScale: 3.7,
                fog: scene.fog !== undefined
            }
        );
        water.rotation.x = -Math.PI / 2;
        water.position.y = -5 + (waterLevel * 10); // Adjust water level
        scene.add(water);
    }
    
    function createSky() {
        // Create sky
        sky = new THREE.Sky();
        sky.scale.setScalar(1000);
        scene.add(sky);
        
        // Create sun
        sun = new THREE.Vector3();
        
        // Update sun position based on time
        updateDayNightCycle();
    }
    
    function createLights() {
        // Create ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
        scene.add(ambientLight);
        lights.push(ambientLight);
        
        // Create directional light (sun)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(0, 100, 0);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 500;
        directionalLight.shadow.camera.left = -100;
        directionalLight.shadow.camera.right = 100;
        directionalLight.shadow.camera.top = 100;
        directionalLight.shadow.camera.bottom = -100;
        scene.add(directionalLight);
        lights.push(directionalLight);
        
        // Create point lights based on world type
        if (worldType === 'neon-city') {
            // Create grid of neon lights
            for (let x = -80; x <= 80; x += 40) {
                for (let z = -80; z <= 80; z += 40) {
                    // Get height at this position
                    const height = getHeightAt(x, z) + 5;
                    
                    // Create point light
                    const color = Math.random() < 0.5 ? colorSchemes[colorScheme].primary : colorSchemes[colorScheme].secondary;
                    const intensity = 2 + Math.random() * 3;
                    const distance = 20 + Math.random() * 30;
                    
                    const pointLight = new THREE.PointLight(color, intensity, distance);
                    pointLight.position.set(x, height, z);
                    scene.add(pointLight);
                    lights.push(pointLight);
                    
                    // Create light marker (small sphere)
                    const markerGeometry = new THREE.SphereGeometry(0.5, 16, 16);
                    const markerMaterial = new THREE.MeshBasicMaterial({ color: color });
                    const marker = new THREE.Mesh(markerGeometry, markerMaterial);
                    marker.position.copy(pointLight.position);
                    scene.add(marker);
                    worldObjects.push(marker);
                }
            }
        } else if (worldType === 'alien-landscape') {
            // Create scattered alien lights
            for (let i = 0; i < 20; i++) {
                const x = Math.random() * 160 - 80;
                const z = Math.random() * 160 - 80;
                const height = getHeightAt(x, z) + 2;
                
                // Create point light
                const color = Math.random() < 0.5 ? 0x00ff00 : 0xff00ff;
                const intensity = 1 + Math.random() * 2;
                const distance = 10 + Math.random() * 20;
                
                const pointLight = new THREE.PointLight(color, intensity, distance);
                pointLight.position.set(x, height, z);
                scene.add(pointLight);
                lights.push(pointLight);
                
                // Create light marker (alien plant)
                const plantGeometry = new THREE.ConeGeometry(1, 3, 8);
                const plantMaterial = new THREE.MeshBasicMaterial({ color: color });
                const plant = new THREE.Mesh(plantGeometry, plantMaterial);
                plant.position.set(x, height - 1.5, z);
                scene.add(plant);
                worldObjects.push(plant);
            }
        }
    }
    
    function createObjects() {
        // Create objects based on world type and entity density
        const objectCount = Math.floor(50 * entityDensity);
        
        switch (worldType) {
            case 'neon-city':
                createNeonCityObjects(objectCount);
                break;
            case 'alien-landscape':
                createAlienLandscapeObjects(objectCount);
                break;
            case 'cyber-ocean':
                createCyberOceanObjects(objectCount);
                break;
            case 'abstract-void':
                createAbstractVoidObjects(objectCount);
                break;
        }
    }
    
    function createNeonCityObjects(count) {
        // Create buildings
        for (let i = 0; i < count; i++) {
            // Random position
            const x = Math.random() * 160 - 80;
            const z = Math.random() * 160 - 80;
            const height = getHeightAt(x, z);
            
            // Random building size
            const width = 2 + Math.random() * 8;
            const depth = 2 + Math.random() * 8;
            const buildingHeight = 5 + Math.random() * 30;
            
            // Create building geometry
            const geometry = new THREE.BoxGeometry(width, buildingHeight, depth);
            
            // Create building material
            const material = new THREE.MeshStandardMaterial({
                color: 0x000000,
                metalness: 0.9,
                roughness: 0.1,
                emissive: Math.random() < 0.5 ? colorSchemes[colorScheme].primary : colorSchemes[colorScheme].secondary,
                emissiveIntensity: 0.2
            });
            
            // Create building mesh
            const building = new THREE.Mesh(geometry, material);
            building.position.set(x, height + buildingHeight / 2, z);
            building.castShadow = true;
            building.receiveShadow = true;
            scene.add(building);
            worldObjects.push(building);
            
            // Add windows
            addBuildingWindows(building, width, buildingHeight, depth);
        }
    }
    
    function addBuildingWindows(building, width, height, depth) {
        // Calculate number of windows
        const windowsX = Math.floor(width / 1.5);
        const windowsY = Math.floor(height / 2);
        const windowsZ = Math.floor(depth / 1.5);
        
        // Window size
        const windowSize = 0.5;
        
        // Create windows for each side
        for (let i = 0; i < windowsX; i++) {
            for (let j = 0; j < windowsY; j++) {
                // Front windows
                if (Math.random() > 0.3) { // 70% chance to have a window
                    const windowGeometry = new THREE.PlaneGeometry(windowSize, windowSize);
                    const windowMaterial = new THREE.MeshBasicMaterial({
                        color: Math.random() < 0.8 ? colorSchemes[colorScheme].primary : colorSchemes[colorScheme].secondary,
                        side: THREE.DoubleSide
                    });
                    const window = new THREE.Mesh(windowGeometry, windowMaterial);
                    
                    // Position window
                    const x = (i * 1.5) - (width / 2) + 0.75;
                    const y = (j * 2) - (height / 2) + 1;
                    const z = depth / 2 + 0.01;
                    
                    window.position.set(x, y, z);
                    building.add(window);
                }
                
                // Back windows
                if (Math.random() > 0.3) {
                    const windowGeometry = new THREE.PlaneGeometry(windowSize, windowSize);
                    const windowMaterial = new THREE.MeshBasicMaterial({
                        color: Math.random() < 0.8 ? colorSchemes[colorScheme].primary : colorSchemes[colorScheme].secondary,
                        side: THREE.DoubleSide
                    });
                    const window = new THREE.Mesh(windowGeometry, windowMaterial);
                    
                    // Position window
                    const x = (i * 1.5) - (width / 2) + 0.75;
                    const y = (j * 2) - (height / 2) + 1;
                    const z = -depth / 2 - 0.01;
                    
                    window.position.set(x, y, z);
                    window.rotation.y = Math.PI;
                    building.add(window);
                }
            }
        }
        
        for (let i = 0; i < windowsZ; i++) {
            for (let j = 0; j < windowsY; j++) {
                // Left windows
                if (Math.random() > 0.3) {
                    const windowGeometry = new THREE.PlaneGeometry(windowSize, windowSize);
                    const windowMaterial = new THREE.MeshBasicMaterial({
                        color: Math.random() < 0.8 ? colorSchemes[colorScheme].primary : colorSchemes[colorScheme].secondary,
                        side: THREE.DoubleSide
                    });
                    const window = new THREE.Mesh(windowGeometry, windowMaterial);
                    
                    // Position window
                    const x = -width / 2 - 0.01;
                    const y = (j * 2) - (height / 2) + 1;
                    const z = (i * 1.5) - (depth / 2) + 0.75;
                    
                    window.position.set(x, y, z);
                    window.rotation.y = Math.PI / 2;
                    building.add(window);
                }
                
                // Right windows
                if (Math.random() > 0.3) {
                    const windowGeometry = new THREE.PlaneGeometry(windowSize, windowSize);
                    const windowMaterial = new THREE.MeshBasicMaterial({
                        color: Math.random() < 0.8 ? colorSchemes[colorScheme].primary : colorSchemes[colorScheme].secondary,
                        side: THREE.DoubleSide
                    });
                    const window = new THREE.Mesh(windowGeometry, windowMaterial);
                    
                    // Position window
                    const x = width / 2 + 0.01;
                    const y = (j * 2) - (height / 2) + 1;
                    const z = (i * 1.5) - (depth / 2) + 0.75;
                    
                    window.position.set(x, y, z);
                    window.rotation.y = -Math.PI / 2;
                    building.add(window);
                }
            }
        }
    }
    
    function createAlienLandscapeObjects(count) {
        // Create alien structures
        for (let i = 0; i < count; i++) {
            // Random position
            const x = Math.random() * 160 - 80;
            const z = Math.random() * 160 - 80;
            const height = getHeightAt(x, z);
            
            // Random structure type
            const type = Math.floor(Math.random() * 3);
            
            if (type === 0) {
                // Alien crystal
                const crystalGeometry = new THREE.ConeGeometry(1 + Math.random() * 2, 3 + Math.random() * 7, 5);
                const crystalMaterial = new THREE.MeshStandardMaterial({
                    color: Math.random() < 0.5 ? 0x00ff00 : 0xff00ff,
                    metalness: 0.9,
                    roughness: 0.1,
                    emissive: Math.random() < 0.5 ? 0x00ff00 : 0xff00ff,
                    emissiveIntensity: 0.5
                });
                const crystal = new THREE.Mesh(crystalGeometry, crystalMaterial);
                crystal.position.set(x, height + crystalGeometry.parameters.height / 2, z);
                crystal.castShadow = true;
                crystal.receiveShadow = true;
                scene.add(crystal);
                worldObjects.push(crystal);
            } else if (type === 1) {
                // Alien mushroom
                const stemGeometry = new THREE.CylinderGeometry(0.5, 0.5, 2 + Math.random() * 3, 8);
                const stemMaterial = new THREE.MeshStandardMaterial({
                    color: 0x885588,
                    metalness: 0.3,
                    roughness: 0.7
                });
                const stem = new THREE.Mesh(stemGeometry, stemMaterial);
                stem.position.set(x, height + stemGeometry.parameters.height / 2, z);
                stem.castShadow = true;
                stem.receiveShadow = true;
                scene.add(stem);
                worldObjects.push(stem);
                
                const capGeometry = new THREE.SphereGeometry(1 + Math.random() * 2, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
                const capMaterial = new THREE.MeshStandardMaterial({
                    color: Math.random() < 0.5 ? 0xff00ff : 0x00ffff,
                    metalness: 0.5,
                    roughness: 0.5,
                    emissive: Math.random() < 0.5 ? 0xff00ff : 0x00ffff,
                    emissiveIntensity: 0.3
                });
                const cap = new THREE.Mesh(capGeometry, capMaterial);
                cap.position.set(x, height + stemGeometry.parameters.height, z);
                cap.castShadow = true;
                cap.receiveShadow = true;
                scene.add(cap);
                worldObjects.push(cap);
            } else {
                // Alien arch
                const archHeight = 3 + Math.random() * 5;
                const archWidth = 2 + Math.random() * 4;
                
                // Left pillar
                const leftPillarGeometry = new THREE.CylinderGeometry(0.5, 0.5, archHeight, 8);
                const pillarMaterial = new THREE.MeshStandardMaterial({
                    color: 0x885588,
                    metalness: 0.7,
                    roughness: 0.3
                });
                const leftPillar = new THREE.Mesh(leftPillarGeometry, pillarMaterial);
                leftPillar.position.set(x - archWidth / 2, height + archHeight / 2, z);
                leftPillar.castShadow = true;
                leftPillar.receiveShadow = true;
                scene.add(leftPillar);
                worldObjects.push(leftPillar);
                
                // Right pillar
                const rightPillarGeometry = new THREE.CylinderGeometry(0.5, 0.5, archHeight, 8);
                const rightPillar = new THREE.Mesh(rightPillarGeometry, pillarMaterial);
                rightPillar.position.set(x + archWidth / 2, height + archHeight / 2, z);
                rightPillar.castShadow = true;
                rightPillar.receiveShadow = true;
                scene.add(rightPillar);
                worldObjects.push(rightPillar);
                
                // Top arch
                const archGeometry = new THREE.TorusGeometry(archWidth / 2, 0.5, 8, 16, Math.PI);
                const archMaterial = new THREE.MeshStandardMaterial({
                    color: Math.random() < 0.5 ? 0x00ff00 : 0xff00ff,
                    metalness: 0.8,
                    roughness: 0.2,
                    emissive: Math.random() < 0.5 ? 0x00ff00 : 0xff00ff,
                    emissiveIntensity: 0.4
                });
                const arch = new THREE.Mesh(archGeometry, archMaterial);
                arch.position.set(x, height + archHeight, z);
                arch.rotation.x = Math.PI / 2;
                arch.castShadow = true;
                arch.receiveShadow = true;
                scene.add(arch);
                worldObjects.push(arch);
            }
        }
    }
    
    function createCyberOceanObjects(count) {
        // Create floating platforms and structures
        for (let i = 0; i < count; i++) {
            // Random position
            const x = Math.random() * 160 - 80;
            const z = Math.random() * 160 - 80;
            const baseHeight = getHeightAt(x, z);
            const height = Math.max(baseHeight, water.position.y + 1 + Math.random() * 10);
            
            // Random platform type
            const type = Math.floor(Math.random() * 3);
            
            if (type === 0) {
                // Floating platform
                const platformGeometry = new THREE.CylinderGeometry(2 + Math.random() * 4, 2 + Math.random() * 4, 1, 16);
                const platformMaterial = new THREE.MeshStandardMaterial({
                    color: 0x000033,
                    metalness: 0.8,
                    roughness: 0.2,
                    emissive: colorSchemes[colorScheme].primary,
                    emissiveIntensity: 0.2
                });
                const platform = new THREE.Mesh(platformGeometry, platformMaterial);
                platform.position.set(x, height, z);
                platform.castShadow = true;
                platform.receiveShadow = true;
                scene.add(platform);
                worldObjects.push(platform);
                
                // Add edge lights
                const edgeGeometry = new THREE.TorusGeometry(platformGeometry.parameters.radiusTop, 0.2, 8, 32);
                const edgeMaterial = new THREE.MeshBasicMaterial({
                    color: colorSchemes[colorScheme].primary
                });
                const edge = new THREE.Mesh(edgeGeometry, edgeMaterial);
                edge.position.set(x, height + 0.5, z);
                edge.rotation.x = Math.PI / 2;
                scene.add(edge);
                worldObjects.push(edge);
                
                // Add structure on top
                if (Math.random() > 0.5) {
                    const structureGeometry = new THREE.BoxGeometry(1, 2 + Math.random() * 3, 1);
                    const structureMaterial = new THREE.MeshStandardMaterial({
                        color: 0x000033,
                        metalness: 0.8,
                        roughness: 0.2,
                        emissive: colorSchemes[colorScheme].secondary,
                        emissiveIntensity: 0.2
                    });
                    const structure = new THREE.Mesh(structureGeometry, structureMaterial);
                    structure.position.set(x, height + 0.5 + structureGeometry.parameters.height / 2, z);
                    structure.castShadow = true;
                    structure.receiveShadow = true;
                    scene.add(structure);
                    worldObjects.push(structure);
                }
            } else if (type === 1) {
                // Floating ring
                const ringGeometry = new THREE.TorusGeometry(3 + Math.random() * 5, 0.5, 8, 32);
                const ringMaterial = new THREE.MeshStandardMaterial({
                    color: 0x000033,
                    metalness: 0.9,
                    roughness: 0.1,
                    emissive: colorSchemes[colorScheme].secondary,
                    emissiveIntensity: 0.3
                });
                const ring = new THREE.Mesh(ringGeometry, ringMaterial);
                ring.position.set(x, height, z);
                ring.rotation.x = Math.PI / 2;
                ring.castShadow = true;
                ring.receiveShadow = true;
                scene.add(ring);
                worldObjects.push(ring);
                
                // Add center sphere
                const sphereGeometry = new THREE.SphereGeometry(1, 16, 16);
                const sphereMaterial = new THREE.MeshBasicMaterial({
                    color: colorSchemes[colorScheme].primary
                });
                const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
                sphere.position.set(x, height, z);
                scene.add(sphere);
                worldObjects.push(sphere);
            } else {
                // Floating beacon
                const beaconBaseGeometry = new THREE.CylinderGeometry(1, 2, 1, 8);
                const beaconBaseMaterial = new THREE.MeshStandardMaterial({
                    color: 0x000033,
                    metalness: 0.8,
                    roughness: 0.2
                });
                const beaconBase = new THREE.Mesh(beaconBaseGeometry, beaconBaseMaterial);
                beaconBase.position.set(x, height, z);
                beaconBase.castShadow = true;
                beaconBase.receiveShadow = true;
                scene.add(beaconBase);
                worldObjects.push(beaconBase);
                
                const beaconPoleGeometry = new THREE.CylinderGeometry(0.2, 0.2, 5, 8);
                const beaconPoleMaterial = new THREE.MeshStandardMaterial({
                    color: 0x333333,
                    metalness: 0.5,
                    roughness: 0.5
                });
                const beaconPole = new THREE.Mesh(beaconPoleGeometry, beaconPoleMaterial);
                beaconPole.position.set(x, height + 2.5, z);
                beaconPole.castShadow = true;
                beaconPole.receiveShadow = true;
                scene.add(beaconPole);
                worldObjects.push(beaconPole);
                
                const beaconLightGeometry = new THREE.SphereGeometry(0.5, 16, 16);
                const beaconLightMaterial = new THREE.MeshBasicMaterial({
                    color: colorSchemes[colorScheme].tertiary
                });
                const beaconLight = new THREE.Mesh(beaconLightGeometry, beaconLightMaterial);
                beaconLight.position.set(x, height + 5, z);
                scene.add(beaconLight);
                worldObjects.push(beaconLight);
                
                // Add point light
                const pointLight = new THREE.PointLight(colorSchemes[colorScheme].tertiary, 2, 20);
                pointLight.position.copy(beaconLight.position);
                scene.add(pointLight);
                lights.push(pointLight);
            }
        }
    }
    
    function createAbstractVoidObjects(count) {
        // Create abstract geometric shapes
        for (let i = 0; i < count; i++) {
            // Random position
            const x = Math.random() * 160 - 80;
            const z = Math.random() * 160 - 80;
            const height = getHeightAt(x, z) + 2 + Math.random() * 10;
            
            // Random shape type
            const type = Math.floor(Math.random() * 5);
            
            // Random color
            const color = Math.random() < 0.33 ? colorSchemes[colorScheme].primary : 
                         (Math.random() < 0.5 ? colorSchemes[colorScheme].secondary : colorSchemes[colorScheme].tertiary);
            
            // Create material
            const material = new THREE.MeshBasicMaterial({
                color: color,
                wireframe: true
            });
            
            let shape;
            
            if (type === 0) {
                // Icosahedron
                const geometry = new THREE.IcosahedronGeometry(1 + Math.random() * 3, 0);
                shape = new THREE.Mesh(geometry, material);
            } else if (type === 1) {
                // Dodecahedron
                const geometry = new THREE.DodecahedronGeometry(1 + Math.random() * 3, 0);
                shape = new THREE.Mesh(geometry, material);
            } else if (type === 2) {
                // Octahedron
                const geometry = new THREE.OctahedronGeometry(1 + Math.random() * 3, 0);
                shape = new THREE.Mesh(geometry, material);
            } else if (type === 3) {
                // Tetrahedron
                const geometry = new THREE.TetrahedronGeometry(1 + Math.random() * 3, 0);
                shape = new THREE.Mesh(geometry, material);
            } else {
                // Torus knot
                const geometry = new THREE.TorusKnotGeometry(1 + Math.random() * 2, 0.3, 64, 8, 2, 3);
                shape = new THREE.Mesh(geometry, material);
            }
            
            shape.position.set(x, height, z);
            scene.add(shape);
            worldObjects.push(shape);
        }
    }
    
    function createParticles() {
        // Create particles based on world type and particle density
        const particleCount = Math.floor(1000 * particleDensity);
        
        // Create particle system
        const particleGeometry = new THREE.BufferGeometry();
        const particlePositions = new Float32Array(particleCount * 3);
        const particleSizes = new Float32Array(particleCount);
        const particleColors = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            // Random position
            const x = Math.random() * 200 - 100;
            const y = Math.random() * 50;
            const z = Math.random() * 200 - 100;
            
            particlePositions[i * 3] = x;
            particlePositions[i * 3 + 1] = y;
            particlePositions[i * 3 + 2] = z;
            
            // Random size
            particleSizes[i] = 0.1 + Math.random() * 0.9;
            
            // Random color based on color scheme
            if (Math.random() < 0.33) {
                // Primary color
                particleColors[i * 3] = ((colorSchemes[colorScheme].primary >> 16) & 0xff) / 255;
                particleColors[i * 3 + 1] = ((colorSchemes[colorScheme].primary >> 8) & 0xff) / 255;
                particleColors[i * 3 + 2] = (colorSchemes[colorScheme].primary & 0xff) / 255;
            } else if (Math.random() < 0.5) {
                // Secondary color
                particleColors[i * 3] = ((colorSchemes[colorScheme].secondary >> 16) & 0xff) / 255;
                particleColors[i * 3 + 1] = ((colorSchemes[colorScheme].secondary >> 8) & 0xff) / 255;
                particleColors[i * 3 + 2] = (colorSchemes[colorScheme].secondary & 0xff) / 255;
            } else {
                // Tertiary color
                particleColors[i * 3] = ((colorSchemes[colorScheme].tertiary >> 16) & 0xff) / 255;
                particleColors[i * 3 + 1] = ((colorSchemes[colorScheme].tertiary >> 8) & 0xff) / 255;
                particleColors[i * 3 + 2] = (colorSchemes[colorScheme].tertiary & 0xff) / 255;
            }
        }
        
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
        particleGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
        
        // Create particle material
        const particleMaterial = new THREE.PointsMaterial({
            size: 0.5,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            sizeAttenuation: true
        });
        
        // Create particle system
        const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
        scene.add(particleSystem);
        particles.push(particleSystem);
    }
    
    function createPlayer() {
        // Create player object
        player = new THREE.Group();
        
        // Add player mesh (only visible in third-person view)
        const playerGeometry = new THREE.CylinderGeometry(0.5, 0.5, 2, 8);
        const playerMaterial = new THREE.MeshBasicMaterial({
            color: colorSchemes[colorScheme].primary,
            wireframe: true
        });
        const playerMesh = new THREE.Mesh(playerGeometry, playerMaterial);
        playerMesh.position.y = 1;
        player.add(playerMesh);
        
        // Add player head
        const headGeometry = new THREE.SphereGeometry(0.3, 16, 16);
        const headMaterial = new THREE.MeshBasicMaterial({
            color: colorSchemes[colorScheme].secondary
        });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 2.3;
        player.add(head);
        
        // Set initial player position
        player.position.set(0, 5, 0);
        scene.add(player);
        
        // Initialize player velocity and direction
        playerVelocity = new THREE.Vector3();
        playerDirection = new THREE.Vector3();
    }
    
    function updateWorld() {
        // Remove existing objects
        for (let i = worldObjects.length - 1; i >= 0; i--) {
            scene.remove(worldObjects[i]);
            worldObjects.splice(i, 1);
        }
        
        // Remove existing particles
        for (let i = particles.length - 1; i >= 0; i--) {
            scene.remove(particles[i]);
            particles.splice(i, 1);
        }
        
        // Remove existing lights (except the first two - ambient and directional)
        for (let i = lights.length - 1; i >= 2; i--) {
            scene.remove(lights[i]);
            lights.splice(i, 1);
        }
        
        // Remove existing terrain, water, and sky
        scene.remove(terrain);
        scene.remove(water);
        scene.remove(sky);
        
        // Create new world
        createTerrain();
        createWater();
        createSky();
        createLights();
        createObjects();
        createParticles();
        
        // Update color scheme
        updateColorScheme();
        
        // Update day/night cycle
        updateDayNightCycle();
        
        // Update weather
        updateWeather();
    }
    
    function updateDayNightCycle() {
        // Update sun position based on time
        const phi = THREE.MathUtils.degToRad(90 - (worldTime / 24) * 360);
        const theta = THREE.MathUtils.degToRad(0);
        
        sun.setFromSphericalCoords(1, phi, theta);
        
        // Update sky
        const uniforms = sky.material.uniforms;
        uniforms['sunPosition'].value.copy(sun);
        
        // Update directional light position
        if (lights.length > 1) {
            lights[1].position.set(sun.x * 100, sun.y * 100, sun.z * 100);
        }
        
        // Update water
        if (water) {
            water.material.uniforms['sunDirection'].value.copy(sun).normalize();
        }
        
        // Update ambient light intensity based on time
        if (lights.length > 0) {
            // Night time (lower ambient light)
            if (worldTime < 6 || worldTime > 18) {
                lights[0].intensity = 0.1;
                scene.fog.density = 0.01;
            } 
            // Dawn/dusk (medium ambient light)
            else if (worldTime < 8 || worldTime > 16) {
                lights[0].intensity = 0.2;
                scene.fog.density = 0.007;
            } 
            // Day time (higher ambient light)
            else {
                lights[0].intensity = 0.3;
                scene.fog.density = 0.005;
            }
        }
        
        // Update directional light intensity based on time
        if (lights.length > 1) {
            // Night time (no directional light)
            if (worldTime < 6 || worldTime > 18) {
                lights[1].intensity = 0;
            } 
            // Dawn/dusk (medium directional light)
            else if (worldTime < 8 || worldTime > 16) {
                lights[1].intensity = 0.5;
            } 
            // Day time (full directional light)
            else {
                lights[1].intensity = 1;
            }
        }
        
        // Format time for display
        const hours = Math.floor(worldTime);
        const minutes = Math.floor((worldTime - hours) * 60);
        document.getElementById('world-time').textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }
    
    function updateWeather() {
        // Clear existing weather particles
        for (let i = particles.length - 1; i >= 0; i--) {
            scene.remove(particles[i]);
            particles.splice(i, 1);
        }
        
        // Create new weather particles based on weather type
        switch (weatherType) {
            case 'rain':
                createRainParticles();
                break;
            case 'fog':
                createFogParticles();
                scene.fog.density = 0.02;
                break;
            case 'storm':
                createStormParticles();
                scene.fog.density = 0.015;
                break;
            default:
                createParticles();
                break;
        }
    }
    
    function createRainParticles() {
        // Create rain particles
        const rainCount = 5000;
        
        // Create particle system
        const rainGeometry = new THREE.BufferGeometry();
        const rainPositions = new Float32Array(rainCount * 3);
        const rainVelocities = new Float32Array(rainCount * 3);
        
        for (let i = 0; i < rainCount; i++) {
            // Random position
            const x = Math.random() * 200 - 100;
            const y = Math.random() * 50;
            const z = Math.random() * 200 - 100;
            
            rainPositions[i * 3] = x;
            rainPositions[i * 3 + 1] = y;
            rainPositions[i * 3 + 2] = z;
            
            // Velocity (mostly downward)
            rainVelocities[i * 3] = (Math.random() - 0.5) * 0.1;
            rainVelocities[i * 3 + 1] = -0.5 - Math.random() * 0.5;
            rainVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.1;
        }
        
        rainGeometry.setAttribute('position', new THREE.BufferAttribute(rainPositions, 3));
        rainGeometry.setAttribute('velocity', new THREE.BufferAttribute(rainVelocities, 3));
        
        // Create rain material
        const rainMaterial = new THREE.PointsMaterial({
            color: colorSchemes[colorScheme].primary,
            size: 0.1,
            transparent: true,
            opacity: 0.6,
            sizeAttenuation: true
        });
        
        // Create rain system
        const rainSystem = new THREE.Points(rainGeometry, rainMaterial);
        rainSystem.userData.isRain = true;
        scene.add(rainSystem);
        particles.push(rainSystem);
    }
    
    function createFogParticles() {
        // Create fog particles
        const fogCount = 1000;
        
        // Create particle system
        const fogGeometry = new THREE.BufferGeometry();
        const fogPositions = new Float32Array(fogCount * 3);
        const fogSizes = new Float32Array(fogCount);
        
        for (let i = 0; i < fogCount; i++) {
            // Random position
            const x = Math.random() * 200 - 100;
            const y = Math.random() * 10;
            const z = Math.random() * 200 - 100;
            
            fogPositions[i * 3] = x;
            fogPositions[i * 3 + 1] = y;
            fogPositions[i * 3 + 2] = z;
            
            // Random size
            fogSizes[i] = 2 + Math.random() * 3;
        }
        
        fogGeometry.setAttribute('position', new THREE.BufferAttribute(fogPositions, 3));
        fogGeometry.setAttribute('size', new THREE.BufferAttribute(fogSizes, 1));
        
        // Create fog material
        const fogMaterial = new THREE.PointsMaterial({
            color: 0xaaaaaa,
            size: 5,
            transparent: true,
            opacity: 0.3,
            sizeAttenuation: true
        });
        
        // Create fog system
        const fogSystem = new THREE.Points(fogGeometry, fogMaterial);
        fogSystem.userData.isFog = true;
        scene.add(fogSystem);
        particles.push(fogSystem);
    }
    
    function createStormParticles() {
        // Create both rain and fog
        createRainParticles();
        createFogParticles();
        
        // Add occasional lightning
        setInterval(() => {
            if (weatherType === 'storm' && Math.random() < 0.1) {
                createLightning();
            }
        }, 1000);
    }
    
    function createLightning() {
        // Create lightning flash
        const lightningLight = new THREE.PointLight(0xffffff, 10, 100);
        lightningLight.position.set(
            Math.random() * 100 - 50,
            30,
            Math.random() * 100 - 50
        );
        scene.add(lightningLight);
        
        // Remove after flash
        setTimeout(() => {
            scene.remove(lightningLight);
        }, 100);
    }
    
    function updateParticles() {
        // Update particle systems based on density
        for (let i = particles.length - 1; i >= 0; i--) {
            scene.remove(particles[i]);
            particles.splice(i, 1);
        }
        
        // Create new particles
        if (weatherType === 'clear') {
            createParticles();
        } else {
            updateWeather();
        }
    }
    
    function updatePhysics() {
        // Update physics parameters
        // (In a real implementation, this would update the physics engine)
    }
    
    function updateWater() {
        // Update water level
        if (water) {
            water.position.y = -5 + (waterLevel * 10);
        }
    }
    
    function updateColorScheme() {
        // Update scene background and fog
        scene.background = new THREE.Color(colorSchemes[colorScheme].background);
        scene.fog.color = new THREE.Color(colorSchemes[colorScheme].fog);
        
        // Update water color
        if (water) {
            water.material.uniforms['waterColor'].value = new THREE.Color(colorSchemes[colorScheme].primary);
        }
        
        // Update player colors
        if (player) {
            player.children[0].material.color.setHex(colorSchemes[colorScheme].primary);
            player.children[1].material.color.setHex(colorSchemes[colorScheme].secondary);
        }
    }
    
    function updatePostProcessing() {
        // Update bloom pass
        if (bloomPass) {
            bloomPass.strength = bloomIntensity;
        }
    }
    
    function updateShadows() {
        // Update shadow settings
        renderer.shadowMap.enabled = enableShadows;
        
        // Update all objects
        scene.traverse(function(object) {
            if (object instanceof THREE.Mesh) {
                object.castShadow = enableShadows;
                object.receiveShadow = enableShadows;
            }
        });
    }
    
    function updateCamera() {
        // Remove existing controls
        if (controls) {
            controls.dispose();
        }
        
        switch (viewMode) {
            case 'first-person':
                // First-person controls
                controls = new THREE.PointerLockControls(camera, document.body);
                break;
            case 'third-person':
                // Third-person controls
                camera.position.set(0, 5, 10);
                controls = new THREE.OrbitControls(camera, renderer.domElement);
                controls.target.copy(player.position);
                controls.enableDamping = true;
                controls.dampingFactor = 0.05;
                controls.maxPolarAngle = Math.PI / 2;
                break;
            case 'orbit':
                // Orbit controls
                camera.position.set(0, 20, 20);
                controls = new THREE.OrbitControls(camera, renderer.domElement);
                controls.enableDamping = true;
                controls.dampingFactor = 0.05;
                break;
            case 'top-down':
                // Top-down controls
                camera.position.set(0, 50, 0);
                camera.lookAt(0, 0, 0);
                controls = new THREE.OrbitControls(camera, renderer.domElement);
                controls.enableDamping = true;
                controls.dampingFactor = 0.05;
                controls.maxPolarAngle = Math.PI / 3;
                controls.minPolarAngle = Math.PI / 6;
                break;
        }
    }
    
    function updateEntities() {
        // Update entity density
        updateWorld();
    }
    
    function resetWorld() {
        // Reset all settings to default
        worldType = 'neon-city';
        worldTypeSelect.value = worldType;
        
        worldTime = 12;
        timeSlider.value = worldTime;
        
        weatherType = 'clear';
        weatherTypeSelect.value = weatherType;
        
        autoCycle = true;
        autoCycleCheckbox.checked = autoCycle;
        
        gravity = 1;
        gravitySlider.value = gravity;
        
        windStrength = 0.5;
        windSlider.value = windStrength;
        
        waterLevel = 0.3;
        waterLevelSlider.value = waterLevel;
        
        enableCollisions = true;
        enableCollisionsCheckbox.checked = enableCollisions;
        
        particleDensity = 0.5;
        particlesSlider.value = particleDensity;
        
        bloomIntensity = 1;
        bloomSlider.value = bloomIntensity;
        
        colorScheme = 'cyberpunk';
        colorSchemeSelect.value = colorScheme;
        
        enableShadows = true;
        enableShadowsCheckbox.checked = enableShadows;
        
        movementSpeed = 1;
        movementSpeedSlider.value = movementSpeed;
        
        viewMode = 'first-person';
        viewModeSelect.value = viewMode;
        
        entityDensity = 0.5;
        entityDensitySlider.value = entityDensity;
        
        enableFlight = true;
        enableFlightCheckbox.checked = enableFlight;
        
        // Reset player position
        player.position.set(0, 5, 0);
        
        // Update world
        updateWorld();
        updateCamera();
        updatePostProcessing();
    }
    
    function generateNewWorld() {
        // Generate new noise seed
        simplex = new SimplexNoise();
        
        // Update world
        updateWorld();
    }
    
    function getHeightAt(x, z) {
        // Calculate height at position using noise
        let height = 0;
        
        // Large scale terrain features
        height += simplex.noise2D(x * 0.01, z * 0.01) * 15;
        
        // Medium scale terrain features
        height += simplex.noise2D(x * 0.03, z * 0.03) * 5;
        
        // Small scale terrain features
        height += simplex.noise2D(x * 0.1, z * 0.1) * 1;
        
        return height;
    }
    
    function onKeyDown(event) {
        if (isPaused) return;
        
        switch (event.code) {
            case 'KeyW':
                moveForward = true;
                break;
            case 'KeyS':
                moveBackward = true;
                break;
            case 'KeyA':
                moveLeft = true;
                break;
            case 'KeyD':
                moveRight = true;
                break;
            case 'Space':
                if (canJump || enableFlight) {
                    playerVelocity.y = 5;
                    canJump = false;
                }
                break;
            case 'ShiftLeft':
                // Sprint
                movementSpeed = 2;
                break;
            case 'ControlLeft':
                // Crouch or fly down
                if (enableFlight) {
                    playerVelocity.y = -5;
                } else {
                    isCrouching = true;
                }
                break;
            case 'KeyE':
                // Interact
                interact();
                break;
            case 'KeyF':
                // Toggle flashlight
                toggleFlashlight();
                break;
            case 'KeyR':
                // Reset position
                player.position.set(0, 5, 0);
                break;
            case 'KeyC':
                // Toggle camera mode
                cycleViewMode();
                break;
            case 'KeyV':
                // Reset camera
                resetCamera();
                break;
            case 'Tab':
                // Toggle control panel
                toggleControlPanel();
                event.preventDefault();
                break;
            case 'KeyP':
                // Take screenshot
                takeScreenshot();
                break;
            case 'Escape':
                // Pause game
                togglePause();
                break;
            case 'F11':
                // Fullscreen
                toggleFullscreen();
                event.preventDefault();
                break;
        }
    }
    
    function onKeyUp(event) {
        switch (event.code) {
            case 'KeyW':
                moveForward = false;
                break;
            case 'KeyS':
                moveBackward = false;
                break;
            case 'KeyA':
                moveLeft = false;
                break;
            case 'KeyD':
                moveRight = false;
                break;
            case 'ShiftLeft':
                // Stop sprint
                movementSpeed = parseFloat(movementSpeedSlider.value);
                break;
            case 'ControlLeft':
                // Stop crouch or fly down
                isCrouching = false;
                break;
        }
    }
    
    function interact() {
        // Cast ray from camera
        raycaster.setFromCamera(new THREE.Vector2(), camera);
        
        // Check for intersections
        const intersects = raycaster.intersectObjects(worldObjects);
        
        if (intersects.length > 0 && intersects[0].distance < 5) {
            // Interact with object
            const object = intersects[0].object;
            
            // Make object glow
            if (object.material) {
                const originalColor = object.material.color.clone();
                const originalEmissive = object.material.emissive ? object.material.emissive.clone() : new THREE.Color(0x000000);
                const originalEmissiveIntensity = object.material.emissiveIntensity || 0;
                
                // Set glow
                if (object.material.emissive) {
                    object.material.emissive.set(colorSchemes[colorScheme].primary);
                    object.material.emissiveIntensity = 1;
                }
                
                // Reset after a short time
                setTimeout(() => {
                    if (object.material) {
                        if (object.material.emissive) {
                            object.material.emissive.copy(originalEmissive);
                            object.material.emissiveIntensity = originalEmissiveIntensity;
                        }
                    }
                }, 500);
            }
        }
    }
    
    function toggleFlashlight() {
        // Check if flashlight exists
        let flashlight = player.children.find(child => child.isPointLight);
        
        if (flashlight) {
            // Remove flashlight
            player.remove(flashlight);
        } else {
            // Add flashlight
            flashlight = new THREE.SpotLight(0xffffff, 1, 50, Math.PI / 6, 0.5, 1);
            flashlight.position.set(0, 1.5, 0);
            flashlight.target.position.set(0, 1.5, -1);
            flashlight.add(flashlight.target);
            flashlight.castShadow = true;
            player.add(flashlight);
        }
    }
    
    function cycleViewMode() {
        // Cycle through view modes
        switch (viewMode) {
            case 'first-person':
                viewMode = 'third-person';
                break;
            case 'third-person':
                viewMode = 'orbit';
                break;
            case 'orbit':
                viewMode = 'top-down';
                break;
            case 'top-down':
                viewMode = 'first-person';
                break;
        }
        
        // Update select element
        viewModeSelect.value = viewMode;
        
        // Update camera
        updateCamera();
    }
    
    function resetCamera() {
        // Reset camera based on view mode
        switch (viewMode) {
            case 'first-person':
                camera.position.copy(player.position);
                camera.position.y += 1.7;
                break;
            case 'third-person':
                camera.position.set(
                    player.position.x,
                    player.position.y + 5,
                    player.position.z + 10
                );
                controls.target.copy(player.position);
                break;
            case 'orbit':
                camera.position.set(0, 20, 20);
                controls.target.set(0, 0, 0);
                break;
            case 'top-down':
                camera.position.set(0, 50, 0);
                camera.lookAt(0, 0, 0);
                break;
        }
    }
    
    function toggleControlPanel() {
        const panelContent = controlsPanel.querySelector('.panel-content');
        if (panelContent.style.display === 'none') {
            panelContent.style.display = 'block';
            togglePanelBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
        } else {
            panelContent.style.display = 'none';
            togglePanelBtn.innerHTML = '<i class="fas fa-chevron-down"></i>';
        }
    }
    
    function togglePause() {
        isPaused = !isPaused;
        
        if (isPaused) {
            // Show pause menu
            pauseMenu.style.display = 'flex';
            
            // Unlock pointer
            document.exitPointerLock();
        } else {
            // Hide pause menu
            pauseMenu.style.display = 'none';
            
            // Lock pointer if in first-person or third-person mode
            if (viewMode === 'first-person' || viewMode === 'third-person') {
                lockPointer();
            }
        }
    }
    
    function resumeGame() {
        // Hide pause menu
        pauseMenu.style.display = 'none';
        
        // Resume game
        isPaused = false;
        
        // Lock pointer if in first-person or third-person mode
        if (viewMode === 'first-person' || viewMode === 'third-person') {
            lockPointer();
        }
    }
    
    function takeScreenshot() {
        // Render scene
        composer.render();
        
        // Get image data
        const imageData = renderer.domElement.toDataURL('image/png');
        
        // Show screenshot modal
        screenshotModal.style.display = 'flex';
        screenshotImage.src = imageData;
    }
    
    function downloadScreenshot() {
        // Create download link
        const link = document.createElement('a');
        link.href = screenshotImage.src;
        link.download = 'virtual-world-screenshot.png';
        link.click();
    }
    
    function closeScreenshot() {
        // Hide screenshot modal
        screenshotModal.style.display = 'none';
    }
    
    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            canvasContainer.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    }
    
    function lockPointer() {
        controls.lock();
    }
    
    function onPointerLockChange() {
        isPointerLocked = document.pointerLockElement === document.body;
    }
    
    function onWindowResize() {
        // Update camera
        camera.aspect = canvasContainer.clientWidth / canvasContainer.clientHeight;
        camera.updateProjectionMatrix();
        
        // Update renderer
        renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
        
        // Update composer
        composer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
    }
    
    function updatePlayerPosition(delta) {
        if (viewMode !== 'first-person' && viewMode !== 'third-person') return;
        
        // Get camera direction
        camera.getWorldDirection(playerDirection);
        playerDirection.y = 0;
        playerDirection.normalize();
        
        // Calculate movement direction
        const moveDirection = new THREE.Vector3();
        
        if (moveForward) {
            moveDirection.add(playerDirection);
        }
        if (moveBackward) {
            moveDirection.sub(playerDirection);
        }
        if (moveLeft) {
            moveDirection.add(new THREE.Vector3(playerDirection.z, 0, -playerDirection.x));
        }
        if (moveRight) {
            moveDirection.add(new THREE.Vector3(-playerDirection.z, 0, playerDirection.x));
        }
        
        moveDirection.normalize();
        
        // Apply movement
        if (moveDirection.length() > 0) {
            const speed = isCrouching ? movementSpeed * 0.5 : movementSpeed;
            player.position.x += moveDirection.x * speed * delta * 10;
            player.position.z += moveDirection.z * speed * delta * 10;
        }
        
        // Apply gravity if not flying
        if (!enableFlight) {
            playerVelocity.y -= gravity * delta * 10;
        }
        
        // Apply vertical velocity
        player.position.y += playerVelocity.y * delta;
        
        // Check ground collision
        const height = getHeightAt(player.position.x, player.position.z);
        
        if (player.position.y < height + 1) {
            player.position.y = height + 1;
            playerVelocity.y = 0;
            canJump = true;
        }
        
        // Check water collision
        if (player.position.y < water.position.y + 0.5) {
            // Slow down in water
            playerVelocity.y *= 0.9;
            
            // Apply buoyancy
            if (playerVelocity.y < 0) {
                playerVelocity.y *= 0.5;
            }
            
            // Allow jumping in water
            canJump = true;
            
            // Reduce health in deep water
            if (player.position.y < water.position.y - 1) {
                health -= delta * 5;
                updateHealth();
            }
        }
        
        // Update camera position in first-person mode
        if (viewMode === 'first-person') {
            camera.position.copy(player.position);
            camera.position.y += isCrouching ? 1.2 : 1.7;
        } 
        // Update orbit controls target in third-person mode
        else if (viewMode === 'third-person' && controls) {
            controls.target.copy(player.position);
        }
        
        // Update coordinates display
        coordX.textContent = player.position.x.toFixed(1);
        coordY.textContent = player.position.y.toFixed(1);
        coordZ.textContent = player.position.z.toFixed(1);
    }
    
    function updateParticlePositions(delta) {
        // Update particle positions
        for (let i = 0; i < particles.length; i++) {
            const particle = particles[i];
            
            if (particle.userData.isRain) {
                // Update rain particles
                const positions = particle.geometry.attributes.position.array;
                const velocities = particle.geometry.attributes.velocity.array;
                
                for (let j = 0; j < positions.length; j += 3) {
                    // Apply velocity
                    positions[j] += velocities[j] + (windStrength - 0.5) * delta * 10;
                    positions[j + 1] += velocities[j + 1] * delta * 10;
                    positions[j + 2] += velocities[j + 2] + (windStrength - 0.5) * delta * 10;
                    
                    // Reset if below ground or out of bounds
                    if (positions[j + 1] < getHeightAt(positions[j], positions[j + 2]) || 
                        positions[j] < -100 || positions[j] > 100 || 
                        positions[j + 2] < -100 || positions[j + 2] > 100) {
                        positions[j] = Math.random() * 200 - 100;
                        positions[j + 1] = 50;
                        positions[j + 2] = Math.random() * 200 - 100;
                    }
                }
                
                particle.geometry.attributes.position.needsUpdate = true;
            } else if (particle.userData.isFog) {
                // Update fog particles
                const positions = particle.geometry.attributes.position.array;
                
                for (let j = 0; j < positions.length; j += 3) {
                    // Move slowly
                    positions[j] += (Math.random() - 0.5) * 0.1 + (windStrength - 0.5) * delta * 2;
                    positions[j + 2] += (Math.random() - 0.5) * 0.1 + (windStrength - 0.5) * delta * 2;
                    
                    // Reset if out of bounds
                    if (positions[j] < -100 || positions[j] > 100 || 
                        positions[j + 2] < -100 || positions[j + 2] > 100) {
                        positions[j] = Math.random() * 200 - 100;
                        positions[j + 2] = Math.random() * 200 - 100;
                    }
                }
                
                particle.geometry.attributes.position.needsUpdate = true;
            }
        }
    }
    
    function updateHealth() {
        // Update health display
        health = Math.max(0, Math.min(100, health));
        healthFill.style.width = health + '%';
        
        // Game over if health reaches 0
        if (health <= 0) {
            // Reset player position
            player.position.set(0, 5, 0);
            health = 100;
            updateHealth();
        }
    }
    
    function checkInteractions() {
        // Cast ray from camera
        raycaster.setFromCamera(new THREE.Vector2(), camera);
        
        // Check for intersections
        const intersects = raycaster.intersectObjects(worldObjects);
        
        if (intersects.length > 0 && intersects[0].distance < 5) {
            // Show interaction prompt
            interactionPrompt.style.display = 'block';
        } else {
            // Hide interaction prompt
            interactionPrompt.style.display = 'none';
        }
    }
    
    function updateFPS() {
        // Calculate FPS
        const now = performance.now();
        frameCount++;
        
        if (now - lastFpsUpdate > 1000) {
            fps = Math.round((frameCount * 1000) / (now - lastFpsUpdate));
            fpsValue.textContent = fps;
            frameCount = 0;
            lastFpsUpdate = now;
        }
    }
    
    function animate() {
        requestAnimationFrame(animate);
        
        // Calculate delta time
        delta = clock.getDelta();
        
        // Update FPS counter
        updateFPS();
        
        // Skip updates if paused
        if (isPaused) return;
        
        // Update day/night cycle if auto cycle is enabled
        if (autoCycle) {
            worldTime += delta * 0.1; // 1 day = 10 minutes real time
            if (worldTime >= 24) worldTime = 0;
            timeSlider.value = worldTime;
            updateDayNightCycle();
        }
        
        // Update controls
        if (controls && controls.update) {
            controls.update();
        }
        
        // Update player position
        updatePlayerPosition(delta);
        
        // Update particle positions
        updateParticlePositions(delta);
        
        // Check for interactions
        checkInteractions();
        
        // Update water
        if (water) {
            water.material.uniforms['time'].value += delta;
        }
        
        // Render scene with post-processing
        composer.render();
    }
});
