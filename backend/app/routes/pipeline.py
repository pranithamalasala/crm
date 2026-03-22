# app/routes/pipeline.py
from flask import Blueprint, request
from app.extensions import mysql
from app.utils.helpers import success, error, PIPELINE_STAGES

pipeline_bp = Blueprint("pipeline", __name__, url_prefix="/pipeline")

# ── POST /pipeline/move ──────────────────────────────────────────────────────
@pipeline_bp.route("/move", methods=["POST"])
def move_stage():
    """Move a lead to a specific pipeline stage (or auto-advance)."""
    data = request.get_json()
    lead_id   = data.get("lead_id")
    new_stage = data.get("stage")   # optional: provide explicit stage

    if not lead_id:
        return error("'lead_id' is required")

    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM leads WHERE id = %s", (lead_id,))
    lead = cur.fetchone()
    if not lead:
        cur.close()
        return error("Lead not found", 404)

    current_stage = lead["status"]

    # If no stage provided, auto-advance to next
    if not new_stage:
        if current_stage in ("Won", "Lost"):
            cur.close()
            return error(f"Lead is already in terminal stage: {current_stage}")
        idx = PIPELINE_STAGES.index(current_stage)
        new_stage = PIPELINE_STAGES[idx + 1]
    else:
        if new_stage not in PIPELINE_STAGES:
            cur.close()
            return error(f"Invalid stage. Must be one of: {PIPELINE_STAGES}")

    # Update lead status
    cur.execute("UPDATE leads SET status = %s WHERE id = %s", (new_stage, lead_id))

    # If moved to Won → convert lead to customer
    if new_stage == "Won":
        cur.execute("SELECT customer_id FROM customers WHERE lead_id = %s", (lead_id,))
        if not cur.fetchone():
            cur.execute(
                "INSERT INTO customers (lead_id, name, email, phone) "
                "VALUES (%s, %s, %s, %s)",
                (lead_id, lead["name"], lead["email"], lead["phone"])
            )

    mysql.connection.commit()
    cur.close()
    return success(
        {"lead_id": lead_id, "previous_stage": current_stage, "new_stage": new_stage},
        f"Lead moved to '{new_stage}'"
    )

# ── GET /pipeline/stages ─────────────────────────────────────────────────────
@pipeline_bp.route("/stages", methods=["GET"])
def get_stages():
    """Return all pipeline stages."""
    return success(PIPELINE_STAGES)

# ── GET /pipeline/board ──────────────────────────────────────────────────────
@pipeline_bp.route("/board", methods=["GET"])
def get_board():
    """Return leads grouped by pipeline stage (Kanban view)."""
    cur = mysql.connection.cursor()
    cur.execute(
        "SELECT l.*, u.name AS assigned_user FROM leads l "
        "LEFT JOIN users u ON l.assigned_to = u.id ORDER BY l.created_at DESC"
    )
    leads = cur.fetchall()
    cur.close()

    board = {stage: [] for stage in PIPELINE_STAGES}
    for lead in leads:
        stage = lead["status"]
        if stage in board:
            board[stage].append(lead)

    return success(board)
