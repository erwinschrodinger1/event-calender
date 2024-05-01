from http.client import BAD_REQUEST
from flask import render_template, jsonify, request, Response
from app.api.v1.event import bp
from app.api.v1.event.models import Event
from .schema import event_schema, get_schema, get_detail_schema
import json
from .controllers import create_event, get_event_dates, get_event_detail


@bp.route("/create", methods=["POST"])
def create():
    errors = event_schema.validate(request.json)
    if errors:
        return Response(json.dumps(errors), BAD_REQUEST)

    title = request.json["title"]
    content = request.json["content"]
    event_date = request.json["event_date"]
    contact_email = request.json["contact_email"]
    return create_event(title, content, event_date, contact_email)


@bp.route("/", methods=["GET"])
def get_date():
    errors = get_schema.validate(request.args)
    if errors:
        return Response(json.dumps(errors), BAD_REQUEST)

    year = int(request.args.get("year"))
    month = int(request.args.get("month"))
    return get_event_dates(year, month)


@bp.route("/detail", methods=["GET"])
def get_detail():
    errors = get_detail_schema.validate(request.args)
    if errors:
        return Response(json.dumps(errors), BAD_REQUEST)

    year = int(request.args.get("year"))
    month = int(request.args.get("month"))
    day = int(request.args.get("day"))
    return get_event_detail(year, month, day)
