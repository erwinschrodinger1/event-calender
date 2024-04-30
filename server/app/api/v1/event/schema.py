from app.extensions import ma
from marshmallow import fields
from .models import Event


class EventSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Event


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
