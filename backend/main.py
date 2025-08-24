from fastapi import FastAPI, Depends, HTTPException
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session

from . import crud, models, schemas
from .database import SessionLocal, engine, get_db

# This line creates the database tables if they don't exist.
models.Base.metadata.create_all(bind=engine)

app = FastAPI()


# --- Temporary Data Seeding ---
# This function will run on startup and create a sample user and portfolio
# if one doesn't already exist. This is for development purposes.
def seed_data():
    db = SessionLocal()
    user = crud.get_user_by_username(db, username="rajnishadhikari")
    if not user:
        user_in = schemas.UserCreate(
            username="rajnishadhikari",
            email="rajnishprofessionaladhikari@gmail.com",
            password="password123",
            full_name="Rajnish Adhikari",
            title="Data Scientist",
            profile_text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic quis reprehenderit et laborum, rem, dolore eum quod voluptate exercitationem nobis, nihil esse debitis maxime facere minus sint delectus velit in eos quo officiis explicabo deleniti dignissimos. Eligendi illum libero dolorum cum laboriosam corrupti quidem, reiciendis ea magnam? Nulla, impedit fuga!"
        )
        user = crud.create_user(db, user_in)

        # Add sample education
        db.add(models.Education(degree="B.Sc. Computer Science and Information Technology", field="M.Sc. Masters Degree", owner=user))

        # Add sample experience
        db.add(models.Experience(duration="3 Months", title="Data Science Internship", owner=user))

        # Add sample skills
        db.add(models.Skill(category="Frontend Development", name="HTML", level="Experienced", owner=user))
        db.add(models.Skill(category="Frontend Development", name="CSS", level="Experienced", owner=user))
        db.add(models.Skill(category="Frontend Development", name="JavaScript", level="Basic", owner=user))
        db.add(models.Skill(category="Backend Development", name="PostgreSQL", level="Basic", owner=user))
        db.add(models.Skill(category="Backend Development", name="Node JS", level="Intermediate", owner=user))
        db.add(models.Skill(category="Backend Development", name="Git", level="Intermediate", owner=user))

        # Add sample projects
        db.add(models.Project(title="Project One", image_url="/assets/project-1.png", github_url="https://github.com/", demo_url="https://github.com/", owner=user))
        db.add(models.Project(title="Project Two", image_url="/assets/project-2.png", github_url="https://github.com/", demo_url="https://github.com/", owner=user))
        db.add(models.Project(title="Project Three", image_url="/assets/project-3.png", github_url="https://github.com/", demo_url="https://github.com/", owner=user))

        db.commit()
    db.close()

seed_data()
# --- End of Seeding ---


@app.get("/api/portfolio/{username}", response_model=schemas.User)
def read_user_portfolio(username: str, db: Session = Depends(get_db)):
    """
    API endpoint to retrieve all portfolio data for a specific user.
    """
    db_user = crud.get_user_by_username(db, username=username)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


# --- Static Files Mounting ---
# This must come after the API routes to ensure they are not overridden.
app.mount("/assets", StaticFiles(directory="assets"), name="assets")
app.mount("/", StaticFiles(directory="frontend", html=True), name="frontend")
