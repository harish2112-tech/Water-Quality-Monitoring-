from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.collaboration import CollaborationCreate, CollaborationResponse, CollaborationUpdate
from app.services import collaboration_service
from app.services.auth import get_current_user
from app.dependencies.role_guard import require_role
from app.models.user import User

router = APIRouter(
    prefix="/api/v1/collaborations",
    tags=["NGO Collaborations"],
    dependencies=[Depends(require_role("ngo", "admin"))]
)

@router.get("", response_model=List[CollaborationResponse])
def list_collaborations(
    status: Optional[str] = None,
    search: Optional[str] = None,
    page: int = 1,
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List all NGO collaboration projects for the authenticated NGO."""
    skip = (page - 1) * limit
    return collaboration_service.get_collaborations(db, ngo_user_id=current_user.id, status=status, search=search, skip=skip, limit=limit)

@router.post("", response_model=CollaborationResponse, status_code=status.HTTP_201_CREATED)
def create_collaboration(
    data: CollaborationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Submit a new NGO collaboration project."""
    return collaboration_service.create_collaboration(db, data, ngo_user_id=current_user.id)

@router.get("/{id}", response_model=CollaborationResponse)
def get_collaboration(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get details of a specific collaboration."""
    collaboration = collaboration_service.get_collaboration_by_id(db, id, current_user.id)
    if not collaboration:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Collaboration not found or access denied"
        )
    return collaboration

@router.patch("/{id}", response_model=CollaborationResponse)
def update_collaboration(
    id: int,
    data: CollaborationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update a collaboration project."""
    collaboration = collaboration_service.update_collaboration(db, id, data, current_user.id)
    if not collaboration:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Collaboration not found or access denied"
        )
    return collaboration

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_collaboration(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete a collaboration project."""
    success = collaboration_service.delete_collaboration(db, id, current_user.id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Collaboration not found or access denied"
        )
    return None
