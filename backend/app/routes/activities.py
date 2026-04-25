from flask import Blueprint, request
from app import get_db
from app.utils.helpers import success, error, rows_to_list, row_to_dict

activities_bp = Blueprint("activities", __name__, url_prefix="/activities")

@activities_bp.route("", methods=["GET"])
def get_activities():
    lead_id = request.args.get("lead_id")
    db = get_db()
    if lead_id:
        rows = db.execute(
            "SELECT a.*, u.name AS user_name FROM activities a "
            "JOIN users u ON a.user_id = u.id "
            "WHERE a.lead_id = ? ORDER BY a.date DESC", (lead_id,)
        ).fetchall()
    else:
        rows = db.execute(
            "SELECT a.*, u.name AS user_name FROM activities a "
            "JOIN users u ON a.user_id = u.id ORDER BY a.date DESC"
        ).fetchall()
    return success(rows_to_list(rows))

@activities_bp.route("", methods=["POST"])
def create_activity():
    data = request.get_json() or {}
    for f in ["lead_id", "user_id", "type"]:
        if not data.get(f):
            return error(f"'{f}' is required")
    if data["type"] not in ("call", "email", "meeting"):
        return error("'type' must be one of: call, email, meeting")
    db = get_db()
    if not db.execute("SELECT id FROM leads WHERE id = ?", (data["lead_id"],)).fetchone():
        return error("Lead not found", 404)
    cur = db.execute(
        "INSERT INTO activities (lead_id, user_id, type, notes) VALUES (?, ?, ?, ?)",
        (data["lead_id"], data["user_id"], data["type"], data.get("notes"))
    )
    db.commit()
    return success({"activity_id": cur.lastrowid}, "Activity logged", 201)

@activities_bp.route("/<int:activity_id>", methods=["DELETE"])
def delete_activity(activity_id):
    db = get_db()
    if not db.execute("SELECT activity_id FROM activities WHERE activity_id = ?", (activity_id,)).fetchone():
        return error("Activity not found", 404)
    db.execute("DELETE FROM activities WHERE activity_id = ?", (activity_id,))
    db.commit()
    return success(message="Activity deleted")
