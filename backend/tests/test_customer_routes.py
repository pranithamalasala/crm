
import pytest
from unittest.mock import MagicMock, patch

from flask import Flask
from app.routes.customers import customers_bp


@pytest.fixture
def app():
    app = Flask(__name__)
    app.register_blueprint(customers_bp)
    app.config["TESTING"] = True
    return app


@pytest.fixture
def client(app):
    return app.test_client()


def make_customer():
    return {
        "customer_id": 1,
        "name": "Test Customer",
        "email": "customer@example.com",
        "phone": "1234567890",
        "company": "Test Co",
        "notes": "Test note",
    }



def mock_db(customer=None, customers=None):
    db = MagicMock()
    customers = customers or []

    def execute_side_effect(sql, params=()):
        result = MagicMock()

        if "COUNT(*) AS total" in sql:
            result.fetchone.return_value = {"total": len(customers)}

        elif "ORDER BY created_at DESC" in sql:
            result.fetchall.return_value = customers

        elif "SELECT * FROM customers WHERE" in sql:
            result.fetchone.return_value = customer

        elif "SELECT customer_id FROM customers WHERE" in sql:
            result.fetchone.return_value = customer

        else:
            result.fetchone.return_value = None

        return result

    db.execute.side_effect = execute_side_effect
    return db




def test_get_customers(client):
    db = mock_db(customers=[make_customer()])

    with patch("app.routes.customers.get_db", return_value=db):
        response = client.get("/customers")

    data = response.get_json()["data"]

    assert response.status_code == 200
    assert response.get_json()["success"] is True
    assert len(data["customers"]) == 1
    assert data["pagination"]["page"] == 1
    assert data["pagination"]["limit"] == 10
    assert data["pagination"]["total"] == 1
    assert data["pagination"]["total_pages"] == 1


def test_get_customers_empty(client):
    db = mock_db(customers=[])

    with patch("app.routes.customers.get_db", return_value=db):
        response = client.get("/customers")

    data = response.get_json()["data"]

    assert response.status_code == 200
    assert data["customers"] == []
    assert data["pagination"]["total"] == 0
    assert data["pagination"]["total_pages"] == 0



def test_get_customer_found(client):
    db = mock_db(customer=make_customer())

    with patch("app.routes.customers.get_db", return_value=db):
        response = client.get("/customers/1")

    assert response.status_code == 200
    assert response.get_json()["data"]["customer_id"] == 1


def test_get_customer_not_found(client):
    db = mock_db(customer=None)

    with patch("app.routes.customers.get_db", return_value=db):
        response = client.get("/customers/999")

    assert response.status_code == 404
    assert response.get_json()["message"] == "Customer not found"


def test_update_customer_success(client):
    db = mock_db(customer={"customer_id": 1})

    with patch("app.routes.customers.get_db", return_value=db):
        response = client.put(
            "/customers/1",
            json={"name": "Updated Name", "company": "Updated Co"},
        )

    assert response.status_code == 200
    assert response.get_json()["message"] == "Customer updated successfully"
    db.commit.assert_called_once()

    update_call = next(
        call for call in db.execute.call_args_list
        if call.args[0].startswith("UPDATE customers SET")
    )
    assert "name = ?" in update_call.args[0]
    assert "company = ?" in update_call.args[0]


def test_update_customer_not_found(client):
    db = mock_db(customer=None)

    with patch("app.routes.customers.get_db", return_value=db):
        response = client.put("/customers/999", json={"name": "Updated"})

    assert response.status_code == 404
    assert response.get_json()["message"] == "Customer not found"


def test_update_customer_no_valid_fields(client):
    db = mock_db(customer={"customer_id": 1})

    with patch("app.routes.customers.get_db", return_value=db):
        response = client.put("/customers/1", json={"unknown": "value"})

    assert response.status_code == 400
    assert response.get_json()["message"] == "No valid fields to update"
    db.commit.assert_not_called()


def test_update_customer_empty_body(client):
    db = mock_db(customer={"customer_id": 1})

    with patch("app.routes.customers.get_db", return_value=db):
        response = client.put("/customers/1", json={})

    assert response.status_code == 400
    assert response.get_json()["message"] == "No valid fields to update"


def test_delete_customer_success(client):
    db = mock_db(customer={"customer_id": 1})

    with patch("app.routes.customers.get_db", return_value=db):
        response = client.delete("/customers/1")

    assert response.status_code == 200
    assert response.get_json()["message"] == "Customer deleted successfully"
    db.commit.assert_called_once()

    assert any(
        call.args[0].startswith("DELETE FROM customers")
        for call in db.execute.call_args_list
    )


def test_delete_customer_not_found(client):
    db = mock_db(customer=None)

    with patch("app.routes.customers.get_db", return_value=db):
        response = client.delete("/customers/999")

    assert response.status_code == 404
    assert response.get_json()["message"] == "Customer not found"
    db.commit.assert_not_called()

def test_get_customers_page_2(client):
    customers = [
        {**make_customer(), "customer_id": 2, "name": "Customer 2"}
    ]
    db = mock_db(customers=customers)

    with patch("app.routes.customers.get_db", return_value=db):
        response = client.get("/customers?page=2&limit=5")

    data = response.get_json()["data"]

    assert response.status_code == 200
    assert len(data["customers"]) == 1
    assert data["pagination"]["page"] == 2
    assert data["pagination"]["limit"] == 5


def test_get_customers_invalid_page(client):
    response = client.get("/customers?page=0")
    assert response.status_code == 400


def test_get_customers_invalid_limit(client):
    response = client.get("/customers?limit=101")
    assert response.status_code == 400


def test_get_customers_invalid_page_type(client):
    response = client.get("/customers?page=abc")
    assert response.status_code == 400


def test_get_customers_search(client):
    db = mock_db(customers=[make_customer()])

    with patch("app.routes.customers.get_db", return_value=db):
        response = client.get("/customers?search=Test")

    assert response.status_code == 200
    assert len(response.get_json()["data"]["customers"]) == 1
