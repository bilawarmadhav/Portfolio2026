import skills from '../data/skills.json';

export async function renderSkills() {
    try {
        const grid = document.getElementById('skills-grid');
        if (!grid) return;

        // Group by row
        const row1 = skills.filter(s => s.row === 1);
        const row2 = skills.filter(s => s.row === 2);
        const row3 = skills.filter(s => s.row === 3);
        const row4 = skills.filter(s => s.row === 4);

        // Creates HTML for an icon with tooltip wrapper
        const renderIcon = (skill) => {
            const miniClass = skill.mini ? 'mini' : '';
            const colorStyle = skill.color ? `style="color: ${skill.color}"` : '';
            return `
                <div class="tech-icon-wrapper">
                    <div class="tech-icon ${miniClass}" ${colorStyle}>
                        <i class="${skill.iconClass}"></i>
                    </div>
                    ${skill.label ? `<span class="tech-tooltip">${skill.label}</span>` : ''}
                </div>
            `;
        };

        const html = `
            <div class="tech-row">
                ${row1.map(renderIcon).join('')}
            </div>

            <div class="tech-row">
                ${row2.slice(0, 2).map(renderIcon).join('')}

                <div class="tech-tagline-container">
                    <h2 class="tech-tagline text-white">Always Building,<br>Always Growing.</h2>
                </div>

                ${row2.slice(2).map(renderIcon).join('')}
            </div>

            <div class="tech-row">
                ${row3.map(renderIcon).join('')}
            </div>

            <div class="tech-row-bottom">
                ${row4.map(renderIcon).join('')}
            </div>
        `;

        grid.innerHTML = html;
        grid.style.overflow = 'visible';

        // Initialize physics after render (slight delay to let layout settle)
        setTimeout(initSkillsPhysics, 100);

    } catch (error) {
        console.error('Error loading skills:', error);
    }
}

function initSkillsPhysics() {
    const section = document.getElementById('skills');
    const widgets = Array.from(document.querySelectorAll('.tech-icon-wrapper'));
    if (!section || widgets.length === 0) return;

    // ── Tuning ───────────────────────────────────────────────────────────────
    const ATTRACT_RADIUS = window.innerWidth < 768 ? 120 : 180;  // smaller radius on mobile
    const ATTRACT_SPRING = 0.12; // how quickly each icon moves toward cursor
    const DAMPING        = 0.78; // velocity decay per frame
    const RETURN_SPRING  = 0.06; // how quickly icons return to origin

    let mouseX = 0;
    let mouseY = 0;
    let isInSection = false;

    const nodes = widgets.map(el => ({
        el,
        x: 0, y: 0,
        vx: 0, vy: 0,
        originX: 0, originY: 0,
    }));

    // ── Snapshot layout origins ──────────────────────────────────────────────
    const updateOrigins = () => {
        nodes.forEach(n => {
            n.el.style.transform = 'translate3d(0,0,0)';
            n.x = 0; n.y = 0; n.vx = 0; n.vy = 0;
        });
        void section.offsetHeight;
        nodes.forEach(n => {
            const r = n.el.getBoundingClientRect();
            n.originX = r.left + r.width  / 2 + window.scrollX;
            n.originY = r.top  + r.height / 2 + window.scrollY;
        });
    };

    updateOrigins();
    window.addEventListener('resize', updateOrigins);

    // ── Mouse tracking (desktop) ─────────────────────────────────────────────
    section.addEventListener('mouseenter', e => {
        isInSection = true;
        mouseX = e.pageX;
        mouseY = e.pageY;
    });
    section.addEventListener('mousemove', e => {
        mouseX = e.pageX;
        mouseY = e.pageY;
    });
    section.addEventListener('mouseleave', () => {
        isInSection = false;
    });

    // ── Touch tracking (mobile) ──────────────────────────────────────────────
    section.addEventListener('touchstart', e => {
        isInSection = true;
        const touch = e.touches[0];
        mouseX = touch.pageX;
        mouseY = touch.pageY;
    }, { passive: true });

    section.addEventListener('touchmove', e => {
        const touch = e.touches[0];
        mouseX = touch.pageX;
        mouseY = touch.pageY;
    }, { passive: true });

    section.addEventListener('touchend', () => {
        isInSection = false;
    }, { passive: true });

    new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) isInSection = false;
    }).observe(section);

    // ── Physics loop ─────────────────────────────────────────────────────────
    const loop = () => {
        nodes.forEach(n => {
            if (isInSection) {
                // Distance from cursor to this icon's current world position
                const worldX = n.originX + n.x;
                const worldY = n.originY + n.y;
                const dx = mouseX - worldX;
                const dy = mouseY - worldY;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < ATTRACT_RADIUS) {
                    // Attraction strength fades off with distance (closer = stronger pull)
                    const strength = (1 - dist / ATTRACT_RADIUS) * ATTRACT_SPRING;
                    n.vx += dx * strength;
                    n.vy += dy * strength;
                } else {
                    // Outside radius — spring back to origin
                    n.vx += (0 - n.x) * RETURN_SPRING;
                    n.vy += (0 - n.y) * RETURN_SPRING;
                }
            } else {
                // Cursor left — return all icons to origin
                n.vx += (0 - n.x) * RETURN_SPRING;
                n.vy += (0 - n.y) * RETURN_SPRING;
            }

            n.vx *= DAMPING;
            n.vy *= DAMPING;
            n.x  += n.vx;
            n.y  += n.vy;

            const moving = Math.abs(n.vx) > 0.01 || Math.abs(n.vy) > 0.01 ||
                           Math.abs(n.x)  > 0.1  || Math.abs(n.y)  > 0.1;

            if (moving) {
                n.el.style.transform  = `translate3d(${n.x}px,${n.y}px,0)`;
                n.el.style.willChange = 'transform';
            } else if (!isInSection) {
                n.x = 0; n.y = 0; n.vx = 0; n.vy = 0;
                n.el.style.transform  = 'translate3d(0,0,0)';
                n.el.style.willChange = 'auto';
            }
        });

        requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
}
