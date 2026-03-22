# app/routes/activities.py
from flask import Blueprint, request
from app.extensions import mysql
from app.utils.helpers import success, error

activities_bp = Blueprint("activities", __name__, url_prefix="/activities")

# ── GET /activities?lead_id=<id> ─────────────────────────────────────────────
@activities_bp.route("", methods=["GET"])
def get_activities():
    lead_id = request.args.get("lead_id")
    cur = mysql.connection.cursor()
    if lead_id:
        cur.execute(
            "SELECT a.*, u.name AS user_name FROM activities a "
            "JOIN users u ON a.user_id = u.id "
            "WHERE a.lead_id = %s ORDER BY a.date DESC",
            (lead_id,)
        )
    else:
        cur.execute(
            "SELECT a.*, u.name AS user_name FROM activities a "
            "JOIN users u ON a.user_id = u.id ORDER BY a.date DESC"
        )
    activities = cur.fetchall()
    cur.close()
    return success(activities)

# ── POST /activities ──────────────────────────────────────────────────────────
@activities_bp.route("", methods=["POST"])
def create_activity():
    data = request.get_json()
    required = ["lead_id", "user_id", "type"]
    for f in required:
        if not data.get(f):
            return error(f"'{f}' is required")
    if data["type"] not in ("call", "email", "meeting"):
        return error("'type' must be one of: call, email, meeting")

    cur = mysql.connection.cursor()
    cur.execute("SELECT id FROM leads WHERE id = %s", (data["lead_id"],))
    if not cur.fetchone():
        cur.close()
        return error("Lead not found", 404)

    cur.execute(
        "INSERT INTO activities (lead_id, user_id, type, notes, date) "
        "VALUES (%s, %s, %s, %s, %s)",
        (
            data["lead_id"],
            data["user_id"],
            data["type"],
            data.get("notes"),
            data.get("date"),
        )
    )
    mysql.connection.commit()
    activity_id = cur.lastrowid
    cur.close()
    return success({"activity_id": activity_id}, "Activity logged", 201)

# ── DELETE /activities/<id> ───────────────────────────────────────────────────
@activities_bp.route("/<int:activity_id>", methods=["DELETE"])
def delete_activity(activity_id):
    cur = mysql.connection.cursor()
    cur.execute("SELECT activity_id FROM activities WHERE activity_id = %s", (activity_id,))
    if not cur.fetchone():
        cur.close()
        return error("Activity not found", 404)
    cur.execute("DELETE FROM activities WHERE activity_id = %s", (activity_id,))
    mysql.connection.commit()
    cur.close()
    return success(message="Activity deleted")
