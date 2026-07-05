export function initCursorAndNav() {
    const cursorDot = document.getElementById('cursor-dot');
    const magneticElements = document.querySelectorAll('[data-magnetic]');
    const navContainer = document.getElementById('nav-container');
    
    if (!cursorDot || !navContainer) return;

    // Expand / Collapse Navbar
    const expandNav = () => {
        navContainer.classList.remove('collapsed');
        navContainer.classList.add('expanded');
    };

    const collapseNav = () => {
        navContainer.classList.remove('expanded');
        navContainer.classList.add('collapsed');
    };

    navContainer.addEventListener('mouseenter', expandNav);
    navContainer.addEventListener('mouseleave', collapseNav);
    navContainer.addEventListener('click', (e) => {
        if (e.target.closest('.nav-link')) return;
        if (navContainer.classList.contains('collapsed')) {
            expandNav();
        } else {
            collapseNav();
        }
    });

    // Custom Cursor with Spring Physics (Matching Framer Motion stiffness/damping)
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;
    let isMagnetic = false;
    
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    const render = () => {
        if (!isMagnetic) {
            // Spring physics lag (approximate to stiffness 400, damping 40)
            cursorX += (mouseX - cursorX) * 0.25;
            cursorY += (mouseY - cursorY) * 0.25;
            
            cursorDot.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%) scale(1)`;
            cursorDot.style.width = `8px`;
            cursorDot.style.height = `8px`;
            cursorDot.style.borderRadius = `9999px`;
        }
        requestAnimationFrame(render);
    };
    requestAnimationFrame(render);

    // Magnetic Pill Highlight
    magneticElements.forEach((el) => {
        el.addEventListener('mouseenter', () => {
            isMagnetic = true;
            cursorDot.classList.add('magnetic-active');
            
            const rect = el.getBoundingClientRect();
            // Snap to exact dimensions with a softer pill shape (rx: 8)
            cursorDot.style.width = `${rect.width}px`;
            cursorDot.style.height = `${rect.height}px`;
            cursorDot.style.borderRadius = `8px`;
            cursorDot.style.transform = `translate(${rect.left + rect.width / 2}px, ${rect.top + rect.height / 2}px) translate(-50%, -50%) scale(1.05)`;
        });

        el.addEventListener('mouseleave', () => {
            isMagnetic = false;
            cursorDot.classList.remove('magnetic-active');
            // Prevent jerking by syncing variables back to mouse instantly
            cursorX = mouseX;
            cursorY = mouseY;
        });
    });
}
