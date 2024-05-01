from flask import jsonify
from .models import Event
from .schema import event_schema, event_schemas
from app.extensions import db
from dateutil.parser import parse
from sqlalchemy import extract
from datetime import datetime


def create_event(title, content, event_date, contact_email):
    new_event = Event(title, content, parse(event_date), contact_email)
    db.session.add(new_event)
    db.session.commit()

    return event_schema.jsonify(new_event)


def get_event_dates(year, month):
    result = Event.query.filter(
        extract("year", Event.event_date) == year,
        extract("month", Event.event_date) == month,
    ).all()

    return [event.event_date for event in result]


def get_event_detail(year, month, day):
    result = Event.query.filter(
        extract("year", Event.event_date) == year,
        extract("month", Event.event_date) == month,
        extract("day", Event.event_date) == day,
    ).all()

    return event_schemas.jsonify(result)
