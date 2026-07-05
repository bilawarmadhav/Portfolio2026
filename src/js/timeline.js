import experienceData from '../data/experience.json';

export async function renderTimeline() {
    try {
        const experiences = experienceData;
        
        const container = document.getElementById('timeline-container');
        if (!container) return;

        let html = `
            <div class="timeline-sticky-icon">
                <div class="mini-cube"></div>
            </div>
            <div class="timeline-entries" id="timeline-entries">`;

        
        experiences.forEach(exp => {
            let bulletsHtml = exp.bullets.map(b => `<li>${b}</li>`).join('');
            
            html += `
                <div class="timeline-entry">
                    <div class="timeline-dot"></div>
                    <h3 class="role-title">${exp.role} <span class="company-name">@ ${exp.company}</span></h3>
                    <p class="timeline-date">${exp.date}</p>
                    <ul class="timeline-bullets">
                        ${bulletsHtml}
                    </ul>
                </div>
            `;
        });
        
        html += `</div>`; // close timeline-entries
        container.innerHTML = html;
        
    } catch (error) {
        console.error("Error loading timeline:", error);
    }
}
