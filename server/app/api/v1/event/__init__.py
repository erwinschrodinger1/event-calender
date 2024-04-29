from flask import Blueprint

bp = Blueprint('event', __name__)

from app.api.v1.event import routes