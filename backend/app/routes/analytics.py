from flask import Blueprint
from app import get_db
from app.utils.helpers import success, PIPELINE_STAGES, rows_to_list

analytics_bp = Blueprint("analytics", __name__, url_prefix="/analytics")

@analytics_bp.route("", methods=["GET"])
def get_analytics():
    db = get_db()
    total_leads = db.execute("SELECT COUNT(*) AS total FROM leads").fetchone()["total"]
    stage_rows = db.execute("SELECT status AS stage, COUNT(*) AS count FROM leads GROUP BY status").fetchall()
    leads_by_stage = {stage: 0 for stage in PIPELINE_STAGES}
    for row in stage_rows:
        leads_by_stage[row["stage"]] = row["count"]
    deals_won = leads_by_stage.get("Won", 0)
    conversion_rate = round((deals_won / total_leads) * 100, 2) if total_leads else 0.0
    total_customers = db.execute("SELECT COUNT(*) AS total FROM customers").fetchone()["total"]
    activity_rows = db.execute("SELECT type, COUNT(*) AS count FROM activities GROUP BY type").fetchall()
    activities_breakdown = {row["type"]: row["count"] for row in activity_rows}
    total_value = db.execute("SELECT COALESCE(SUM(value),0) AS total FROM leads").fetchone()["total"]
    won_value = db.execute("SELECT COALESCE(SUM(value),0) AS total FROM leads WHERE status='Won'").fetchone()["total"]
    monthly = db.execute(
        "SELECT strftime('%Y-%m', created_at) AS month, COUNT(*) AS count, COALESCE(SUM(value),0) AS value "
        "FROM leads GROUP BY month ORDER BY month DESC LIMIT 6"
    ).fetchall()
    return success({
        "total_leads":          total_leads,
        "total_pipeline_value": total_value,
        "leads_by_stage":       leads_by_stage,
        "deals_won":            deals_won,
        "won_value":            won_value,
        "conversion_rate_pct":  conversion_rate,
        "total_customers":      total_customers,
        "activities_breakdown": activities_breakdown,
        "monthly_data":         rows_to_list(monthly),
    })
