from sqlalchemy import Column, Integer, String, DateTime, Enum
from datetime import datetime
import enum
from app.core.database import Base


class UserRole(str, enum.Enum):
    """User role enumeration."""
    CITIZEN = "citizen"
    NGO = "ngo"
    AUTHORITY = "authority"
    ADMIN = "admin"


class User(Base):
    """User model for authentication and authorization."""
    
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)  # Hashed password
    role = Column(Enum(UserRole), nullable=False, default=UserRole.CITIZEN)
    phone = Column(String, nullable=True) # Profile information
    location = Column(String, nullable=True) # Profile information
    created_at = Column(DateTime, default=datetime.utcnow)
