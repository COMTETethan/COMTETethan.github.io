document.addEventListener('DOMContentLoaded', function() {
    let scene, camera, renderer, controls;
    let currentObject, lights = [];
    
    const settings = {
        geometry: {
            type: 'box',
            size: 1.0,
            detail: 32
        },
        material: {
            type: 'standard',
            color: '#00ffff',
            metalness: 0.5,
            roughness: 0.2,
            emissiveIntensity: 0.3
        },
        animation: {
            rotationSpeed: 0.01,
            autoRotate: true
        },
        environment: {
            backgroundColor: '#0d0d0d',
            lightIntensity: 1.0
        }
    };
    
    const canvasContainer = document.getElementById('canvas-container');
    
    function init() {
        scene = new THREE.Scene();
        scene.background = new THREE.Color(settings.environment.backgroundColor);
        
        camera = new THREE.PerspectiveCamera(75, canvasContainer.clientWidth / canvasContainer.clientHeight, 0.1, 1000);
        camera.position.z = 5;
        
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        canvasContainer.appendChild(renderer.domElement);
        
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        
        addLights();
        
        createObject();
        
        addEventListeners();
        
        animate();
        
        window.addEventListener('resize', onWindowResize);
    }
    
    function addLights() {
        const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        scene.add(ambientLight);
        lights.push(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, settings.environment.lightIntensity);
        directionalLight.position.set(1, 1, 1);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 1024;
        directionalLight.shadow.mapSize.height = 1024;
        scene.add(directionalLight);
        lights.push(directionalLight);
        
        const pointLight1 = new THREE.PointLight(0x00ffff, settings.environment.lightIntensity * 0.5, 10);
        pointLight1.position.set(-2, 2, 3);
        scene.add(pointLight1);
        lights.push(pointLight1);
        
        const pointLight2 = new THREE.PointLight(0xff00ff, settings.environment.lightIntensity * 0.5, 10);
        pointLight2.position.set(2, -2, -3);
        scene.add(pointLight2);
        lights.push(pointLight2);
    }
    
    function updateLightIntensity() {
        lights[1].intensity = settings.environment.lightIntensity;
        lights[2].intensity = settings.environment.lightIntensity * 0.5;
        lights[3].intensity = settings.environment.lightIntensity * 0.5;
    }
    
    function createObject() {
        if (currentObject) {
            scene.remove(currentObject);
        }
        
        let geometry;
        let size = settings.geometry.size;
        let detail = settings.geometry.detail;
        switch (settings.geometry.type) {
            case 'box':
                geometry = new THREE.BoxGeometry(size, size, size);
                break;
            case 'sphere':
                geometry = new THREE.SphereGeometry(
                    size * 0.7,
                    detail,
                    detail
                );
                break;
            case 'plane':
                geometry = new THREE.PlaneGeometry(size, size * 0.5, detail, detail);
                break;
            case 'triangle':
                geometry = new THREE.BufferGeometry();
                const vertices = new Float32Array([
                    0, size, 0, 
                    -size, -size, 0,
                    size, -size, 0
                ]);
                geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
                break;
            case 'cone':
                geometry = new THREE.ConeGeometry(
                    size * 0.7,
                    size * 1.5,
                    detail
                );
                break;
            case 'cylinder':
                geometry = new THREE.CylinderGeometry(
                    size * 0.7,
                    size * 0.7,
                    size * 1.5,
                    detail
                );
                break;
            case 'torus':
                geometry = new THREE.TorusGeometry(
                    size * 0.7,
                    size * 0.3,
                    detail / 2,
                    detail
                );
                break;
            case 'torusKnot':
                geometry = new THREE.TorusKnotGeometry(
                    size * 0.6,
                    size * 0.2,
                    detail,
                    detail / 4
                );
                break;
            case 'icosahedron':
                geometry = new THREE.IcosahedronGeometry(
                    size * 0.7,
                    Math.floor(detail / 16)
                );
                break;
            default:
                geometry = new THREE.BoxGeometry(size, size, size);
        }
        
        let material;
        const color = new THREE.Color(settings.material.color);
        
        switch (settings.material.type) {
            case 'standard':
                material = new THREE.MeshStandardMaterial({
                    color: color,
                    metalness: settings.material.metalness,
                    roughness: settings.material.roughness,
                    emissive: color,
                    emissiveIntensity: settings.material.emissiveIntensity
                });
                break;
            case 'physical':
                material = new THREE.MeshPhysicalMaterial({
                    color: color,
                    metalness: settings.material.metalness,
                    roughness: settings.material.roughness,
                    emissive: color,
                    emissiveIntensity: settings.material.emissiveIntensity,
                    clearcoat: 0.5,
                    clearcoatRoughness: 0.2
                });
                break;
            case 'phong':
                material = new THREE.MeshPhongMaterial({
                    color: color,
                    shininess: (1 - settings.material.roughness) * 100,
                    emissive: color,
                    emissiveIntensity: settings.material.emissiveIntensity
                });
                break;
            case 'basic':
                material = new THREE.MeshBasicMaterial({
                    color: color
                });
                break;
            case 'wireframe':
                material = new THREE.MeshBasicMaterial({
                    color: color,
                    wireframe: true
                });
                break;
            default:
                material = new THREE.MeshStandardMaterial({
                    color: color,
                    metalness: settings.material.metalness,
                    roughness: settings.material.roughness,
                    emissive: color,
                    emissiveIntensity: settings.material.emissiveIntensity
                });
        }
        
        currentObject = new THREE.Mesh(geometry, material);
        currentObject.castShadow = true;
        currentObject.receiveShadow = true;
        scene.add(currentObject);
        
        playSound('success');
    }
    
    function animate() {
        requestAnimationFrame(animate);
        
        controls.update();
        
        if (settings.animation.autoRotate && currentObject) {
            currentObject.rotation.x += settings.animation.rotationSpeed;
            currentObject.rotation.y += settings.animation.rotationSpeed;
        }
        
        renderer.render(scene, camera);
    }
    
    function onWindowResize() {
        camera.aspect = canvasContainer.clientWidth / canvasContainer.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
    }
    
    function addEventListeners() {
        document.getElementById('geometry-type').addEventListener('change', function(e) {
            settings.geometry.type = e.target.value;
            createObject();
            playSound('click');
        });
        
        document.getElementById('size-slider').addEventListener('input', function(e) {
            settings.geometry.size = parseFloat(e.target.value);
            document.getElementById('size-value').textContent = settings.geometry.size.toFixed(1);
            createObject();
        });
        
        document.getElementById('detail-slider').addEventListener('input', function(e) {
            settings.geometry.detail = parseInt(e.target.value);
            document.getElementById('detail-value').textContent = settings.geometry.detail;
            createObject();
        });
        
        document.getElementById('material-type').addEventListener('change', function(e) {
            settings.material.type = e.target.value;
            createObject();
            playSound('click');
        });
        
        document.getElementById('color-picker').addEventListener('input', function(e) {
            settings.material.color = e.target.value;
            createObject();
        });
        
        document.getElementById('metalness-slider').addEventListener('input', function(e) {
            settings.material.metalness = parseFloat(e.target.value);
            document.getElementById('metalness-value').textContent = settings.material.metalness.toFixed(2);
            if (currentObject && currentObject.material.metalness !== undefined) {
                currentObject.material.metalness = settings.material.metalness;
                currentObject.material.needsUpdate = true;
            }
        });
        
        document.getElementById('roughness-slider').addEventListener('input', function(e) {
            settings.material.roughness = parseFloat(e.target.value);
            document.getElementById('roughness-value').textContent = settings.material.roughness.toFixed(2);
            if (currentObject && currentObject.material.roughness !== undefined) {
                currentObject.material.roughness = settings.material.roughness;
                currentObject.material.needsUpdate = true;
            }
        });
        
        document.getElementById('emissive-intensity-slider').addEventListener('input', function(e) {
            settings.material.emissiveIntensity = parseFloat(e.target.value);
            document.getElementById('emissive-intensity-value').textContent = settings.material.emissiveIntensity.toFixed(2);
            if (currentObject && currentObject.material.emissiveIntensity !== undefined) {
                currentObject.material.emissiveIntensity = settings.material.emissiveIntensity;
                currentObject.material.needsUpdate = true;
            }
        });
        
        document.getElementById('rotation-speed-slider').addEventListener('input', function(e) {
            settings.animation.rotationSpeed = parseFloat(e.target.value);
            document.getElementById('rotation-speed-value').textContent = settings.animation.rotationSpeed.toFixed(3);
        });
        
        document.getElementById('auto-rotate').addEventListener('change', function(e) {
            settings.animation.autoRotate = e.target.checked;
            playSound('click');
        });
        
        document.getElementById('background-color-picker').addEventListener('input', function(e) {
            settings.environment.backgroundColor = e.target.value;
            scene.background = new THREE.Color(settings.environment.backgroundColor);
        });
        
        document.getElementById('light-intensity-slider').addEventListener('input', function(e) {
            settings.environment.lightIntensity = parseFloat(e.target.value);
            document.getElementById('light-intensity-value').textContent = settings.environment.lightIntensity.toFixed(1);
            updateLightIntensity();
        });
        
        document.getElementById('reset-button').addEventListener('click', function() {
            settings.geometry.type = 'box';
            settings.geometry.size = 1.0;
            settings.geometry.detail = 32;
            settings.material.type = 'standard';
            settings.material.color = '#00ffff';
            settings.material.metalness = 0.5;
            settings.material.roughness = 0.2;
            settings.material.emissiveIntensity = 0.3;
            settings.animation.rotationSpeed = 0.01;
            settings.animation.autoRotate = true;
            settings.environment.backgroundColor = '#0d0d0d';
            settings.environment.lightIntensity = 1.0;
            
            document.getElementById('geometry-type').value = settings.geometry.type;
            document.getElementById('size-slider').value = settings.geometry.size;
            document.getElementById('size-value').textContent = settings.geometry.size.toFixed(1);
            document.getElementById('detail-slider').value = settings.geometry.detail;
            document.getElementById('detail-value').textContent = settings.geometry.detail;
            document.getElementById('material-type').value = settings.material.type;
            document.getElementById('color-picker').value = settings.material.color;
            document.getElementById('metalness-slider').value = settings.material.metalness;
            document.getElementById('metalness-value').textContent = settings.material.metalness.toFixed(2);
            document.getElementById('roughness-slider').value = settings.material.roughness;
            document.getElementById('roughness-value').textContent = settings.material.roughness.toFixed(2);
            document.getElementById('emissive-intensity-slider').value = settings.material.emissiveIntensity;
            document.getElementById('emissive-intensity-value').textContent = settings.material.emissiveIntensity.toFixed(2);
            document.getElementById('rotation-speed-slider').value = settings.animation.rotationSpeed;
            document.getElementById('rotation-speed-value').textContent = settings.animation.rotationSpeed.toFixed(3);
            document.getElementById('auto-rotate').checked = settings.animation.autoRotate;
            document.getElementById('background-color-picker').value = settings.environment.backgroundColor;
            document.getElementById('light-intensity-slider').value = settings.environment.lightIntensity;
            document.getElementById('light-intensity-value').textContent = settings.environment.lightIntensity.toFixed(1);
            
            scene.background = new THREE.Color(settings.environment.backgroundColor);
            updateLightIntensity();
            createObject();
            
            playSound('success');
        });
        
        document.getElementById('screenshot-button').addEventListener('click', function() {
            renderer.render(scene, camera);
            
            const dataURL = renderer.domElement.toDataURL('image/png');
            
            const link = document.createElement('a');
            link.href = dataURL;
            link.download = 'geometry-explorer-screenshot.png';
            link.click();
            
            playSound('success');
        });
    }
    
    function playSound(soundName) {
        if (window.sounds && window.sounds[soundName]) {
            const soundClone = window.sounds[soundName].cloneNode();
            soundClone.volume = 0.2;
            soundClone.play().catch(e => console.log("Audio play failed:", e));
        }
    }
    
    init();
});
