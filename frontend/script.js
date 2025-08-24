function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  menu.classList.toggle("open");
  icon.classList.toggle("open");
}

document.addEventListener('DOMContentLoaded', () => {
  const username = 'rajnishadhikari';
  fetchPortfolioData(username);
});

async function fetchPortfolioData(username) {
  try {
    const response = await fetch(`/api/portfolio/${username}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    populatePage(data);
  } catch (error) {
    console.error('Failed to fetch portfolio data:', error);
    document.body.innerHTML = '<p style="text-align: center; padding: 50px;">Failed to load portfolio data. Please try again later.</p>';
  }
}

function populatePage(data) {
  document.getElementById('profile-name').textContent = data.full_name;
  document.getElementById('profile-title').textContent = data.title;
  document.title = `${data.full_name}'s Portfolio`;
  document.querySelectorAll('.logo').forEach(logo => logo.textContent = data.full_name);
  document.getElementById('about-me-text').textContent = data.profile_text;

  const experienceEntry = data.experience_entries[0];
  if (experienceEntry) {
    document.querySelector('#about-experience p').innerHTML = `${experienceEntry.duration}<br />${experienceEntry.title}`;
  }

  const educationEntry = data.education_entries[0];
  if (educationEntry) {
    document.querySelector('#about-education p').innerHTML = `${educationEntry.degree}<br />${educationEntry.field}`;
  }

  const frontendSkillsContainer = document.getElementById('frontend-skills-container');
  const backendSkillsContainer = document.getElementById('backend-skills-container');
  frontendSkillsContainer.innerHTML = '';
  backendSkillsContainer.innerHTML = '';

  data.skills.forEach(skill => {
    const article = document.createElement('article');
    article.innerHTML = `
      <img src="/assets/checkmark.png" alt="Experience icon" class="icon" />
      <div><h3>${skill.name}</h3><p>${skill.level}</p></div>
    `;
    if (skill.category === 'Frontend Development') {
      frontendSkillsContainer.appendChild(article);
    } else {
      backendSkillsContainer.appendChild(article);
    }
  });

  const projectsContainer = document.getElementById('projects-container');
  projectsContainer.innerHTML = '';
  data.projects.forEach(project => {
    const projectCard = document.createElement('div');
    projectCard.className = 'details-container color-container';
    projectCard.innerHTML = `
      <div class="article-container">
        <img src="${project.image_url}" alt="${project.title}" class="project-img" />
      </div>
      <h2 class="experience-sub-title project-title">${project.title}</h2>
      <p style="text-align: center; margin: 1rem;">${project.summary}</p>
      <div class="btn-container">
        <button class="btn btn-color-2 project-btn" onclick="location.href='${project.github_url}'">Github</button>
        <button class="btn btn-color-2 project-btn" onclick="location.href='/project-detail.html?id=${project.id}'">View Details</button>
      </div>
    `;
    projectsContainer.appendChild(projectCard);
  });

  const papersContainer = document.getElementById('papers-container');
  papersContainer.innerHTML = '';
  data.papers.forEach(paper => {
      const paperCard = document.createElement('div');
      paperCard.className = 'details-container color-container';
      // Using a simplified card for papers
      paperCard.innerHTML = `
        <div class="article-container">
            <h2 class="experience-sub-title project-title">${paper.title}</h2>
            <p style="margin: 1rem;"><strong>Authors:</strong> ${paper.authors}</p>
            <p style="margin: 1rem;"><em>${paper.publication}</em></p>
            <p style="margin: 1rem;">${paper.summary}</p>
            <div class="btn-container">
                <button class="btn btn-color-2 project-btn" onclick="location.href='/paper-detail.html?id=${paper.id}'">View Details</button>
            </div>
        </div>
      `;
      papersContainer.appendChild(paperCard);
  });

  const contactEmail = document.getElementById('contact-email');
  contactEmail.href = `mailto:${data.email}`;
  contactEmail.textContent = data.email;

  const copyrightText = document.getElementById('copyright-text');
  copyrightText.innerHTML = `Copyright &#169; ${new Date().getFullYear()} ${data.full_name}. All Rights Reserved.`;
}