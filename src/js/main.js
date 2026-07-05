// Import all CSS files to bundle them with Vite
import '../css/variables.css';
import '../css/reset.css';
import '../css/typography.css';
import '../css/utilities.css';
import '../css/animations.css';
import '../css/navbar.css';
import '../css/hero.css';
import '../css/skills.css';
import '../css/projects.css';
import '../css/stats.css';
import '../css/timeline.css';
import '../css/contact.css';
import '../css/footer.css';
import '../css/theme.css';
import '../css/responsive.css';

// Import JS modules
import { initTheme } from './theme.js';
import { initAnimations } from './animations.js';
import { initStats } from './stats.js';
import { renderProjects } from './projects.js';
import { renderTimeline } from './timeline.js';
import { renderSkills } from './skills.js';
import { renderSocials } from './socials.js';
import { initNavigation } from './navigation.js';
import { initCursorAndNav } from './cursor.js';
import { initHeroTypewriter } from './hero.js';
import { init3DRobot } from './robot3d.js';
import { initMobileMenu } from './mobile-menu.js';

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Initialize UI Interactions
    initTheme();
    initNavigation();
    initCursorAndNav();
    initHeroTypewriter();
    init3DRobot();
    initMobileMenu();
    
    // 2. Fetch and render dynamic content
    await Promise.all([
        renderSkills(),
        renderProjects(),
        renderTimeline(),
        renderSocials()
    ]);
    
    // 3. Initialize Animations (must be called after dynamic content is rendered)
    initAnimations();
    initStats();
});
