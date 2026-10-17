
from unittest.mock import MagicMock, patch

import pytest
from flask import Flask

from app.routes.activities import activities_bp


@pytest.fixture
def app():
    app = Flask(__name__)
    app.register_blueprint(activities_bp)
    app.config["TESTING"] = True
    return app


@pytest.fixture
def client(app):
    return app.test_client()


def mock_db(lead_exists=True, activity_rows=None):
    db = MagicMock()

    def execute_side_effect(sql, params=()):
        result = MagicMock()

        if "SELECT id FROM leads" in sql:
            result.fetchone.return_value = (
                {"id": 1} if lead_exists else None
            )
        elif "SELECT a.*, u.name AS user_name" in sql:
            result.fetchall.return_value = activity_rows or []
        elif "INSERT INTO activities" in sql:
            result.lastrowid = 101

        return result

    db.execute.side_effect = execute_side_effect
    return db


# GET /activities

def test_get_activities_empty(client):
    db = mock_db(activity_rows=[])

    with patch("app.routes.activities.get_db", return_value=db):
        response = client.get("/activities")

    assert response.status_code == 200
    assert response.get_json()["data"] == []


def test_get_activities_filtered_by_lead(client):
    db = mock_db(activity_rows=[
        {
            "id": 1,
            "lead_id": 7,
            "type": "call",
            "user_name": "Test User",
        }
    ])

    with patch("app.routes.activities.get_db", return_value=db):
        response = client.get("/activities?lead_id=7")

    assert response.status_code == 200
    assert len(response.get_json()["data"]) == 1

    sql, params = db.execute.call_args.args
    assert "WHERE a.lead_id = ?" in sql
    assert params == ("7",)


def test_get_activities_all(client):
    db = mock_db(activity_rows=[
        {"id": 1, "lead_id": 1, "type": "meeting"}
    ])

    with patch("app.routes.activities.get_db", return_value=db):
        response = client.get("/activities")

    assert response.status_code == 200
    assert len(response.get_json()["data"]) == 1


# POST /activities

@pytest.mark.parametrize("missing_field", ["lead_id", "user_id", "type"])
def test_create_activity_missing_required_field(client, missing_field):
    data = {
        "lead_id": 1,
        "user_id": 2,
        "type": "call",
    }
    del data[missing_field]

    response = client.post("/activities", json=data)

    assert response.status_code == 400
    assert missing_field in response.get_json()["message"]


def test_create_activity_invalid_type(client):
    response = client.post(
        "/activities",
        json={"lead_id": 1, "user_id": 2, "type": "sms"},
    )

    assert response.status_code == 400
    assert "type" in response.get_json()["message"]


def test_create_activity_lead_not_found(client):
    db = mock_db(lead_exists=False)

    with patch("app.routes.activities.get_db", return_value=db):
        response = client.post(
            "/activities",
            json={"lead_id": 999, "user_id": 2, "type": "call"},
        )

    assert response.status_code == 404
    assert response.get_json()["message"] == "Lead not found"
    db.commit.assert_not_called()


def test_create_activity_success(client):
    db = mock_db()

    with (
        patch("app.routes.activities.get_db", return_value=db),
        patch("app.routes.activities.log_activity") as log_mock,
    ):
        response = client.post(
            "/activities",
            json={
                "lead_id": 1,
                "user_id": 2,
                "type": "call",
                "notes": "Discussed requirements",
            },
        )

    assert response.status_code == 201
    assert response.get_json()["data"] == {"activity_id": 101}
    assert response.get_json()["message"] == "Activity logged"
    db.commit.assert_called_once()
    log_mock.assert_called_once_with(
        activity_id=101,
        lead_id=1,
        user_id=2,
        activity_type="call",
        notes="Discussed requirements",
    )


@pytest.mark.parametrize("activity_type", ["call", "email", "meeting"])
def test_create_activity_supported_types(client, activity_type):
    db = mock_db()

    with (
        patch("app.routes.activities.get_db", return_value=db),
        patch("app.routes.activities.log_activity"),
    ):
        response = client.post(
            "/activities",
            json={
                "lead_id": 1,
                "user_id": 2,
                "type": activity_type,
            },
        )

    assert response.status_code == 201
