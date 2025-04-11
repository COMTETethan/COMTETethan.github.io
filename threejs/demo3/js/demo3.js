// Demo 3 - 3D Model Viewer JavaScript

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // ThreeJS Variables
    let scene, camera, renderer, controls;
    let currentModel, lights = [];
    let mixer, clock;
    
    // Settings
    const settings = {
        lighting: {
            ambientIntensity: 0.3,
            directionalIntensity: 1.0,
            color: '#ffffff',
            shadows: true
        },
        materials: {
            type: 'standard',
            color: '#00ffff',
            metalness: 0.5,
            roughness: 0.2,
            emissiveEnabled: true,
            emissiveIntensity: 0.3
        },
        environment: {
            backgroundType: 'color',
            backgroundColor: '#0d0d0d',
            autoRotate: true
        }
    };
    
    // DOM Elements
    const canvasContainer = document.getElementById('canvas-container');
    const modelOptions = document.querySelectorAll('.model-option');
    const modelUpload = document.getElementById('model-upload');
    
    // Initialize the scene
    function init() {
        // Create clock for animations
        clock = new THREE.Clock();
        
        // Create scene
        scene = new THREE.Scene();
        updateBackground();
        
        // Create camera
        camera = new THREE.PerspectiveCamera(75, canvasContainer.clientWidth / canvasContainer.clientHeight, 0.1, 1000);
        camera.position.z = 5;
        
        // Create renderer
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled = settings.lighting.shadows;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        canvasContainer.appendChild(renderer.domElement);
        
        // Add orbit controls
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.autoRotate = settings.environment.autoRotate;
        controls.autoRotateSpeed = 1.0;
        
        // Add lights
        addLights();
        
        // Load initial model
        loadModel('robot');
        
        // Set first model option as active
        modelOptions[0].classList.add('active');
        
        // Add event listeners
        addEventListeners();
        
        // Start animation loop
        animate();
        
        // Handle window resize
        window.addEventListener('resize', onWindowResize);
    }
    
    // Add lights to the scene
    function addLights() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(
            settings.lighting.color, 
            settings.lighting.ambientIntensity
        );
        scene.add(ambientLight);
        lights.push(ambientLight);
        
        // Directional light (main light)
        const directionalLight = new THREE.DirectionalLight(
            settings.lighting.color, 
            settings.lighting.directionalIntensity
        );
        directionalLight.position.set(5, 5, 5);
        directionalLight.castShadow = settings.lighting.shadows;
        directionalLight.shadow.mapSize.width = 1024;
        directionalLight.shadow.mapSize.height = 1024;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 50;
        directionalLight.shadow.camera.left = -10;
        directionalLight.shadow.camera.right = 10;
        directionalLight.shadow.camera.top = 10;
        directionalLight.shadow.camera.bottom = -10;
        scene.add(directionalLight);
        lights.push(directionalLight);
        
        // Point light (accent light)
        const pointLight = new THREE.PointLight(
            settings.lighting.color, 
            settings.lighting.directionalIntensity * 0.5, 
            10
        );
        pointLight.position.set(-5, 0, -5);
        pointLight.castShadow = settings.lighting.shadows;
        scene.add(pointLight);
        lights.push(pointLight);
    }
    
    // Update light settings
    function updateLights() {
        // Update light colors and intensities
        const lightColor = new THREE.Color(settings.lighting.color);
        
        lights[0].color = lightColor;
        lights[0].intensity = settings.lighting.ambientIntensity;
        
        lights[1].color = lightColor;
        lights[1].intensity = settings.lighting.directionalIntensity;
        lights[1].castShadow = settings.lighting.shadows;
        
        lights[2].color = lightColor;
        lights[2].intensity = settings.lighting.directionalIntensity * 0.5;
        lights[2].castShadow = settings.lighting.shadows;
        
        // Update renderer shadow settings
        renderer.shadowMap.enabled = settings.lighting.shadows;
    }
    
    // Update background based on settings
    function updateBackground() {
        switch (settings.environment.backgroundType) {
            case 'color':
                scene.background = new THREE.Color(settings.environment.backgroundColor);
                scene.fog = null;
                break;
                
            case 'gradient':
                // Create gradient texture
                const canvas = document.createElement('canvas');
                canvas.width = 2;
                canvas.height = 2;
                
                const context = canvas.getContext('2d');
                const gradient = context.createLinearGradient(0, 0, 0, 2);
                
                const color1 = new THREE.Color(settings.environment.backgroundColor);
                const color2 = new THREE.Color(settings.materials.color);
                
                gradient.addColorStop(0, color1.getStyle());
                gradient.addColorStop(1, color2.getStyle());
                
                context.fillStyle = gradient;
                context.fillRect(0, 0, 2, 2);
                
                const texture = new THREE.CanvasTexture(canvas);
                scene.background = texture;
                scene.fog = null;
                break;
                
            case 'grid':
                scene.background = new THREE.Color(settings.environment.backgroundColor);
                
                // Create grid helper
                if (scene.getObjectByName('gridHelper')) {
                    scene.remove(scene.getObjectByName('gridHelper'));
                }
                
                const gridHelper = new THREE.GridHelper(20, 20, 0x00ffff, 0x00ffff);
                gridHelper.material.opacity = 0.2;
                gridHelper.material.transparent = true;
                gridHelper.name = 'gridHelper';
                scene.add(gridHelper);
                
                // Add fog
                scene.fog = new THREE.FogExp2(new THREE.Color(settings.environment.backgroundColor).getHex(), 0.05);
                break;
                
            default:
                scene.background = new THREE.Color(settings.environment.backgroundColor);
                scene.fog = null;
        }
    }
    
    // Load 3D model
    function loadModel(modelType) {
        // Show loading spinner
        document.querySelector('.loading').style.display = 'flex';
        
        // Remove current model if it exists
        if (currentModel) {
            scene.remove(currentModel);
            currentModel = null;
        }
        
        // Reset mixer
        mixer = null;
        
        // Create placeholder model while loading
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ 
            color: 0x00ffff, 
            wireframe: true 
        });
        const placeholder = new THREE.Mesh(geometry, material);
        scene.add(placeholder);
        
        // Create model based on selected type
        switch (modelType) {
            case 'robot':
                createRobotModel().then(model => {
                    scene.remove(placeholder);
                    currentModel = model;
                    scene.add(currentModel);
                    updateMaterials();
                    document.querySelector('.loading').style.display = 'none';
                });
                break;
                
            case 'spaceship':
                createSpaceshipModel().then(model => {
                    scene.remove(placeholder);
                    currentModel = model;
                    scene.add(currentModel);
                    updateMaterials();
                    document.querySelector('.loading').style.display = 'none';
                });
                break;
                
            case 'futuristic_city':
                createCityModel().then(model => {
                    scene.remove(placeholder);
                    currentModel = model;
                    scene.add(currentModel);
                    updateMaterials();
                    document.querySelector('.loading').style.display = 'none';
                });
                break;
                
            case 'custom':
                // Handle custom model upload
                if (modelUpload.files.length > 0) {
                    const file = modelUpload.files[0];
                    const reader = new FileReader();
                    
                    reader.onload = function(event) {
                        const contents = event.target.result;
                        
                        // Load GLTF model
                        const loader = new THREE.GLTFLoader();
                        const dracoLoader = new THREE.DRACOLoader();
                        dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
                        loader.setDRACOLoader(dracoLoader);
                        
                        loader.parse(contents, '', function(gltf) {
                            scene.remove(placeholder);
                            currentModel = gltf.scene;
                            
                            // Center model
                            const box = new THREE.Box3().setFromObject(currentModel);
                            const center = box.getCenter(new THREE.Vector3());
                            currentModel.position.sub(center);
                            
                            // Scale model to reasonable size
                            const size = box.getSize(new THREE.Vector3());
                            const maxDim = Math.max(size.x, size.y, size.z);
                            if (maxDim > 5) {
                                const scale = 5 / maxDim;
                                currentModel.scale.set(scale, scale, scale);
                            }
                            
                            // Setup shadows
                            currentModel.traverse(function(node) {
                                if (node.isMesh) {
                                    node.castShadow = true;
                                    node.receiveShadow = true;
                                }
                            });
                            
                            // Add model to scene
                            scene.add(currentModel);
                            updateMaterials();
                            
                            // Check for animations
                            if (gltf.animations && gltf.animations.length) {
                                mixer = new THREE.AnimationMixer(currentModel);
                                const action = mixer.clipAction(gltf.animations[0]);
                                action.play();
                            }
                            
                            document.querySelector('.loading').style.display = 'none';
                        });
                    };
                    
                    reader.readAsArrayBuffer(file);
                } else {
                    // If no file selected, create a default model
                    createRobotModel().then(model => {
                        scene.remove(placeholder);
                        currentModel = model;
                        scene.add(currentModel);
                        updateMaterials();
                        document.querySelector('.loading').style.display = 'none';
                    });
                }
                break;
                
            default:
                createRobotModel().then(model => {
                    scene.remove(placeholder);
                    currentModel = model;
                    scene.add(currentModel);
                    updateMaterials();
                    document.querySelector('.loading').style.display = 'none';
                });
        }
    }
    
    // Create robot model
    async function createRobotModel() {
        // Create robot group
        const robot = new THREE.Group();
        
        // Create materials
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: 0x00ffff,
            metalness: 0.7,
            roughness: 0.2,
            emissive: 0x00ffff,
            emissiveIntensity: 0.3
        });
        
        const jointMaterial = new THREE.MeshStandardMaterial({
            color: 0x333333,
            metalness: 0.9,
            roughness: 0.1
        });
        
        const eyeMaterial = new THREE.MeshStandardMaterial({
            color: 0xff00ff,
            emissive: 0xff00ff,
            emissiveIntensity: 0.8
        });
        
        // Create body
        const bodyGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1.5, 16);
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 1.5;
        body.castShadow = true;
        body.receiveShadow = true;
        robot.add(body);
        
        // Create head
        const headGeometry = new THREE.SphereGeometry(0.4, 16, 16);
        const head = new THREE.Mesh(headGeometry, bodyMaterial);
        head.position.y = 2.5;
        head.castShadow = true;
        head.receiveShadow = true;
        robot.add(head);
        
        // Create eyes
        const eyeGeometry = new THREE.SphereGeometry(0.1, 8, 8);
        
        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(0.2, 2.5, 0.3);
        robot.add(leftEye);
        
        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(-0.2, 2.5, 0.3);
        robot.add(rightEye);
        
        // Create arms
        const armGeometry = new THREE.BoxGeometry(0.2, 0.8, 0.2);
        
        const leftArm = new THREE.Mesh(armGeometry, bodyMaterial);
        leftArm.position.set(0.8, 1.5, 0);
        leftArm.castShadow = true;
        leftArm.receiveShadow = true;
        robot.add(leftArm);
        
        const rightArm = new THREE.Mesh(armGeometry, bodyMaterial);
        rightArm.position.set(-0.8, 1.5, 0);
        rightArm.castShadow = true;
        rightArm.receiveShadow = true;
        robot.add(rightArm);
        
        // Create legs
        const legGeometry = new THREE.BoxGeometry(0.3, 1, 0.3);
        
        const leftLeg = new THREE.Mesh(legGeometry, bodyMaterial);
        leftLeg.position.set(0.3, 0.5, 0);
        leftLeg.castShadow = true;
        leftLeg.receiveShadow = true;
        robot.add(leftLeg);
        
        const rightLeg = new THREE.Mesh(legGeometry, bodyMaterial);
        rightLeg.position.set(-0.3, 0.5, 0);
        rightLeg.castShadow = true;
        rightLeg.receiveShadow = true;
        robot.add(rightLeg);
        
        // Create joints
        const jointGeometry = new THREE.SphereGeometry(0.15, 8, 8);
        
        const leftShoulderJoint = new THREE.Mesh(jointGeometry, jointMaterial);
        leftShoulderJoint.position.set(0.6, 1.8, 0);
        leftShoulderJoint.castShadow = true;
        leftShoulderJoint.receiveShadow = true;
        robot.add(leftShoulderJoint);
        
        const rightShoulderJoint = new THREE.Mesh(jointGeometry, jointMaterial);
        rightShoulderJoint.position.set(-0.6, 1.8, 0);
        rightShoulderJoint.castShadow = true;
        rightShoulderJoint.receiveShadow = true;
        robot.add(rightShoulderJoint);
        
        const leftHipJoint = new THREE.Mesh(jointGeometry, jointMaterial);
        leftHipJoint.position.set(0.3, 1, 0);
        leftHipJoint.castShadow = true;
        leftHipJoint.receiveShadow = true;
        robot.add(leftHipJoint);
        
        const rightHipJoint = new THREE.Mesh(jointGeometry, jointMaterial);
        rightHipJoint.position.set(-0.3, 1, 0);
        rightHipJoint.castShadow = true;
        rightHipJoint.receiveShadow = true;
        robot.add(rightHipJoint);
        
        // Create base
        const baseGeometry = new THREE.CylinderGeometry(1, 1, 0.2, 16);
        const base = new THREE.Mesh(baseGeometry, jointMaterial);
        base.position.y = -0.1;
        base.castShadow = true;
        base.receiveShadow = true;
        robot.add(base);
        
        // Create animation mixer
        mixer = new THREE.AnimationMixer(robot);
        
        // Create animation tracks
        const times = [0, 1, 2];
        
        // Head rotation
        const headRotationTrack = new THREE.KeyframeTrack(
            'children[1].rotation[y]',
            times,
            [0, Math.PI / 4, 0]
        );
        
        // Arm rotation
        const leftArmRotationTrack = new THREE.KeyframeTrack(
            'children[4].rotation[x]',
            times,
            [0, Math.PI / 4, 0]
        );
        
        const rightArmRotationTrack = new THREE.KeyframeTrack(
            'children[5].rotation[x]',
            times,
            [0, -Math.PI / 4, 0]
        );
        
        // Create animation clip
        const clip = new THREE.AnimationClip('robotAnimation', 2, [
            headRotationTrack,
            leftArmRotationTrack,
            rightArmRotationTrack
        ]);
        
        // Play animation
        const action = mixer.clipAction(clip);
        action.play();
        
        return robot;
    }
    
    // Create spaceship model
    async function createSpaceshipModel() {
        // Create spaceship group
        const spaceship = new THREE.Group();
        
        // Create materials
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: 0x00ffff,
            metalness: 0.7,
            roughness: 0.2,
            emissive: 0x00ffff,
            emissiveIntensity: 0.3
        });
        
        const detailMaterial = new THREE.MeshStandardMaterial({
            color: 0x333333,
            metalness: 0.9,
            roughness: 0.1
        });
        
        const engineMaterial = new THREE.MeshStandardMaterial({
            color: 0xff00ff,
            emissive: 0xff00ff,
            emissiveIntensity: 0.8
        });
        
        // Create main body
        const bodyGeometry = new THREE.ConeGeometry(1, 3, 8);
        bodyGeometry.rotateX(Math.PI / 2);
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.castShadow = true;
        body.receiveShadow = true;
        spaceship.add(body);
        
        // Create cockpit
        const cockpitGeometry = new THREE.SphereGeometry(0.5, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
        cockpitGeometry.rotateX(Math.PI);
        const cockpit = new THREE.Mesh(cockpitGeometry, detailMaterial);
        cockpit.position.set(0, 0, -1.2);
        cockpit.castShadow = true;
        cockpit.receiveShadow = true;
        spaceship.add(cockpit);
        
        // Create wings
        const wingGeometry = new THREE.BoxGeometry(3, 0.1, 1);
        
        const leftWing = new THREE.Mesh(wingGeometry, bodyMaterial);
        leftWing.position.set(1, 0, 0);
        leftWing.castShadow = true;
        leftWing.receiveShadow = true;
        spaceship.add(leftWing);
        
        const rightWing = new THREE.Mesh(wingGeometry, bodyMaterial);
        rightWing.position.set(-1, 0, 0);
        rightWing.castShadow = true;
        rightWing.receiveShadow = true;
        spaceship.add(rightWing);
        
        // Create engines
        const engineGeometry = new THREE.CylinderGeometry(0.2, 0.3, 0.5, 16);
        
        const leftEngine = new THREE.Mesh(engineGeometry, detailMaterial);
        leftEngine.position.set(1.5, 0, 0.5);
        leftEngine.castShadow = true;
        leftEngine.receiveShadow = true;
        spaceship.add(leftEngine);
        
        const rightEngine = new THREE.Mesh(engineGeometry, detailMaterial);
        rightEngine.position.set(-1.5, 0, 0.5);
        rightEngine.castShadow = true;
        rightEngine.receiveShadow = true;
        spaceship.add(rightEngine);
        
        // Create engine glow
        const engineGlowGeometry = new THREE.CylinderGeometry(0.1, 0.2, 0.3, 16);
        
        const leftEngineGlow = new THREE.Mesh(engineGlowGeometry, engineMaterial);
        leftEngineGlow.position.set(1.5, 0, 0.8);
        spaceship.add(leftEngineGlow);
        
        const rightEngineGlow = new THREE.Mesh(engineGlowGeometry, engineMaterial);
        rightEngineGlow.position.set(-1.5, 0, 0.8);
        spaceship.add(rightEngineGlow);
        
        // Create animation mixer
        mixer = new THREE.AnimationMixer(spaceship);
        
        // Create animation tracks
        const times = [0, 1, 2];
        
        // Engine glow animation
        const leftEngineScaleTrack = new THREE.KeyframeTrack(
            'children[6].scale',
            times,
            [
                1, 1, 1,
                1.2, 1.2, 1.5,
                1, 1, 1
            ]
        );
        
        const rightEngineScaleTrack = new THREE.KeyframeTrack(
            'children[7].scale',
            times,
            [
                1, 1, 1,
                1.2, 1.2, 1.5,
                1, 1, 1
            ]
        );
        
        // Spaceship hover animation
        const positionTrack = new THREE.KeyframeTrack(
            '.position[y]',
            times,
            [0, 0.1, 0]
        );
        
        // Create animation clip
        const clip = new THREE.AnimationClip('spaceshipAnimation', 2, [
            leftEngineScaleTrack,
            rightEngineScaleTrack,
            positionTrack
        ]);
        
        // Play animation
        const action = mixer.clipAction(clip);
        action.play();
        
        return spaceship;
    }
    
    // Create city model
    async function createCityModel() {
        // Create city group
        const city = new THREE.Group();
        
        // Create materials
        const buildingMaterial = new THREE.MeshStandardMaterial({
            color: 0x00ffff,
            metalness: 0.7,
            roughness: 0.2,
            emissive: 0x00ffff,
            emissiveIntensity: 0.3
        });
        
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: 0x333333,
            metalness: 0.9,
            roughness: 0.1
        });
        
        const windowMaterial = new THREE.MeshStandardMaterial({
            color: 0xff00ff,
            emissive: 0xff00ff,
            emissiveIntensity: 0.8
        });
        
        // Create ground
        const groundGeometry = new THREE.BoxGeometry(10, 0.5, 10);
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.position.y = -0.25;
        ground.receiveShadow = true;
        city.add(ground);
        
        // Create buildings
        const buildingCount = 15;
        const buildings = [];
        
        for (let i = 0; i < buildingCount; i++) {
            // Random building properties
            const width = Math.random() * 0.5 + 0.5;
            const height = Math.random() * 3 + 1;
            const depth = Math.random() * 0.5 + 0.5;
            
            // Create building
            const buildingGeometry = new THREE.BoxGeometry(width, height, depth);
            const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
            
            // Position building
            const x = Math.random() * 8 - 4;
            const z = Math.random() * 8 - 4;
            building.position.set(x, height / 2, z);
            
            // Add shadows
            building.castShadow = true;
            building.receiveShadow = true;
            
            // Add building to city
            city.add(building);
            buildings.push(building);
            
            // Add windows
            const windowCount = Math.floor(height * 2);
            
            for (let j = 0; j < windowCount; j++) {
                const windowSize = 0.1;
                const windowGeometry = new THREE.BoxGeometry(windowSize, windowSize, 0.1);
                
                // Create windows on each side
                for (let k = 0; k < 4; k++) {
                    const windowMesh = new THREE.Mesh(windowGeometry, windowMaterial);
                    
                    // Position window
                    const windowY = j * 0.3 - height / 2 + 0.3;
                    let windowX = 0;
                    let windowZ = 0;
                    
                    switch (k) {
                        case 0: // Front
                            windowX = Math.random() * (width - windowSize) - (width - windowSize) / 2;
                            windowZ = depth / 2 + 0.01;
                            break;
                        case 1: // Back
                            windowX = Math.random() * (width - windowSize) - (width - windowSize) / 2;
                            windowZ = -depth / 2 - 0.01;
                            break;
                        case 2: // Left
                            windowX = width / 2 + 0.01;
                            windowZ = Math.random() * (depth - windowSize) - (depth - windowSize) / 2;
                            break;
                        case 3: // Right
                            windowX = -width / 2 - 0.01;
                            windowZ = Math.random() * (depth - windowSize) - (depth - windowSize) / 2;
                            break;
                    }
                    
                    windowMesh.position.set(windowX, windowY, windowZ);
                    
                    // Add window to building
                    building.add(windowMesh);
                }
            }
        }
        
        // Create animation mixer
        mixer = new THREE.AnimationMixer(city);
        
        // Create animation tracks for windows
        const tracks = [];
        const times = [0, 1, 2];
        
        // Animate random windows
        buildings.forEach((building, index) => {
            // Get windows (children of building)
            const windows = building.children;
            
            // Animate random windows
            for (let i = 0; i < windows.length; i += Math.floor(Math.random() * 3) + 1) {
                const window = windows[i];
                
                // Create intensity animation
                const intensityTrack = new THREE.KeyframeTrack(
                    `children[${index + 1}].children[${i}].material.emissiveIntensity`,
                    times,
                    [0.8, 0.2, 0.8]
                );
                
                tracks.push(intensityTrack);
            }
        });
        
        // Create animation clip
        const clip = new THREE.AnimationClip('cityAnimation', 2, tracks);
        
        // Play animation
        const action = mixer.clipAction(clip);
        action.play();
        
        return city;
    }
    
    // Update materials for current model
    function updateMaterials() {
        if (!currentModel) return;
        
        // Create material based on settings
        let material;
        const color = new THREE.Color(settings.materials.color);
        
        switch (settings.materials.type) {
            case 'standard':
                material = new THREE.MeshStandardMaterial({
                    color: color,
                    metalness: settings.materials.metalness,
                    roughness: settings.materials.roughness,
                    emissive: settings.materials.emissiveEnabled ? color : 0x000000,
                    emissiveIntensity: settings.materials.emissiveIntensity
                });
                break;
                
            case 'physical':
                material = new THREE.MeshPhysicalMaterial({
                    color: color,
                    metalness: settings.materials.metalness,
                    roughness: settings.materials.roughness,
                    emissive: settings.materials.emissiveEnabled ? color : 0x000000,
                    emissiveIntensity: settings.materials.emissiveIntensity,
                    clearcoat: 0.5,
                    clearcoatRoughness: 0.2
                });
                break;
                
            case 'toon':
                material = new THREE.MeshToonMaterial({
                    color: color,
                    emissive: settings.materials.emissiveEnabled ? color : 0x000000,
                    emissiveIntensity: settings.materials.emissiveIntensity
                });
                break;
                
            case 'wireframe':
                material = new THREE.MeshBasicMaterial({
                    color: color,
                    wireframe: true
                });
                break;
                
            case 'normal':
                material = new THREE.MeshNormalMaterial();
                break;
                
            default:
                material = new THREE.MeshStandardMaterial({
                    color: color,
                    metalness: settings.materials.metalness,
                    roughness: settings.materials.roughness,
                    emissive: settings.materials.emissiveEnabled ? color : 0x000000,
                    emissiveIntensity: settings.materials.emissiveIntensity
                });
        }
        
        // Apply material to model
        currentModel.traverse(function(node) {
            if (node.isMesh && !node.name.includes('window') && !node.name.includes('eye') && !node.name.includes('glow')) {
                node.material = material;
                node.castShadow = true;
                node.receiveShadow = true;
            }
        });
    }
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Update controls
        controls.update();
        
        // Update mixer if it exists
        if (mixer) {
            mixer.update(clock.getDelta());
        }
        
        // Update auto-rotation
        controls.autoRotate = settings.environment.autoRotate;
        
        // Render scene
        renderer.render(scene, camera);
    }
    
    // Handle window resize
    function onWindowResize() {
        camera.aspect = canvasContainer.clientWidth / canvasContainer.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
    }
    
    // Add event listeners for controls
    function addEventListeners() {
        // Model selection
        modelOptions.forEach(option => {
            option.addEventListener('click', function() {
                // Remove active class from all options
                modelOptions.forEach(opt => opt.classList.remove('active'));
                
                // Add active class to clicked option
                this.classList.add('active');
                
                // Load selected model
                const modelType = this.getAttribute('data-model');
                
                if (modelType === 'custom') {
                    // Trigger file input click
                    modelUpload.click();
                } else {
                    loadModel(modelType);
                }
            });
        });
        
        // Model upload
        modelUpload.addEventListener('change', function() {
            if (this.files.length > 0) {
                loadModel('custom');
            }
        });
        
        // Ambient Light Slider
        document.getElementById('ambient-light-slider').addEventListener('input', function(e) {
            settings.lighting.ambientIntensity = parseFloat(e.target.value);
            document.getElementById('ambient-light-value').textContent = settings.lighting.ambientIntensity.toFixed(2);
            updateLights();
        });
        
        // Directional Light Slider
        document.getElementById('directional-light-slider').addEventListener('input', function(e) {
            settings.lighting.directionalIntensity = parseFloat(e.target.value);
            document.getElementById('directional-light-value').textContent = settings.lighting.directionalIntensity.toFixed(1);
            updateLights();
        });
        
        // Light Color Picker
        document.getElementById('light-color-picker').addEventListener('input', function(e) {
            settings.lighting.color = e.target.value;
            updateLights();
        });
        
        // Shadows Toggle
        document.getElementById('show-shadows').addEventListener('change', function(e) {
            settings.lighting.shadows = e.target.checked;
            updateLights();
        });
        
        // Material Type
        document.getElementById('material-type').addEventListener('change', function(e) {
            settings.materials.type = e.target.value;
            updateMaterials();
        });
        
        // Material Color Picker
        document.getElementById('material-color-picker').addEventListener('input', function(e) {
            settings.materials.color = e.target.value;
            updateMaterials();
        });
        
        // Metalness Slider
        document.getElementById('metalness-slider').addEventListener('input', function(e) {
            settings.materials.metalness = parseFloat(e.target.value);
            document.getElementById('metalness-value').textContent = settings.materials.metalness.toFixed(2);
            updateMaterials();
        });
        
        // Roughness Slider
        document.getElementById('roughness-slider').addEventListener('input', function(e) {
            settings.materials.roughness = parseFloat(e.target.value);
            document.getElementById('roughness-value').textContent = settings.materials.roughness.toFixed(2);
            updateMaterials();
        });
        
        // Emissive Toggle
        document.getElementById('emissive-enabled').addEventListener('change', function(e) {
            settings.materials.emissiveEnabled = e.target.checked;
            updateMaterials();
        });
        
        // Emissive Intensity Slider
        document.getElementById('emissive-intensity-slider').addEventListener('input', function(e) {
            settings.materials.emissiveIntensity = parseFloat(e.target.value);
            document.getElementById('emissive-intensity-value').textContent = settings.materials.emissiveIntensity.toFixed(2);
            updateMaterials();
        });
        
        // Background Type
        document.getElementById('background-type').addEventListener('change', function(e) {
            settings.environment.backgroundType = e.target.value;
            updateBackground();
        });
        
        // Background Color Picker
        document.getElementById('background-color-picker').addEventListener('input', function(e) {
            settings.environment.backgroundColor = e.target.value;
            updateBackground();
        });
        
        // Auto Rotate Toggle
        document.getElementById('auto-rotate').addEventListener('change', function(e) {
            settings.environment.autoRotate = e.target.checked;
        });
        
        // Reset Button
        document.getElementById('reset-button').addEventListener('click', function() {
            // Reset settings to defaults
            settings.lighting.ambientIntensity = 0.3;
            settings.lighting.directionalIntensity = 1.0;
            settings.lighting.color = '#ffffff';
            settings.lighting.shadows = true;
            settings.materials.type = 'standard';
            settings.materials.color = '#00ffff';
            settings.materials.metalness = 0.5;
            settings.materials.roughness = 0.2;
            settings.materials.emissiveEnabled = true;
            settings.materials.emissiveIntensity = 0.3;
            settings.environment.backgroundType = 'color';
            settings.environment.backgroundColor = '#0d0d0d';
            settings.environment.autoRotate = true;
            
            // Update UI
            document.getElementById('ambient-light-slider').value = settings.lighting.ambientIntensity;
            document.getElementById('ambient-light-value').textContent = settings.lighting.ambientIntensity.toFixed(2);
            document.getElementById('directional-light-slider').value = settings.lighting.directionalIntensity;
            document.getElementById('directional-light-value').textContent = settings.lighting.directionalIntensity.toFixed(1);
            document.getElementById('light-color-picker').value = settings.lighting.color;
            document.getElementById('show-shadows').checked = settings.lighting.shadows;
            document.getElementById('material-type').value = settings.materials.type;
            document.getElementById('material-color-picker').value = settings.materials.color;
            document.getElementById('metalness-slider').value = settings.materials.metalness;
            document.getElementById('metalness-value').textContent = settings.materials.metalness.toFixed(2);
            document.getElementById('roughness-slider').value = settings.materials.roughness;
            document.getElementById('roughness-value').textContent = settings.materials.roughness.toFixed(2);
            document.getElementById('emissive-enabled').checked = settings.materials.emissiveEnabled;
            document.getElementById('emissive-intensity-slider').value = settings.materials.emissiveIntensity;
            document.getElementById('emissive-intensity-value').textContent = settings.materials.emissiveIntensity.toFixed(2);
            document.getElementById('background-type').value = settings.environment.backgroundType;
            document.getElementById('background-color-picker').value = settings.environment.backgroundColor;
            document.getElementById('auto-rotate').checked = settings.environment.autoRotate;
            
            // Update scene
            updateLights();
            updateBackground();
            updateMaterials();
            
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
            link.download = '3d-model-screenshot.png';
            link.click();
            
        });
    }
    
    // Initialize the scene
    init();
});
