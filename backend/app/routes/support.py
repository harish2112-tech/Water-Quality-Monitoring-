from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel, EmailStr
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/support", tags=["support"])

class ContactForm(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str

def send_email_task(contact_data: ContactForm):
    smtp_host = os.getenv("SMTP_HOST")
    smtp_port = int(os.getenv("SMTP_PORT", 587))
    smtp_user = os.getenv("SMTP_USER")
    smtp_password = os.getenv("SMTP_PASSWORD")
    admin_email = os.getenv("ADMIN_EMAIL")

    if not all([smtp_host, smtp_user, smtp_password, admin_email]):
        print("SMTP configuration is missing. Skipping email sending.")
        return

    try:
        msg = MIMEMultipart()
        msg['From'] = smtp_user
        msg['To'] = admin_email
        msg['Subject'] = f"Support Contact: {contact_data.subject}"

        body = f"""
        New message from WaterWatch Support Contact Form:
        
        Name: {contact_data.name}
        Email: {contact_data.email}
        Subject: {contact_data.subject}
        
        Message:
        {contact_data.message}
        """
        msg.attach(MIMEText(body, 'plain'))

        server = smtplib.SMTP(smtp_host, smtp_port)
        server.starttls()
        server.login(smtp_user, smtp_password)
        server.send_message(msg)
        server.quit()
        print(f"Email sent successfully to {admin_email}")
    except Exception as e:
        print(f"Failed to send email: {e}")

@router.post("/contact")
async def submit_contact_form(form_data: ContactForm, background_tasks: BackgroundTasks):
    # Use background tasks to not block the response
    background_tasks.add_task(send_email_task, form_data)
    
    return {"message": "Thank you for contacting us. Our admin will get back to you soon!"}
