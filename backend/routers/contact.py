from fastapi import APIRouter
from pydantic import BaseModel, EmailStr

router = APIRouter()

class ContactForm(BaseModel):
    name: str; email: EmailStr; phone: str = None; message: str

@router.post("")
def send_contact(data: ContactForm):
    # In production: send email notification
    print(f"Contact form: {data.name} <{data.email}> - {data.message[:50]}")
    return {"message": "Thank you for reaching out! We'll get back to you soon."}
