document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', handleLogout);
    }
});

async function handleLogin(event) {
    event.preventDefault();
    const errorMessage = document.getElementById('error-message');
    errorMessage.style.display = 'none';

    const username = event.target.username.value;
    const password = event.target.password.value;

    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    try {
        const response = await fetch('/api/token', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Login failed');
        }

        const data = await response.json();
        localStorage.setItem('accessToken', data.access_token);
        window.location.href = '/admin.html'; // Redirect to admin page on success
    } catch (error) {
        errorMessage.textContent = error.message;
        errorMessage.style.display = 'block';
    }
}

function handleLogout() {
    localStorage.removeItem('accessToken');
    window.location.href = '/login.html';
}

function getAuthToken() {
    return localStorage.getItem('accessToken');
}
