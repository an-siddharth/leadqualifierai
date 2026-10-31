from app.services.database import SessionLocal
from app.services.lead_service import (
    create_lead,
    get_leads,
    get_lead_by_id
)
from app.schemas.lead import LeadInput


db = SessionLocal()

try:
    # Create a test lead
    lead_data = LeadInput(
        name="Aman Verma",
        email="aman@example.com",
        company="TechSolutions",
        budget=50000,
        service="AI Automation",
        urgency="high",
        requirements="Need an AI chatbot for customer support."
    )

    new_lead = create_lead(db, lead_data)
    print("Created Lead ID:", new_lead.id)

    # Fetch all leads
    leads = get_leads(db)
    print("Total Leads:", len(leads))

    # Fetch lead by ID
    lead = get_lead_by_id(db, new_lead.id)
    print("Fetched Lead:", lead.name)

finally:
    db.close()