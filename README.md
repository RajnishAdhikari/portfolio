# Dynamic Personal Portfolio with CMS

This project is a dynamic, single-page-style personal portfolio website with a full Content Management System (CMS) built with a Python FastAPI backend and a vanilla JavaScript frontend.

## Features

- **Dynamic Content:** All portfolio content (profile, skills, projects, papers) is loaded dynamically from the backend.
- **Content Management System:** A secure, password-protected admin dashboard allows the user to create, update, and delete all their portfolio content.
- **Multi-Page Details:** While the main page is a single-page experience, users can click to view detailed, separate pages for each project and research paper.
- **Modern & Responsive Design:** The frontend is designed to be clean, modern, and fully responsive for all screen sizes.
- **REST API:** The FastAPI backend provides a well-structured REST API for managing and retrieving portfolio data.

## Project Structure

The project is organized into two main directories:

- `/frontend`: Contains all the client-side files, including HTML, CSS, and JavaScript.
- `/backend`: Contains all the server-side Python code, including the FastAPI application, database models, and business logic.

```
/
├── frontend/
│   ├── index.html          # Main portfolio page
│   ├── project-detail.html # Template for project details
│   ├── paper-detail.html   # Template for paper details
│   ├── login.html          # Admin login page
│   ├── admin.html          # CMS dashboard
│   ├── style.css           # Main stylesheet
│   ├── mediaqueries.css    # Responsive design
│   ├── script.js           # JS for main page
│   ├── project-detail.js   # JS for project detail page
│   └── ...                 # (and other JS files)
│
├── backend/
│   ├── main.py             # Main FastAPI application and API routes
│   ├── crud.py             # Database interaction functions
│   ├── models.py           # SQLAlchemy database models
│   ├── schemas.py          # Pydantic data schemas
│   ├── auth.py             # Authentication logic (JWT, hashing)
│   └── requirements.txt    # Python dependencies
│
└── README.md
```

## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install backend dependencies:**
    Make sure you have Python 3.8+ and pip installed.
    ```bash
    pip install -r backend/requirements.txt
    ```

## Running the Application

1.  **Start the backend server:**
    Navigate to the project's root directory and run the following command:
    ```bash
    uvicorn backend.main:app --reload
    ```
    The `--reload` flag enables hot-reloading, which is useful for development.

2.  **Access the application:**
    Open your web browser and navigate to:
    [http://127.0.0.1:8000](http://127.0.0.1:8000)

## How to Use the CMS

1.  **Register Your First User:**
    Since the database starts empty, you first need to create a user account. The backend is running, but there is no frontend UI for registration. You must use the API docs.
    - Go to [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
    - Find the `POST /api/users/register` endpoint and expand it.
    - Click "Try it out" and fill in the JSON body with your desired `username`, `email`, and `password`.
    - Click "Execute". You should receive a success response.

2.  **Log In:**
    - Navigate to [http://127.0.0.1:8000/login.html](http://127.0.0.1:8000/login.html).
    - Enter the credentials you just registered.
    - Upon successful login, you will be redirected to the admin dashboard.

3.  **Manage Content:**
    - The admin dashboard at `/admin.html` provides forms to update your profile, and add, edit, or delete skills, projects, and research papers.
    - Any changes you save here will be instantly reflected on your public-facing portfolio at the root URL.

## API Endpoints

A brief overview of the main API endpoints. For full details, see the interactive API documentation provided by FastAPI at `/docs`.

- **Authentication**
  - `POST /api/users/register`: Create a new user.
  - `POST /api/token`: Log in to get a JWT token.
- **Public Data**
  - `GET /api/portfolio/{username}`: Get all public portfolio data for a user.
  - `GET /api/projects/{project_id}`: Get details for a single project.
  - `GET /api/papers/{paper_id}`: Get details for a single paper.
- **CMS (Protected)**
  - `GET /api/users/me`: Get the current logged-in user's full data.
  - `PUT /api/users/me`: Update the current user's profile.
  - `POST /api/skills`, `DELETE /api/skills/{skill_id}`: Manage skills.
  - `POST /api/projects`, `PUT /api/projects/{project_id}`, `DELETE /api/projects/{project_id}`: Manage projects.
  - (Similar endpoints exist for papers, education, and experience).
