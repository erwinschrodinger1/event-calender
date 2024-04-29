from app.extensions import db, ma

class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150))
    content = db.Column(db.Text)
    event_date = db.Column(db.DateTime(timezone=True))
    created_at = db.Column(db.DateTime(timezone=True), server_default=db.func.now())

    def __repr__(self):
        return f'<Event "{self.title}">'


class EventSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Event

event_schema = EventSchema()
event_schemas = EventSchema(many=True)    
