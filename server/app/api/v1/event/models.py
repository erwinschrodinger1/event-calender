from app.extensions import db, ma
from sqlalchemy import Column, Integer, DateTime, String, Text, func


class Event(db.Model):
    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(150), nullable=False)
    content = Column(Text, nullable=False)
    event_date = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    def __repr__(self):
        return f'<Event "{self.title}">'

    def __init__(self, title, content, event_date):
        self.title = title
        self.content = content
        self.event_date = event_date
