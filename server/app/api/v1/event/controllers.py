from flask import jsonify
from .models import Event
from .schema import event_schema, event_schemas
from app.extensions import db
from dateutil.parser import parse
from sqlalchemy import extract
from datetime import datetime
from app.extensions import queue, send_notifications


def create_event(title, content, start_date, end_date, participants_email):
    j = queue.enqueue_at(
        parse(start_date),
        send_notifications,
        (participants_email, title, content, start_date, end_date),
    )
    new_event = Event(
        title,
        content,
        parse(start_date),
        parse(end_date),
        participants_email,
        j.get_id(),
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


def update_event(id, title, content, start_date, end_date, participants_email):
    event = Event.query.filter_by(id=id).first()
    if event:
        job = queue.fetch_job(event.job_id)
        if job:
            job.delete()
        new_job = queue.enqueue_at(
            parse(start_date),
            send_notifications,
            (participants_email, title, content, start_date, end_date),
        )
        event.job_id = new_job.get_id()
        event.title = title
        event.content = content
        event.start_date = parse(start_date)
        event.end_date = parse(end_date)
        event.participants_email = participants_email
        db.session.commit()
        return jsonify({"message": "event updated"})

    return jsonify({"message": "event not found"})
