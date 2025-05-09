document.addEventListener('DOMContentLoaded', function() {
    let scene, camera, renderer, controls;
    let currentModel, lights = [];
    let mixer, clock;
    
    const settings = {
        lighting: {
            ambientIntensity: 0.3,
            directionalIntensity: 1.0,
            color: '#ffffff',
            shadows: true
        },
        materials: {
            emissiveEnabled: true,
            color: '#00ffff',
            emissiveIntensity: 0.3
        },
        environment: {
            backgroundType: 'color',
            backgroundColor: '#0d0d0d',
            autoRotate: true
        }
    };
    
    const canvasContainer = document.getElementById('canvas-container');
    const modelOptions = document.querySelectorAll('.model-option');
    const modelUpload = document.getElementById('model-upload');
    
    function init() {
        clock = new THREE.Clock();
        
        scene = new THREE.Scene();
        updateBackground();
        
        camera = new THREE.PerspectiveCamera(75, canvasContainer.clientWidth / canvasContainer.clientHeight, 0.1, 1000);
        camera.position.z = 5;
        
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled = settings.lighting.shadows;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        canvasContainer.appendChild(renderer.domElement);
        
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.autoRotate = settings.environment.autoRotate;
        controls.autoRotateSpeed = 1.0;
        
        addLights();
        
        loadModel('sword');
        
        modelOptions[0].classList.add('active');
        
        addEventListeners();
        
        animate();
        
        window.addEventListener('resize', onWindowResize);
    }
    
    function addLights() {
        const ambientLight = new THREE.AmbientLight(
            settings.lighting.color, 
            settings.lighting.ambientIntensity
        );
        scene.add(ambientLight);
        lights.push(ambientLight);
        
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
    
    function updateLights() {
        const lightColor = new THREE.Color(settings.lighting.color);
        
        lights[0].color = lightColor;
        lights[0].intensity = settings.lighting.ambientIntensity;
        
        lights[1].color = lightColor;
        lights[1].intensity = settings.lighting.directionalIntensity;
        lights[1].castShadow = settings.lighting.shadows;
        
        lights[2].color = lightColor;
        lights[2].intensity = settings.lighting.directionalIntensity * 0.5;
        lights[2].castShadow = settings.lighting.shadows;
        
        renderer.shadowMap.enabled = settings.lighting.shadows;
    }
    
    function updateBackground() {
        switch (settings.environment.backgroundType) {
            case 'color':
                scene.background = new THREE.Color(settings.environment.backgroundColor);
                scene.fog = null;
                break;
                
            case 'gradient':
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
                
                if (scene.getObjectByName('gridHelper')) {
                    scene.remove(scene.getObjectByName('gridHelper'));
                }
                
                const gridHelper = new THREE.GridHelper(20, 20, 0x00ffff, 0x00ffff);
                gridHelper.material.opacity = 0.2;
                gridHelper.material.transparent = true;
                gridHelper.name = 'gridHelper';
                scene.add(gridHelper);
                
                scene.fog = new THREE.FogExp2(new THREE.Color(settings.environment.backgroundColor).getHex(), 0.05);
                break;
                
            default:
                scene.background = new THREE.Color(settings.environment.backgroundColor);
                scene.fog = null;
        }
    }
    
    function loadModel(modelType) {
        document.querySelector('.loading').style.display = 'flex';
        
        if (currentModel) {
            scene.remove(currentModel);
            currentModel = null;
        }
        
        mixer = null;
        
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ 
            color: 0x00ffff, 
            wireframe: true 
        });
        const placeholder = new THREE.Mesh(geometry, material);
        scene.add(placeholder);
        
        switch (modelType) {
            case 'sword':
                createSwordModel().then(model => {
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
                
            case 'well':
                createWellModel().then(model => {
                    scene.remove(placeholder);
                    currentModel = model;
                    scene.add(currentModel);
                    updateMaterials();
                    document.querySelector('.loading').style.display = 'none';
                });
                break;
                
            case 'custom':
                if (modelUpload.files.length > 0) {
                    const file = modelUpload.files[0];
                    const reader = new FileReader();
                    
                    reader.onload = function(event) {
                        const contents = event.target.result;
                        
                        const loader = new THREE.GLTFLoader();
                        const dracoLoader = new THREE.DRACOLoader();
                        dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
                        loader.setDRACOLoader(dracoLoader);
                        
                        loader.parse(contents, '', function(gltf) {
                            scene.remove(placeholder);
                            currentModel = gltf.scene;
                            
                            const box = new THREE.Box3().setFromObject(currentModel);
                            const center = box.getCenter(new THREE.Vector3());
                            currentModel.position.sub(center);
                            
                            const size = box.getSize(new THREE.Vector3());
                            const maxDim = Math.max(size.x, size.y, size.z);
                            if (maxDim > 5) {
                                const scale = 5 / maxDim;
                                currentModel.scale.set(scale, scale, scale);
                            }
                            
                            currentModel.traverse(function(node) {
                                if (node.isMesh) {
                                    node.castShadow = true;
                                    node.receiveShadow = true;
                                }
                            });
                            
                            scene.add(currentModel);
                            updateMaterials();
                            
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
                    createSwordModel().then(model => {
                        scene.remove(placeholder);
                        currentModel = model;
                        scene.add(currentModel);
                        updateMaterials();
                        document.querySelector('.loading').style.display = 'none';
                    });
                }
                break;
                
            default:
                createSwordModel().then(model => {
                    scene.remove(placeholder);
                    currentModel = model;
                    scene.add(currentModel);
                    updateMaterials();
                    document.querySelector('.loading').style.display = 'none';
                });
        }
    }
    
    async function checkFileExists(url) {
        try {
            const response = await fetch(url, { 
                method: 'HEAD',
                mode: 'no-cors'
            });
            return response.ok;
        } catch (error) {
            try {
                const response = await fetch(url, { 
                    method: 'GET',
                    mode: 'no-cors',
                    cache: 'no-store'
                });
                return true;
            } catch (e) {
                return false;
            }
        }
    }
    
    async function createSwordModel() {
        const possiblePaths = [
            '../models/elucidator_sword_art_online.glb',
            './models/elucidator_sword_art_online.glb',
            'models/elucidator_sword_art_online.glb'
        ];
        
        for (const path of possiblePaths) {
            if (await checkFileExists(path)) {
                return loadGLBModel(path);
            }
        }
        
        return loadGLBModel('../models/elucidator_sword_art_online.glb');
    }
    
    async function createWellModel() {
        const possiblePaths = [
            '../models/the_village_well.glb',
            './models/the_village_well.glb',
            'models/the_village_well.glb'
        ];
        
        for (const path of possiblePaths) {
            if (await checkFileExists(path)) {
                return loadGLBModel(path);
            }
        }
        
        return loadGLBModel('../models/the_village_well.glb');
    }
    
    async function createSpaceshipModel() {
        const possiblePaths = [
            '../models/spaceship_low_poly.glb',
            './models/spaceship_low_poly.glb',
            'models/spaceship_low_poly.glb'
        ];
        
        for (const path of possiblePaths) {
            if (await checkFileExists(path)) {
                return loadGLBModel(path);
            }
        }
        
        return loadGLBModel('../models/spaceship_low_poly.glb');
    }

    async function loadGLBModel(path) {
        return new Promise((resolve, reject) => {
            const loader = new THREE.GLTFLoader();
            const dracoLoader = new THREE.DRACOLoader();
            dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
            loader.setDRACOLoader(dracoLoader);
    
            loader.load(path, (glb) => {
                const model = glb.scene;
                
                model.traverse(node => {
                    if (node.isMesh) {
                        node.castShadow = true;
                        node.receiveShadow = true;
                    }
                });
    
                const box = new THREE.Box3().setFromObject(model);
                const center = box.getCenter(new THREE.Vector3());
                model.position.sub(center);
                
                const size = box.getSize(new THREE.Vector3());
                const maxDim = Math.max(size.x, size.y, size.z);
                const scale = 5 / maxDim;
                model.scale.set(scale, scale, scale);
    
                resolve(model);
            }, undefined, reject);
        });
    }
    
    function updateMaterials() {
        if (!currentModel) return;
        
        currentModel.traverse(function(node) {
            if (node.isMesh && node.material) {
                if (settings.materials.emissiveEnabled) {
                    if (Array.isArray(node.material)) {
                        node.material.forEach(mat => {
                            mat.emissive = new THREE.Color(settings.materials.color);
                            mat.emissiveIntensity = settings.materials.emissiveIntensity;
                        });
                    } else {
                        node.material.emissive = new THREE.Color(settings.materials.color);
                        node.material.emissiveIntensity = settings.materials.emissiveIntensity;
                    }
                } else {
                    if (Array.isArray(node.material)) {
                        node.material.forEach(mat => {
                            mat.emissive = new THREE.Color(0x000000);
                            mat.emissiveIntensity = 0;
                        });
                    } else {
                        node.material.emissive = new THREE.Color(0x000000);
                        node.material.emissiveIntensity = 0;
                    }
                }
                
                node.castShadow = true;
                node.receiveShadow = true;
            }
        });
    }
    
    function animate() {
        requestAnimationFrame(animate);
        
        controls.update();
        
        if (mixer) {
            mixer.update(clock.getDelta());
        }
        
        controls.autoRotate = settings.environment.autoRotate;
        
        renderer.render(scene, camera);
    }
    
    function onWindowResize() {
        camera.aspect = canvasContainer.clientWidth / canvasContainer.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
    }
    
    function addEventListeners() {
        modelOptions.forEach(option => {
            option.addEventListener('click', function() {
                modelOptions.forEach(opt => opt.classList.remove('active'));
                
                this.classList.add('active');
                
                const modelType = this.getAttribute('data-model');
                
                if (modelType === 'custom') {
                    modelUpload.click();
                } else {
                    loadModel(modelType);
                }
            });
        });
        
        modelUpload.addEventListener('change', function() {
            if (this.files.length > 0) {
                loadModel('custom');
            }
        });
        
        document.getElementById('emissive-enabled').addEventListener('change', function(e) {
            settings.materials.emissiveEnabled = e.target.checked;
            updateMaterials();
        });
        
        document.getElementById('emissive-color-picker').addEventListener('input', function(e) {
            settings.materials.color = e.target.value;
            updateMaterials();
        });
        
        document.getElementById('emissive-intensity-slider').addEventListener('input', function(e) {
            settings.materials.emissiveIntensity = parseFloat(e.target.value);
            document.getElementById('emissive-intensity-value').textContent = settings.materials.emissiveIntensity.toFixed(2);
            updateMaterials();
        });
    }
    
    init();
});
