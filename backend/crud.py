from sqlalchemy.orm import Session
from . import models, schemas
import passlib.hash as hash # Will be used for password hashing

def get_user_by_username(db: Session, username: str):
    """
    Fetches a user from the database by their username.
    """
    return db.query(models.User).filter(models.User.username == username).first()

def get_user_by_email(db: Session, email: str):
    """
    Fetches a user from the database by their email.
    """
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    """
    Creates a new user in the database.
    This function will be expanded later to include proper password hashing.
    """
    # For now, we are using a simple hashing scheme. This will be improved
    # when we implement the full authentication system.
    hashed_password = hash.bcrypt.hash(user.password)
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

# We will add more CRUD functions for projects, skills, etc., in a later step
# when building the content management part of the application.
# For now, we just need to be able to create and read a user.
