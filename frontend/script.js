function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  menu.classList.toggle("open");
  icon.classList.toggle("open");
}

document.addEventListener('DOMContentLoaded', () => {
  // The username is hardcoded for now. In a full application,
  // this might come from the URL or user session.
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
  // --- Populate Profile Section ---
  document.getElementById('profile-name').textContent = data.full_name;
  document.getElementById('profile-title').textContent = data.title;
  document.title = `${data.full_name}'s Portfolio`;

  // --- Populate Nav Logos ---
  const logos = document.querySelectorAll('.logo');
  logos.forEach(logo => logo.textContent = data.full_name);

  // --- Populate About Section ---
  document.getElementById('about-me-text').textContent = data.profile_text;

  const experienceEntry = data.experience_entries[0];
  if (experienceEntry) {
    document.querySelector('#about-experience p').innerHTML = `${experienceEntry.duration}<br />${experienceEntry.title}`;
  }

  const educationEntry = data.education_entries[0];
  if (educationEntry) {
    document.querySelector('#about-education p').innerHTML = `${educationEntry.degree}<br />${educationEntry.field}`;
  }

  // --- Populate Skills Section ---
  const frontendSkillsContainer = document.getElementById('frontend-skills-container');
  const backendSkillsContainer = document.getElementById('backend-skills-container');
  frontendSkillsContainer.innerHTML = ''; // Clear any static content
  backendSkillsContainer.innerHTML = '';

  data.skills.forEach(skill => {
    const article = document.createElement('article');
    article.innerHTML = `
      <img src="/assets/checkmark.png" alt="Experience icon" class="icon" />
      <div>
        <h3>${skill.name}</h3>
        <p>${skill.level}</p>
      </div>
    `;
    if (skill.category === 'Frontend Development') {
      frontendSkillsContainer.appendChild(article);
    } else {
      backendSkillsContainer.appendChild(article);
    }
  });

  // --- Populate Projects Section ---
  const projectsContainer = document.getElementById('projects-container');
  projectsContainer.innerHTML = ''; // Clear any static content

  data.projects.forEach(project => {
    const projectCard = document.createElement('div');
    projectCard.className = 'details-container color-container';
    projectCard.innerHTML = `
      <div class="article-container">
        <img src="${project.image_url}" alt="Project ${project.title}" class="project-img" />
      </div>
      <h2 class="experience-sub-title project-title">${project.title}</h2>
      <div class="btn-container">
        <button class="btn btn-color-2 project-btn" onclick="location.href='${project.github_url}'">Github</button>
        <button class="btn btn-color-2 project-btn" onclick="location.href='${project.demo_url}'">Live Demo</button>
      </div>
    `;
    projectsContainer.appendChild(projectCard);
  });

  // --- Populate Contact Section ---
  const contactEmail = document.getElementById('contact-email');
  contactEmail.href = `mailto:${data.email}`;
  contactEmail.textContent = data.email;

  // --- Populate Footer ---
  const copyrightText = document.getElementById('copyright-text');
  copyrightText.innerHTML = `Copyright &#169; ${new Date().getFullYear()} ${data.full_name}. All Rights Reserved.`;
}