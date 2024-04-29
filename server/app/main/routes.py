from app.main import bp

@bp.route("/bp")
def index():
    return "Welcome to server"