from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.models.settings import SystemThreshold, UserPreference
from app.models.user import User
from app.schemas.settings import ThresholdBase, ThresholdResponse, UserPreferenceBase, UserPreferenceResponse
from app.services.auth import get_current_user
from app.dependencies.role_guard import require_role

router = APIRouter(prefix="/api/v1/settings", tags=["settings"])

# --- System Thresholds (Admin Only to Update) ---

@router.get("/thresholds", response_model=List[ThresholdResponse])
def get_thresholds(db: Session = Depends(get_db)):
    return db.query(SystemThreshold).all()

@router.post("/thresholds", response_model=List[ThresholdResponse])
def update_thresholds(
    thresholds: List[ThresholdBase],
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin", "authority"))
):
    # Upsert thresholds
    results = []
    for t in thresholds:
        db_t = db.query(SystemThreshold).filter(SystemThreshold.parameter == t.parameter).first()
        if db_t:
            db_t.warning_value = t.warning_value
            db_t.critical_value = t.critical_value
            db_t.unit = t.unit
        else:
            db_t = SystemThreshold(**t.dict())
            db.add(db_t)
        results.append(db_t)
    
    db.commit()
    for r in results:
        db.refresh(r)
    return results

# --- User Preferences ---

@router.get("/preferences", response_model=UserPreferenceResponse)
def get_preferences(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    pref = db.query(UserPreference).filter(UserPreference.user_id == current_user.id).first()
    if not pref:
        # Create default preferences if they don't exist
        pref = UserPreference(user_id=current_user.id)
        db.add(pref)
        db.commit()
        db.refresh(pref)
    return pref

@router.post("/preferences", response_model=UserPreferenceResponse)
def update_preferences(
    new_prefs: UserPreferenceBase,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    pref = db.query(UserPreference).filter(UserPreference.user_id == current_user.id).first()
    if not pref:
        pref = UserPreference(user_id=current_user.id, **new_prefs.dict())
        db.add(pref)
    else:
        for key, value in new_prefs.dict().items():
            setattr(pref, key, value)
    
    db.commit()
    db.refresh(pref)
    return pref
