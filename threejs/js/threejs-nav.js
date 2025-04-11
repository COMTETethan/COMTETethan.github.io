// ThreeJS Navigation Page JavaScript

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: false
        });
    }

    // Initialize ThreeJS preview scenes
    initPreview('preview1', createGeometryPreview);
    initPreview('preview2', createParticlePreview);
    initPreview('preview3', createModelPreview);
    initPreview('preview4', createEnvironmentPreview);

    // Function to initialize a preview container with a specific scene
    function initPreview(containerId, sceneCreator) {
        const container = document.getElementById(containerId);
        if (!container) return;

        // Create scene, camera, and renderer
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);
        
        // Call the specific scene creator function
        const animate = sceneCreator(scene, camera, renderer);
        
        // Handle window resize
        window.addEventListener('resize', function() {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        });
        
        // Start animation loop
        animate();
    }

    // Geometry Explorer Preview
    function createGeometryPreview(scene, camera, renderer) {
        // Set background
        scene.background = new THREE.Color(0x0d0d0d);
        
        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0x404040);
        scene.add(ambientLight);
        
        // Add directional light
        const directionalLight = new THREE.DirectionalLight(0x00ffff, 1);
        directionalLight.position.set(1, 1, 1);
        scene.add(directionalLight);
        
        // Add point light
        const pointLight = new THREE.PointLight(0xff00ff, 1, 100);
        pointLight.position.set(-2, 2, 3);
        scene.add(pointLight);
        
        // Create geometry group
        const geometryGroup = new THREE.Group();
        scene.add(geometryGroup);
        
        // Add cube
        const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
        const cubeMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x00ffff,
            metalness: 0.7,
            roughness: 0.2,
            emissive: 0x00ffff,
            emissiveIntensity: 0.2
        });
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.position.x = -1.5;
        geometryGroup.add(cube);
        
        // Add sphere
        const sphereGeometry = new THREE.SphereGeometry(0.7, 32, 32);
        const sphereMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xff00ff,
            metalness: 0.7,
            roughness: 0.2,
            emissive: 0xff00ff,
            emissiveIntensity: 0.2
        });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.x = 0;
        geometryGroup.add(sphere);
        
        // Add torus
        const torusGeometry = new THREE.TorusGeometry(0.5, 0.2, 16, 100);
        const torusMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x00ff00,
            metalness: 0.7,
            roughness: 0.2,
            emissive: 0x00ff00,
            emissiveIntensity: 0.2
        });
        const torus = new THREE.Mesh(torusGeometry, torusMaterial);
        torus.position.x = 1.5;
        geometryGroup.add(torus);
        
        // Position camera
        camera.position.z = 5;
        
        // Animation function
        return function animate() {
            requestAnimationFrame(animate);
            
            // Rotate geometries
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
            
            sphere.rotation.y += 0.01;
            
            torus.rotation.x += 0.01;
            torus.rotation.y += 0.01;
            
            // Rotate entire group
            geometryGroup.rotation.y += 0.005;
            
            renderer.render(scene, camera);
        };
    }

    // Particle System Preview
    function createParticlePreview(scene, camera, renderer) {
        // Set background
        scene.background = new THREE.Color(0x0d0d0d);
        
        // Create particles
        const particleCount = 1000;
        const particles = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount * 3; i += 3) {
            // Position
            positions[i] = (Math.random() - 0.5) * 10;
            positions[i + 1] = (Math.random() - 0.5) * 10;
            positions[i + 2] = (Math.random() - 0.5) * 10;
            
            // Color
            colors[i] = Math.random() * 0.5 + 0.5; // R
            colors[i + 1] = Math.random(); // G
            colors[i + 2] = Math.random() * 0.5 + 0.5; // B
        }
        
        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: true,
            transparent: true,
            opacity: 0.8
        });
        
        const particleSystem = new THREE.Points(particles, particleMaterial);
        scene.add(particleSystem);
        
        // Position camera
        camera.position.z = 5;
        
        // Animation function
        return function animate() {
            requestAnimationFrame(animate);
            
            // Animate particles
            const positions = particles.attributes.position.array;
            
            for (let i = 0; i < positions.length; i += 3) {
                // Create wave-like motion
                positions[i + 1] += Math.sin(Date.now() * 0.001 + positions[i] * 0.1) * 0.01;
                
                // Add slight rotation
                const x = positions[i];
                const z = positions[i + 2];
                const angle = 0.001;
                positions[i] = x * Math.cos(angle) - z * Math.sin(angle);
                positions[i + 2] = x * Math.sin(angle) + z * Math.cos(angle);
            }
            
            particles.attributes.position.needsUpdate = true;
            
            renderer.render(scene, camera);
        };
    }

    // 3D Model Viewer Preview
    function createModelPreview(scene, camera, renderer) {
        // Set background
        scene.background = new THREE.Color(0x0d0d0d);
        
        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0x404040);
        scene.add(ambientLight);
        
        // Add directional light
        const directionalLight = new THREE.DirectionalLight(0x00ffff, 1);
        directionalLight.position.set(1, 1, 1);
        scene.add(directionalLight);
        
        // Add point light
        const pointLight = new THREE.PointLight(0xff00ff, 1, 100);
        pointLight.position.set(-2, 2, 3);
        scene.add(pointLight);
        
        // Create a simple model (since we don't have actual GLTF models loaded)
        const group = new THREE.Group();
        scene.add(group);
        
        // Base
        const baseGeometry = new THREE.CylinderGeometry(1.2, 1.2, 0.2, 32);
        const baseMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x00ffff,
            metalness: 0.7,
            roughness: 0.2,
            emissive: 0x00ffff,
            emissiveIntensity: 0.2
        });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.y = -1;
        group.add(base);
        
        // Body
        const bodyGeometry = new THREE.CylinderGeometry(0.5, 0.8, 1.5, 32);
        const bodyMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xff00ff,
            metalness: 0.7,
            roughness: 0.2,
            emissive: 0xff00ff,
            emissiveIntensity: 0.2
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 0;
        group.add(body);
        
        // Head
        const headGeometry = new THREE.SphereGeometry(0.7, 32, 32);
        const headMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x00ff00,
            metalness: 0.7,
            roughness: 0.2,
            emissive: 0x00ff00,
            emissiveIntensity: 0.2
        });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 1.2;
        group.add(head);
        
        // Position camera
        camera.position.z = 5;
        camera.position.y = 1;
        
        // Animation function
        return function animate() {
            requestAnimationFrame(animate);
            
            // Rotate model
            group.rotation.y += 0.01;
            
            renderer.render(scene, camera);
        };
    }

    // Interactive Environment Preview
    function createEnvironmentPreview(scene, camera, renderer) {
        // Set background
        scene.background = new THREE.Color(0x0d0d0d);
        
        // Add fog
        scene.fog = new THREE.FogExp2(0x0d0d0d, 0.05);
        
        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0x404040);
        scene.add(ambientLight);
        
        // Add directional light (sun)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 7);
        directionalLight.castShadow = true;
        scene.add(directionalLight);
        
        // Create terrain
        const terrainGeometry = new THREE.PlaneGeometry(20, 20, 64, 64);
        
        // Modify terrain vertices to create hills
        const positions = terrainGeometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            const x = positions[i];
            const z = positions[i + 2];
            positions[i + 1] = Math.sin(x * 0.5) * Math.cos(z * 0.5) * 1.5;
        }
        
        terrainGeometry.computeVertexNormals();
        
        // Create terrain material with grid effect
        const terrainMaterial = new THREE.MeshStandardMaterial({
            color: 0x00ffff,
            wireframe: true,
            emissive: 0x00ffff,
            emissiveIntensity: 0.2
        });
        
        const terrain = new THREE.Mesh(terrainGeometry, terrainMaterial);
        terrain.rotation.x = -Math.PI / 2;
        terrain.position.y = -2;
        scene.add(terrain);
        
        // Add some objects to the scene
        const objects = new THREE.Group();
        scene.add(objects);
        
        // Create several glowing cubes
        for (let i = 0; i < 10; i++) {
            const size = Math.random() * 0.5 + 0.5;
            const geometry = new THREE.BoxGeometry(size, size, size);
            
            // Randomly choose color
            const colors = [0x00ffff, 0xff00ff, 0x00ff00];
            const colorIndex = Math.floor(Math.random() * colors.length);
            const color = colors[colorIndex];
            
            const material = new THREE.MeshStandardMaterial({
                color: color,
                metalness: 0.7,
                roughness: 0.2,
                emissive: color,
                emissiveIntensity: 0.5
            });
            
            const cube = new THREE.Mesh(geometry, material);
            
            // Random position
            cube.position.x = (Math.random() - 0.5) * 15;
            cube.position.y = Math.random() * 3;
            cube.position.z = (Math.random() - 0.5) * 15;
            
            // Random rotation
            cube.rotation.x = Math.random() * Math.PI;
            cube.rotation.y = Math.random() * Math.PI;
            
            // Store original position for animation
            cube.userData.originalY = cube.position.y;
            cube.userData.speed = Math.random() * 0.02 + 0.01;
            cube.userData.rotationSpeed = Math.random() * 0.02 + 0.01;
            
            objects.add(cube);
        }
        
        // Position camera
        camera.position.set(0, 3, 10);
        camera.lookAt(0, 0, 0);
        
        // Animation variables
        let cameraAngle = 0;
        
        // Animation function
        return function animate() {
            requestAnimationFrame(animate);
            
            // Rotate camera around the scene
            cameraAngle += 0.005;
            const radius = 12;
            camera.position.x = Math.sin(cameraAngle) * radius;
            camera.position.z = Math.cos(cameraAngle) * radius;
            camera.lookAt(0, 0, 0);
            
            // Animate objects
            objects.children.forEach(cube => {
                // Floating animation
                cube.position.y = cube.userData.originalY + Math.sin(Date.now() * 0.001 * cube.userData.speed) * 0.5;
                
                // Rotation
                cube.rotation.x += cube.userData.rotationSpeed;
                cube.rotation.y += cube.userData.rotationSpeed;
            });
            
            renderer.render(scene, camera);
        };
    }
});


document.querySelectorAll('.threejs-card-large').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.querySelector('.btn-primary').style.transform = 'translateY(0) scale(1.1)';
  });
  
  card.addEventListener('mouseleave', () => {
    card.querySelector('.btn-primary').style.transform = 'translateY(20px) scale(1)';
  });
});

document.querySelectorAll('.threejs-preview canvas').forEach(canvas => {
  canvas.style.pointerEvents = 'none';
});
