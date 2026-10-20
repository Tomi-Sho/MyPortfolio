const yearSpan = document.getElementById('current-year');
yearSpan.textContent = new Date().getFullYear();

const links = document.querySelectorAll('a[href^="#"]');
links.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
    });
});
const targets = document.querySelectorAll('.fade-in');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
},{
    threshold: 0.2
});
targets.forEach(target => {
    observer.observe(target);
});

async function fetchPortfolioData() {
    const query = `
    query {
        skills {
            name
            category
            level
            icon
            color
        }
        projects {
            title
            description
            techStack
            githubUrl
        }
    }
`;

try {
    const response = await fetch('http://localhost:4000/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
    });

    const result = await response.json();
    const data = result.data;

    // 1.Worksの描画
    const projectListEl = document.getElementById('project-list');
    if (projectListEl && data.projects) {
        projectListEl.innerHTML = data.projects.map(project => `
            <div class="project-card fade-in show">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <p class="tech-stack">使用技術: ${project.techStack.join(', ')}</p>
                ${project.githubUrl ? `<a href="${project.githubUrl}" target="_blank">GitHubを見る</a>` : ''}
            </div>
            `).join('');
    }

    // 2.Skillsの描画
    const skillListEl = document.getElementById('skill-list');
    if (skillListEl && data.skills) {
        skillListEl.innerHTML = data.skills.map(skill => `
            <div clss="skill-item fade-in show">
                <span class="skill-name">${skill.icon ? `<i class="${skill.icon}" style="color: ${skill.color} !important; font-size: 24px; margin-right: 10px;"></i>` : ''}${skill.name}</span>
                <span class="skill-category">${skill.category}</span>
                <span class="skill-level">(${skill.level})</span>
            </div>
            `).join('');
    }
} catch (error) {
    console.error('GraphQLデータの取得に失敗しました:', error);
}
}

// ページ読み込み時に実行
window.addEventListener('DOMContentLoaded', fetchPortfolioData)