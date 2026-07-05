export function initHeroTypewriter() {
    const el = document.getElementById('hero-role');
    if (!el) return;

    const words = ['Full Stack', 'Frontend', 'Backend', 'React'];
    let currentIndex = 0;
    let isDeleting = false;
    let currentText = '';
    let charIndex = 0;
    let delay = 120;

    const type = () => {
        const fullWord = words[currentIndex];

        if (!isDeleting) {
            currentText = fullWord.substring(0, charIndex + 1);
            charIndex++;
            delay = 120;
        } else {
            currentText = fullWord.substring(0, charIndex - 1);
            charIndex--;
            delay = 60;
        }

        el.textContent = currentText;

        if (!isDeleting && charIndex === fullWord.length) {
            delay = 2200;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            currentIndex = (currentIndex + 1) % words.length;
            delay = 300;
        }

        setTimeout(type, delay);
    };

    setTimeout(type, 800);
}

// Robot 360° Rotation + Eye Tracking
export function initRobotEyes() {
    const robot3d = document.querySelector('.robot-3d');
    const pupils = document.querySelectorAll('.pupil');
    const robotScene = document.querySelector('.robot-scene');
    
    if (!robot3d || pupils.length === 0 || !robotScene) return;

    let isDragging = false;
    let startX = 0;
    let currentRotationY = 0;
    let currentRotationX = 0;
    let targetRotationY = 0;
    let targetRotationX = 0;

    // Track mouse movement for rotation
    const handleMouseMove = (e) => {
        const rect = robotScene.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Calculate rotation based on cursor position relative to center
        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;

        // Map cursor position to rotation (-180 to 180 degrees)
        targetRotationY = (deltaX / rect.width) * 120; // Horizontal rotation
        targetRotationX = -(deltaY / rect.height) * 30; // Vertical tilt (limited)

        // Eye tracking - calculate angle from robot face to cursor
        const eyes = document.querySelector('.eyes');
        if (eyes) {
            const eyesRect = eyes.getBoundingClientRect();
            const eyesCenterX = eyesRect.left + eyesRect.width / 2;
            const eyesCenterY = eyesRect.top + eyesRect.height / 2;

            pupils.forEach(pupil => {
                const eye = pupil.parentElement;
                const eyeRect = eye.getBoundingClientRect();
                const eyeCenterX = eyeRect.left + eyeRect.width / 2;
                const eyeCenterY = eyeRect.top + eyeRect.height / 2;

                const dx = e.clientX - eyeCenterX;
                const dy = e.clientY - eyeCenterY;
                const angle = Math.atan2(dy, dx);
                const distance = Math.min(Math.sqrt(dx * dx + dy * dy), 100);

                // Constrain pupil movement
                const maxMove = 4;
                const moveX = Math.cos(angle) * Math.min(distance / 20, maxMove);
                const moveY = Math.sin(angle) * Math.min(distance / 20, maxMove);

                pupil.style.transform = `translate(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px))`;
            });
        }
    };

    // Smooth animation loop
    const animate = () => {
        // Smoothly interpolate to target rotation
        currentRotationY += (targetRotationY - currentRotationY) * 0.1;
        currentRotationX += (targetRotationX - currentRotationX) * 0.1;

        robot3d.style.transform = `rotateX(${currentRotationX}deg) rotateY(${currentRotationY}deg)`;
        requestAnimationFrame(animate);
    };

    // Start tracking on hover
    robotScene.addEventListener('mouseenter', () => {
        isDragging = true;
        document.addEventListener('mousemove', handleMouseMove);
    });

    robotScene.addEventListener('mouseleave', () => {
        isDragging = false;
        document.removeEventListener('mousemove', handleMouseMove);
        
        // Return to neutral position
        targetRotationY = 0;
        targetRotationX = 0;

        // Reset eyes to center
        pupils.forEach(pupil => {
            pupil.style.transform = 'translate(-50%, -50%)';
        });
    });

    // Start animation loop
    requestAnimationFrame(animate);
}
