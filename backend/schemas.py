from pydantic import BaseModel
from typing import List, Optional

# --- Base and Create Schemas ---
# These define the shape of data for creating new items.

class SkillBase(BaseModel):
    category: str
    name: str
    level: str

class SkillCreate(SkillBase):
    pass

class ProjectBase(BaseModel):
    title: str
    summary: Optional[str] = None
    long_description: Optional[str] = None
    image_url: Optional[str] = None
    github_url: Optional[str] = None
    demo_url: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass

class ResearchPaperBase(BaseModel):
    title: str
    authors: str
    publication: str
    summary: Optional[str] = None
    long_description: Optional[str] = None
    paper_url: Optional[str] = None

class ResearchPaperCreate(ResearchPaperBase):
    pass

class EducationBase(BaseModel):
    degree: str
    field: Optional[str] = None

class EducationCreate(EducationBase):
    pass

class ExperienceBase(BaseModel):
    duration: str
    title: str

class ExperienceCreate(ExperienceBase):
    pass

class UserBase(BaseModel):
    username: str
    email: str
    full_name: Optional[str] = None
    title: Optional[str] = None
    profile_text: Optional[str] = None

class UserCreate(UserBase):
    password: str


# --- API Response Schemas ---
# These define the shape of data returned from the API.
# `from_attributes = True` allows them to be created from database models.

class Skill(SkillBase):
    id: int
    class Config:
        from_attributes = True

class Project(ProjectBase):
    id: int
    class Config:
        from_attributes = True

class ResearchPaper(ResearchPaperBase):
    id: int
    class Config:
        from_attributes = True

class Education(EducationBase):
    id: int
    class Config:
        from_attributes = True

class Experience(ExperienceBase):
    id: int
    class Config:
        from_attributes = True

# This is the main schema for returning all portfolio data for a user.
class User(UserBase):
    id: int
    skills: List[Skill] = []
    projects: List[Project] = []
    papers: List[ResearchPaper] = []
    education_entries: List[Education] = []
    experience_entries: List[Experience] = []

    class Config:
        from_attributes = True

# --- Token Schemas ---
# For handling JWT authentication.

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
