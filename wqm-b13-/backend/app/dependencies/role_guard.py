from fastapi import Depends, HTTPException, status
from app.services.auth import get_current_user
from app.models.user import User, UserRole

def require_role(*roles: str):
    """
    FastAPI dependency factory to check if the current user has one of the required roles.
    
    Usage:
        @router.get("/ngo-only", dependencies=[Depends(require_role("ngo", "admin"))])
        def ngo_only_endpoint():
            ...
    """
    def role_dependency(current_user: User = Depends(get_current_user)):
        # Since UserRole inherits from str, comparing against strings works.
        # We check both the Enum object and its string value for robustness.
        if current_user.role not in roles and current_user.role.value not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Operation not permitted for role: {current_user.role.value}. Required: {', '.join(roles)}",
            )
        return current_user
    
    return role_dependency
