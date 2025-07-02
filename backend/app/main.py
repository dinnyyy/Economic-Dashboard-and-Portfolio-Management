from . import models

models.Base.metadata.create_all(bind=engine)
