# backend/app/database.py

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Local Postgres URL (adjust user, password, db name)
SQLALCHEMY_DATABASE_URL = "postgresql://postgres:dinny@localhost:5432/ed&p"

# Create the DB engine
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# Session local for CRUD operations
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()
