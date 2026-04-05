from typing import Optional, List
from sqlalchemy.orm import Session

from app.models.user import User, UserRole
from app.schemas.user import UserCreate, UserUpdate
from app.services.auth import hash_password


def get_user_by_email(db: Session, email: str) -> Optional[User]:
    """Fetch a user by email address."""
    return db.query(User).filter(User.email == email).first()


def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
    """Fetch a user by their ID."""
    return db.query(User).filter(User.id == user_id).first()


def get_all_users(db: Session, skip: int = 0, limit: int = 100) -> List[User]:
    """Return a paginated list of all users."""
    return db.query(User).offset(skip).limit(limit).all()


def create_user(db: Session, user_data: UserCreate) -> User:
    """Create a new user with a hashed password."""
    print(f"DEBUG: Creating user with data: {user_data.model_dump()}")
    try:
        hashed = hash_password(user_data.password)
        db_user = User(
            name=user_data.name,
            email=user_data.email,
            password=hashed,
            role=user_data.role,
            phone=user_data.phone,
            location=user_data.location,
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        print(f"DEBUG: User created successfully: {db_user.id}")
        return db_user
    except Exception as e:
        print(f"ERROR creating user: {str(e)}")
        db.rollback()
        raise e


def update_user(db: Session, user_id: int, user_update: UserUpdate) -> Optional[User]:
    """Update a user's profile information."""
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        return None
        
    update_data = user_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_user, key, value)
        
    db.commit()
    db.refresh(db_user)
    return db_user
