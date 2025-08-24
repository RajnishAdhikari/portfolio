document.addEventListener('DOMContentLoaded', () => {
    const token = getAuthToken();
    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    // Fetch user data and populate forms
    fetchAdminData(token);

    // Add event listeners for forms
    document.getElementById('profile-form').addEventListener('submit', (e) => handleProfileUpdate(e, token));
    document.getElementById('add-skill-form').addEventListener('submit', (e) => handleAddSkill(e, token));
    document.getElementById('project-form').addEventListener('submit', (e) => handleProjectSave(e, token));
    document.getElementById('new-project-btn').addEventListener('click', clearProjectForm);
});

async function fetchAdminData(token) {
    try {
        const response = await fetch('/api/users/me', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch user data');

        const user = await response.json();

        // Populate profile form
        document.getElementById('full_name').value = user.full_name;
        document.getElementById('title').value = user.title;
        document.getElementById('email').value = user.email;
        document.getElementById('profile_text').value = user.profile_text;

        // Populate skills list
        const skillsList = document.getElementById('skills-list');
        skillsList.innerHTML = '';
        user.skills.forEach(skill => {
            const li = document.createElement('li');
            li.textContent = `${skill.category}: ${skill.name} (${skill.level})`;
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.className = 'btn btn-color-2';
            deleteBtn.onclick = () => handleDelete('skills', skill.id, token);
            li.appendChild(deleteBtn);
            skillsList.appendChild(li);
        });

        // Populate projects list
        const projectsList = document.getElementById('projects-list');
        projectsList.innerHTML = '';
        user.projects.forEach(project => {
            const li = document.createElement('li');
            li.textContent = project.title;
            const editBtn = document.createElement('button');
            editBtn.textContent = 'Edit';
            editBtn.className = 'btn btn-color-1';
            editBtn.onclick = () => populateProjectForm(project);

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.className = 'btn btn-color-2';
            deleteBtn.onclick = () => handleDelete('projects', project.id, token);

            const btnGroup = document.createElement('div');
            btnGroup.appendChild(editBtn);
            btnGroup.appendChild(deleteBtn);
            li.appendChild(btnGroup);
            projectsList.appendChild(li);
        });

    } catch (error) {
        console.error(error);
        handleLogout(); // If token is invalid or expired, log out
    }
}

// --- Form Handlers ---

async function handleProfileUpdate(event, token) {
    event.preventDefault();
    const profileData = {
        full_name: document.getElementById('full_name').value,
        title: document.getElementById('title').value,
        email: document.getElementById('email').value,
        profile_text: document.getElementById('profile_text').value,
        username: 'placeholder' // username is not updated here but required by schema
    };

    // We need the username, so we fetch it first
    const meResponse = await fetch('/api/users/me', { headers: { 'Authorization': `Bearer ${token}` } });
    const meData = await meResponse.json();
    profileData.username = meData.username;


    const response = await fetch('/api/users/me', {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData)
    });

    if (response.ok) {
        alert('Profile updated successfully!');
    } else {
        alert('Failed to update profile.');
    }
}

async function handleAddSkill(event, token) {
    event.preventDefault();
    const skillData = {
        name: document.getElementById('skill-name').value,
        level: document.getElementById('skill-level').value,
        category: document.getElementById('skill-category').value
    };

    const response = await fetch('/api/skills', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(skillData)
    });

    if (response.ok) {
        fetchAdminData(token); // Refresh list
        event.target.reset();
    } else {
        alert('Failed to add skill.');
    }
}

async function handleDelete(itemType, itemId, token) {
    if (!confirm(`Are you sure you want to delete this ${itemType.slice(0,-1)}?`)) return;

    const response = await fetch(`/api/${itemType}/${itemId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (response.ok) {
        fetchAdminData(token); // Refresh list
    } else {
        alert(`Failed to delete ${itemType.slice(0,-1)}.`);
    }
}

function populateProjectForm(project) {
    document.getElementById('project-id').value = project.id;
    document.getElementById('project-title').value = project.title;
    document.getElementById('project-summary').value = project.summary;
    document.getElementById('project-long_description').value = project.long_description;
    document.getElementById('project-image_url').value = project.image_url;
    document.getElementById('project-github_url').value = project.github_url;
    document.getElementById('project-demo_url').value = project.demo_url;
}

function clearProjectForm() {
    document.getElementById('project-form').reset();
    document.getElementById('project-id').value = '';
}

async function handleProjectSave(event, token) {
    event.preventDefault();
    const projectId = document.getElementById('project-id').value;
    const projectData = {
        title: document.getElementById('project-title').value,
        summary: document.getElementById('project-summary').value,
        long_description: document.getElementById('project-long_description').value,
        image_url: document.getElementById('project-image_url').value,
        github_url: document.getElementById('project-github_url').value,
        demo_url: document.getElementById('project-demo_url').value
    };

    const url = projectId ? `/api/projects/${projectId}` : '/api/projects';
    const method = projectId ? 'PUT' : 'POST';

    const response = await fetch(url, {
        method: method,
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData)
    });

    if (response.ok) {
        fetchAdminData(token);
        clearProjectForm();
    } else {
        alert('Failed to save project.');
    }
}
