from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.report import ReportCreate, ReportResponse, ReportStatusUpdate
from app.services import report_service
from app.services.auth import get_current_user

router = APIRouter(prefix="/api/reports", tags=["Water Reports"])


@router.get("", response_model=List[ReportResponse])
def list_reports(
    skip: int = 0,
    limit: int = 200,
    station_id: int = None,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """List citizen water quality reports (filtered by role)."""
    return report_service.get_reports(db, user=current_user, station_id=station_id, skip=skip, limit=limit)


@router.post("", response_model=ReportResponse, status_code=status.HTTP_201_CREATED)
def submit_report(
    data: ReportCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Submit a new citizen water quality report."""
    return report_service.create_report(db, data, user_id=current_user.id)


from app.dependencies.role_guard import require_role

@router.patch("/{report_id}/status", response_model=ReportResponse, dependencies=[Depends(require_role("authority", "admin"))])
def update_report_status(
    report_id: int,
    data: ReportStatusUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Update report status (Authority/Admin only)."""
    updated_report = report_service.update_report_status(
        db, 
        report_id=report_id, 
        status=data.status, 
        verified_by=current_user.id
    )
    
    if not updated_report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Report with ID {report_id} not found"
        )
        
    return updated_report


@router.get("/{report_id}", response_model=ReportResponse)
def get_report(
    report_id: int,
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    """Get report details."""
    report = report_service.get_report_by_id(db, report_id=report_id)
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Report with ID {report_id} not found"
        )
    return report


@router.delete("/{report_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_report(
    report_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Delete a report (Admin only)."""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only Admin users can delete reports"
        )
    
    success = report_service.delete_report(db, report_id=report_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Report with ID {report_id} not found"
        )
    return None
