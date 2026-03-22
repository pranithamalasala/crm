"""
crm_backend/app/utils/db_helpers.py
Thin wrappers around MySQLdb cursor management.
"""

from app.extensions import mysql


def query_db(sql: str, args: tuple = (), one: bool = False):
    """Execute a SELECT and return dict-rows."""
    cur = mysql.connection.cursor()
    cur.execute(sql, args)
    rows = cur.fetchall()
    cur.close()
    return rows[0] if (one and rows) else rows


def mutate_db(sql: str, args: tuple = ()) -> int:
    """Execute INSERT / UPDATE / DELETE; returns lastrowid."""
    cur = mysql.connection.cursor()
    cur.execute(sql, args)
    mysql.connection.commit()
    last_id = cur.lastrowid
    cur.close()
    return last_id
