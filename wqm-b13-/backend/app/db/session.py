from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings   # or your DB URL config

DATABASE_URL =settings.DATABASE_URL    #or hardcode if needed "sqlite:///./test.db"

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# ✅ THIS IS MISSING IN YOUR FILE
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()