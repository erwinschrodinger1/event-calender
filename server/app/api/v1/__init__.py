from flask import Blueprint
from app.api.v1.event import bp as event_bp

bp = Blueprint('api/v1', __name__)
bp.register_blueprint(event_bp, url_prefix="/event")