import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
import base64
from email.message import EmailMessage
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Credentials from environment variables
DEFAULT_SENDER_EMAIL = os.getenv("SENDER_EMAIL", "")
if not DEFAULT_SENDER_EMAIL:
    print("WARNING: SENDER_EMAIL not set in environment variables.")

@app.route("/upload", methods=["POST"])
def upload_excel():
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400
    try:
        # User might need openpyxl for .xlsx files
        df = pd.read_excel(file, engine='openpyxl')
        # Fill NaN with empty strings to avoid JSON serialization issues
        df = df.fillna("")
        return jsonify(df.to_dict(orient="records"))
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/send-email", methods=["POST"])
def send_email():
    data = request.json
    
    sender_email = data.get("sender_email") or DEFAULT_SENDER_EMAIL
    access_token = data.get("access_token")
    recipient = data.get("recipient")
    subject = data.get("subject")
    message = data.get("message")

    if not all([sender_email, access_token, recipient, subject, message]):
        return jsonify({"status": "error", "message": "Missing required fields or credentials"}), 400

    try:
        creds = Credentials(access_token)
        service = build('gmail', 'v1', credentials=creds)

        msg = EmailMessage()
        msg.set_content(message)
        msg["From"] = sender_email
        msg["To"] = recipient
        msg["Subject"] = subject
        
        encoded_message = base64.urlsafe_b64encode(msg.as_bytes()).decode()
        create_message = {'raw': encoded_message}

        service.users().messages().send(userId="me", body=create_message).execute()

        return jsonify({"status": "success", "message": "Email sent successfully"})
    except Exception as e:
        import traceback
        traceback.print_exc()
        if "google.auth.exceptions.RefreshError" in str(type(e)):
             return jsonify({"status": "error", "message": "Your Google connection expired or is invalid. Please sign out and sign in again."}), 401
        return jsonify({"status": "error", "message": "Could not send email: " + str(e)}), 500

if __name__ == "__main__":
    app.run(port=5000, debug=True)
