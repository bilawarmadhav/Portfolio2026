export function initNavigation() {
    // 1. Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 2. Pixel-Perfect Navbar Entrance and Hide-on-Scroll Logic (Using GSAP)
    const navbar = document.getElementById('navbar');
    const navContainer = document.getElementById('nav-container');

    if (!navbar || !navContainer) return;

    // Retrieve global GSAP instance loaded via CDN
    const gsapInstance = window.gsap;
    
    if (!gsapInstance) {
        console.warn("GSAP CDN not loaded yet. Falling back to CSS transitions.");
        // CSS Fallback: make navbar visible directly
        navbar.style.opacity = '1';
        navbar.style.transform = 'translateX(-50%) translateY(0) scale(1)';
        navbar.style.filter = 'blur(0px)';
        navbar.style.pointerEvents = 'auto';
        return;
    }

    // Set initial state matching requirements: opacity:0, scale:0.85, translateY:-40px, blur:10px
    gsapInstance.set(navbar, {
        xPercent: -50,
        y: -40,
        scale: 0.85,
        opacity: 0,
        filter: "blur(10px)",
        pointerEvents: "none"
    });

    // OPENING ANIMATION: Animate to scale: 1, translateY: 0, blur: 0, opacity: 1
    // Timing: 700ms (0.7s), Easing: cubic-bezier(0.22, 1, 0.36, 1) -> "power4.out"
    gsapInstance.to(navbar, {
        y: 0,
        scale: 1,
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.7,
        ease: "power4.out",
        pointerEvents: "auto",
        delay: 0.15
    });

    // Hide/Show on Scroll Variables
    let lastScrollY = window.scrollY;
    let isHidden = false;
    const scrollThreshold = 80; // Distance to scroll down before hiding

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        // Toggle chevron state line class (.scrolled) if scrolled down past 20px
        if (currentScrollY > 20) {
            navContainer.classList.add('scrolled');
        } else {
            navContainer.classList.remove('scrolled');
        }

        // Check scroll direction
        if (currentScrollY > lastScrollY && currentScrollY > scrollThreshold) {
            // Scrolling down -> Trigger CLOSING ANIMATION
            // Sequence: scale 1 -> 0.9, opacity fades, translate upward, blur increases, disappears.
            // Timing: 500ms (0.5s), Easing: same "power4.out"
            if (!isHidden) {
                isHidden = true;
                
                // If navbar is expanded, collapse it first before hiding
                if (navContainer.classList.contains('expanded')) {
                    navContainer.classList.remove('expanded');
                    navContainer.classList.add('collapsed');
                }

                gsapInstance.to(navbar, {
                    y: -40,
                    scale: 0.9,
                    opacity: 0,
                    filter: "blur(10px)",
                    duration: 0.5,
                    ease: "power4.out",
                    pointerEvents: "none"
                });
            }
        } else if (currentScrollY < lastScrollY) {
            // Scrolling up -> Trigger OPENING ANIMATION
            // Sequence: opacity:1, scale:1, translateY:0, blur:0. Timing: 700ms
            if (isHidden) {
                isHidden = false;
                
                gsapInstance.to(navbar, {
                    y: 0,
                    scale: 1,
                    opacity: 1,
                    filter: "blur(0px)",
                    duration: 0.7,
                    ease: "power4.out",
                    pointerEvents: "auto"
                });
            }
        }

        lastScrollY = currentScrollY;
    });
}
