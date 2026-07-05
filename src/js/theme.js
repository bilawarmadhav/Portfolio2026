export function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    // Apply saved theme on load
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        themeToggle.innerHTML = '<i class="ri-sun-line"></i>';
    } else {
        themeToggle.innerHTML = '<i class="ri-moon-line"></i>';
    }

    themeToggle.addEventListener('click', () => {
        const isLight = document.body.classList.toggle('light-theme');

        if (isLight) {
            localStorage.setItem('theme', 'light');
            themeToggle.innerHTML = '<i class="ri-sun-line"></i>';
        } else {
            localStorage.setItem('theme', 'dark');
            themeToggle.innerHTML = '<i class="ri-moon-line"></i>';
        }
    });

    // Scroll-based blur for light theme nature background
    let ticking = false;
    
    const handleScroll = () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                const scrollThreshold = 200; // Start blurring after 200px scroll
                
                if (scrollY > scrollThreshold) {
                    document.body.classList.add('scrolled-blur');
                } else {
                    document.body.classList.remove('scrolled-blur');
                }
                
                ticking = false;
            });
            ticking = true;
        }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
}
