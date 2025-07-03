from .database import engine
from . import models
from fastapi import FastAPI
from . import routes

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(routes.router)