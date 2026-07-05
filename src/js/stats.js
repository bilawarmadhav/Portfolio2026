export function initStats() {
    // Setup Marquee Content
    setupMarquee();
}

function setupMarquee() {
    const track = document.getElementById('stats-marquee');
    if (!track) return;
    
    const icons = [
        '<i class="devicon-mysql-plain"></i>',
        '<i class="devicon-postgresql-plain"></i>',
        '<i class="devicon-javascript-plain" style="color: #f7df1e;"></i>',
        '<i class="devicon-typescript-plain" style="color: #3178c6;"></i>',
        '<i class="devicon-django-plain"></i>',
        '<i class="devicon-python-plain"></i>',
        '<i class="devicon-github-original"></i>',
        '<i class="devicon-nestjs-plain" style="color: #E0234E"></i>',
        '<i class="devicon-react-original" style="color: #61DAFB"></i>',
        '<i class="devicon-googlecloud-plain"></i>',
        '<i class="devicon-nextjs-plain"></i>',
        '<i class="devicon-docker-plain" style="color: #2496ED"></i>',
        '<i class="devicon-mongodb-plain" style="color: #47A248"></i>',
        '<i class="devicon-nodejs-plain" style="color: #339933"></i>',
    ];
    
    // Duplicate for seamless loop
    const combined = [...icons, ...icons, ...icons];
    
    const html = combined.map(icon => `<div class="marquee-item">${icon}</div>`).join('');
    track.innerHTML = html;
}
