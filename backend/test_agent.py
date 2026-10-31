
from app.agents.graph import lead_graph
from app.schemas.lead import LeadInput
from langgraph.types import Command

lead = LeadInput(
    name="Rahul Sharma",
    email="rahul@example.com",
    company="TechNova Solutions",
    budget=50000,
    service="AI Automation",
    urgency="high",
    requirements="We need an AI chatbot to automate customer support."
)

config = {
    "configurable": {
        "thread_id": "lead-001"
    }
}

# Start workflow
result = lead_graph.invoke(
    {"lead": lead},
    config=config
)

# Display generated email
email = result["email_draft"]

print("\n--- EMAIL GENERATED ---")
print("To:", lead.email)
print("Subject:", email.subject)
print("\nBody:\n", email.body)

# Manual approval
while True:
    choice = input("\nApprove, Edit or Reject? (a/e/r): ").lower().strip()

    if choice == "a":
        approval = {"action": "approve"}
        break

    elif choice == "e":
        subject = input("\nEnter new subject: ")
        body = input("\nEnter new body:\n")
        approval = {
            "action": "approve",
            "subject": subject,
            "body": body
        }
        break

    elif choice == "r":
        approval = {"action": "reject"}
        break

    else:
        print("Invalid choice. Enter a, e or r.")

# Resume workflow
result = lead_graph.invoke(
    Command(resume=approval),
    config=config
)

print("\n--- WORKFLOW RESULT ---")
print("Email Status:", result["email_status"])

if result["email_status"] == "sent":
    print("Gmail Message ID:", result["gmail_message_id"])
