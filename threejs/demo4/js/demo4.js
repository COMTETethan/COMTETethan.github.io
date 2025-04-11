// Demo 4 - Interactive Terrain JavaScript

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // ThreeJS Variables
    let scene, camera, renderer, controls, fpControls;
    let terrain, water, particles;
    let stats, clock;
    let isWireframe = false;
    let isFlyMode = false;
    
    // Settings
    const settings = {
        terrain: {
            size: 100,
            resolution: 128,
            heightScale: 20,
            noiseScale: 3,
            type: 'mountains'
        },
        materials: {
            type: 'phong',
            useVertexColors: true,
            lowColor: '#0000ff',
            highColor: '#00ffff'
        },
        environment: {
            skyType: 'gradient',
            lightIntensity: 1.0,
            showFog: true,
            showParticles: false
        },
        water: {
            level: 5,
            color: '#00ffff',
            waveSpeed: 0.5,
            waveHeight: 0.5,
            isVisible: false
        }
    };
    
    // DOM Elements
    const canvasContainer = document.getElementById('canvas-container');
    
    // Initialize the scene
    function init() {
        // Create clock for animations
        clock = new THREE.Clock();
        
        // Create stats
        stats = new Stats();
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.top = '0px';
        stats.domElement.style.right = '0px';
        stats.domElement.style.zIndex = '100';
        canvasContainer.appendChild(stats.domElement);
        
        // Create scene
        scene = new THREE.Scene();
        
        // Create camera
        camera = new THREE.PerspectiveCamera(75, canvasContainer.clientWidth / canvasContainer.clientHeight, 0.1, 1000);
        camera.position.set(0, 30, 50);
        
        // Create renderer
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        canvasContainer.appendChild(renderer.domElement);
        
        // Add orbit controls
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.minDistance = 10;
        controls.maxDistance = 200;
        controls.maxPolarAngle = Math.PI / 2 - 0.1;
        
        // Add first person controls (disabled by default)
        fpControls = new THREE.FirstPersonControls(camera, renderer.domElement);
        fpControls.lookSpeed = 0.1;
        fpControls.movementSpeed = 20;
        fpControls.lookVertical = true;
        fpControls.constrainVertical = true;
        fpControls.verticalMin = 1.0;
        fpControls.verticalMax = 2.0;
        fpControls.enabled = false;
        
        // Setup environment
        setupEnvironment();
        
        // Generate initial terrain
        generateTerrain();
        
        // Add event listeners
        addEventListeners();
        
        // Start animation loop
        animate();
        
        // Handle window resize
        window.addEventListener('resize', onWindowResize);
    }
    
    // Setup environment (sky, lights, fog)
    function setupEnvironment() {
        // Update sky based on settings
        updateSky();
        
        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, settings.environment.lightIntensity);
        directionalLight.position.set(50, 100, 50);
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
        
        // Add fog if enabled
        if (settings.environment.showFog) {
            scene.fog = new THREE.FogExp2(0x000000, 0.005);
        }
        
        // Add particles if enabled
        if (settings.environment.showParticles) {
            addParticles();
        }
    }
    
    // Update sky based on settings
    function updateSky() {
        switch (settings.environment.skyType) {
            case 'gradient':
                // Create gradient texture
                const canvas = document.createElement('canvas');
                canvas.width = 2;
                canvas.height = 2;
                
                const context = canvas.getContext('2d');
                const gradient = context.createLinearGradient(0, 0, 0, 2);
                
                gradient.addColorStop(0, '#000033');
                gradient.addColorStop(1, '#0099cc');
                
                context.fillStyle = gradient;
                context.fillRect(0, 0, 2, 2);
                
                const texture = new THREE.CanvasTexture(canvas);
                scene.background = texture;
                
                // Update fog color
                if (scene.fog) {
                    scene.fog.color.set('#0099cc');
                }
                break;
                
            case 'night':
                scene.background = new THREE.Color('#000022');
                
                // Update fog color
                if (scene.fog) {
                    scene.fog.color.set('#000022');
                }
                break;
                
            case 'sunset':
                // Create gradient texture
                const sunsetCanvas = document.createElement('canvas');
                sunsetCanvas.width = 2;
                sunsetCanvas.height = 2;
                
                const sunsetContext = sunsetCanvas.getContext('2d');
                const sunsetGradient = sunsetContext.createLinearGradient(0, 0, 0, 2);
                
                sunsetGradient.addColorStop(0, '#ff9900');
                sunsetGradient.addColorStop(1, '#cc0066');
                
                sunsetContext.fillStyle = sunsetGradient;
                sunsetContext.fillRect(0, 0, 2, 2);
                
                const sunsetTexture = new THREE.CanvasTexture(sunsetCanvas);
                scene.background = sunsetTexture;
                
                // Update fog color
                if (scene.fog) {
                    scene.fog.color.set('#cc0066');
                }
                break;
                
            case 'alien':
                // Create gradient texture
                const alienCanvas = document.createElement('canvas');
                alienCanvas.width = 2;
                alienCanvas.height = 2;
                
                const alienContext = alienCanvas.getContext('2d');
                const alienGradient = alienContext.createLinearGradient(0, 0, 0, 2);
                
                alienGradient.addColorStop(0, '#330066');
                alienGradient.addColorStop(1, '#00ff99');
                
                alienContext.fillStyle = alienGradient;
                alienContext.fillRect(0, 0, 2, 2);
                
                const alienTexture = new THREE.CanvasTexture(alienCanvas);
                scene.background = alienTexture;
                
                // Update fog color
                if (scene.fog) {
                    scene.fog.color.set('#00ff99');
                }
                break;
                
            default:
                scene.background = new THREE.Color('#000033');
                
                // Update fog color
                if (scene.fog) {
                    scene.fog.color.set('#000033');
                }
        }
    }
    
    // Add atmospheric particles
    function addParticles() {
        // Remove existing particles if any
        if (particles) {
            scene.remove(particles);
        }
        
        // Create particle geometry
        const particleCount = 5000;
        const particleGeometry = new THREE.BufferGeometry();
        const particlePositions = new Float32Array(particleCount * 3);
        
        // Create particle positions
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            particlePositions[i3] = (Math.random() - 0.5) * settings.terrain.size * 2;
            particlePositions[i3 + 1] = Math.random() * settings.terrain.heightScale * 2;
            particlePositions[i3 + 2] = (Math.random() - 0.5) * settings.terrain.size * 2;
        }
        
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
        
        // Create particle material
        const particleMaterial = new THREE.PointsMaterial({
            color: 0x00ffff,
            size: 0.5,
            transparent: true,
            opacity: 0.5,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        
        // Create particle system
        particles = new THREE.Points(particleGeometry, particleMaterial);
        scene.add(particles);
    }
    
    // Generate terrain based on settings
    function generateTerrain() {
        // Show loading spinner
        document.querySelector('.loading').style.display = 'flex';
        
        // Remove existing terrain if any
        if (terrain) {
            scene.remove(terrain);
        }
        
        // Create terrain geometry
        const geometry = new THREE.PlaneGeometry(
            settings.terrain.size,
            settings.terrain.size,
            settings.terrain.resolution - 1,
            settings.terrain.resolution - 1
        );
        
        // Rotate to horizontal plane
        geometry.rotateX(-Math.PI / 2);
        
        // Get position attribute
        const position = geometry.attributes.position;
        
        // Create noise generator
        const noise = new THREE.ImprovedNoise();
        
        // Create vertex colors array
        const colors = [];
        
        // Apply noise to vertices
        for (let i = 0; i < position.count; i++) {
            const x = position.getX(i);
            const z = position.getZ(i);
            
            // Calculate height based on terrain type
            let height = 0;
            
            switch (settings.terrain.type) {
                case 'mountains':
                    height = generateMountainHeight(x, z, noise);
                    break;
                    
                case 'hills':
                    height = generateHillsHeight(x, z, noise);
                    break;
                    
                case 'canyon':
                    height = generateCanyonHeight(x, z, noise);
                    break;
                    
                case 'islands':
                    height = generateIslandsHeight(x, z, noise);
                    break;
                    
                case 'alien':
                    height = generateAlienHeight(x, z, noise);
                    break;
                    
                default:
                    height = generateMountainHeight(x, z, noise);
            }
            
            // Set vertex height
            position.setY(i, height);
            
            // Calculate color based on height
            if (settings.materials.useVertexColors) {
                const lowColor = new THREE.Color(settings.materials.lowColor);
                const highColor = new THREE.Color(settings.materials.highColor);
                
                // Normalize height between 0 and 1
                const normalizedHeight = Math.max(0, Math.min(1, height / settings.terrain.heightScale));
                
                // Interpolate between low and high color
                const color = new THREE.Color().lerpColors(lowColor, highColor, normalizedHeight);
                
                colors.push(color.r, color.g, color.b);
            }
        }
        
        // Add colors to geometry if using vertex colors
        if (settings.materials.useVertexColors) {
            geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        }
        
        // Compute normals for lighting
        geometry.computeVertexNormals();
        
        // Create material based on settings
        let material;
        
        switch (settings.materials.type) {
            case 'phong':
                material = new THREE.MeshPhongMaterial({
                    vertexColors: settings.materials.useVertexColors,
                    flatShading: false,
                    shininess: 0,
                    wireframe: isWireframe
                });
                break;
                
            case 'standard':
                material = new THREE.MeshStandardMaterial({
                    vertexColors: settings.materials.useVertexColors,
                    roughness: 0.8,
                    metalness: 0.2,
                    wireframe: isWireframe
                });
                break;
                
            case 'toon':
                material = new THREE.MeshToonMaterial({
                    vertexColors: settings.materials.useVertexColors,
                    wireframe: isWireframe
                });
                break;
                
            case 'height':
                // Create height map material
                material = new THREE.MeshBasicMaterial({
                    vertexColors: true,
                    wireframe: isWireframe
                });
                
                // Override colors with height map
                const heightColors = [];
                
                for (let i = 0; i < position.count; i++) {
                    const height = position.getY(i);
                    
                    // Normalize height between 0 and 1
                    const normalizedHeight = Math.max(0, Math.min(1, height / settings.terrain.heightScale));
                    
                    // Create color based on height
                    if (normalizedHeight < 0.2) {
                        // Deep blue for low areas
                        heightColors.push(0, 0, 0.5);
                    } else if (normalizedHeight < 0.4) {
                        // Light blue for medium-low areas
                        heightColors.push(0, 0.5, 1);
                    } else if (normalizedHeight < 0.6) {
                        // Green for medium areas
                        heightColors.push(0, 1, 0);
                    } else if (normalizedHeight < 0.8) {
                        // Brown for medium-high areas
                        heightColors.push(0.5, 0.25, 0);
                    } else {
                        // White for high areas
                        heightColors.push(1, 1, 1);
                    }
                }
                
                geometry.setAttribute('color', new THREE.Float32BufferAttribute(heightColors, 3));
                break;
                
            case 'normal':
                material = new THREE.MeshNormalMaterial({
                    wireframe: isWireframe
                });
                break;
                
            default:
                material = new THREE.MeshPhongMaterial({
                    vertexColors: settings.materials.useVertexColors,
                    wireframe: isWireframe
                });
        }
        
        // Create terrain mesh
        terrain = new THREE.Mesh(geometry, material);
        terrain.castShadow = true;
        terrain.receiveShadow = true;
        
        // Center terrain
        terrain.position.set(0, 0, 0);
        
        // Add terrain to scene
        scene.add(terrain);
        
        // Add water if enabled
        if (settings.water.isVisible) {
            addWater();
        }
        
        // Hide loading spinner
        document.querySelector('.loading').style.display = 'none';
        
        // Play sound effect
        playSound('success');
    }
    
    // Generate mountain height
    function generateMountainHeight(x, z, noise) {
        const scale = settings.terrain.noiseScale / 100;
        
        // Base noise
        let height = noise.noise(
            x * scale,
            z * scale,
            0
        );
        
        // Add multiple octaves of noise
        height += 0.5 * noise.noise(
            x * scale * 2,
            z * scale * 2,
            0.5
        );
        
        height += 0.25 * noise.noise(
            x * scale * 4,
            z * scale * 4,
            1
        );
        
        // Normalize and scale
        height = (height + 1) * 0.5 * settings.terrain.heightScale;
        
        return height;
    }
    
    // Generate rolling hills height
    function generateHillsHeight(x, z, noise) {
        const scale = settings.terrain.noiseScale / 100;
        
        // Smoother noise for hills
        let height = noise.noise(
            x * scale * 0.5,
            z * scale * 0.5,
            0
        );
        
        // Add smaller details
        height += 0.3 * noise.noise(
            x * scale,
            z * scale,
            0.5
        );
        
        // Normalize and scale (lower height for hills)
        height = (height + 1) * 0.5 * settings.terrain.heightScale * 0.7;
        
        return height;
    }
    
    // Generate canyon height
    function generateCanyonHeight(x, z, noise) {
        const scale = settings.terrain.noiseScale / 100;
        
        // Base noise
        let height = noise.noise(
            x * scale,
            z * scale,
            0
        );
        
        // Add canyon effect
        const distance = Math.sqrt(x * x + z * z) / settings.terrain.size;
        const canyonDepth = Math.sin(distance * Math.PI * 2) * 0.5 + 0.5;
        
        // Mix noise with canyon shape
        height = height * 0.5 + canyonDepth * 0.5;
        
        // Add details
        height += 0.2 * noise.noise(
            x * scale * 3,
            z * scale * 3,
            1
        );
        
        // Normalize and scale
        height = (height + 0.2) * settings.terrain.heightScale;
        
        return height;
    }
    
    // Generate islands height
    function generateIslandsHeight(x, z, noise) {
        const scale = settings.terrain.noiseScale / 100;
        
        // Base noise
        let height = noise.noise(
            x * scale,
            z * scale,
            0
        );
        
        // Add island effect (higher in center, lower at edges)
        const distance = Math.sqrt(x * x + z * z) / (settings.terrain.size * 0.5);
        const falloff = Math.max(0, 1 - distance);
        
        // Apply falloff to create islands
        height = height * falloff;
        
        // Add details
        height += 0.2 * noise.noise(
            x * scale * 3,
            z * scale * 3,
            1
        ) * falloff;
        
        // Normalize and scale
        height = height * settings.terrain.heightScale;
        
        return height;
    }
    
    // Generate alien landscape height
    function generateAlienHeight(x, z, noise) {
        const scale = settings.terrain.noiseScale / 100;
        
        // Base noise with different frequency
        let height = noise.noise(
            x * scale * 1.5,
            z * scale * 1.5,
            0.5
        );
        
        // Add weird formations
        height += 0.7 * Math.sin(x * scale * 2) * Math.cos(z * scale * 2);
        
        // Add crater-like structures
        const distance = Math.sqrt(x * x + z * z) / settings.terrain.size;
        height += Math.sin(distance * Math.PI * 8) * 0.2;
        
        // Add small details
        height += 0.1 * noise.noise(
            x * scale * 5,
            z * scale * 5,
            2
        );
        
        // Normalize and scale
        height = height * settings.terrain.heightScale;
        
        return height;
    }
    
    // Add water to the scene
    function addWater() {
        // Remove existing water if any
        if (water) {
            scene.remove(water);
        }
        
        // Create water geometry
        const waterGeometry = new THREE.PlaneGeometry(
            settings.terrain.size * 2,
            settings.terrain.size * 2
        );
        
        // Create water material
        const waterColor = new THREE.Color(settings.water.color);
        
        // Create water mesh using THREE.Water
        water = new THREE.Water(
            waterGeometry,
            {
                textureWidth: 512,
                textureHeight: 512,
                waterNormals: new THREE.TextureLoader().load(
                    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/waternormals.jpg',
                    function(texture) {
                        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                    }
                ),
                alpha: 0.8,
                sunDirection: new THREE.Vector3(0, 1, 0),
                sunColor: 0xffffff,
                waterColor: waterColor.getHex(),
                distortionScale: settings.water.waveHeight,
                fog: settings.environment.showFog
            }
        );
        
        // Rotate to horizontal plane
        water.rotation.x = -Math.PI / 2;
        
        // Position water at specified level
        water.position.y = settings.water.level;
        
        // Add water to scene
        scene.add(water);
    }
    
    // Toggle wireframe mode
    function toggleWireframe() {
        isWireframe = !isWireframe;
        
        if (terrain) {
            terrain.material.wireframe = isWireframe;
        }
        
        playSound('click');
    }
    
    // Toggle fly mode
    function toggleFlyMode() {
        isFlyMode = !isFlyMode;
        
        // Toggle between orbit and first person controls
        if (isFlyMode) {
            // Save orbit camera position
            const position = camera.position.clone();
            
            // Enable first person controls
            controls.enabled = false;
            fpControls.enabled = true;
            
            // Set first person camera position
            camera.position.copy(position);
            
            // Update first person controls
            fpControls.lookAt(0, 0, 0);
        } else {
            // Save first person camera position
            const position = camera.position.clone();
            
            // Enable orbit controls
            fpControls.enabled = false;
            controls.enabled = true;
            
            // Set orbit camera position
            camera.position.copy(position);
            
            // Update orbit controls
            controls.target.set(0, 0, 0);
        }
        
        playSound('click');
    }
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Update stats
        stats.update();
        
        // Get delta time
        const delta = clock.getDelta();
        
        // Update controls based on mode
        if (isFlyMode) {
            fpControls.update(delta);
        } else {
            controls.update();
        }
        
        // Update water if it exists
        if (water) {
            water.material.uniforms['time'].value += delta * settings.water.waveSpeed;
        }
        
        // Update particles if they exist
        if (particles) {
            particles.rotation.y += delta * 0.05;
        }
        
        // Render scene
        renderer.render(scene, camera);
    }
    
    // Handle window resize
    function onWindowResize() {
        camera.aspect = canvasContainer.clientWidth / canvasContainer.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
        
        // Update first person controls
        if (fpControls) {
            fpControls.handleResize();
        }
    }
    
    // Add event listeners for controls
    function addEventListeners() {
        // Terrain Size Slider
        document.getElementById('terrain-size-slider').addEventListener('input', function(e) {
            settings.terrain.size = parseInt(e.target.value);
            document.getElementById('terrain-size-value').textContent = settings.terrain.size;
        });
        
        // Terrain Resolution Slider
        document.getElementById('terrain-resolution-slider').addEventListener('input', function(e) {
            settings.terrain.resolution = parseInt(e.target.value);
            document.getElementById('terrain-resolution-value').textContent = settings.terrain.resolution;
        });
        
        // Terrain Height Slider
        document.getElementById('terrain-height-slider').addEventListener('input', function(e) {
            settings.terrain.heightScale = parseInt(e.target.value);
            document.getElementById('terrain-height-value').textContent = settings.terrain.heightScale;
        });
        
        // Noise Scale Slider
        document.getElementById('noise-scale-slider').addEventListener('input', function(e) {
            settings.terrain.noiseScale = parseFloat(e.target.value);
            document.getElementById('noise-scale-value').textContent = settings.terrain.noiseScale.toFixed(1);
        });
        
        // Terrain Type
        document.getElementById('terrain-type').addEventListener('change', function(e) {
            settings.terrain.type = e.target.value;
            playSound('click');
        });
        
        // Material Type
        document.getElementById('material-type').addEventListener('change', function(e) {
            settings.materials.type = e.target.value;
            playSound('click');
        });
        
        // Use Vertex Colors Toggle
        document.getElementById('use-vertex-colors').addEventListener('change', function(e) {
            settings.materials.useVertexColors = e.target.checked;
            playSound('click');
        });
        
        // Low Color Picker
        document.getElementById('low-color').addEventListener('input', function(e) {
            settings.materials.lowColor = e.target.value;
        });
        
        // High Color Picker
        document.getElementById('high-color').addEventListener('input', function(e) {
            settings.materials.highColor = e.target.value;
        });
        
        // Sky Type
        document.getElementById('sky-type').addEventListener('change', function(e) {
            settings.environment.skyType = e.target.value;
            updateSky();
            playSound('click');
        });
        
        // Light Intensity Slider
        document.getElementById('light-intensity-slider').addEventListener('input', function(e) {
            settings.environment.lightIntensity = parseFloat(e.target.value);
            document.getElementById('light-intensity-value').textContent = settings.environment.lightIntensity.toFixed(1);
            
            // Update directional light
            scene.children.forEach(child => {
                if (child instanceof THREE.DirectionalLight) {
                    child.intensity = settings.environment.lightIntensity;
                }
            });
        });
        
        // Show Fog Toggle
        document.getElementById('show-fog').addEventListener('change', function(e) {
            settings.environment.showFog = e.target.checked;
            
            if (settings.environment.showFog) {
                // Add fog
                scene.fog = new THREE.FogExp2(0x000000, 0.005);
                
                // Update fog color based on sky
                updateSky();
            } else {
                // Remove fog
                scene.fog = null;
            }
            
            // Update water fog setting if water exists
            if (water) {
                water.material.fog = settings.environment.showFog;
            }
            
            playSound('click');
        });
        
        // Show Particles Toggle
        document.getElementById('show-particles').addEventListener('change', function(e) {
            settings.environment.showParticles = e.target.checked;
            
            if (settings.environment.showParticles) {
                addParticles();
            } else if (particles) {
                scene.remove(particles);
                particles = null;
            }
            
            playSound('click');
        });
        
        // Water Level Slider
        document.getElementById('water-level-slider').addEventListener('input', function(e) {
            settings.water.level = parseFloat(e.target.value);
            document.getElementById('water-level-value').textContent = settings.water.level.toFixed(1);
            
            // Update water position if it exists
            if (water) {
                water.position.y = settings.water.level;
            }
        });
        
        // Water Color Picker
        document.getElementById('water-color').addEventListener('input', function(e) {
            settings.water.color = e.target.value;
            
            // Update water color if it exists
            if (water) {
                water.material.uniforms['waterColor'].value = new THREE.Color(settings.water.color);
            }
        });
        
        // Wave Speed Slider
        document.getElementById('wave-speed-slider').addEventListener('input', function(e) {
            settings.water.waveSpeed = parseFloat(e.target.value);
            document.getElementById('wave-speed-value').textContent = settings.water.waveSpeed.toFixed(1);
        });
        
        // Wave Height Slider
        document.getElementById('wave-height-slider').addEventListener('input', function(e) {
            settings.water.waveHeight = parseFloat(e.target.value);
            document.getElementById('wave-height-value').textContent = settings.water.waveHeight.toFixed(1);
            
            // Update water distortion if it exists
            if (water) {
                water.material.uniforms['distortionScale'].value = settings.water.waveHeight;
            }
        });
        
        // Generate Terrain Button
        document.getElementById('generate-terrain').addEventListener('click', function() {
            generateTerrain();
        });
        
        // Toggle Wireframe Button
        document.getElementById('toggle-wireframe').addEventListener('click', function() {
            toggleWireframe();
        });
        
        // Add Water Button
        document.getElementById('add-water').addEventListener('click', function() {
            settings.water.isVisible = !settings.water.isVisible;
            
            if (settings.water.isVisible) {
                addWater();
                this.textContent = 'Remove Water';
            } else {
                if (water) {
                    scene.remove(water);
                    water = null;
                }
                this.textContent = 'Add Water';
            }
            
            playSound('click');
        });
        
        // Toggle Fly Mode Button
        document.getElementById('toggle-fly').addEventListener('click', function() {
            toggleFlyMode();
            
            if (isFlyMode) {
                this.textContent = 'Exit Fly Mode';
            } else {
                this.textContent = 'Toggle Fly Mode';
            }
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
            link.download = 'terrain-screenshot.png';
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
