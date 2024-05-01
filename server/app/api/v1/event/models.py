from app.extensions import db, ma
from sqlalchemy import Column, Integer, DateTime, String, Text, func, ARRAY


class Event(db.Model):
    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(150), nullable=False)
    content = Column(Text, nullable=False)
    start_date = Column(DateTime(timezone=True), nullable=False)
    end_date = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    job_id = Column(String)
    participants_email = Column(ARRAY(String(150)), nullable=False)

    def __repr__(self):
        return f'<Event "{self.title}">'

    def __init__(
        self, title, content, start_date, end_date, participants_email, job_id
    ):
        self.title = title
        self.content = content
        self.start_date = start_date
        self.end_date = end_date
        self.participants_email = participants_email
        self.job_id = job_id
