from operator import and_, or_
from flask import jsonify
from app.extensions import ma
from marshmallow import ValidationError, fields
from .models import Event
from dateutil.parser import parse


class EventSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Event

    def validate(self, data, **kwargs):
        start_date = data.get("start_date")
        end_date = data.get("end_date")
        if start_date and end_date:
            overlapping_events = Event.query.filter(
                or_(
                    Event.start_date.between(start_date, end_date),
                    Event.end_date.between(start_date, end_date),
                )
            ).all()
            if overlapping_events:
                return {"message": "Event overlaps with existing events"}


class EventBodySchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Event


class EventUpdateSchema(ma.SQLAlchemyAutoSchema):
    def validate(self, data, **kwargs):
        id = data.get("id")
        start_date = data.get("start_date")
        end_date = data.get("end_date")
        if start_date and end_date:
            overlapping_events = Event.query.filter(
                and_(
                    Event.id != id,
                    (
                        Event.start_date.between(start_date, end_date)
                        | Event.end_date.between(start_date, end_date)
                    ),
                )
            ).all()
            if overlapping_events:
                return {"message": "Event overlaps with existing events"}


event_body_schema = EventBodySchema()
event_update_schema = EventUpdateSchema()

event_schema = EventSchema()
event_schemas = EventSchema(many=True)


class GetSchema(ma.Schema):
    year = fields.Int(required=True)
    month = fields.Int(required=True)


get_schema = GetSchema()


class GetDetailSchema(ma.Schema):
    year = fields.Int(required=True)
    month = fields.Int(required=True)
    day = fields.Int(required=True)


get_detail_schema = GetDetailSchema()
