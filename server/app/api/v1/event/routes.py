from http.client import BAD_REQUEST
from flask import render_template, jsonify, request, Response
from app.api.v1.event import bp
from app.api.v1.event.models import Event
from .schema import (
    event_schema,
    get_schema,
    get_detail_schema,
    event_update_schema,
    event_body_schema,
)
import json
from .controllers import (
    create_event,
    delete_event,
    get_event_dates,
    get_event_detail,
    update_event,
)
from app.extensions import send_notifications


@bp.route("/create", methods=["POST"])
def create():
    errors = event_schema.validate(request.json)
    if errors:
        print("Validation here")
        return Response(json.dumps(errors), BAD_REQUEST)

    title = request.json["title"]
    content = request.json["content"]
    start_date = request.json["start_date"]
    end_date = request.json["end_date"]
    participants_email = request.json["participants_email"]
    return create_event(title, content, start_date, end_date, participants_email)


@bp.route("/", methods=["GET"])
def get_date():
    send_notifications()
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


@bp.route("/<int:id>", methods=["DELETE"])
def delete(id):
    return delete_event(id)


@bp.route("/<int:id>", methods=["PATCH"])
def update(id):
    body_errors = event_body_schema.validate(request.json)
    print(body_errors)
    if body_errors:
        return Response(json.dumps(body_errors), BAD_REQUEST)

    errors = event_update_schema.validate(
        {
            "id": id,
            "start_date": request.json["start_date"],
            "end_date": request.json["end_date"],
        }
    )
    if errors:
        return Response(json.dumps(errors), BAD_REQUEST)

    title = request.json["title"]
    content = request.json["content"]
    start_date = request.json["start_date"]
    end_date = request.json["end_date"]
    participants_email = request.json["participants_email"]
    return update_event(id, title, content, start_date, end_date, participants_email)
