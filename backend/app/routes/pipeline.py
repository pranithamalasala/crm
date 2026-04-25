from flask import Blueprint, request
from app import get_db
from app.utils.helpers import success, error, PIPELINE_STAGES, rows_to_list, row_to_dict

pipeline_bp = Blueprint("pipeline", __name__, url_prefix="/pipeline")

@pipeline_bp.route("/move", methods=["POST"])
def move_stage():
    data = request.get_json() or {}
    lead_id   = data.get("lead_id")
    new_stage = data.get("stage")
    if not lead_id:
        return error("'lead_id' is required")
    db = get_db()
    lead = db.execute("SELECT * FROM leads WHERE id = ?", (lead_id,)).fetchone()
    if not lead:
        return error("Lead not found", 404)
    lead = row_to_dict(lead)
    current_stage = lead["status"]
    if not new_stage:
        if current_stage in ("Won", "Lost"):
            return error(f"Lead is already in terminal stage: {current_stage}")
        idx = PIPELINE_STAGES.index(current_stage)
        new_stage = PIPELINE_STAGES[idx + 1]
    else:
        if new_stage not in PIPELINE_STAGES:
            return error(f"Invalid stage. Must be one of: {PIPELINE_STAGES}")
    db.execute("UPDATE leads SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", (new_stage, lead_id))
    if new_stage == "Won":
        existing = db.execute("SELECT customer_id FROM customers WHERE lead_id = ?", (lead_id,)).fetchone()
        if not existing:
            db.execute(
                "INSERT INTO customers (lead_id, name, email, phone, company) VALUES (?, ?, ?, ?, ?)",
                (lead_id, lead["name"], lead["email"], lead["phone"], lead.get("company"))
            )
    db.commit()
    return success(
        {"lead_id": lead_id, "previous_stage": current_stage, "new_stage": new_stage},
        f"Lead moved to '{new_stage}'"
    )

@pipeline_bp.route("/stages", methods=["GET"])
def get_stages():
    return success(PIPELINE_STAGES)

@pipeline_bp.route("/board", methods=["GET"])
def get_board():
    db = get_db()
    rows = db.execute(
        "SELECT l.*, u.name AS assigned_user FROM leads l "
        "LEFT JOIN users u ON l.assigned_to = u.id ORDER BY l.created_at DESC"
    ).fetchall()
    board = {stage: [] for stage in PIPELINE_STAGES}
    for row in rows:
        r = row_to_dict(row)
        if r["status"] in board:
            board[r["status"]].append(r)
    return success(board)
