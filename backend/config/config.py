# config/config.py
import os

class Config:
    SECRET_KEY     = os.environ.get("SECRET_KEY",      "dev-secret-key-change-in-production")
    MYSQL_HOST     = os.environ.get("MYSQL_HOST",      "localhost")
    MYSQL_USER     = os.environ.get("MYSQL_USER",      "root")
    MYSQL_PASSWORD = os.environ.get("MYSQL_PASSWORD",  "yourpassword")
    MYSQL_DB       = os.environ.get("MYSQL_DB",        "crm_db")
    MYSQL_PORT     = int(os.environ.get("MYSQL_PORT",  3306))
    DEBUG          = os.environ.get("DEBUG", "true").lower() == "true"
