from sqlalchemy import Column, Integer, String, ForeignKey, Float, Date, JSON, Table
from .database import Base
from sqlalchemy.orm import relationship

report_models = Table(
    "report_models",
    Base.metadata,
    Column("report_id", Integer, ForeignKey("reports.report_id"), primary_key=True),
    Column("results_id", Integer, ForeignKey("results.results_id"), primary_key=True),
)

class User(Base):
    __tablename__ = "users"  # This is the table name in Postgres

    user_id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)

class Portfolio(Base):
    __tablename__ = "portfolio"

    portfolio_id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.user_id"))

class Trades(Base):
    __tablename__ = "trades"

    trades_id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String, unique=False, nullable=False)
    quantity = Column(Integer, unique=False, nullable=False)
    price = Column(Float, unique=False, nullable=False)
    date = Column(Date, unique=False, nullable=False)
    portfolio_id = Column(Integer, ForeignKey("portfolio.portfolio_id"))
    action = Column(String, nullable=False)

class ModelResults(Base):
    __tablename__ = "results"

    results_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"))
    model_name = Column(String, unique=True, nullable=False)
    parameters = Column(JSON)

    reports = relationship("Reports", secondary=report_models, back_populates="models")

class Reports(Base):
    __tablename__ = "reports"

    report_id = Column(Integer, primary_key=True, index=True)
    file_path = Column(String, unique=True, nullable=False)
    created_at = Column(Date, unique=False, nullable=False)

    models = relationship("ModelResults", secondary=report_models, back_populates="reports")
