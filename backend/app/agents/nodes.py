from app.agents.state import LeadState
from app.services.llm import llm
from app.schemas.analysis import LeadAnalysis
from app.schemas.email import EmailDraft
from app.services.gmail import send_email as gmail_send_email
from app.services.database import SessionLocal
from app.services.lead_service import update_lead_analysis

from langgraph.types import interrupt

from app.services.lead_service import (
    update_lead_analysis,
    update_email_draft,
    update_email_status
)

def analyze_lead(state: LeadState):

    lead = state["lead"]

    structured_llm = llm.with_structured_output(LeadAnalysis)

    prompt = f"""
    You are an expert sales lead qualification agent.

    Analyze this lead and assign a score between 0 and 100.

    Name: {lead.name}
    Company: {lead.company}
    Budget: {lead.budget}
    Service: {lead.service}
    Urgency: {lead.urgency}
    Requirements: {lead.requirements}

    Scoring:
    High: 75-100
    Medium: 40-74
    Low: 0-39

    Generate score, category, reasoning and recommended_action.
    """

    result = structured_llm.invoke(prompt)

    return {"analysis": result}


def high_priority(state: LeadState):
    return {
        "follow_up_priority": "high",
        "routing_decision": "Schedule discovery call within 24 hours."
    }


def medium_priority(state: LeadState):
    return {
        "follow_up_priority": "medium",
        "routing_decision": "Send follow-up and nurture the lead."
    }


def low_priority(state: LeadState):
    return {
        "follow_up_priority": "low",
        "routing_decision": "Keep lead in low-priority follow-up queue."
    }


def generate_email(state: LeadState):

    lead = state["lead"]
    analysis = state["analysis"]

    structured_llm = llm.with_structured_output(EmailDraft)

    prompt = f"""
    You are an expert sales representative.

    Write a personalized follow-up email.

    Lead:
    Name: {lead.name}
    Company: {lead.company}
    Service: {lead.service}
    Budget: {lead.budget}
    Urgency: {lead.urgency}
    Requirements: {lead.requirements}

    Analysis:
    Score: {analysis.score}
    Category: {analysis.category}
    Reasoning: {analysis.reasoning}
    Recommended action: {analysis.recommended_action}

    Generate a professional email subject and body.
    Do not invent facts or promises.
    """

    result = structured_llm.invoke(prompt)

    db = SessionLocal()

    try:
        updated_lead = update_email_draft(
            db=db,
            lead_id=state["lead_id"],
            subject=result.subject,
            body=result.body
        )

        if not updated_lead:
            raise ValueError(
                f"Lead {state['lead_id']} not found"
            )

    finally:
        db.close()

    return {"email_draft": result}

def human_approval(state: LeadState):
    email = state["email_draft"]

    decision = interrupt({
        "message": "Review email before sending",
        "subject": email.subject,
        "body": email.body
    })

    action = decision.get("action")

    if action == "reject":
        return {
            "email_status": "rejected"
        }

    if action == "edit":
        subject = decision.get("subject")
        body = decision.get("body")

        if not subject or not body:
            raise ValueError("Subject and body are required")

        db = SessionLocal()

        try:
            update_email_draft(
                db=db,
                lead_id=state["lead_id"],
                subject=subject,
                body=body
            )
        finally:
            db.close()

        return {
            "email_draft": EmailDraft(
                subject=subject,
                body=body
            ),
            "email_status": "awaiting_approval"
        }

    if action == "approve":
        return {
            "email_status": "approved"
        }

    raise ValueError("Invalid approval action")


def send_email_node(state: LeadState):
    lead = state["lead"]
    email = state["email_draft"]

    message_id = gmail_send_email(
        to=str(lead.email),
        subject=email.subject,
        body=email.body
    )

    return {
        "email_status": "sent",
        "gmail_message_id": message_id
    }

def save_analysis(state: LeadState):
    db = SessionLocal()

    try:
        updated_lead = update_lead_analysis(
            db=db,
            lead_id=state["lead_id"],
            analysis=state["analysis"]
        )

        if not updated_lead:
            raise ValueError(
                f"Lead {state['lead_id']} not found"
            )

        return {}

    finally:
        db.close()