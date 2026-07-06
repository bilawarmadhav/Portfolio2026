export function initAnimations() {
    // Guard: wait for GSAP + ScrollTrigger to be available (loaded via CDN)
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn('[animations] GSAP or ScrollTrigger not loaded yet, retrying...');
        setTimeout(initAnimations, 100);
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Configure ScrollTrigger for better performance
    ScrollTrigger.config({
        autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load'
    });

    // ─────────────────────────────────────────────────────────────────────────
    // 1. SECTION-LEVEL SLIDE-UP REVEALS (.slide-up)
    //    Remove the old CSS class approach — GSAP sets from/to directly.
    // ─────────────────────────────────────────────────────────────────────────
    const slideUpEls = document.querySelectorAll('.slide-up');
    slideUpEls.forEach(el => {
        // Reset any CSS-driven initial state
        el.style.opacity = '0';
        el.style.transform = 'translate3d(0, 40px, 0)';

        ScrollTrigger.create({
            trigger: el,
            start: 'top 88%',
            once: true,
            onEnter: () => {
                gsap.to(el, {
                    opacity: 1,
                    y: 0,
                    duration: 0.9,
                    ease: 'power3.out',
                    clearProps: 'transform' // Clean up after animation
                });
            }
        });
    });

    // ─────────────────────────────────────────────────────────────────────────
    // 2. STAGGERED SLIDE-IN REVEALS FOR LIST ITEMS
    //    Applied to: project cards, timeline entries, contact cards, tech icons
    // ─────────────────────────────────────────────────────────────────────────

    // Helper: batch-observe a list of children with stagger
    function revealList(selector, options = {}) {
        const {
            fromX = 0,
            fromY = 40,
            stagger = 0.1,
            delay = 0,
            start = 'top 85%',
            alternating = false,
        } = options;

        const parent = document.querySelector(selector);
        if (!parent) return;

        const items = Array.from(parent.children);
        if (!items.length) return;

        // Pre-hide all items with GPU-accelerated properties
        gsap.set(items, { 
            opacity: 0, 
            x: alternating ? 0 : fromX, 
            y: fromY,
            force3D: true // Force GPU acceleration
        });

        items.forEach((item, i) => {
            if (alternating) {
                gsap.set(item, { x: i % 2 === 0 ? -60 : 60 });
            }
        });

        ScrollTrigger.create({
            trigger: parent,
            start,
            once: true,
            onEnter: () => {
                gsap.to(items, {
                    opacity: 1,
                    x: 0,
                    y: 0,
                    duration: 0.7,
                    ease: 'power3.out',
                    stagger,
                    delay,
                    force3D: true,
                    clearProps: 'transform' // Clean up after animation
                });
            }
        });
    }

    // Project cards — slide in from bottom with stagger
    revealList('#projects-grid', { fromY: 50, stagger: 0.08, start: 'top 82%' });

    // Timeline entries — alternating left/right slide
    revealList('#timeline-container', { alternating: true, stagger: 0.12, fromY: 0, start: 'top 80%' });

    // Contact cards — cascade from bottom
    revealList('.contact-cards', { fromY: 40, stagger: 0.1, start: 'top 85%' });

    // ─────────────────────────────────────────────────────────────────────────
    // 3. HEADING WORD STAGGER REVEALS
    //    Walks DOM childNodes so <span class="accent"> tags are PRESERVED.
    //    Only splits text nodes into word spans — HTML elements stay intact.
    // ─────────────────────────────────────────────────────────────────────────
    const headings = document.querySelectorAll('.experience-heading, .contact-heading, .section-heading');
    headings.forEach(heading => {
        // Collect all leaf nodes (text + elements) in order
        const childNodes = Array.from(heading.childNodes);
        heading.innerHTML = '';

        childNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                // Split plain text into individual word spans
                const parts = node.textContent.split(/(\s+)/);
                parts.forEach(part => {
                    if (part.trim()) {
                        const outer = document.createElement('span');
                        outer.className = 'word-reveal';
                        outer.style.cssText = 'display:inline-block; overflow:hidden; vertical-align:bottom';
                        const inner = document.createElement('span');
                        inner.style.display = 'inline-block';
                        inner.textContent = part;
                        outer.appendChild(inner);
                        heading.appendChild(outer);
                    } else {
                        // Preserve whitespace as a text node
                        heading.appendChild(document.createTextNode(part));
                    }
                });
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                // Wrap the entire element (e.g. <span class="accent">) as one word unit
                const outer = document.createElement('span');
                outer.className = 'word-reveal';
                outer.style.cssText = 'display:inline-block; overflow:hidden; vertical-align:bottom';
                const inner = document.createElement('span');
                inner.style.display = 'inline-block';
                inner.innerHTML = node.outerHTML; // preserve classes + content
                outer.appendChild(inner);
                heading.appendChild(outer);
            }
        });

        const wordSpans = heading.querySelectorAll('.word-reveal > span');
        gsap.set(wordSpans, { y: '110%', opacity: 0, force3D: true });

        ScrollTrigger.create({
            trigger: heading,
            start: 'top 88%',
            once: true,
            onEnter: () => {
                gsap.to(wordSpans, {
                    y: '0%',
                    opacity: 1,
                    duration: 0.7,
                    ease: 'power3.out',
                    stagger: 0.08,
                    force3D: true,
                    clearProps: 'transform'
                });
            }
        });
    });

    // ─────────────────────────────────────────────────────────────────────────
    // 4. LAPTOP LID SCRUB ANIMATION (Experience Section)
    //    The laptop lid rotates from closed (rotateX(-90)) to open (rotateX(0))
    //    as the user scrolls through the experience section.
    // ─────────────────────────────────────────────────────────────────────────
    initLaptopScrub();
}

