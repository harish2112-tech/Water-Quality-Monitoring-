from pydantic import BaseModel, EmailStr, field_validator
from datetime import datetime
from typing import Optional
from app.models.user import UserRole

class UserCreate(BaseModel):
    """Schema for user registration."""
    name: str
    email: EmailStr
    password: str
    role: UserRole = UserRole.CITIZEN
    location: Optional[str] = None
    phone: Optional[str] = None
    
    @field_validator('password')
    @classmethod
    def validate_password(cls, v):
        if len(v) < 6:
            raise ValueError('Password must be at least 6 characters long')
        # Truncate to 72 characters for bcrypt compatibility
        if len(v) > 72:
            return v[:72]
        return v


class UserLogin(BaseModel):
    """Schema for user login."""
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    """Schema for updating user profile."""
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    location: Optional[str] = None


class UserResponse(BaseModel):
    """Schema for user response."""
    id: int
    name: str
    email: str
    role: UserRole
    phone: Optional[str] = None
    location: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


class Token(BaseModel):
    """Schema for JWT token response."""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
