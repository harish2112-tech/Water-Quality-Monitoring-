from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.collaboration import Collaboration, CollaborationStatus
from app.models.station import WaterStation
from app.schemas.collaboration import CollaborationCreate, CollaborationUpdate
from fastapi import HTTPException, status

<<<<<<< HEAD
def get_collaborations(db: Session, ngo_user_id: int, status: Optional[str] = None, search: Optional[str] = None, skip: int = 0, limit: int = 100) -> List[Collaboration]:
    """Get collaborations for a specific NGO user with optional status and search filter."""
    query = db.query(Collaboration).filter(Collaboration.ngo_user_id == ngo_user_id)
    if status:
        query = query.filter(Collaboration.status == status)
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            (Collaboration.project_name.ilike(search_filter)) | 
            (Collaboration.ngo_name.ilike(search_filter))
        )
    # Explicitly join with station to get coordinates if needed for Response mapping
    # Or just fetch all and use the station_id later
    results = query.order_by(Collaboration.created_at.desc()).offset(skip).limit(limit).all()
    
    # We populate the latitude/longitude from the station if station_id exists
    for collab in results:
        if collab.station_id:
            station = db.query(WaterStation).filter(WaterStation.id == collab.station_id).first()
            if station:
                collab.latitude = station.latitude
                collab.longitude = station.longitude
    return results
=======
def get_collaborations(db: Session, ngo_user_id: int, status: Optional[str] = None, skip: int = 0, limit: int = 100) -> List[Collaboration]:
    """Get collaborations for a specific NGO user with optional status filter."""
    query = db.query(Collaboration).filter(Collaboration.ngo_user_id == ngo_user_id)
    if status:
        query = query.filter(Collaboration.status == status)
    return query.order_by(Collaboration.created_at.desc()).offset(skip).limit(limit).all()
>>>>>>> 9f82e7e5f8c36504b270f509af7d2ffeea6ddc29

def get_collaboration_by_id(db: Session, collaboration_id: int, ngo_user_id: int) -> Optional[Collaboration]:
    """Get a specific collaboration by ID, ensuring ownership."""
    return db.query(Collaboration).filter(
        Collaboration.id == collaboration_id,
        Collaboration.ngo_user_id == ngo_user_id
    ).first()

def create_collaboration(db: Session, data: CollaborationCreate, ngo_user_id: int) -> Collaboration:
    """Create a new collaboration project for the authenticated NGO."""
    if data.station_id:
        station = db.query(WaterStation).filter(WaterStation.id == data.station_id).first()
        if not station:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Station with ID {data.station_id} not found"
            )

    collaboration = Collaboration(
        project_name=data.project_name,
        ngo_name=data.ngo_name,
        contact_email=data.contact_email,
        station_id=data.station_id,
        ngo_user_id=ngo_user_id,
        status=CollaborationStatus.ACTIVE
    )
    db.add(collaboration)
    db.commit()
    db.refresh(collaboration)
    return collaboration

def update_collaboration(db: Session, collaboration_id: int, data: CollaborationUpdate, ngo_user_id: int) -> Optional[Collaboration]:
    """Update a collaboration project, ensuring ownership."""
    collaboration = get_collaboration_by_id(db, collaboration_id, ngo_user_id)
    if not collaboration:
        return None
    
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(collaboration, key, value)
    
    db.commit()
    db.refresh(collaboration)
    return collaboration

def delete_collaboration(db: Session, collaboration_id: int, ngo_user_id: int) -> bool:
    """Delete a collaboration project, ensuring ownership."""
    collaboration = get_collaboration_by_id(db, collaboration_id, ngo_user_id)
    if not collaboration:
        return False
    
    db.delete(collaboration)
    db.commit()
    return True
