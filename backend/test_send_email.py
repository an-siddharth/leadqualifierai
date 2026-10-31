
from app.services.gmail import send_email

try:
    message_id = send_email(
        to="anshsiddharth98@gmail.com",
        subject="LeadQualifierAI - Test Email",
        body="Hello! Gmail API integration is working successfully."
    )

    print("Email sent successfully!")
    print("Message ID:", message_id)

except Exception as e:
    print("Email sending failed:", e)

