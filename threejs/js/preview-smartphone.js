// 3D Smartphone Model Generator
document.addEventListener('DOMContentLoaded', function() {
    // Create a scene
    const scene = new THREE.Scene();
    
    // Create a camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // Create a renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    document.getElementById('preview3').appendChild(renderer.domElement);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Create smartphone model
    const smartphone = createSmartphone();
    scene.add(smartphone);
    
    // Add orbit controls
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false;
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Rotate smartphone
        smartphone.rotation.y += 0.01;
        
        controls.update();
        renderer.render(scene, camera);
    }
    
    // Create smartphone model
    function createSmartphone() {
        const group = new THREE.Group();
        
        // Phone body
        const bodyGeometry = new THREE.BoxGeometry(2, 4, 0.2);
        const bodyMaterial = new THREE.MeshPhongMaterial({
            color: 0x333333,
            specular: 0x111111,
            shininess: 100
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        group.add(body);
        
        // Screen
        const screenGeometry = new THREE.BoxGeometry(1.9, 3.8, 0.05);
        const screenMaterial = new THREE.MeshPhongMaterial({
            color: 0x0088ff,
            emissive: 0x0088ff,
            emissiveIntensity: 0.2,
            specular: 0xffffff,
            shininess: 100
        });
        const screen = new THREE.Mesh(screenGeometry, screenMaterial);
        screen.position.z = 0.1;
        group.add(screen);
        
        // Camera lens
        const lensGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.05, 32);
        const lensMaterial = new THREE.MeshPhongMaterial({
            color: 0x111111,
            specular: 0x555555,
            shininess: 100
        });
        const lens = new THREE.Mesh(lensGeometry, lensMaterial);
        lens.rotation.x = Math.PI / 2;
        lens.position.set(0.5, 1.5, -0.15);
        group.add(lens);
        
        // Home button
        const buttonGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.05, 32);
        const buttonMaterial = new THREE.MeshPhongMaterial({
            color: 0x222222,
            specular: 0x555555,
            shininess: 100
        });
        const button = new THREE.Mesh(buttonGeometry, buttonMaterial);
        button.rotation.x = Math.PI / 2;
        button.position.set(0, -1.8, 0.1);
        group.add(button);
        
        return group;
    }
    
    // Handle window resize
    window.addEventListener('resize', function() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
    // Start animation
    animate();
});
