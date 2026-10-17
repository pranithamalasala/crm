
from unittest.mock import MagicMock, patch


def test_delete_activity_success(client):
    db = MagicMock()
    db.execute.return_value.fetchone.return_value = {
        "activity_id": 1
    }

    with patch(
        "app.routes.activities.get_db",
        return_value=db,
    ):
        response = client.delete("/activities/1")

    assert response.status_code == 200
    assert response.get_json()["message"] == "Activity deleted"

    assert db.execute.call_count == 2
    db.commit.assert_called_once()


def test_delete_activity_not_found(client):
    db = MagicMock()
    db.execute.return_value.fetchone.return_value = None

    with patch(
        "app.routes.activities.get_db",
        return_value=db,
    ):
        response = client.delete("/activities/999")

    assert response.status_code == 404
    assert response.get_json()["message"] == "Activity not found"

    db.commit.assert_not_called()
