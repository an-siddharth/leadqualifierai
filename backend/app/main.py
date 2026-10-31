from app.services.lead_service import update_email_status
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session

from langgraph.types import Command

from app.agents.graph import lead_graph
from app.services.database import get_db
from app.services.lead_service import (
    create_lead,
    get_leads,
    get_lead_by_id
)
from app.schemas.lead import LeadInput
from app.schemas.email import EmailApproval

app = FastAPI(
    title="AI Lead Qualification Agent",
    description="AI-powered lead qualification and follow-up automation",
    version="1.0.0"
)


@app.get("/")
def home():
    return {
        "message": "AI Lead Qualification Agent API is running!"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }


@app.post("/api/leads")
def add_lead(
    lead_data: LeadInput,
    db: Session = Depends(get_db)
):
    new_lead = create_lead(db, lead_data)

    config = {
        "configurable": {
            "thread_id": f"lead-{new_lead.id}"
        }
    }

    result = lead_graph.invoke(
        {
            "lead_id": new_lead.id,
            "lead": lead_data
        },
        config=config
    )

    return {
        "lead_id": new_lead.id,
        "name": new_lead.name,
        "analysis": result["analysis"].model_dump(),
        "follow_up_priority": result["follow_up_priority"],
        "routing_decision": result["routing_decision"],
        "email_draft": result["email_draft"].model_dump(),
        "email_status": "awaiting_approval"
    }


@app.get("/api/leads")
def fetch_leads(db: Session = Depends(get_db)):
    return get_leads(db)


@app.get("/api/leads/{lead_id}")
def fetch_lead(
    lead_id: int,
    db: Session = Depends(get_db)
):
    lead = get_lead_by_id(db, lead_id)

    if not lead:
        raise HTTPException(
            status_code=404,
            detail="Lead not found"
        )

    return lead


@app.post("/api/leads/{lead_id}/approve")
def approve_lead(
    lead_id: int,
    approval: EmailApproval,
    db: Session = Depends(get_db)
):
    lead = get_lead_by_id(db, lead_id)

    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    if lead.email_status in ["sent", "rejected", "approved"]:
        raise HTTPException(
            status_code=409,
            detail=f"Email is already {lead.email_status}"
        )

    config = {
        "configurable": {
            "thread_id": f"lead-{lead_id}"
        }
    }

    decision = {
        "action": approval.action
    }

    if approval.action == "edit":
        if not approval.subject or not approval.body:
            raise HTTPException(
                status_code=400,
                detail="Subject and body are required for editing"
            )

        decision["subject"] = approval.subject
        decision["body"] = approval.body

    result = lead_graph.invoke(
        Command(resume=decision),
        config=config
    )

    email_status = result.get("email_status", "unknown")

    if email_status in ["sent", "rejected"]:
        update_email_status(db, lead_id, email_status)

    return {
        "lead_id": lead_id,
        "email_status": email_status,
        "gmail_message_id": result.get("gmail_message_id")
    }