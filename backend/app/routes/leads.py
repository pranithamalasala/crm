from flask import Blueprint, request
from app import get_db
from app.utils.helpers import success, error, rows_to_list, row_to_dict

leads_bp = Blueprint("leads", __name__, url_prefix="/leads")

@leads_bp.route("", methods=["GET"])
def get_leads():
    status = request.args.get("status")
    db = get_db()
    if status:
        rows = db.execute(
            "SELECT l.*, u.name AS assigned_user FROM leads l "
            "LEFT JOIN users u ON l.assigned_to = u.id "
            "WHERE l.status = ? ORDER BY l.created_at DESC", (status,)
        ).fetchall()
    else:
        rows = db.execute(
            "SELECT l.*, u.name AS assigned_user FROM leads l "
            "LEFT JOIN users u ON l.assigned_to = u.id "
            "ORDER BY l.created_at DESC"
        ).fetchall()
    return success(rows_to_list(rows))

@leads_bp.route("/<int:lead_id>", methods=["GET"])
def get_lead(lead_id):
    db = get_db()
    row = db.execute(
        "SELECT l.*, u.name AS assigned_user FROM leads l "
        "LEFT JOIN users u ON l.assigned_to = u.id WHERE l.id = ?", (lead_id,)
    ).fetchone()
    if not row:
        return error("Lead not found", 404)
    return success(row_to_dict(row))

@leads_bp.route("", methods=["POST"])
def create_lead():
    data = request.get_json() or {}
    for field in ["name", "email"]:
        if not data.get(field):
            return error(f"'{field}' is required")
    db = get_db()
    try:
        cur = db.execute(
            "INSERT INTO leads (name, email, phone, company, source, status, score, value, assigned_to) "
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            (
                data["name"], data["email"],
                data.get("phone"), data.get("company"),
                data.get("source"),
                data.get("status", "New Lead"),
                data.get("score", 0),
                data.get("value", 0),
                data.get("assigned_to"),
            )
        )
        db.commit()
        return success({"id": cur.lastrowid}, "Lead created successfully", 201)
    except Exception as e:
        return error(str(e))

@leads_bp.route("/<int:lead_id>", methods=["PUT"])
def update_lead(lead_id):
    data = request.get_json() or {}
    db = get_db()
    if not db.execute("SELECT id FROM leads WHERE id = ?", (lead_id,)).fetchone():
        return error("Lead not found", 404)
    fields, values = [], []
    for col in ["name", "email", "phone", "company", "source", "status", "score", "value", "assigned_to"]:
        if col in data:
            fields.append(f"{col} = ?")
            values.append(data[col])
    if not fields:
        return error("No valid fields to update")
    values.append(lead_id)
    db.execute(f"UPDATE leads SET {', '.join(fields)}, updated_at = CURRENT_TIMESTAMP WHERE id = ?", values)
    db.commit()
    return success(message="Lead updated successfully")

@leads_bp.route("/<int:lead_id>", methods=["DELETE"])
def delete_lead(lead_id):
    db = get_db()
    if not db.execute("SELECT id FROM leads WHERE id = ?", (lead_id,)).fetchone():
        return error("Lead not found", 404)
    db.execute("DELETE FROM leads WHERE id = ?", (lead_id,))
    db.commit()
    return success(message="Lead deleted successfully")
