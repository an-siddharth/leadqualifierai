from pydantic import BaseModel, EmailStr, Field
from typing import Literal


class LeadInput(BaseModel):
    name: str
    email: EmailStr
    company: str
    budget: float = Field(gt=0)
    service: str
    urgency: Literal["low", "medium", "high"]
    requirements: str
