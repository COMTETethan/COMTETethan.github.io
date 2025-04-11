// 3D Smartphone Model Viewer
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const canvasContainer = document.getElementById('canvas-container');
    const toggleWireframeBtn = document.getElementById('toggle-wireframe');
    const toggleExplodeBtn = document.getElementById('toggle-explode');
    const toggleAnimationBtn = document.getElementById('toggle-animation');
    const screenshotBtn = document.getElementById('screenshot-button');
    const phoneColorInput = document.getElementById('phone-color');
    const screenColorInput = document.getElementById('screen-color');
    const phoneModelSelect = document.getElementById('phone-model');
    const showScreenCheckbox = document.getElementById('show-screen');
    const materialTypeSelect = document.getElementById('material-type');
    const metalnessSlider = document.getElementById('metalness-slider');
    const metalnessValue = document.getElementById('metalness-value');
    const roughnessSlider = document.getElementById('roughness-slider');
    const roughnessValue = document.getElementById('roughness-value');
    const showReflectionsCheckbox = document.getElementById('show-reflections');
    const environmentTypeSelect = document.getElementById('environment-type');
    const lightIntensitySlider = document.getElementById('light-intensity-slider');
    const lightIntensityValue = document.getElementById('light-intensity-value');
    const showShadowsCheckbox = document.getElementById('show-shadows');
    const showGlowCheckbox = document.getElementById('show-glow');
    const cameraPositionSelect = document.getElementById('camera-position');
    const autoRotateCheckbox = document.getElementById('auto-rotate');
    const resetButton = document.getElementById('reset-button');
    
    // Three.js Variables
    let scene, camera, renderer, controls;
    let phoneModel, phoneBody, phoneScreen, phoneCamera, phoneButton;
    let directionalLight, ambientLight, pointLight;
    let composer, bloomPass;
    let isWireframe = false;
    let isExploded = false;
    let isAnimating = true;
    let originalPositions = {};
    let currentPhoneType = 'modern';
    
    // Initialize
    init();
    
    function init() {
        // Create scene
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000);
        
        // Create camera
        camera = new THREE.PerspectiveCamera(75, canvasContainer.clientWidth / canvasContainer.clientHeight, 0.1, 1000);
        camera.position.z = 5;
        
        // Create renderer
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        canvasContainer.appendChild(renderer.domElement);
        
        // Add orbit controls
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 1;
        
        // Add lights
        setupLights();
        
        // Create smartphone model
        createSmartphoneModel();
        
        // Set up post-processing
        setupPostProcessing();
        
        // Add event listeners
        setupEventListeners();
        
        // Start animation loop
        animate();
        
        // Handle window resize
        window.addEventListener('resize', onWindowResize);
    }
    
    function setupLights() {
        // Ambient light
        ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        
        // Directional light (sun)
        directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 1024;
        directionalLight.shadow.mapSize.height = 1024;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 50;
        directionalLight.shadow.camera.left = -10;
        directionalLight.shadow.camera.right = 10;
        directionalLight.shadow.camera.top = 10;
        directionalLight.shadow.camera.bottom = -10;
        scene.add(directionalLight);
        
        // Point light (for screen glow)
        pointLight = new THREE.PointLight(0x0088ff, 0, 10);
        pointLight.position.set(0, 0, 0.5);
        scene.add(pointLight);
    }
    
    function createSmartphoneModel() {
        // Create a group for the phone
        phoneModel = new THREE.Group();
        scene.add(phoneModel);
        
        createModernSmartphone();
    }
    
    function createModernSmartphone() {
        // Clear existing model
        while(phoneModel.children.length > 0) {
            phoneModel.remove(phoneModel.children[0]);
        }
        
        // Phone body
        const bodyGeometry = new THREE.BoxGeometry(2, 4, 0.2);
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: phoneColorInput.value,
            metalness: parseFloat(metalnessSlider.value),
            roughness: parseFloat(roughnessSlider.value)
        });
        phoneBody = new THREE.Mesh(bodyGeometry, bodyMaterial);
        phoneBody.castShadow = true;
        phoneBody.receiveShadow = true;
        phoneModel.add(phoneBody);
        originalPositions.body = phoneBody.position.clone();
        
        // Screen
        const screenGeometry = new THREE.BoxGeometry(1.9, 3.8, 0.05);
        const screenMaterial = new THREE.MeshStandardMaterial({
            color: screenColorInput.value,
            emissive: screenColorInput.value,
            emissiveIntensity: showScreenCheckbox.checked ? 0.5 : 0,
            metalness: 0.9,
            roughness: 0.1
        });
        phoneScreen = new THREE.Mesh(screenGeometry, screenMaterial);
        phoneScreen.position.z = 0.1;
        phoneScreen.castShadow = true;
        phoneScreen.receiveShadow = true;
        phoneModel.add(phoneScreen);
        originalPositions.screen = phoneScreen.position.clone();
        
        // Camera lens
        const lensGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.05, 32);
        const lensMaterial = new THREE.MeshStandardMaterial({
            color: 0x111111,
            metalness: 0.8,
            roughness: 0.2
        });
        phoneCamera = new THREE.Mesh(lensGeometry, lensMaterial);
        phoneCamera.rotation.x = Math.PI / 2;
        phoneCamera.position.set(0.5, 1.5, -0.15);
        phoneCamera.castShadow = true;
        phoneCamera.receiveShadow = true;
        phoneModel.add(phoneCamera);
        originalPositions.camera = phoneCamera.position.clone();
        
        // Home button
        const buttonGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.05, 32);
        const buttonMaterial = new THREE.MeshStandardMaterial({
            color: 0x222222,
            metalness: 0.6,
            roughness: 0.3
        });
        phoneButton = new THREE.Mesh(buttonGeometry, buttonMaterial);
        phoneButton.rotation.x = Math.PI / 2;
        phoneButton.position.set(0, -1.8, 0.1);
        phoneButton.castShadow = true;
        phoneButton.receiveShadow = true;
        phoneModel.add(phoneButton);
        originalPositions.button = phoneButton.position.clone();
        
        // Add screen details (time, icons, etc.)
        addScreenDetails();
        
        // Position the point light at the screen center
        pointLight.position.copy(phoneScreen.position);
        pointLight.position.z += 0.1;
    }
    
    function createClassicPhone() {
        // Clear existing model
        while(phoneModel.children.length > 0) {
            phoneModel.remove(phoneModel.children[0]);
        }
        
        // Phone body
        const bodyGeometry = new THREE.BoxGeometry(2, 4, 0.4);
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: phoneColorInput.value,
            metalness: parseFloat(metalnessSlider.value),
            roughness: parseFloat(roughnessSlider.value)
        });
        phoneBody = new THREE.Mesh(bodyGeometry, bodyMaterial);
        phoneBody.castShadow = true;
        phoneBody.receiveShadow = true;
        phoneModel.add(phoneBody);
        originalPositions.body = phoneBody.position.clone();
        
        // Screen (smaller)
        const screenGeometry = new THREE.BoxGeometry(1.5, 1.5, 0.05);
        const screenMaterial = new THREE.MeshStandardMaterial({
            color: screenColorInput.value,
            emissive: screenColorInput.value,
            emissiveIntensity: showScreenCheckbox.checked ? 0.5 : 0,
            metalness: 0.9,
            roughness: 0.1
        });
        phoneScreen = new THREE.Mesh(screenGeometry, screenMaterial);
        phoneScreen.position.z = 0.2;
        phoneScreen.position.y = 1;
        phoneScreen.castShadow = true;
        phoneScreen.receiveShadow = true;
        phoneModel.add(phoneScreen);
        originalPositions.screen = phoneScreen.position.clone();
        
        // Keypad
        const keypadGeometry = new THREE.BoxGeometry(1.8, 1.8, 0.05);
        const keypadMaterial = new THREE.MeshStandardMaterial({
            color: 0x333333,
            metalness: 0.5,
            roughness: 0.5
        });
        const keypad = new THREE.Mesh(keypadGeometry, keypadMaterial);
        keypad.position.z = 0.2;
        keypad.position.y = -1;
        keypad.castShadow = true;
        keypad.receiveShadow = true;
        phoneModel.add(keypad);
        originalPositions.keypad = keypad.position.clone();
        
        // Add keys
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const keyGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.05, 32);
                const keyMaterial = new THREE.MeshStandardMaterial({
                    color: 0x666666,
                    metalness: 0.7,
                    roughness: 0.3
                });
                const key = new THREE.Mesh(keyGeometry, keyMaterial);
                key.rotation.x = Math.PI / 2;
                key.position.set(-0.6 + j * 0.6, -1.6 + i * 0.6, 0.25);
                key.castShadow = true;
                key.receiveShadow = true;
                phoneModel.add(key);
                originalPositions[`key_${i}_${j}`] = key.position.clone();
            }
        }
        
        // Antenna
        const antennaGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1, 16);
        const antennaMaterial = new THREE.MeshStandardMaterial({
            color: 0x111111,
            metalness: 0.8,
            roughness: 0.2
        });
        const antenna = new THREE.Mesh(antennaGeometry, antennaMaterial);
        antenna.position.set(0.8, 2.5, 0);
        antenna.castShadow = true;
        antenna.receiveShadow = true;
        phoneModel.add(antenna);
        originalPositions.antenna = antenna.position.clone();
        
        // Position the point light at the screen center
        pointLight.position.copy(phoneScreen.position);
        pointLight.position.z += 0.1;
    }
    
    function createFuturisticDevice() {
        // Clear existing model
        while(phoneModel.children.length > 0) {
            phoneModel.remove(phoneModel.children[0]);
        }
        
        // Phone body (curved)
        const bodyGeometry = new THREE.CylinderGeometry(2, 2, 4, 32, 1, false, 0, Math.PI);
        bodyGeometry.rotateY(Math.PI);
        bodyGeometry.rotateZ(Math.PI / 2);
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: phoneColorInput.value,
            metalness: parseFloat(metalnessSlider.value),
            roughness: parseFloat(roughnessSlider.value)
        });
        phoneBody = new THREE.Mesh(bodyGeometry, bodyMaterial);
        phoneBody.scale.z = 0.2;
        phoneBody.castShadow = true;
        phoneBody.receiveShadow = true;
        phoneModel.add(phoneBody);
        originalPositions.body = phoneBody.position.clone();
        
        // Screen (curved)
        const screenGeometry = new THREE.CylinderGeometry(1.95, 1.95, 3.8, 32, 1, false, 0, Math.PI);
        screenGeometry.rotateY(Math.PI);
        screenGeometry.rotateZ(Math.PI / 2);
        const screenMaterial = new THREE.MeshStandardMaterial({
            color: screenColorInput.value,
            emissive: screenColorInput.value,
            emissiveIntensity: showScreenCheckbox.checked ? 0.5 : 0,
            metalness: 0.9,
            roughness: 0.1
        });
        phoneScreen = new THREE.Mesh(screenGeometry, screenMaterial);
        phoneScreen.scale.z = 0.05;
        phoneScreen.position.z = 0.15;
        phoneScreen.castShadow = true;
        phoneScreen.receiveShadow = true;
        phoneModel.add(phoneScreen);
        originalPositions.screen = phoneScreen.position.clone();
        
        // Holographic projector
        const projectorGeometry = new THREE.SphereGeometry(0.2, 32, 32);
        const projectorMaterial = new THREE.MeshStandardMaterial({
            color: 0x00ffff,
            emissive: 0x00ffff,
            emissiveIntensity: showScreenCheckbox.checked ? 0.5 : 0,
            metalness: 1,
            roughness: 0
        });
        const projector = new THREE.Mesh(projectorGeometry, projectorMaterial);
        projector.position.set(0, 1.8, 0.3);
        projector.castShadow = true;
        projector.receiveShadow = true;
        phoneModel.add(projector);
        originalPositions.projector = projector.position.clone();
        
        // Accent lights
        for (let i = 0; i < 5; i++) {
            const lightGeometry = new THREE.BoxGeometry(0.1, 0.5, 0.05);
            const lightMaterial = new THREE.MeshStandardMaterial({
                color: 0x00ffff,
                emissive: 0x00ffff,
                emissiveIntensity: showScreenCheckbox.checked ? 0.5 : 0,
                metalness: 1,
                roughness: 0
            });
            const light = new THREE.Mesh(lightGeometry, lightMaterial);
            light.position.set(-0.9, -1.5 + i * 0.7, 0.15);
            light.castShadow = true;
            light.receiveShadow = true;
            phoneModel.add(light);
            originalPositions[`light_${i}`] = light.position.clone();
        }
        
        // Position the point light at the screen center
        pointLight.position.copy(phoneScreen.position);
        pointLight.position.z += 0.2;
    }
    
    function createTablet() {
        // Clear existing model
        while(phoneModel.children.length > 0) {
            phoneModel.remove(phoneModel.children[0]);
        }
        
        // Tablet body
        const bodyGeometry = new THREE.BoxGeometry(4, 5, 0.2);
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: phoneColorInput.value,
            metalness: parseFloat(metalnessSlider.value),
            roughness: parseFloat(roughnessSlider.value)
        });
        phoneBody = new THREE.Mesh(bodyGeometry, bodyMaterial);
        phoneBody.castShadow = true;
        phoneBody.receiveShadow = true;
        phoneModel.add(phoneBody);
        originalPositions.body = phoneBody.position.clone();
        
        // Screen
        const screenGeometry = new THREE.BoxGeometry(3.8, 4.8, 0.05);
        const screenMaterial = new THREE.MeshStandardMaterial({
            color: screenColorInput.value,
            emissive: screenColorInput.value,
            emissiveIntensity: showScreenCheckbox.checked ? 0.5 : 0,
            metalness: 0.9,
            roughness: 0.1
        });
        phoneScreen = new THREE.Mesh(screenGeometry, screenMaterial);
        phoneScreen.position.z = 0.1;
        phoneScreen.castShadow = true;
        phoneScreen.receiveShadow = true;
        phoneModel.add(phoneScreen);
        originalPositions.screen = phoneScreen.position.clone();
        
        // Camera lens
        const lensGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.05, 32);
        const lensMaterial = new THREE.MeshStandardMaterial({
            color: 0x111111,
            metalness: 0.8,
            roughness: 0.2
        });
        phoneCamera = new THREE.Mesh(lensGeometry, lensMaterial);
        phoneCamera.rotation.x = Math.PI / 2;
        phoneCamera.position.set(0, 2.3, -0.15);
        phoneCamera.castShadow = true;
        phoneCamera.receiveShadow = true;
        phoneModel.add(phoneCamera);
        originalPositions.camera = phoneCamera.position.clone();
        
        // Home button
        const buttonGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.05, 32);
        const buttonMaterial = new THREE.MeshStandardMaterial({
            color: 0x222222,
            metalness: 0.6,
            roughness: 0.3
        });
        phoneButton = new THREE.Mesh(buttonGeometry, buttonMaterial);
        phoneButton.rotation.x = Math.PI / 2;
        phoneButton.position.set(0, -2.3, 0.1);
        phoneButton.castShadow = true;
        phoneButton.receiveShadow = true;
        phoneModel.add(phoneButton);
        originalPositions.button = phoneButton.position.clone();
        
        // Add screen details
        addTabletScreenDetails();
        
        // Position the point light at the screen center
        pointLight.position.copy(phoneScreen.position);
        pointLight.position.z += 0.1;
    }
    
    function addScreenDetails() {
        if (!showScreenCheckbox.checked) return;
        
        // Status bar
        const statusBarGeometry = new THREE.BoxGeometry(1.8, 0.2, 0.01);
        const statusBarMaterial = new THREE.MeshBasicMaterial({
            color: 0x000000,
            transparent: true,
            opacity: 0.5
        });
        const statusBar = new THREE.Mesh(statusBarGeometry, statusBarMaterial);
        statusBar.position.set(0, 1.8, 0.13);
        phoneModel.add(statusBar);
        originalPositions.statusBar = statusBar.position.clone();
        
        // App icons (simplified as colored squares)
        const iconSize = 0.3;
        const iconGeometry = new THREE.BoxGeometry(iconSize, iconSize, 0.01);
        
        const iconColors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff];
        
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 2; j++) {
                const iconMaterial = new THREE.MeshBasicMaterial({
                    color: iconColors[i * 2 + j],
                    transparent: true,
                    opacity: 0.9
                });
                const icon = new THREE.Mesh(iconGeometry, iconMaterial);
                icon.position.set(-0.5 + j, 0.5 - i * 0.8, 0.13);
                phoneModel.add(icon);
                originalPositions[`icon_${i}_${j}`] = icon.position.clone();
            }
        }
    }
    
    function addTabletScreenDetails() {
        if (!showScreenCheckbox.checked) return;
        
        // Status bar
        const statusBarGeometry = new THREE.BoxGeometry(3.7, 0.2, 0.01);
        const statusBarMaterial = new THREE.MeshBasicMaterial({
            color: 0x000000,
            transparent: true,
            opacity: 0.5
        });
        const statusBar = new THREE.Mesh(statusBarGeometry, statusBarMaterial);
        statusBar.position.set(0, 2.3, 0.13);
        phoneModel.add(statusBar);
        originalPositions.statusBar = statusBar.position.clone();
        
        // App icons (simplified as colored squares)
        const iconSize = 0.4;
        const iconGeometry = new THREE.BoxGeometry(iconSize, iconSize, 0.01);
        
        const iconColors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff, 
                           0xff8800, 0x88ff00, 0x0088ff, 0xff0088, 0x8800ff, 0x00ff88];
        
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 3; j++) {
                const iconMaterial = new THREE.MeshBasicMaterial({
                    color: iconColors[i * 3 + j],
                    transparent: true,
                    opacity: 0.9
                });
                const icon = new THREE.Mesh(iconGeometry, iconMaterial);
                icon.position.set(-1.2 + j * 1.2, 1 - i * 1, 0.13);
                phoneModel.add(icon);
                originalPositions[`icon_${i}_${j}`] = icon.position.clone();
            }
        }
    }
    
    function setupPostProcessing() {
        // Create composer
        composer = new THREE.EffectComposer(renderer);
        
        // Add render pass
        const renderPass = new THREE.RenderPass(scene, camera);
        composer.addPass(renderPass);
        
        // Add bloom pass
        bloomPass = new THREE.UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            0, // strength
            0.5, // radius
            0.7 // threshold
        );
        composer.addPass(bloomPass);
    }
    
    function setupEventListeners() {
        // Toggle wireframe
        toggleWireframeBtn.addEventListener('click', function() {
            isWireframe = !isWireframe;
            phoneModel.traverse(function(child) {
                if (child instanceof THREE.Mesh) {
                    child.material.wireframe = isWireframe;
                }
            });
        });
        
        // Toggle explode view
        toggleExplodeBtn.addEventListener('click', function() {
            isExploded = !isExploded;
            if (isExploded) {
                explodeModel();
            } else {
                resetExplodedModel();
            }
        });
        
        // Toggle animation
        toggleAnimationBtn.addEventListener('click', function() {
            isAnimating = !isAnimating;
            controls.autoRotate = isAnimating;
            if (isAnimating) {
                toggleAnimationBtn.innerHTML = '<i class="fas fa-pause"></i> Pause Animation';
            } else {
                toggleAnimationBtn.innerHTML = '<i class="fas fa-play"></i> Start Animation';
            }
        });
        
        // Take screenshot
        screenshotBtn.addEventListener('click', takeScreenshot);
        
        // Phone color
        phoneColorInput.addEventListener('input', function() {
            if (phoneBody) {
                phoneBody.material.color.set(this.value);
            }
        });
        
        // Screen color
        screenColorInput.addEventListener('input', function() {
            if (phoneScreen) {
                phoneScreen.material.color.set(this.value);
                phoneScreen.material.emissive.set(this.value);
                pointLight.color.set(this.value);
            }
        });
        
        // Phone model
        phoneModelSelect.addEventListener('change', function() {
            currentPhoneType = this.value;
            switch(this.value) {
                case 'modern':
                    createModernSmartphone();
                    break;
                case 'classic':
                    createClassicPhone();
                    break;
                case 'futuristic':
                    createFuturisticDevice();
                    break;
                case 'tablet':
                    createTablet();
                    break;
            }
            
            // Reset wireframe and explode view
            isWireframe = false;
            isExploded = false;
            
            // Update materials
            updateMaterials();
        });
        
        // Show screen
        showScreenCheckbox.addEventListener('change', function() {
            if (phoneScreen) {
                if (this.checked) {
                    phoneScreen.material.emissiveIntensity = 0.5;
                    pointLight.intensity = showGlowCheckbox.checked ? 1 : 0;
                    
                    // Add screen details based on phone type
                    switch(currentPhoneType) {
                        case 'modern':
                            addScreenDetails();
                            break;
                        case 'tablet':
                            addTabletScreenDetails();
                            break;
                    }
                } else {
                    phoneScreen.material.emissiveIntensity = 0;
                    pointLight.intensity = 0;
                    
                    // Remove screen details
                    phoneModel.children.forEach(child => {
                        if (child !== phoneBody && child !== phoneScreen && 
                            child !== phoneCamera && child !== phoneButton) {
                            phoneModel.remove(child);
                        }
                    });
                }
            }
        });
        
        // Material type
        materialTypeSelect.addEventListener('change', updateMaterials);
        
        // Metalness
        metalnessSlider.addEventListener('input', function() {
            metalnessValue.textContent = this.value;
            updateMaterials();
        });
        
        // Roughness
        roughnessSlider.addEventListener('input', function() {
            roughnessValue.textContent = this.value;
            updateMaterials();
        });
        
        // Show reflections
        showReflectionsCheckbox.addEventListener('change', updateEnvironment);
        
        // Environment type
        environmentTypeSelect.addEventListener('change', updateEnvironment);
        
        // Light intensity
        lightIntensitySlider.addEventListener('input', function() {
            lightIntensityValue.textContent = this.value;
            directionalLight.intensity = parseFloat(this.value);
            ambientLight.intensity = parseFloat(this.value) * 0.5;
        });
        
        // Show shadows
        showShadowsCheckbox.addEventListener('change', function() {
            directionalLight.castShadow = this.checked;
            renderer.shadowMap.enabled = this.checked;
        });
        
        // Show glow
        showGlowCheckbox.addEventListener('change', function() {
            bloomPass.strength = this.checked ? 0.5 : 0;
            pointLight.intensity = this.checked && showScreenCheckbox.checked ? 1 : 0;
        });
        
        // Camera position
        cameraPositionSelect.addEventListener('change', function() {
            switch(this.value) {
                case 'front':
                    camera.position.set(0, 0, 5);
                    break;
                case 'side':
                    camera.position.set(5, 0, 0);
                    break;
                case 'angled':
                    camera.position.set(3, 2, 4);
                    break;
                case 'top':
                    camera.position.set(0, 5, 0);
                    break;
            }
            camera.lookAt(0, 0, 0);
        });
        
        // Auto rotate
        autoRotateCheckbox.addEventListener('change', function() {
            controls.autoRotate = this.checked;
        });
        
        // Reset button
        resetButton.addEventListener('click', resetAllSettings);
    }
    
    function updateMaterials() {
        const materialType = materialTypeSelect.value;
        const metalness = parseFloat(metalnessSlider.value);
        const roughness = parseFloat(roughnessSlider.value);
        
        phoneModel.traverse(function(child) {
            if (child instanceof THREE.Mesh) {
                let newMaterial;
                
                switch(materialType) {
                    case 'standard':
                        newMaterial = new THREE.MeshStandardMaterial({
                            color: child.material.color,
                            emissive: child.material.emissive,
                            emissiveIntensity: child.material.emissiveIntensity,
                            metalness: metalness,
                            roughness: roughness,
                            wireframe: isWireframe
                        });
                        break;
                    case 'physical':
                        newMaterial = new THREE.MeshPhysicalMaterial({
                            color: child.material.color,
                            emissive: child.material.emissive,
                            emissiveIntensity: child.material.emissiveIntensity,
                            metalness: metalness,
                            roughness: roughness,
                            clearcoat: 1,
                            clearcoatRoughness: 0.1,
                            wireframe: isWireframe
                        });
                        break;
                    case 'toon':
                        newMaterial = new THREE.MeshToonMaterial({
                            color: child.material.color,
                            wireframe: isWireframe
                        });
                        break;
                    case 'glossy':
                        newMaterial = new THREE.MeshPhongMaterial({
                            color: child.material.color,
                            emissive: child.material.emissive,
                            emissiveIntensity: child.material.emissiveIntensity,
                            shininess: 100,
                            specular: new THREE.Color(0xffffff),
                            wireframe: isWireframe
                        });
                        break;
                    case 'matte':
                        newMaterial = new THREE.MeshLambertMaterial({
                            color: child.material.color,
                            emissive: child.material.emissive,
                            emissiveIntensity: child.material.emissiveIntensity,
                            wireframe: isWireframe
                        });
                        break;
                }
                
                // Preserve shadow casting/receiving
                newMaterial.castShadow = child.castShadow;
                newMaterial.receiveShadow = child.receiveShadow;
                
                // Replace material
                child.material.dispose();
                child.material = newMaterial;
            }
        });
    }
    
    function updateEnvironment() {
        const environmentType = environmentTypeSelect.value;
        const showReflections = showReflectionsCheckbox.checked;
        
        // Update scene background
        switch(environmentType) {
            case 'studio':
                scene.background = new THREE.Color(0x000000);
                directionalLight.position.set(5, 5, 5);
                directionalLight.color.set(0xffffff);
                break;
            case 'outdoor':
                scene.background = new THREE.Color(0x87ceeb);
                directionalLight.position.set(10, 10, 10);
                directionalLight.color.set(0xffffcc);
                break;
            case 'night':
                scene.background = new THREE.Color(0x000033);
                directionalLight.position.set(-5, 5, 5);
                directionalLight.color.set(0xaaaaff);
                break;
            case 'abstract':
                scene.background = new THREE.Color(0x330033);
                directionalLight.position.set(0, 10, 5);
                directionalLight.color.set(0xff00ff);
                break;
        }
        
        // TODO: In a real implementation, we would load environment maps for reflections
        // For this demo, we'll simulate reflections by adjusting material properties
        if (showReflections) {
            phoneModel.traverse(function(child) {
                if (child instanceof THREE.Mesh && child.material.metalness !== undefined) {
                    child.material.envMapIntensity = 1;
                }
            });
        } else {
            phoneModel.traverse(function(child) {
                if (child instanceof THREE.Mesh && child.material.metalness !== undefined) {
                    child.material.envMapIntensity = 0;
                }
            });
        }
    }
    
    function explodeModel() {
        // Store original positions if not already stored
        phoneModel.children.forEach(child => {
            if (!originalPositions[child.uuid]) {
                originalPositions[child.uuid] = child.position.clone();
            }
            
            // Calculate explosion direction (away from center)
            const direction = child.position.clone().normalize();
            
            // Move part away from center
            const distance = 1.5; // Explosion distance
            child.position.x += direction.x * distance;
            child.position.y += direction.y * distance;
            child.position.z += direction.z * distance;
        });
    }
    
    function resetExplodedModel() {
        // Restore original positions
        phoneModel.children.forEach(child => {
            if (originalPositions[child.uuid]) {
                child.position.copy(originalPositions[child.uuid]);
            }
        });
    }
    
    function resetAllSettings() {
        // Reset controls
        phoneColorInput.value = '#333333';
        screenColorInput.value = '#0088ff';
        phoneModelSelect.value = 'modern';
        showScreenCheckbox.checked = true;
        materialTypeSelect.value = 'standard';
        metalnessSlider.value = 0.5;
        metalnessValue.textContent = '0.5';
        roughnessSlider.value = 0.2;
        roughnessValue.textContent = '0.2';
        showReflectionsCheckbox.checked = true;
        environmentTypeSelect.value = 'studio';
        lightIntensitySlider.value = 1;
        lightIntensityValue.textContent = '1.0';
        showShadowsCheckbox.checked = true;
        showGlowCheckbox.checked = false;
        cameraPositionSelect.value = 'front';
        autoRotateCheckbox.checked = true;
        
        // Reset camera
        camera.position.set(0, 0, 5);
        camera.lookAt(0, 0, 0);
        
        // Reset model
        currentPhoneType = 'modern';
        createModernSmartphone();
        
        // Reset wireframe and explode view
        isWireframe = false;
        isExploded = false;
        
        // Reset lights
        directionalLight.position.set(5, 5, 5);
        directionalLight.intensity = 1;
        directionalLight.color.set(0xffffff);
        directionalLight.castShadow = true;
        ambientLight.intensity = 0.5;
        pointLight.intensity = 0;
        
        // Reset renderer
        renderer.shadowMap.enabled = true;
        
        // Reset post-processing
        bloomPass.strength = 0;
        
        // Reset scene background
        scene.background = new THREE.Color(0x000000);
        
        // Reset controls
        controls.autoRotate = true;
        
        // Update materials
        updateMaterials();
    }
    
    function takeScreenshot() {
        // Render scene
        if (composer) {
            composer.render();
        } else {
            renderer.render(scene, camera);
        }
        
        // Get image data
        const imageData = renderer.domElement.toDataURL('image/png');
        
        // Create modal if it doesn't exist
        let modal = document.querySelector('.screenshot-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.classList.add('screenshot-modal');
            
            const container = document.createElement('div');
            container.classList.add('screenshot-container');
            
            const img = document.createElement('img');
            img.id = 'screenshot-image';
            container.appendChild(img);
            
            const actions = document.createElement('div');
            actions.classList.add('screenshot-actions');
            
            const downloadBtn = document.createElement('button');
            downloadBtn.classList.add('btn', 'btn-success');
            downloadBtn.innerHTML = '<i class="fas fa-download"></i> Download';
            downloadBtn.addEventListener('click', function() {
                const link = document.createElement('a');
                link.href = document.getElementById('screenshot-image').src;
                link.download = 'smartphone-3d-model.png';
                link.click();
            });
            
            const closeBtn = document.createElement('button');
            closeBtn.classList.add('btn', 'btn-secondary');
            closeBtn.innerHTML = '<i class="fas fa-times"></i> Close';
            closeBtn.addEventListener('click', function() {
                modal.classList.remove('active');
            });
            
            actions.appendChild(downloadBtn);
            actions.appendChild(closeBtn);
            
            const closeX = document.createElement('button');
            closeX.classList.add('screenshot-close');
            closeX.innerHTML = '×';
            closeX.addEventListener('click', function() {
                modal.classList.remove('active');
            });
            
            modal.appendChild(container);
            modal.appendChild(actions);
            modal.appendChild(closeX);
            
            document.body.appendChild(modal);
        }
        
        // Update image and show modal
        document.getElementById('screenshot-image').src = imageData;
        modal.classList.add('active');
    }
    
    function onWindowResize() {
        camera.aspect = canvasContainer.clientWidth / canvasContainer.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
        composer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
    }
    
    function animate() {
        requestAnimationFrame(animate);
        
        // Update controls
        controls.update();
        
        // Render scene with post-processing
        composer.render();
    }
});
