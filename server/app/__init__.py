from flask import Flask
from flask import Blueprint
from config import Config
from app.extensions import db, ma

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Extensions 
    db.init_app(app)
    ma.init_app(app)

    # Blueprints
    from app.main import bp as main_bp
    app.register_blueprint(main_bp)

    from app.api.v1 import bp as api_bp
    app.register_blueprint(api_bp, url_prefix="/api/v1")

    @app.route('/test/')
    def test_page():
        return '<h1>Testing the Flask Application</h1>'

    return app