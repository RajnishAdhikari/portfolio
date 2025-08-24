document.addEventListener('DOMContentLoaded', () => {
    // Get the project ID from the URL query parameters
    const params = new URLSearchParams(window.location.search);
    const projectId = params.get('id');

    if (projectId) {
        fetchProjectDetails(projectId);
    } else {
        document.body.innerHTML = '<p>No project ID provided.</p>';
    }
});

async function fetchProjectDetails(id) {
    try {
        const response = await fetch(`/api/projects/${id}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const project = await response.json();
        populateProjectDetails(project);
    } catch (error) {
        console.error('Failed to fetch project details:', error);
        document.body.innerHTML = '<p>Failed to load project details.</p>';
    }
}

function populateProjectDetails(project) {
    // Set the page title
    document.title = project.title;

    // Populate the template elements
    document.getElementById('project-title').textContent = project.title;

    const projectImage = document.getElementById('project-image');
    projectImage.src = project.image_url;
    projectImage.alt = project.title;

    document.getElementById('project-description').textContent = project.long_description;

    const linksContainer = document.getElementById('project-links');
    linksContainer.innerHTML = ''; // Clear any placeholders

    if (project.github_url) {
        const githubButton = document.createElement('button');
        githubButton.className = 'btn btn-color-2 project-btn';
        githubButton.textContent = 'Github';
        githubButton.onclick = () => location.href = project.github_url;
        linksContainer.appendChild(githubButton);
    }

    if (project.demo_url) {
        const demoButton = document.createElement('button');
        demoButton.className = 'btn btn-color-2 project-btn';
        demoButton.textContent = 'Live Demo';
        demoButton.onclick = () => location.href = project.demo_url;
        linksContainer.appendChild(demoButton);
    }
}
