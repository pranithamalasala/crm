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

    # Flask-MySQLdb
    MYSQL_HOST     = os.getenv("MYSQL_HOST",     "localhost")
    MYSQL_PORT     = int(os.getenv("MYSQL_PORT", "3306"))
    MYSQL_USER     = os.getenv("MYSQL_USER",     "root")
    MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD", "")
    MYSQL_DB       = os.getenv("MYSQL_DB",       "crm_db")
    MYSQL_CURSORCLASS = "DictCursor"          # rows returned as dicts


class DevelopmentConfig(Config):
    DEBUG = True


class ProductionConfig(Config):
    DEBUG = False
