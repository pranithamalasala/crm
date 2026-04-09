"""
crm_backend/app/config.py
All configuration is read from environment variables (or .env via python-dotenv).
"""

import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    # Flask
    SECRET_KEY = os.getenv("SECRET_KEY", "change-me-in-production")
    DEBUG      = os.getenv("FLASK_DEBUG", "False").lower() == "true"

    # Flask-MySQLdb (FORCED VALUES - FIX)
    MYSQL_HOST = "localhost"
    MYSQL_PORT = 3306
    MYSQL_USER = "root"
    MYSQL_PASSWORD = ""   # VERY IMPORTANT (empty for XAMPP)
    MYSQL_DB = "crm"      # match your created database
    MYSQL_CURSORCLASS = "DictCursor"


class DevelopmentConfig(Config):
    DEBUG = True


class ProductionConfig(Config):
    DEBUG = False