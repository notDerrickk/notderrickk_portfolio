const GITHUB_USERNAME = 'notderrickk';
const GITHUB_API_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos`;

/* ================== THEME ================== */

const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

const currentTheme = localStorage.getItem('theme') || 'dark';
htmlElement.setAttribute('data-theme', currentTheme);

themeToggle.addEventListener('click', () => {
    const newTheme =
        htmlElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';

    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

/* ================== GITHUB PROJECTS ================== */

function createRepoCard(repo) {
    const card = document.createElement('div');
    card.className = 'project-card';

    const description = repo.description || 'No description available';
    const language = repo.language || '';
    const truncatedDesc =
        description.length > 100
            ? description.slice(0, 100) + '...'
            : description;

    card.innerHTML = `
        <div class="project-card-header">
            <svg class="folder-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
            </svg>
            <a href="${repo.html_url}" target="_blank" class="project-link">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                    <polyline points="15 3 21 3 21 9"/>
                    <line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
            </a>
        </div>
        <h3 class="project-card-title">${repo.name}</h3>
        <p class="project-card-description">${truncatedDesc}</p>
        <div class="project-card-footer">
            <div class="project-card-tech">
                ${language ? `<span class="tech-badge">${language}</span>` : ''}
            </div>
            <div class="project-card-stats">
                <span class="stat">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/>
                    </svg>
                    ${repo.stargazers_count}
                </span>
                <span class="stat">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="6" y1="3" x2="6" y2="15"/>
                        <circle cx="18" cy="6" r="3"/>
                        <circle cx="6" cy="18" r="3"/>
                        <path d="M18 9a9 9 0 0 1-9 9"/>
                    </svg>
                    ${repo.forks_count}
                </span>
            </div>
        </div>
    `;

    card.addEventListener('click', (e) => {
        if (!e.target.closest('.project-link')) {
            window.open(repo.html_url, '_blank');
        }
    });

    return card;
}

async function loadGitHubRepos() {
    const loading = document.getElementById('loading');
    const reposContainer = document.getElementById('repos-container');
    const errorMessage = document.getElementById('error-message');

    try {
        const response = await fetch(GITHUB_API_URL);
        if (!response.ok) throw new Error('Fetch failed');

        const repos = await response.json();
        loading.style.display = 'none';

        repos
            .filter(repo => !repo.private && repo.name !== GITHUB_USERNAME)
            .sort((a, b) => b.stargazers_count - a.stargazers_count)
            .slice(0, 6)
            .forEach(repo => {
                reposContainer.appendChild(createRepoCard(repo));
            });

    } catch (error) {
        loading.style.display = 'none';
        errorMessage.style.display = 'flex';
        console.error(error);
    }
}


document.addEventListener('DOMContentLoaded', loadGitHubRepos);
