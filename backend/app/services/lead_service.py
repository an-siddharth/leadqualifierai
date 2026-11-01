from sqlalchemy.orm import Session

from app.models import Lead
from app.schemas.lead import LeadInput
from app.schemas.analysis import LeadAnalysis


def create_lead(db: Session, lead_data: LeadInput):
    lead = Lead(
        name=lead_data.name,
        email=str(lead_data.email),
        company=lead_data.company,
        budget=lead_data.budget,
        service=lead_data.service,
        urgency=lead_data.urgency,
        requirements=lead_data.requirements
    )

    db.add(lead)
    db.commit()
    db.refresh(lead)

    return lead


def get_leads(db: Session):
    return db.query(Lead).all()


def get_lead_by_id(db: Session, lead_id: int):
    return db.query(Lead).filter(Lead.id == lead_id).first()


def update_lead_analysis(
    db: Session,
    lead_id: int,
    analysis: LeadAnalysis
):
    lead = get_lead_by_id(db, lead_id)

    if not lead:
        return None

    lead.score = analysis.score
    lead.category = analysis.category
    lead.status = "qualified"

    db.commit()
    db.refresh(lead)

    return lead

def update_email_status(db: Session, lead_id: int, status: str):
    lead = get_lead_by_id(db, lead_id)

    if not lead:
        return None

    lead.email_status = status

    db.commit()
    db.refresh(lead)

    return lead

def update_email_draft(
    db: Session,
    lead_id: int,
    subject: str,
    body: str
):
    lead = get_lead_by_id(db, lead_id)

    if not lead:
        return None

    lead.email_subject = subject
    lead.email_body = body

    db.commit()
    db.refresh(lead)

    return lead