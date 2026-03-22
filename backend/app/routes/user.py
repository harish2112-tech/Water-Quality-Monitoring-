from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.services.auth import get_current_user
from app.models.user import User, UserRole
from app.schemas.user import UserResponse, UserUpdate
from app.services import user_service, auth as auth_service

router = APIRouter(prefix="/api/users", tags=["Users"])


def require_role(*allowed_roles: UserRole):
    """Dependency factory to restrict access by user role."""
    def role_checker(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Required roles: {', '.join([r.value for r in allowed_roles])}",
            )
        return current_user
    return role_checker


@router.get("/me", response_model=UserResponse)
def get_my_profile(current_user: User = Depends(get_current_user)):
    """Return the currently authenticated user's profile."""
    return current_user


@router.get("/{user_id}", response_model=UserResponse)
def get_user_by_id(
    user_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_role(UserRole.ADMIN, UserRole.AUTHORITY)),
):
    """Get any user by ID (admin/authority only)."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user
@router.put("/me", response_model=UserResponse)
def update_my_profile(
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update the currently authenticated user's profile."""
    updated_user = user_service.update_user(db, current_user.id, user_update)
    return updated_user


@router.post("/me/password")
def update_my_password(
    password_data: dict,  # Simplification for now, usually use a proper schema
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update the currently authenticated user's password."""
    current_pass = password_data.get("current")
    new_pass = password_data.get("newPass")
    
    if not auth_service.verify_password(current_pass, current_user.password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect current password"
        )
        
    current_user.password = auth_service.hash_password(new_pass)
    db.commit()
    return {"message": "Password updated successfully"}
