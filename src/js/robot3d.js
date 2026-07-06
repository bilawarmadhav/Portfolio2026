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
    let robotHead = null;
    let robotNeck = null;
    let robotTorso = null;
    let eyes = [];
    let mixer = null;

    // Global tracking state - works across entire viewport
    let targetX = 0;
    let targetY = 0;
    let isTracking = false;

    // Smooth interpolation values
    let currentBodyRotationY = 0;
    let currentBodyRotationX = 0;
    let currentHeadRotationY = 0;
    let currentHeadRotationX = 0;

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

            // Find robot parts for articulation
            robot.traverse((child) => {
                if (child.isMesh) {
                    const name = child.name.toLowerCase();
                    
                    // Find head
                    if (name.includes('head') || name.includes('skull')) {
                        robotHead = child;
                        console.log('Found head:', child.name);
                    }
                    
                    // Find neck
                    if (name.includes('neck') || name.includes('cervical')) {
                        robotNeck = child;
                        console.log('Found neck:', child.name);
                    }
                    
                    // Find torso/body
                    if (name.includes('torso') || name.includes('body') || name.includes('chest') || name.includes('spine')) {
                        robotTorso = child;
                        console.log('Found torso:', child.name);
                    }
                    
                    // Find eyes
                    if (name.includes('eye') || 
                        name.includes('pupil') || 
                        name.includes('iris') ||
                        name === 'sphere' || 
                        name === 'circle') {
                        console.log('Found potential eye:', child.name);
                        eyes.push(child);
                    }
                }
            });

            // If no specific eyes found, try finding by geometry
            if (eyes.length === 0) {
                robot.traverse((child) => {
                    if (child.isMesh && child.geometry && child.geometry.type === 'SphereGeometry') {
                        console.log('Found sphere mesh as eye:', child.name);
                        eyes.push(child);
                    }
                });
            }

            console.log(`Found ${eyes.length} eye objects`);

            // Setup animations if available
            if (gltf.animations && gltf.animations.length) {
                mixer = new THREE.AnimationMixer(robot);
                gltf.animations.forEach((clip) => {
                    const action = mixer.clipAction(clip);
                    action.setEffectiveWeight(0.3); // Reduce animation strength for smoother tracking
                    action.play();
                });
            }
        },
        undefined,
        (error) => {
            console.error('Error loading robot model:', error);
        }
    );

    // Global mouse/touch tracking - works across ENTIRE viewport
    const updateTargetFromEvent = (clientX, clientY) => {
        // Get robot container position in viewport
        const robotRect = container.getBoundingClientRect();
        const robotCenterX = robotRect.left + robotRect.width / 2;
        const robotCenterY = robotRect.top + robotRect.height / 2;

        // Calculate vector from robot to cursor (anywhere on screen)
        const dx = clientX - robotCenterX;
        const dy = clientY - robotCenterY;

        // Normalize to viewport dimensions for consistent behavior
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Convert to normalized coordinates (-1 to 1)
        targetX = (dx / viewportWidth) * 2;
        targetY = -(dy / viewportHeight) * 2;  // Negative to fix inverted Y-axis

        isTracking = true;
    };

    // Desktop: Mouse tracking across entire document
    const handleMouseMove = (e) => {
        updateTargetFromEvent(e.clientX, e.clientY);
    };

    // Mobile: Touch tracking across entire document
    const handleTouchMove = (e) => {
        if (e.touches.length > 0) {
            const touch = e.touches[0];
            updateTargetFromEvent(touch.clientX, touch.clientY);
        }
    };

    const handleTouchStart = (e) => {
        if (e.touches.length > 0) {
            const touch = e.touches[0];
            updateTargetFromEvent(touch.clientX, touch.clientY);
        }
    };

    const handleTouchEnd = () => {
        isTracking = false;
        // Smoothly return to idle position
    };

    // Add global event listeners (entire document) with passive flag for better scroll performance
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    // Handle window resize with debouncing
    let resizeTimeout;
    const handleResize = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
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
                
                const targetSize = Math.min(width, height) * 0.7;
                const scale = targetSize / maxDim;
                robot.scale.set(scale, scale, scale);
            }
        }, 150);
    };
    
    window.addEventListener('resize', handleResize, { passive: true });
    handleResize();

    // Animation loop with smooth interpolation
    const clock = new THREE.Clock();
    
    function animate() {
        requestAnimationFrame(animate);

        const delta = clock.getDelta();

        // Update mixer for animations
        if (mixer) {
            mixer.update(delta);
        }

        if (robot) {
            // Calculate target rotations based on cursor position
            // Full viewport tracking with natural limits
            const targetBodyRotY = THREE.MathUtils.clamp(targetX * Math.PI * 0.4, -Math.PI * 0.3, Math.PI * 0.3);
            const targetBodyRotX = THREE.MathUtils.clamp(-targetY * 0.3, -0.4, 0.4);  // Added negative sign back
            const targetHeadRotY = THREE.MathUtils.clamp(targetX * Math.PI * 0.6, -Math.PI * 0.5, Math.PI * 0.5);
            const targetHeadRotX = THREE.MathUtils.clamp(-targetY * 0.5, -0.6, 0.6);  // Added negative sign back

            // Smooth interpolation (lerp) for natural movement
            const lerpFactor = isTracking ? 0.08 : 0.05;

            if (isTracking) {
                // Active tracking - smooth follow
                currentBodyRotationY += (targetBodyRotY - currentBodyRotationY) * lerpFactor;
                currentBodyRotationX += (targetBodyRotX - currentBodyRotationX) * lerpFactor;
                currentHeadRotationY += (targetHeadRotY - currentHeadRotationY) * lerpFactor * 1.5;
                currentHeadRotationX += (targetHeadRotX - currentHeadRotationX) * lerpFactor * 1.5;

                // Apply rotations to robot body
                robot.rotation.y = currentBodyRotationY;
                robot.rotation.x = currentBodyRotationX;

                // Apply additional rotation to head if available
                if (robotHead) {
                    robotHead.rotation.y = (currentHeadRotationY - currentBodyRotationY) * 0.5;
                    robotHead.rotation.x = (currentHeadRotX - currentBodyRotationX) * 0.5;
                }

                if (robotNeck) {
                    robotNeck.rotation.y = (currentHeadRotationY - currentBodyRotationY) * 0.3;
                    robotNeck.rotation.x = (currentHeadRotX - currentBodyRotationX) * 0.3;
                }

                // Keep Y position stable during tracking
                robot.position.y = -1.2;
            } else {
                // Return to idle position smoothly
                currentBodyRotationY += (0 - currentBodyRotationY) * lerpFactor;
                currentBodyRotationX += (0 - currentBodyRotationX) * lerpFactor;
                currentHeadRotationY += (0 - currentHeadRotationY) * lerpFactor;
                currentHeadRotationX += (0 - currentHeadRotationX) * lerpFactor;

                robot.rotation.y = currentBodyRotationY;
                robot.rotation.x = currentBodyRotationX;

                if (robotHead) {
                    robotHead.rotation.y = 0;
                    robotHead.rotation.x = 0;
                }

                if (robotNeck) {
                    robotNeck.rotation.y = 0;
                    robotNeck.rotation.x = 0;
                }

                // Idle animation - gentle bobbing
                robot.position.y = -1.2 + Math.sin(Date.now() * 0.001) * 0.05;
                robot.rotation.y += 0.003;
            }

            // Eye tracking - independent of body rotation
            // Eyes ALWAYS track cursor position, even when over the robot
            if (eyes.length > 0 && (isTracking || Math.abs(targetX) > 0.01 || Math.abs(targetY) > 0.01)) {
                eyes.forEach(eye => {
                    if (eye.rotation) {
                        // Calculate eye rotation based on raw target position
                        // Eyes have wider range and more sensitivity
                        const eyeTargetY = THREE.MathUtils.clamp(targetX * Math.PI * 0.8, -Math.PI * 0.4, Math.PI * 0.4);
                        const eyeTargetX = THREE.MathUtils.clamp(-targetY * 0.8, -Math.PI * 0.3, Math.PI * 0.3);  // Added negative sign back
                        
                        // Smooth eye movement
                        eye.rotation.y += (eyeTargetY - eye.rotation.y) * 0.15;
                        eye.rotation.x += (eyeTargetX - eye.rotation.x) * 0.15;
                    }
                });
            } else if (eyes.length > 0 && !isTracking) {
                // Return eyes to center when not tracking
                eyes.forEach(eye => {
                    if (eye.rotation) {
                        eye.rotation.y += (0 - eye.rotation.y) * 0.1;
                        eye.rotation.x += (0 - eye.rotation.x) * 0.1;
                    }
                });
            }
        }

        renderer.render(scene, camera);
    }

    animate();

    // Cleanup
    return () => {
        window.removeEventListener('resize', handleResize);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('touchstart', handleTouchStart);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
        container.removeChild(renderer.domElement);
        renderer.dispose();
    };
}
