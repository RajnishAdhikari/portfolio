from sqlalchemy.orm import Session
from . import models, schemas, auth

# --- User ---
def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,
        full_name=user.full_name,
        title=user.title,
        profile_text=user.profile_text
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user_profile(db: Session, user: models.User, profile_in: schemas.UserBase):
    user.full_name = profile_in.full_name
    user.title = profile_in.title
    user.profile_text = profile_in.profile_text
    user.email = profile_in.email
    db.commit()
    db.refresh(user)
    return user

# --- Generic Delete ---
def delete_item(db: Session, item):
    db.delete(item)
    db.commit()

# --- Items (Skills, Projects, Papers, etc.) ---
def get_skill(db: Session, skill_id: int):
    return db.query(models.Skill).filter(models.Skill.id == skill_id).first()

def create_skill(db: Session, skill: schemas.SkillCreate, user_id: int):
    db_skill = models.Skill(**skill.dict(), owner_id=user_id)
    db.add(db_skill)
    db.commit()
    db.refresh(db_skill)
    return db_skill

def get_project(db: Session, project_id: int):
    return db.query(models.Project).filter(models.Project.id == project_id).first()

def create_project(db: Session, project: schemas.ProjectCreate, user_id: int):
    db_project = models.Project(**project.dict(), owner_id=user_id)
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

def update_project(db: Session, project: models.Project, project_in: schemas.ProjectCreate):
    project_data = project_in.dict()
    for key, value in project_data.items():
        setattr(project, key, value)
    db.commit()
    db.refresh(project)
    return project

def get_paper(db: Session, paper_id: int):
    return db.query(models.ResearchPaper).filter(models.ResearchPaper.id == paper_id).first()

def create_paper(db: Session, paper: schemas.ResearchPaperCreate, user_id: int):
    db_paper = models.ResearchPaper(**paper.dict(), owner_id=user_id)
    db.add(db_paper)
    db.commit()
    db.refresh(db_paper)
    return db_paper

def update_paper(db: Session, paper: models.ResearchPaper, paper_in: schemas.ResearchPaperCreate):
    paper_data = paper_in.dict()
    for key, value in paper_data.items():
        setattr(paper, key, value)
    db.commit()
    db.refresh(paper)
    return paper

# (And so on for Education and Experience)
def get_education(db: Session, edu_id: int):
    return db.query(models.Education).filter(models.Education.id == edu_id).first()

def create_education(db: Session, edu: schemas.EducationCreate, user_id: int):
    db_edu = models.Education(**edu.dict(), owner_id=user_id)
    db.add(db_edu)
    db.commit()
    db.refresh(db_edu)
    return db_edu

def get_experience(db: Session, exp_id: int):
    return db.query(models.Experience).filter(models.Experience.id == exp_id).first()

def create_experience(db: Session, exp: schemas.ExperienceCreate, user_id: int):
    db_exp = models.Experience(**exp.dict(), owner_id=user_id)
    db.add(db_exp)
    db.commit()
    db.refresh(db_exp)
    return db_exp
