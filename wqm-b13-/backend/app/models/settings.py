from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey
from app.core.database import Base

class SystemThreshold(Base):
    __tablename__ = "system_thresholds"

    id = Column(Integer, primary_key=True, index=True)
    parameter = Column(String, unique=True, index=True) # e.g., 'ph_low', 'ph_high', 'turbidity'
    warning_value = Column(Float)
    critical_value = Column(Float)
    unit = Column(String)

class UserPreference(Base):
    __tablename__ = "user_preferences"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    
    # Notifications
    email_notifications = Column(Boolean, default=True)
    sms_notifications = Column(Boolean, default=False)
    webhook_url = Column(String, nullable=True)
    
    # Display
    unit_system = Column(String, default="metric") # 'metric' or 'imperial'
    timezone = Column(String, default="UTC")
    
    # Map
    default_lat = Column(Float, default=20.5937) # Default Center (India)
    default_lng = Column(Float, default=78.9629)
    default_zoom = Column(Integer, default=5)
