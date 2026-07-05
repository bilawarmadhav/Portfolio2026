import socials from '../data/socials.json';

export async function renderSocials() {
    try {
        const container = document.getElementById('footer-socials');
        if (!container) return;

        let html = '';
        socials.forEach((social, index) => {
            if (index > 0) {
                html += `<span class="footer-dot">●</span>`;
            }
            html += `
                <a href="${social.url}" class="footer-link" target="_blank" rel="noopener noreferrer">
                    <i class="${social.icon}"></i> ${social.label}
                </a>
            `;
        });

        container.innerHTML = html;
    } catch (error) {
        console.error("Error loading socials:", error);
    }
}
