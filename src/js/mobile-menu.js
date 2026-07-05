/**
 * Mobile Menu Handler
 * Manages hamburger menu interactions for mobile navigation
 */

export function initMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const menuOverlay = document.getElementById('mobile-menu-overlay');
    const menuPanel = document.getElementById('mobile-menu-panel');
    const menuLinks = document.querySelectorAll('.mobile-menu-link');

    if (!menuBtn || !menuOverlay || !menuPanel) {
        return; // Elements don't exist (likely on desktop)
    }

    // Toggle menu open/close
    function toggleMenu() {
        const isActive = menuBtn.classList.contains('active');
        
        if (isActive) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    function openMenu() {
        menuBtn.classList.add('active');
        menuOverlay.classList.add('active');
        menuPanel.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }

    function closeMenu() {
        menuBtn.classList.remove('active');
        menuOverlay.classList.remove('active');
        menuPanel.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }

    // Event listeners
    menuBtn.addEventListener('click', toggleMenu);
    menuOverlay.addEventListener('click', closeMenu);

    // Close menu when clicking a link
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menuBtn.classList.contains('active')) {
            closeMenu();
        }
    });
}