function initLaptopScrub() {
    const experienceSection = document.getElementById('experience');
    if (!experienceSection) return;

    // ── Part references ─────────────────────────────────────────────────────
    const partScreen   = document.getElementById('part-screen');
    const partHinge    = document.getElementById('part-hinge');
    const partKeyboard = document.getElementById('part-keyboard');
    const partTrackpad = document.getElementById('part-trackpad');
    const partBase     = document.getElementById('part-base');

    const parts = [partScreen, partHinge, partKeyboard, partTrackpad, partBase].filter(Boolean);
    if (!parts.length) return;

    // ── Assembled state (start): all parts at origin ─────────────────────────
    gsap.set(parts, { x: 0, y: 0, rotation: 0, opacity: 1, force3D: true });

    // ── Exploded offsets for each part ───────────────────────────────────────
    // These define where each part flies TO during the explode phase
    const explodeTargets = [
        { el: partScreen,   x: -10,  y: -130, rotation: -18 },
        { el: partHinge,    x:  40,  y: -50,  rotation:  12 },
        { el: partKeyboard, x:  10,  y:  80,  rotation:   5 },
        { el: partTrackpad, x: -60,  y:  130, rotation: -10 },
        { el: partBase,     x:  50,  y:  60,  rotation:   8 },
    ].filter(t => t.el);

    // ── Build the scrubbed GSAP timeline ─────────────────────────────────────
    // Trigger on the first timeline entry so animation only starts once the
    // user actually scrolls to the experience content, not at section entry.
    const firstEntry = document.querySelector('#timeline-entries .timeline-entry') || experienceSection;

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: firstEntry,
            start: 'top center',        // fire when first entry hits viewport center
            end: () => `+=${experienceSection.offsetHeight * 0.6}`, // span 60% of section height
            scrub: 1.5,
            // markers: true,
        }
    });

    // Phase 1 (0 → 0.6): parts explode outward
    explodeTargets.forEach(({ el, x, y, rotation }) => {
        tl.to(el, {
            x, y, rotation,
            duration: 0.6,
            ease: 'power2.out',
            force3D: true
        }, 0);
    });

    // Phase 2 (0.6 → 1): parts reassemble back to origin
    explodeTargets.forEach(({ el }) => {
        tl.to(el, {
            x: 0, y: 0, rotation: 0,
            duration: 0.4,
            ease: 'power3.inOut',
            force3D: true
        }, 0.6);
    });
}
