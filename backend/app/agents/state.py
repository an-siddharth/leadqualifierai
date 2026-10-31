from typing import TypedDict

from app.schemas.lead import LeadInput
from app.schemas.analysis import LeadAnalysis
from app.schemas.email import EmailDraft


class LeadState(TypedDict):
    lead_id: int
    lead: LeadInput
    analysis: LeadAnalysis
    follow_up_priority: str
    routing_decision: str
    email_draft: EmailDraft
    email_status: str
    gmail_message_id: str