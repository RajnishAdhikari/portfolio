from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Define the database URL for SQLite. The database file will be named 'portfolio.db'.
SQLALCHEMY_DATABASE_URL = "sqlite:///./portfolio.db"

# Create the SQLAlchemy engine.
# The 'connect_args' is needed only for SQLite to allow multi-threaded access.
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# Create a SessionLocal class, which will be used to create individual database sessions.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create a Base class. Our ORM models will inherit from this class.
Base = declarative_base()

# This is a dependency for our API endpoints. It ensures that the database
# session is created when a request comes in and closed after the request is finished.
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
