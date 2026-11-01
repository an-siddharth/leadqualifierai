from sqlalchemy import Column, Integer, String, Float, Text
from app.services.database import Base


class Lead(Base):
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(100), nullable=False)
    email = Column(String(255), nullable=False)
    company = Column(String(150), nullable=False)
    budget = Column(Float, nullable=False)
    service = Column(String(150), nullable=False)
    urgency = Column(String(20), nullable=False)
    requirements = Column(Text, nullable=False)

    score = Column(Integer, nullable=True)
    category = Column(String(20), nullable=True)
    status = Column(String(30), default="new")
    email_status = Column(String(30), default="new", nullable=False)

    email_subject = Column(String(500), nullable=True)
    email_body = Column(Text, nullable=True)