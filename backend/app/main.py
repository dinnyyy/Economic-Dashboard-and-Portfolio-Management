from database import engine
import models

if __name__ == "__main__":
    models.Base.metadata.create_all(bind=engine)
