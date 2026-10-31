from pydantic import BaseModel
from typing import Literal


class EmailDraft(BaseModel):
    subject: str
    body: str


class EmailApproval(BaseModel):
    action: Literal["approve", "edit", "reject"]
    subject: str | None = None
    body: str | None = None