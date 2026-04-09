# app/routes/leads.py
from flask import Blueprint, request
from app.extensions import mysql
from app.utils.helpers import success, error

leads_bp = Blueprint("leads", __name__, url_prefix="/leads")

# ── GET /leads ──────────────────────────────────────────────────────────────
@leads_bp.route("", methods=["GET"])
def get_leads():
    status = request.args.get("status")
    cur = mysql.connection.cursor()
    if status:
        cur.execute(
            "SELECT l.*, u.name AS assigned_user FROM leads l "
            "LEFT JOIN users u ON l.assigned_to = u.id "
            "WHERE l.status = %s ORDER BY l.created_at DESC",
            (status,)
        )
    else:
        cur.execute(
            "SELECT l.*, u.name AS assigned_user FROM leads l "
            "LEFT JOIN users u ON l.assigned_to = u.id "
            "ORDER BY l.created_at DESC"
        )
    leads = cur.fetchall()
    cur.close()
    return success(leads)

# ── GET /leads/<id> ──────────────────────────────────────────────────────────
@leads_bp.route("/<int:lead_id>", methods=["GET"])
def get_lead(lead_id):
    cur = mysql.connection.cursor()
    cur.execute(
        "SELECT l.*, u.name AS assigned_user FROM leads l "
        "LEFT JOIN users u ON l.assigned_to = u.id WHERE l.id = %s",
        (lead_id,)
    )
    lead = cur.fetchone()
    cur.close()
    if not lead:
        return error("Lead not found", 404)
    return success(lead)

# ── POST /leads ──────────────────────────────────────────────────────────────
@leads_bp.route("", methods=["POST"])
def create_lead():
    data = request.get_json()
    required = ["name", "email"]
    for field in required:
        if not data.get(field):
            return error(f"'{field}' is required")

    cur = mysql.connection.cursor()
    cur.execute(
        "INSERT INTO leads (name, email, phone, source, status, assigned_to) "
        "VALUES (%s, %s, %s, %s, %s, %s)",
        (
            data["name"],
            data["email"],
            data.get("phone"),
            data.get("source"),
            data.get("status", "New Lead"),
            data.get("assigned_to"),
        )
    )
    mysql.connection.commit()
    lead_id = cur.lastrowid
    cur.close()
    return success({"id": lead_id}, "Lead created successfully", 201)

# ── PUT /leads/<id> ──────────────────────────────────────────────────────────
@leads_bp.route("/<int:lead_id>", methods=["PUT"])
def update_lead(lead_id):
    data = request.get_json()
    cur = mysql.connection.cursor()
    cur.execute("SELECT id FROM leads WHERE id = %s", (lead_id,))
    if not cur.fetchone():
        cur.close()
        return error("Lead not found", 404)

    fields = []
    values = []
    for col in ["name", "email", "phone", "source", "status", "assigned_to"]:
        if col in data:
            fields.append(f"{col} = %s")
            values.append(data[col])

    if not fields:
        cur.close()
        return error("No valid fields to update")

    values.append(lead_id)
    cur.execute(f"UPDATE leads SET {', '.join(fields)} WHERE id = %s", values)
    mysql.connection.commit()
    cur.close()
    return success(message="Lead updated successfully")

# ── DELETE /leads/<id> ───────────────────────────────────────────────────────
@leads_bp.route("/<int:lead_id>", methods=["DELETE"])
def delete_lead(lead_id):
    cur = mysql.connection.cursor()
    cur.execute("SELECT id FROM leads WHERE id = %s", (lead_id,))
    if not cur.fetchone():
        cur.close()
        return error("Lead not found", 404)
    cur.execute("DELETE FROM leads WHERE id = %s", (lead_id,))
    mysql.connection.commit()
    cur.close()
    return success(message="Lead deleted successfully")