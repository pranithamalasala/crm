from flask import Flask
from flask_cors import CORS
from app.routes.leads import leads_bp
from app.extensions import mysql

def create_app():
    app = Flask(__name__)

    # MySQL config
    app.config['MYSQL_HOST'] = 'localhost'
    app.config['MYSQL_USER'] = 'root'
    app.config['MYSQL_PASSWORD'] = ''
    app.config['MYSQL_DB'] = 'crm'

    mysql.init_app(app)

    # ✅ FIX CORS
    CORS(app)

    # Register routes
    app.register_blueprint(leads_bp)

    return app