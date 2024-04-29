from flask import render_template, jsonify
from app.api.v1.event import bp
from app.api.v1.event.models import Event,event_schemas
import json


@bp.route('/')
def index():
    return "Events"

@bp.route('/categories/')
def categories():
    event = Event.query.all()
    print(event)
    return jsonify(event_schemas.dump(event))

