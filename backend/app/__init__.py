# app/__init__.py
from flask import Flask
from config.config import Config
from app.extensions import mysql

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # MySQL config keys expected by flask_mysqldb
    app.config["MYSQL_HOST"]     = Config.MYSQL_HOST
    app.config["MYSQL_USER"]     = Config.MYSQL_USER
    app.config["MYSQL_PASSWORD"] = Config.MYSQL_PASSWORD
    app.config["MYSQL_DB"]       = Config.MYSQL_DB
    app.config["MYSQL_PORT"]     = Config.MYSQL_PORT
    app.config["MYSQL_CURSORCLASS"] = "DictCursor"

    mysql.init_app(app)

    # Register blueprints
    from app.routes.leads      import leads_bp
    from app.routes.customers  import customers_bp
    from app.routes.activities import activities_bp
    from app.routes.pipeline   import pipeline_bp
    from app.routes.analytics  import analytics_bp

    app.register_blueprint(leads_bp)
    app.register_blueprint(customers_bp)
    app.register_blueprint(activities_bp)
    app.register_blueprint(pipeline_bp)
    app.register_blueprint(analytics_bp)

    return app
