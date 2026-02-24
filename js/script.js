/* JustDerrickk — Portfolio Script */

const GITHUB_USERNAME = 'JustDerrickk';
const GITHUB_API = `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=30`;

/* THEME */

const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Load saved theme or default to dark
const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
});

/* MOBILE MENU */

const mobileToggle = document.getElementById('mobileToggle');
const navLinks = document.getElementById('navLinks');

mobileToggle.addEventListener('click', () => {
    mobileToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
});

// Close menu on link click
navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navLinks.classList.remove('open');
    });
});

/* NAVBAR SCROLL */

let lastScroll = 0;
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
    } else {
        navbar.style.boxShadow = 'none';
    }
    lastScroll = currentScroll;
}, { passive: true });

/* TERMINAL TYPING */

const terminalBody = document.getElementById('terminalBody');

const terminalSequence = [
    { type: 'command', text: 'whoami' },
    { type: 'output', text: 'Computer Science Student | Future Cybersecurity Engineer' },
    { type: 'blank' },
    { type: 'command', text: 'skills --list' },
    { type: 'skills', items: ['Linux', 'Networking', 'Python', 'Security', 'Web Dev', 'Docker'] },
    { type: 'blank' },
    { type: 'command', text: 'cat mission.txt' },
    { type: 'output', text: 'Building secure systems, one project at a time.' },
    { type: 'cursor' },
];

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function typeText(element, text, speed = 35) {
    for (let i = 0; i < text.length; i++) {
        element.textContent += text[i];
        await sleep(speed);
    }
}

async function runTerminal() {
    for (const item of terminalSequence) {
        const line = document.createElement('div');
        line.className = 'term-line';

        if (item.type === 'command') {
            line.innerHTML = `<span class="term-prompt">$</span> <span class="term-command"></span>`;
            terminalBody.appendChild(line);
            // Trigger animation
            requestAnimationFrame(() => line.style.opacity = '1');
            const cmdSpan = line.querySelector('.term-command');
            await typeText(cmdSpan, item.text, 40);
            await sleep(300);
        } else if (item.type === 'output') {
            line.classList.add('term-output');
            terminalBody.appendChild(line);
            requestAnimationFrame(() => line.style.opacity = '1');
            await typeText(line, item.text, 15);
            await sleep(200);
        } else if (item.type === 'skills') {
            line.classList.add('term-output');
            line.innerHTML = item.items
                .map(s => `<span class="skill-badge">${s}</span>`)
                .join(' ');
            terminalBody.appendChild(line);
            requestAnimationFrame(() => line.style.opacity = '1');
            await sleep(400);
        } else if (item.type === 'blank') {
            line.innerHTML = '&nbsp;';
            terminalBody.appendChild(line);
            requestAnimationFrame(() => line.style.opacity = '1');
            await sleep(100);
        } else if (item.type === 'cursor') {
            line.innerHTML = `<span class="term-prompt">$</span> <span class="term-cursor"></span>`;
            terminalBody.appendChild(line);
            requestAnimationFrame(() => line.style.opacity = '1');
        }
    }
}

/* SCROLL ANIMATIONS */

function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.delay) || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('[data-animate]').forEach(el => {
        observer.observe(el);
    });
}

/* ACTIVE NAV LINK */

function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinksAll = document.querySelectorAll('.nav-link');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinksAll.forEach(l => l.classList.remove('active'));
                const id = entry.target.getAttribute('id');
                const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
                if (activeLink) activeLink.classList.add('active');
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: `-${parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72}px 0px -40% 0px`
    });

    sections.forEach(s => observer.observe(s));
}

/* GITHUB PROJECTS */

function createProjectCard(repo) {
    const card = document.createElement('div');
    card.className = 'project-card';

    const desc = repo.description || 'No description available';
    const truncDesc = desc.length > 120 ? desc.slice(0, 120) + '...' : desc;
    const lang = repo.language || '';

    card.innerHTML = `
        <div class="project-card-header">
            <svg class="folder-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
            </svg>
            <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="ext-link" onclick="event.stopPropagation()">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                    <polyline points="15 3 21 3 21 9"/>
                    <line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
            </a>
        </div>
        <h3 class="project-card-title">${repo.name}</h3>
        <p class="project-card-desc">${truncDesc}</p>
        <div class="project-card-footer">
            <div class="project-card-tech">
                ${lang ? `<span class="tech-badge">${lang}</span>` : ''}
                ${repo.topics ? repo.topics.slice(0, 2).map(t => `<span class="tech-badge">${t}</span>`).join('') : ''}
            </div>
            <div class="project-card-stats">
                <span class="stat">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/></svg>
                    ${repo.stargazers_count}
                </span>
                <span class="stat">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>
                    ${repo.forks_count}
                </span>
            </div>
        </div>
    `;

    card.addEventListener('click', (e) => {
        if (!e.target.closest('.ext-link')) {
            window.open(repo.html_url, '_blank');
        }
    });

    return card;
}

async function loadGitHubRepos() {
    const loading = document.getElementById('projectsLoading');
    const grid = document.getElementById('projectsGrid');
    const error = document.getElementById('projectsError');

    try {
        const response = await fetch(GITHUB_API);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const repos = await response.json();
        loading.style.display = 'none';

        const filtered = repos
            .filter(r => !r.fork && !r.private && r.name.toLowerCase() !== GITHUB_USERNAME.toLowerCase())
            .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))
            .slice(0, 6);

        if (filtered.length === 0) {
            error.style.display = 'flex';
            return;
        }

        filtered.forEach(repo => {
            grid.appendChild(createProjectCard(repo));
        });

    } catch (err) {
        console.error('GitHub API error:', err);
        loading.style.display = 'none';
        error.style.display = 'flex';
    }
}

/* INIT */

document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initActiveNav();
    loadGitHubRepos();

    // Start terminal after a short delay
    setTimeout(() => {
        runTerminal();
    }, 500);
});
