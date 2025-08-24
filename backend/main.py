from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.staticfiles import StaticFiles
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import List
from datetime import timedelta

from . import crud, models, schemas, auth
from .database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# --- Authentication ---
@app.post("/api/users/register", response_model=schemas.User)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    db_user_by_username = crud.get_user_by_username(db, username=user.username)
    if db_user_by_username:
        raise HTTPException(status_code=400, detail="Username already taken")
    return crud.create_user(db=db, user=user)

@app.post("/api/token", response_model=schemas.Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud.get_user_by_username(db, username=form_data.username)
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password", headers={"WWW-Authenticate": "Bearer"})
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(data={"sub": user.username}, expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}

# --- CMS (Protected) ---
@app.get("/api/users/me", response_model=schemas.User)
def read_users_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user

@app.put("/api/users/me", response_model=schemas.User)
def update_my_profile(profile_in: schemas.UserBase, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    return crud.update_user_profile(db=db, user=current_user, profile_in=profile_in)

@app.post("/api/skills", response_model=schemas.Skill)
def create_new_skill(skill: schemas.SkillCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    return crud.create_skill(db=db, skill=skill, user_id=current_user.id)

@app.delete("/api/skills/{skill_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_skill(skill_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    skill = crud.get_skill(db, skill_id)
    if not skill or skill.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Skill not found")
    crud.delete_item(db, skill)
    return {"ok": True}

@app.post("/api/projects", response_model=schemas.Project)
def create_new_project(project: schemas.ProjectCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    return crud.create_project(db=db, project=project, user_id=current_user.id)

@app.put("/api/projects/{project_id}", response_model=schemas.Project)
def update_existing_project(project_id: int, project_in: schemas.ProjectCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    project = crud.get_project(db, project_id)
    if not project or project.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Project not found")
    return crud.update_project(db, project, project_in)

@app.delete("/api/projects/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(project_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    project = crud.get_project(db, project_id)
    if not project or project.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Project not found")
    crud.delete_item(db, project)
    return {"ok": True}

# (Similar endpoints for papers, education, experience would follow)

# --- Public ---
@app.get("/api/portfolio/{username}", response_model=schemas.User)
def read_user_portfolio(username: str, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_username(db, username=username)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@app.get("/api/projects/{project_id}", response_model=schemas.Project)
def read_project_detail(project_id: int, db: Session = Depends(get_db)):
    db_project = crud.get_project(db, project_id=project_id)
    if db_project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return db_project

@app.get("/api/papers/{paper_id}", response_model=schemas.ResearchPaper)
def read_paper_detail(paper_id: int, db: Session = Depends(get_db)):
    db_paper = crud.get_paper(db, paper_id=paper_id)
    if db_paper is None:
        raise HTTPException(status_code=404, detail="Paper not found")
    return db_paper

# --- Static Files ---
app.mount("/assets", StaticFiles(directory="assets"), name="assets")
app.mount("/", StaticFiles(directory="frontend", html=True), name="frontend")
