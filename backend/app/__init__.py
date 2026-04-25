import os
import sqlite3
from flask import Flask, g
from flask_cors import CORS

DB_PATH = os.path.join(os.path.dirname(__file__), '..', 'crm.db')

def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect(DB_PATH, detect_types=sqlite3.PARSE_DECLTYPES)
        g.db.row_factory = sqlite3.Row
        g.db.execute("PRAGMA foreign_keys = ON")
    return g.db

def close_db(e=None):
    db = g.pop('db', None)
    if db is not None:
        db.close()

def init_db(app):
    with app.app_context():
        db = get_db()
        schema = os.path.join(os.path.dirname(__file__), '..', 'migrations', 'schema.sql')
        with open(schema) as f:
            db.executescript(f.read())
        db.commit()

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
    app.config['DEBUG'] = os.getenv('FLASK_DEBUG', 'True').lower() == 'true'

    CORS(app)
    app.teardown_appcontext(close_db)

    from app.routes.leads      import leads_bp
    from app.routes.customers  import customers_bp
    from app.routes.activities import activities_bp
    from app.routes.pipeline   import pipeline_bp
    from app.routes.analytics  import analytics_bp
    from app.routes.users      import users_bp

    app.register_blueprint(leads_bp)
    app.register_blueprint(customers_bp)
    app.register_blueprint(activities_bp)
    app.register_blueprint(pipeline_bp)
    app.register_blueprint(analytics_bp)
    app.register_blueprint(users_bp)

    init_db(app)
    return app
