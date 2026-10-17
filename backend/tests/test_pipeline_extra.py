
from unittest.mock import MagicMock, patch


def test_move_stage_won_creates_customer(client):
    db = MagicMock()

    lead = {
        "id": 1,
        "name": "Test Lead",
        "email": "test@example.com",
        "phone": "1234567890",
        "company": "Test Company",
        "status": "Negotiation",
    }

    # First query finds the lead; second query finds no customer.
    db.execute.return_value.fetchone.side_effect = [
        lead,
        None,
    ]

    with patch("app.routes.pipeline.get_db", return_value=db):
        response = client.post(
            "/pipeline/move",
            json={"lead_id": 1, "stage": "Won"},
        )

    assert response.status_code == 200
    payload = response.get_json()["data"]
    assert payload["previous_stage"] == "Negotiation"
    assert payload["new_stage"] == "Won"

    sql_calls = [
        call.args[0] for call in db.execute.call_args_list
    ]

    assert any("UPDATE leads SET status" in sql for sql in sql_calls)
    assert any("INSERT INTO customers" in sql for sql in sql_calls)
    db.commit.assert_called_once()


def test_move_stage_won_customer_already_exists(client):
    db = MagicMock()

    lead = {
        "id": 1,
        "name": "Test Lead",
        "email": "test@example.com",
        "phone": "1234567890",
        "company": "Test Company",
        "status": "Negotiation",
    }

    # The customer already exists, so no INSERT should happen.
    db.execute.return_value.fetchone.side_effect = [
        lead,
        {"customer_id": 5},
    ]

    with patch("app.routes.pipeline.get_db", return_value=db):
        response = client.post(
            "/pipeline/move",
            json={"lead_id": 1, "stage": "Won"},
        )

    assert response.status_code == 200

    sql_calls = [
        call.args[0] for call in db.execute.call_args_list
    ]

    assert any("UPDATE leads SET status" in sql for sql in sql_calls)
    assert not any("INSERT INTO customers" in sql for sql in sql_calls)
    db.commit.assert_called_once()


def test_get_board_ignores_unknown_stage(client):
    db = MagicMock()
    db.execute.return_value.fetchall.return_value = [
        {
            "id": 1,
            "name": "Test Lead",
            "status": "New Lead",
        },
        {
            "id": 2,
            "name": "Unexpected Lead",
            "status": "Unknown Stage",
        },
    ]

    with patch("app.routes.pipeline.get_db", return_value=db):
        response = client.get("/pipeline/board")

    assert response.status_code == 200
    board = response.get_json()["data"]

    assert len(board["New Lead"]) == 1
    assert all(
        lead["name"] != "Unexpected Lead"
        for leads in board.values()
        for lead in leads
    )
