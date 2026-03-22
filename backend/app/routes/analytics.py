# app/routes/analytics.py
from flask import Blueprint
from app.extensions import mysql
from app.utils.helpers import success, PIPELINE_STAGES

analytics_bp = Blueprint("analytics", __name__, url_prefix="/analytics")

# ── GET /analytics ────────────────────────────────────────────────────────────
@analytics_bp.route("", methods=["GET"])
def get_analytics():
    cur = mysql.connection.cursor()

    # Total leads
    cur.execute("SELECT COUNT(*) AS total FROM leads")
    total_leads = cur.fetchone()["total"]

    # Leads by stage
    cur.execute(
        "SELECT status AS stage, COUNT(*) AS count FROM leads GROUP BY status"
    )
    stage_rows = cur.fetchall()
    leads_by_stage = {stage: 0 for stage in PIPELINE_STAGES}
    for row in stage_rows:
        leads_by_stage[row["stage"]] = row["count"]

    # Deals won
    deals_won = leads_by_stage.get("Won", 0)

    # Conversion rate = Won / Total  (avoid div-by-zero)
    conversion_rate = round((deals_won / total_leads) * 100, 2) if total_leads else 0.0

    # Total customers
    cur.execute("SELECT COUNT(*) AS total FROM customers")
    total_customers = cur.fetchone()["total"]

    # Activities breakdown
    cur.execute(
        "SELECT type, COUNT(*) AS count FROM activities GROUP BY type"
    )
    activity_rows = cur.fetchall()
    activities_breakdown = {row["type"]: row["count"] for row in activity_rows}

    cur.close()

    return success({
        "total_leads":          total_leads,
        "leads_by_stage":       leads_by_stage,
        "deals_won":            deals_won,
        "conversion_rate_pct":  conversion_rate,
        "total_customers":      total_customers,
        "activities_breakdown": activities_breakdown,
    })
