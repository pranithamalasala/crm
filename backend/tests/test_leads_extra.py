
from unittest.mock import MagicMock, patch


def test_get_leads_with_status_filter(client):
    db = MagicMock()
    db.execute.return_value.fetchall.return_value = [
        {
            "id": 1,
            "name": "Test Lead",
            "email": "lead@example.com",
            "status": "New Lead",
            "assigned_user": "Test User",
        }
    ]

    with patch("app.routes.leads.get_db", return_value=db):
        response = client.get("/leads?status=New%20Lead")

    assert response.status_code == 200
    assert "WHERE l.status = ?" in db.execute.call_args.args[0]
    assert db.execute.call_args.args[1] == ("New Lead",)


def test_create_lead_database_error(client):
    db = MagicMock()
    db.execute.side_effect = RuntimeError("Database error")

    with patch("app.routes.leads.get_db", return_value=db):
        response = client.post(
            "/leads",
            json={
                "name": "Test Lead",
                "email": "lead@example.com",
            },
        )

    assert response.status_code == 400
    assert response.get_json()["message"] == "Database error"
    db.commit.assert_not_called()


def test_delete_lead_success(client):
    db = MagicMock()
    db.execute.return_value.fetchone.return_value = {"id": 1}

    with patch("app.routes.leads.get_db", return_value=db):
        response = client.delete("/leads/1")

    assert response.status_code == 200
    assert response.get_json()["message"] == "Lead deleted successfully"
    assert db.execute.call_count == 2
    db.commit.assert_called_once()


def test_update_lead_success(client):
    db = MagicMock()
    db.execute.return_value.fetchone.return_value = {"id": 1}

    with patch("app.routes.leads.get_db", return_value=db):
        response = client.put(
            "/leads/1",
            json={"name": "Updated Lead"},
        )

    assert response.status_code == 200
    assert response.get_json()["message"] == "Lead updated successfully"
    assert db.execute.call_count == 2
    db.commit.assert_called_once()


def test_delete_lead_not_found(client):
    db = MagicMock()
    db.execute.return_value.fetchone.return_value = None

    with patch("app.routes.leads.get_db", return_value=db):
        response = client.delete("/leads/999")

    assert response.status_code == 404
    assert response.get_json()["message"] == "Lead not found"
    assert db.execute.call_count == 1
    db.commit.assert_not_called()
def test_get_lead_success(client):
    db = MagicMock()
    db.execute.return_value.fetchone.return_value = {
        "id": 1,
        "name": "Alice",
        "email": "alice@example.com",
        "status": "New Lead",
        "assigned_user": None,
    }

    with patch("app.routes.leads.get_db", return_value=db):
        response = client.get("/leads/1")

    assert response.status_code == 200
    assert response.get_json()["data"]["id"] == 1
    assert response.get_json()["data"]["name"] == "Alice"


def test_update_lead_no_valid_fields(client):
    db = MagicMock()
    db.execute.return_value.fetchone.return_value = {"id": 1}

    with patch("app.routes.leads.get_db", return_value=db):
        response = client.put("/leads/1", json={})

    assert response.status_code == 400
    assert response.get_json()["message"] == "No valid fields to update"
    db.commit.assert_not_called()