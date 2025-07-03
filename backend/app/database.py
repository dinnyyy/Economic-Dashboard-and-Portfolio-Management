# backend/app/database.py

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Local Postgres URL (adjust user, password, db name)
SQLALCHEMY_DATABASE_URL = "postgresql://postgres:dinny@localhost:5432/ed&p"

engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency to get a session per request
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()