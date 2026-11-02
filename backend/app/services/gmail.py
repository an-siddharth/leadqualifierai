import os
import base64
import html

from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

SCOPES = ["https://www.googleapis.com/auth/gmail.send"]

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))

CREDENTIALS_FILE = os.path.join(BASE_DIR, "credentials.json")
TOKEN_FILE = os.path.join(BASE_DIR, "token.json")


def get_gmail_service():
    creds = None

    if os.path.exists(TOKEN_FILE):
        creds = Credentials.from_authorized_user_file(
            TOKEN_FILE, SCOPES
        )

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                CREDENTIALS_FILE, SCOPES
            )
            creds = flow.run_local_server(port=0)

        with open(TOKEN_FILE, "w") as token:
            token.write(creds.to_json())

    return build("gmail", "v1", credentials=creds)


def send_email(to, subject, body):
    service = get_gmail_service()

    # Convert plain text line breaks into HTML paragraphs
    escaped_body = html.escape(body.strip())
    paragraphs = escaped_body.split("\n\n")

    html_body = "".join(
        f"<p>{paragraph.replace(chr(10), '<br>')}</p>"
        for paragraph in paragraphs
        if paragraph.strip()
    )

    html_content = f"""
    <html>
      <body style="
        font-family: Arial, sans-serif;
        font-size: 14px;
        line-height: 1.7;
        color: #333333;
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
      ">
        {html_body}
      </body>
    </html>
    """

    message = MIMEMultipart("alternative")
    message["to"] = to
    message["subject"] = subject

    message.attach(MIMEText(body.strip(), "plain", "utf-8"))
    message.attach(MIMEText(html_content, "html", "utf-8"))

    encoded_message = base64.urlsafe_b64encode(
        message.as_bytes()
    ).decode()

    result = service.users().messages().send(
        userId="me",
        body={"raw": encoded_message}
    ).execute()

    return result["id"]
