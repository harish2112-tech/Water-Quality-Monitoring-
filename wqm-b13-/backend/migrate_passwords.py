import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import bcrypt
from app.models.user import User

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def migrate_passwords():
    db = SessionLocal()
    try:
        users = db.query(User).all()
        updated_count = 0
        for user in users:
            # Check if password is not already hashed (bcrypt hashes start with $2)
            if user.password and not user.password.startswith("$2"):
                salt = bcrypt.gensalt()
                password_bytes = user.password.encode('utf-8')[:72]
                hashed_pw = bcrypt.hashpw(password_bytes, salt).decode('utf-8')
                
                user.password = hashed_pw
                updated_count += 1
                print(f"Hashed password for user: {user.email}")
        
        db.commit()
        print(f"Successfully migrated {updated_count} plaintext passwords to bcrypt.")
    except Exception as e:
        db.rollback()
        print(f"Error occurred: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    migrate_passwords()
