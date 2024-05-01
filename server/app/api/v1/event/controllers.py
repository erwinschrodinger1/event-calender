from flask import jsonify
from .models import Event
from .schema import event_schema, event_schemas
from app.extensions import db
from dateutil.parser import parse
from sqlalchemy import extract
from datetime import datetime


def create_event(title, content, start_date, end_date, participants_email):
    new_event = Event(
        title, content, parse(start_date), parse(end_date), participants_email
    )
    db.session.add(new_event)
    db.session.commit()

    return event_schema.jsonify(new_event)


def get_event_dates(year, month):
    result = Event.query.filter(
        extract("year", Event.start_date) == year,
        extract("month", Event.start_date) == month,
    ).all()

    return [event.start_date for event in result]


def get_event_detail(year, month, day):
    result = Event.query.filter(
        extract("year", Event.start_date) == year,
        extract("month", Event.start_date) == month,
        extract("day", Event.start_date) == day,
    ).all()

    return event_schemas.jsonify(result)


def delete_event(id):
    event = Event.query.filter_by(id=id).first()
    if event:
        db.session.delete(event)
        db.session.commit()
        return "Event Deleted"
    else:
        return "Event Id Doesnot exist"
