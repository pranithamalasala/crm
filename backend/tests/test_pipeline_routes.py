
import pytest
from unittest.mock import MagicMock, patch

from flask import Flask
from app.routes.pipeline import pipeline_bp
from app import get_db


@pytest.fixture
def app():
    app = Flask(__name__)
    app.register_blueprint(pipeline_bp)
    app.config["TESTING"] = True
    return app


@pytest.fixture
def client(app):
    return app.test_client()


def make_lead(status="New Lead"):
    return {
        "id": 1,
        "name": "Test Lead",
        "email": "test@example.com",
        "phone": "1234567890",
        "company": "Test Co",
        "status": status,
    }


def mock_db(lead=None, existing_customer=None, board_rows=None):
    db = MagicMock()
    lead_result = MagicMock()
    lead_result.fetchone.return_value = lead
    db.execute.return_value = lead_result

    def execute_side_effect(sql, params=()):
        result = MagicMock()

        if "SELECT * FROM leads" in sql:
            result.fetchone.return_value = lead
        elif "SELECT customer_id FROM customers" in sql:
            result.fetchone.return_value = existing_customer
        elif "SELECT l.*, u.name AS assigned_user" in sql:
            result.fetchall.return_value = board_rows or []
        else:
            result.fetchone.return_value = None

        return result

    db.execute.side_effect = execute_side_effect
    return db


def test_move_stage_missing_lead_id(client):
    response = client.post("/pipeline/move", json={})
    assert response.status_code == 400
    assert response.get_json()["success"] is False


def test_move_stage_lead_not_found(client):
    db = mock_db(lead=None)
    with patch("app.routes.pipeline.get_db", return_value=db):
        response = client.post(
            "/pipeline/move", json={"lead_id": 999}
        )

    assert response.status_code == 404
    assert response.get_json()["message"] == "Lead not found"


def test_move_stage_invalid_stage(client):
    db = mock_db(lead=make_lead())
    with patch("app.routes.pipeline.get_db", return_value=db):
        response = client.post(
            "/pipeline/move",
            json={"lead_id": 1, "stage": "Invalid"},
        )

    assert response.status_code == 400
    assert "Invalid stage" in response.get_json()["message"]


def test_move_stage_progresses_to_contacted(client):
    db = mock_db(lead=make_lead("New Lead"))
    with patch("app.routes.pipeline.get_db", return_value=db):
        response = client.post(
            "/pipeline/move", json={"lead_id": 1}
        )

    assert response.status_code == 200
    assert response.get_json()["data"]["new_stage"] == "Contacted"
    db.commit.assert_called_once()


@pytest.mark.parametrize("stage", ["Won", "Lost"])
def test_move_terminal_stage_without_new_stage(client, stage):
    db = mock_db(lead=make_lead(stage))
    with patch("app.routes.pipeline.get_db", return_value=db):
        response = client.post(
            "/pipeline/move", json={"lead_id": 1}
        )

    assert response.status_code == 400
    assert "terminal stage" in response.get_json()["message"]


def test_move_stage_to_won_creates_customer(client):
    db = mock_db(lead=make_lead(), existing_customer=None)
    with patch("app.routes.pipeline.get_db", return_value=db):
        response = client.post(
            "/pipeline/move",
            json={"lead_id": 1, "stage": "Won"},
        )

    assert response.status_code == 200
    assert response.get_json()["data"]["new_stage"] == "Won"

    insert_calls = [
        call for call in db.execute.call_args_list
        if "INSERT INTO customers" in call.args[0]
    ]
    assert len(insert_calls) == 1


def test_move_stage_to_won_existing_customer(client):
    db = mock_db(
        lead=make_lead(),
        existing_customer={"customer_id": 10},
    )
    with patch("app.routes.pipeline.get_db", return_value=db):
        response = client.post(
            "/pipeline/move",
            json={"lead_id": 1, "stage": "Won"},
        )

    assert response.status_code == 200
    assert not any(
        "INSERT INTO customers" in call.args[0]
        for call in db.execute.call_args_list
    )


def test_get_stages(client):
    response = client.get("/pipeline/stages")
    assert response.status_code == 200
    assert response.get_json()["data"] == [
        "New Lead", "Contacted", "Demo",
        "Negotiation", "Won", "Lost",
    ]


def test_get_board_empty(client):
    db = mock_db(board_rows=[])
    with patch("app.routes.pipeline.get_db", return_value=db):
        response = client.get("/pipeline/board")

    assert response.status_code == 200
    assert response.get_json()["data"]["New Lead"] == []
    assert response.get_json()["data"]["Won"] == []
