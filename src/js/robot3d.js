import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export function init3DRobot() {
    const container = document.getElementById('robot-3d-container');
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera
    const camera = new THREE.PerspectiveCamera(
        45,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );
    camera.position.set(0, 0, 5);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: true 
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight1.position.set(5, 5, 5);
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight2.position.set(-5, 3, -5);
    scene.add(directionalLight2);

    // Load robot model
    const loader = new GLTFLoader();
    let robot = null;
    let eyes = [];
    let mixer = null;

    loader.load(
        '/models/scene.gltf',
        (gltf) => {
            robot = gltf.scene;
            
            // Center and scale the model
            const box = new THREE.Box3().setFromObject(robot);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 3 / maxDim;
            robot.scale.multiplyScalar(scale);
            
            robot.position.sub(center.multiplyScalar(scale));
            robot.position.y = -1.2;
            
            scene.add(robot);

            // Find eye objects (search for common eye naming patterns)
            robot.traverse((child) => {
                if (child.isMesh) {
                    const name = child.name.toLowerCase();
                    if (name.includes('eye') || 
                        name.includes('pupil') || 
                        name.includes('iris') ||
                        name === 'sphere' || // Common eye mesh names
                        name === 'circle') {
                        console.log('Found potential eye:', child.name);
                        eyes.push(child);
                    }
                }
            });

            // If no eyes found, try finding by material/color (black spheres are often eyes)
            if (eyes.length === 0) {
                robot.traverse((child) => {
                    if (child.isMesh && child.geometry && child.geometry.type === 'SphereGeometry') {
                        console.log('Found sphere mesh:', child.name);
                        eyes.push(child);
                    }
                });
            }

            console.log(`Found ${eyes.length} eye objects`);

            // Setup animations if available
            if (gltf.animations && gltf.animations.length) {
                mixer = new THREE.AnimationMixer(robot);
                gltf.animations.forEach((clip) => {
                    mixer.clipAction(clip).play();
                });
            }
        },
        undefined,
        (error) => {
            console.error('Error loading robot model:', error);
        }
    );

    // Mouse tracking for rotation AND eye tracking (within hero section)
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationY = 0;
    let targetRotationX = 0;
    let isHovering = false;
    
    // Get hero section element
    const heroSection = document.querySelector('.hero');

    // Global mouse tracking for eyes (works within hero section boundaries)
    const handleGlobalMouseMove = (e) => {
        // Only track if we have a hero section
        if (!heroSection) return;
        
        // Get hero section boundaries
        const heroRect = heroSection.getBoundingClientRect();
        
        // Check if mouse is within hero section boundaries
        const isInHeroSection = (
            e.clientX >= heroRect.left &&
            e.clientX <= heroRect.right &&
            e.clientY >= heroRect.top &&
            e.clientY <= heroRect.bottom
        );
        
        // Track eyes only within hero section
        if (robot && eyes.length > 0 && isInHeroSection) {
            const robotRect = container.getBoundingClientRect();
            const robotCenterX = robotRect.left + robotRect.width / 2;
            const robotCenterY = robotRect.top + robotRect.height / 2;

            // Calculate vector from robot center to cursor
            const dx = e.clientX - robotCenterX;
            const dy = e.clientY - robotCenterY;

            // Use hero section dimensions for normalization
            const heroWidth = heroRect.width;
            const heroHeight = heroRect.height;
            
            // Horizontal angle (left-right eye movement)
            const normalizedX = dx / (heroWidth * 0.5);
            const angleH = Math.atan(normalizedX) * 2;
            
            // Vertical angle (up-down eye movement)
            const normalizedY = dy / (heroHeight * 0.5);
            const angleV = Math.atan(normalizedY) * 1.5;

            // Apply to all eye objects
            eyes.forEach(eye => {
                if (eye.rotation) {
                    const targetRotY = THREE.MathUtils.clamp(angleH, -Math.PI * 0.4, Math.PI * 0.4);
                    const targetRotX = THREE.MathUtils.clamp(angleV, -Math.PI * 0.25, Math.PI * 0.25);
                    
                    // Smooth lerp for natural eye movement
                    eye.rotation.y += (targetRotY - eye.rotation.y) * 0.12;
                    eye.rotation.x += (targetRotX - eye.rotation.x) * 0.12;
                }
            });
        }
    };

    // Local mouse tracking for robot body rotation (only when hovering)
    const handleLocalMouseMove = (e) => {
        if (!isHovering) return;

        const rect = container.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        mouseX = ((e.clientX - centerX) / rect.width) * 2;
        mouseY = ((e.clientY - centerY) / rect.height) * 2;

        targetRotationY = mouseX * Math.PI;
        targetRotationX = -mouseY * 0.3;
    };

    // Container hover states
    container.addEventListener('mouseenter', () => {
        isHovering = true;
    });

    container.addEventListener('mouseleave', () => {
        isHovering = false;
        targetRotationY = 0;
        targetRotationX = 0;
    });

    // Global mouse tracking for eyes (always active)
    document.addEventListener('mousemove', handleGlobalMouseMove);
    
    // Local mouse tracking for robot rotation (only when hovering)
    document.addEventListener('mousemove', handleLocalMouseMove);

    // Handle window resize
    const handleResize = () => {
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // Recalculate robot scale on resize
        if (robot) {
            const box = new THREE.Box3().setFromObject(robot);
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            
            // Adjust scale based on container size
            const targetSize = Math.min(width, height) * 0.7;
            const scale = targetSize / maxDim;
            robot.scale.set(scale, scale, scale);
        }
    };
    
    window.addEventListener('resize', handleResize);
    
    // Initial resize check
    handleResize();

    // Animation loop
    const clock = new THREE.Clock();
    
    function animate() {
        requestAnimationFrame(animate);

        const delta = clock.getDelta();

        // Update mixer for animations
        if (mixer) {
            mixer.update(delta);
        }

        // Smooth rotation for robot body
        if (robot) {
            robot.rotation.y += (targetRotationY - robot.rotation.y) * 0.1;
            robot.rotation.x += (targetRotationX - robot.rotation.x) * 0.1;

            // Idle animation - slight bobbing when not hovering
            if (!isHovering) {
                robot.position.y = -1.2 + Math.sin(Date.now() * 0.001) * 0.05;
                robot.rotation.y += 0.005;
            }
        }

        renderer.render(scene, camera);
    }

    animate();

    // Cleanup
    return () => {
        window.removeEventListener('resize', handleResize);
        document.removeEventListener('mousemove', handleGlobalMouseMove);
        document.removeEventListener('mousemove', handleLocalMouseMove);
        container.removeChild(renderer.domElement);
        renderer.dispose();
    };
}
