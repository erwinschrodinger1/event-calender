from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

from flask_marshmallow import Marshmallow

ma = Marshmallow()

from redis import Redis
from rq import Queue

queue = Queue(connection=Redis())

import os
import smtplib
from email.mime.text import MIMEText

sender_email = os.environ.get("GMAIL_USERNAME")
sender_password = os.environ.get("GMAIL_PASSWORD")


def send_notifications(emails, title, content, start_date, end_date):
    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.ehlo()
            server.starttls()
            server.ehlo()
            server.login(sender_email, sender_password)
            for email in emails:
                recipient_email = email
                subject = "Event Schedule Alert"
                body = f"""
                    <html>
                    <body>
                        <h1>Event Title: {title}</h1>
                        <p>{content}</p>
                        <p>Starting from: {start_date}</p>
                        <p>To: {end_date}</p>
                    </body>
                    </html>
                    """

                html_message = MIMEText(body, "html")
                html_message["Subject"] = subject
                html_message["From"] = sender_email
                html_message["To"] = recipient_email
                server.sendmail(sender_email, recipient_email, html_message.as_string())
    except e:
        print(e)
