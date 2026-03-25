from typing import List, Callable
from fastapi import Depends, HTTPException, status
from app.models.user import User, UserRole
from app.services.auth import get_current_user

def require_role(allowed_roles: List[UserRole]) -> Callable:
    """
    Dependency factory that returns a dependency to check if the current user 
    has one of the allowed roles.
    """
    def role_dependency(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have the required permissions to access this resource."
            )
        return current_user
    
    return role_dependency
