/**
 * Projects Card Stack with GSAP Animations
 */

import projectsData from '../data/projects.json';

let allProjects = [];
let currentFilter = 'All';
let visibleProjects = [];
let currentIndex = 0;
let isAnimating = false;

export async function renderProjects() {
    try {
        allProjects = projectsData;
        
        // Initialize with all projects
        filterProjects('All');
        renderStack();
        setupProjectFilters();
        setupNextButton();
        
    } catch (error) {
        console.error("Error loading projects:", error);
    }
}

function filterProjects(filter) {
    currentFilter = filter;
    
    if (filter === 'All') {
        visibleProjects = [...allProjects];
    } else {
        visibleProjects = allProjects.filter(p => p.category === filter);
    }
    
    currentIndex = 0;
}

function renderStack() {
    const stack = document.getElementById('projects-stack');
    if (!stack) return;
    
    // Clear existing cards
    stack.innerHTML = '';
    
    // Render top 3 cards in stack (or fewer if not enough projects)
    const cardsToShow = Math.min(3, visibleProjects.length);
    
    for (let i = 0; i < cardsToShow; i++) {
        const projectIndex = (currentIndex + i) % visibleProjects.length;
        const project = visibleProjects[projectIndex];
        const card = createCard(project, i);
        stack.appendChild(card);
    }
    
    // Animate cards into position
    animateStack();
    
    // Update button state
    updateButtonState();
}

function createCard(project, stackPosition) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.dataset.category = project.category;
    card.dataset.stackPosition = stackPosition;
    
    const techTagsHtml = project.tech && project.tech.length 
        ? `<div class="project-tech-tags">${project.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}</div>`
        : '';
    
    card.innerHTML = `
        <div class="thumbnail ${project.gradientClass}">
            <i class="${project.icon} placeholder-icon"></i>
            ${techTagsHtml}
        </div>
        <div class="project-info">
            <h3 class="project-title text-white">${project.title}</h3>
            <p class="project-desc">${project.description}</p>
            <div class="project-footer">
                <span class="project-status">
                    <span class="project-status-dot"></span>
                    In progress
                </span>
                <div class="project-links">
                    <a href="${project.github || '#'}" class="github-link" target="_blank" onclick="event.stopPropagation()">
                        <i class="ri-github-fill"></i> Source
                    </a>
                </div>
            </div>
        </div>
    `;
    
    return card;
}

function animateStack() {
    if (!window.gsap) return;
    
    const cards = document.querySelectorAll('.project-card');
    
    // Stack positions (bottom to top) - adjusted for smaller cards
    const positions = [
        { y: 10, scale: 1, zIndex: 3, opacity: 1 },       // Front card
        { y: -14, scale: 0.95, zIndex: 2, opacity: 0.8 }, // Second card
        { y: -38, scale: 0.9, zIndex: 1, opacity: 0.6 }   // Third card
    ];
    
    cards.forEach((card, index) => {
        const pos = positions[index] || positions[2];
        
        gsap.to(card, {
            y: pos.y,
            scale: pos.scale,
            zIndex: pos.zIndex,
            opacity: pos.opacity,
            duration: 0.5,
            ease: 'power2.out'
        });
    });
}

function nextCard() {
    if (isAnimating || visibleProjects.length === 0) return;
    
    isAnimating = true;
    const stack = document.getElementById('projects-stack');
    const cards = Array.from(stack.querySelectorAll('.project-card'));
    
    if (cards.length === 0) {
        isAnimating = false;
        return;
    }
    
    const frontCard = cards[0];
    
    // Animate front card out (down and fade) - adjusted distance for smaller cards
    gsap.to(frontCard, {
        y: 300,
        scale: 1,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.in',
        onComplete: () => {
            // Remove the front card
            frontCard.remove();
            
            // Update currentIndex to show next project
            currentIndex = (currentIndex + 1) % visibleProjects.length;
            
            // Add new card at the back if we have more projects
            if (visibleProjects.length >= 3) {
                const newProjectIndex = (currentIndex + 2) % visibleProjects.length;
                const newProject = visibleProjects[newProjectIndex];
                const newCard = createCard(newProject, 2);
                
                // Position new card at back initially
                gsap.set(newCard, {
                    y: -38,
                    scale: 0.9,
                    zIndex: 1,
                    opacity: 0
                });
                
                stack.appendChild(newCard);
                
                // Fade in new card
                gsap.to(newCard, {
                    opacity: 0.6,
                    duration: 0.4,
                    ease: 'power2.out'
                });
            }
            
            // Re-animate remaining cards to new positions
            animateStack();
            
            isAnimating = false;
        }
    });
}

function setupNextButton() {
    const btn = document.getElementById('next-card-btn');
    if (!btn) return;
    
    btn.addEventListener('click', () => {
        nextCard();
    });
    
    // Update button text if only 1 project
    updateButtonState();
}

function updateButtonState() {
    const btn = document.getElementById('next-card-btn');
    if (!btn) return;
    
    if (visibleProjects.length <= 1) {
        btn.style.opacity = '0.5';
        btn.style.cursor = 'not-allowed';
        btn.disabled = true;
    } else {
        btn.style.opacity = '1';
        btn.style.cursor = 'pointer';
        btn.disabled = false;
    }
}

function setupProjectFilters() {
    const tabs = document.querySelectorAll('.tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            if (isAnimating) return;
            
            // Update active state
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const filter = tab.dataset.filter;
            
            // Animate out all cards
            const cards = document.querySelectorAll('.project-card');
            gsap.to(cards, {
                y: 300,
                opacity: 0,
                duration: 0.4,
                ease: 'power2.in',
                stagger: 0.05,
                onComplete: () => {
                    // Filter and re-render
                    filterProjects(filter);
                    renderStack();
                }
            });
        });
    });
}
