from pydantic import BaseModel
from typing import List, Optional

# Base and Create schemas define the shape for input data (e.g., when creating a new item).
# The main schemas (e.g., Skill, Project) define the shape for output data from the API.
# The `Config` class with `from_attributes = True` allows the Pydantic model to read data from ORM objects.

class SkillBase(BaseModel):
    category: str
    name: str
    level: str

class SkillCreate(SkillBase):
    pass

class Skill(SkillBase):
    id: int

    class Config:
        from_attributes = True

class ProjectBase(BaseModel):
    title: str
    image_url: Optional[str] = None
    github_url: Optional[str] = None
    demo_url: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass

class Project(ProjectBase):
    id: int

    class Config:
        from_attributes = True

class EducationBase(BaseModel):
    degree: str
    field: Optional[str] = None

class EducationCreate(EducationBase):
    pass

class Education(EducationBase):
    id: int

    class Config:
        from_attributes = True

class ExperienceBase(BaseModel):
    duration: str
    title: str

class ExperienceCreate(ExperienceBase):
    pass

class Experience(ExperienceBase):
    id: int

    class Config:
        from_attributes = True

class UserBase(BaseModel):
    username: str
    email: str
    full_name: Optional[str] = None
    title: Optional[str] = None
    profile_text: Optional[str] = None

class UserCreate(UserBase):
    password: str

# This is the main schema for returning all portfolio data for a user.
# It includes lists of the related items.
class User(UserBase):
    id: int
    skills: List[Skill] = []
    projects: List[Project] = []
    education_entries: List[Education] = []
    experience_entries: List[Experience] = []

    class Config:
        from_attributes = True
