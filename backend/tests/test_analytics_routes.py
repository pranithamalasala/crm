
from unittest.mock import MagicMock, patch

import pytest
from flask import Flask

from app.routes.analytics import analytics_bp


@pytest.fixture
def app():
    app = Flask(__name__)
    app.register_blueprint(analytics_bp)
    app.config["TESTING"] = True
    return app


@pytest.fixture
def client(app):
    return app.test_client()


def mock_db(
    total_leads=10,
    stage_rows=None,
    total_customers=4,
    activity_rows=None,
    total_value=50000,
    won_value=15000,
    monthly_rows=None,
):
    db = MagicMock()

    def execute_side_effect(sql, params=()):
        result = MagicMock()

        # Check specific GROUP BY queries before general SUM queries.
        if "GROUP BY month" in sql:
            result.fetchall.return_value = monthly_rows or []

        elif "GROUP BY status" in sql:
            result.fetchall.return_value = stage_rows or []

        elif "GROUP BY type" in sql:
            result.fetchall.return_value = activity_rows or []

        elif "COUNT(*) AS total FROM leads" in sql:
            result.fetchone.return_value = {"total": total_leads}

        elif "COUNT(*) AS total FROM customers" in sql:
            result.fetchone.return_value = {
                "total": total_customers
            }

        elif "WHERE status='Won'" in sql:
            result.fetchone.return_value = {"total": won_value}

        elif "SUM(value)" in sql:
            result.fetchone.return_value = {"total": total_value}

        return result

    db.execute.side_effect = execute_side_effect
    return db


def test_get_analytics_success(client):
    db = mock_db(
        total_leads=10,
        stage_rows=[
            {"stage": "New Lead", "count": 4},
            {"stage": "Won", "count": 3},
        ],
        total_customers=5,
        activity_rows=[
            {"type": "call", "count": 6},
            {"type": "meeting", "count": 2},
        ],
        total_value=50000,
        won_value=15000,
        monthly_rows=[
            {
                "month": "2026-10",
                "count": 4,
                "value": 20000,
            }
        ],
    )

    with patch("app.routes.analytics.get_db", return_value=db):
        response = client.get("/analytics")

    assert response.status_code == 200
    payload = response.get_json()["data"]

    assert payload["total_leads"] == 10
    assert payload["total_pipeline_value"] == 50000
    assert payload["deals_won"] == 3
    assert payload["won_value"] == 15000
    assert payload["conversion_rate_pct"] == 30.0
    assert payload["total_customers"] == 5

    assert payload["leads_by_stage"]["New Lead"] == 4
    assert payload["leads_by_stage"]["Won"] == 3
    assert payload["leads_by_stage"]["Lost"] == 0

    assert payload["activities_breakdown"] == {
        "call": 6,
        "meeting": 2,
    }

    assert payload["monthly_data"] == [
        {
            "month": "2026-10",
            "count": 4,
            "value": 20000,
        }
    ]


def test_get_analytics_zero_leads(client):
    db = mock_db(
        total_leads=0,
        stage_rows=[],
        total_customers=0,
        activity_rows=[],
        total_value=0,
        won_value=0,
        monthly_rows=[],
    )

    with patch("app.routes.analytics.get_db", return_value=db):
        response = client.get("/analytics")

    assert response.status_code == 200
    payload = response.get_json()["data"]

    assert payload["total_leads"] == 0
    assert payload["conversion_rate_pct"] == 0.0
    assert payload["deals_won"] == 0
    assert payload["total_customers"] == 0
    assert payload["activities_breakdown"] == {}
    assert payload["monthly_data"] == []


def test_get_analytics_all_leads_won(client):
    db = mock_db(
        total_leads=4,
        stage_rows=[
            {"stage": "Won", "count": 4},
        ],
        total_customers=4,
        total_value=20000,
        won_value=20000,
    )

    with patch("app.routes.analytics.get_db", return_value=db):
        response = client.get("/analytics")

    assert response.status_code == 200
    payload = response.get_json()["data"]

    assert payload["conversion_rate_pct"] == 100.0
    assert payload["deals_won"] == 4
    assert payload["won_value"] == 20000
