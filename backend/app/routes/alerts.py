from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.alert import AlertCreate, AlertResponse
from app.services import alert_service
from app.services.auth import get_current_user

router = APIRouter(prefix="/api/alerts", tags=["Water Alerts"])


@router.get("", response_model=List[AlertResponse])
def list_alerts(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    """List all active water quality alerts."""
    return alert_service.get_alerts(db, skip=skip, limit=limit)


@router.post("", response_model=AlertResponse, status_code=status.HTTP_201_CREATED)
def issue_alert(
    data: AlertCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Issue a new water quality alert (Authority/NGO/Admin only)."""
    if current_user.role not in ["authority", "ngo", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only Authority, NGO and Admin users can issue alerts"
        )
    return alert_service.create_alert(db, data)


@router.delete("/{alert_id}", status_code=status.HTTP_204_NO_CONTENT)
def cancel_alert(
    alert_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Cancel/Delete a water quality alert (Admin only)."""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only Admin users can cancel alerts"
        )
    
    success = alert_service.delete_alert(db, alert_id=alert_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Alert with ID {alert_id} not found"
        )
    return None

@router.put("/{alert_id}/acknowledge", response_model=AlertResponse)
def acknowledge_alert(
    alert_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Acknowledge a water quality alert."""
    alert = alert_service.acknowledge_alert(db, alert_id=alert_id)
    if not alert:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Alert with ID {alert_id} not found"
        )
    return alert
