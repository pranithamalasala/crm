
from unittest.mock import MagicMock, patch

import bcrypt
import pytest
from flask import Flask

from app.routes.users import users_bp


@pytest.fixture
def app():
    app = Flask(__name__)
    app.register_blueprint(users_bp)
    app.config["TESTING"] = True
    return app


@pytest.fixture
def client(app):
    return app.test_client()


def mock_db(user=None, users=None, inserted_id=10):
    db = MagicMock()

    def execute_side_effect(sql, params=()):
        result = MagicMock()

        if sql.startswith("SELECT id, name, email, role, created_at FROM users WHERE id"):
            result.fetchone.return_value = user

        elif sql.startswith("SELECT id, name, email, role, created_at FROM users"):
            result.fetchall.return_value = users or []

        elif sql.startswith("SELECT id FROM users WHERE email"):
            result.fetchone.return_value = user

        elif sql.startswith("SELECT id FROM users WHERE id"):
            result.fetchone.return_value = user

        elif sql.startswith("SELECT * FROM users WHERE email"):
            result.fetchone.return_value = user

        elif sql.startswith("INSERT INTO users"):
            result.lastrowid = inserted_id

        else:
            result.fetchone.return_value = None
            result.fetchall.return_value = []

        return result

    db.execute.side_effect = execute_side_effect
    return db


def test_get_users(client):
    db = mock_db(users=[
        {
            "id": 1,
            "name": "Test User",
            "email": "test@example.com",
            "role": "sales",
            "created_at": "2026-10-17",
        }
    ])

    with patch("app.routes.users.get_db", return_value=db):
        response = client.get("/users")

    assert response.status_code == 200
    assert len(response.get_json()["data"]) == 1


def test_get_users_empty(client):
    db = mock_db(users=[])

    with patch("app.routes.users.get_db", return_value=db):
        response = client.get("/users")

    assert response.status_code == 200
    assert response.get_json()["data"] == []


def test_create_user_missing_name(client):
    response = client.post(
        "/users",
        json={
            "name": " ",
            "email": "test@example.com",
            "password": "secret123",
        },
    )

    assert response.status_code == 422
    assert response.get_json()["message"] == "name is required"


def test_create_user_invalid_email(client):
    response = client.post(
        "/users",
        json={
            "name": "Test User",
            "email": "invalid-email",
            "password": "secret123",
        },
    )

    assert response.status_code == 422
    assert response.get_json()["message"] == "a valid email is required"


def test_create_user_short_password(client):
    response = client.post(
        "/users",
        json={
            "name": "Test User",
            "email": "test@example.com",
            "password": "123",
        },
    )

    assert response.status_code == 422
    assert "at least 6 characters" in response.get_json()["message"]


def test_create_user_invalid_role(client):
    response = client.post(
        "/users",
        json={
            "name": "Test User",
            "email": "test@example.com",
            "password": "secret123",
            "role": "unknown",
        },
    )

    assert response.status_code == 422
    assert "role must be one of:" in response.get_json()["message"]


def test_create_user_duplicate_email(client):
    db = mock_db(user={"id": 1})

    with patch("app.routes.users.get_db", return_value=db):
        response = client.post(
            "/users",
            json={
                "name": "Test User",
                "email": "test@example.com",
                "password": "secret123",
            },
        )

    assert response.status_code == 409
    assert response.get_json()["message"] == "Email already registered"


def test_create_user_success(client):
    created_user = {
        "id": 10,
        "name": "Test User",
        "email": "test@example.com",
        "role": "sales",
        "created_at": "2026-10-17",
    }
    db = mock_db(user=None, inserted_id=10)

    # Return the created user on the final SELECT by ID.
    original_side_effect = db.execute.side_effect

    def execute_side_effect(sql, params=()):
        if sql.startswith(
            "SELECT id, name, email, role, created_at FROM users WHERE id"
        ):
            result = MagicMock()
            result.fetchone.return_value = created_user
            return result
        return original_side_effect(sql, params)

    db.execute.side_effect = execute_side_effect

    with patch("app.routes.users.get_db", return_value=db):
        response = client.post(
            "/users",
            json={
                "name": " Test User ",
                "email": " TEST@EXAMPLE.COM ",
                "password": "secret123",
            },
        )

    assert response.status_code == 201
    payload = response.get_json()["data"]
    assert payload["email"] == "test@example.com"
    assert payload["name"] == "Test User"

    insert_call = next(
        call for call in db.execute.call_args_list
        if call.args[0].startswith("INSERT INTO users")
    )
    stored_password = insert_call.args[1][2]
    assert bcrypt.checkpw(
        b"secret123", stored_password.encode()
    )
    db.commit.assert_called_once()


def test_login_user_not_found(client):
    db = mock_db(user=None)

    with patch("app.routes.users.get_db", return_value=db):
        response = client.post(
            "/users/login",
            json={
                "email": "missing@example.com",
                "password": "secret123",
            },
        )

    assert response.status_code == 401
    assert response.get_json()["message"] == "Invalid credentials"


def test_login_success(client):
    password_hash = bcrypt.hashpw(
        b"secret123", bcrypt.gensalt()
    ).decode()

    user = {
        "id": 1,
        "name": "Test User",
        "email": "test@example.com",
        "role": "sales",
        "password": password_hash,
    }
    db = mock_db(user=user)

    with patch("app.routes.users.get_db", return_value=db):
        response = client.post(
            "/users/login",
            json={
                "email": " TEST@EXAMPLE.COM ",
                "password": "secret123",
            },
        )

    assert response.status_code == 200
    assert response.get_json()["message"] == "Login successful"
    assert response.get_json()["data"]["email"] == "test@example.com"
    assert "password" not in response.get_json()["data"]


def test_login_wrong_password(client):
    password_hash = bcrypt.hashpw(
        b"correct-password", bcrypt.gensalt()
    ).decode()

    db = mock_db(user={
        "id": 1,
        "name": "Test User",
        "email": "test@example.com",
        "role": "sales",
        "password": password_hash,
    })

    with patch("app.routes.users.get_db", return_value=db):
        response = client.post(
            "/users/login",
            json={
                "email": "test@example.com",
                "password": "wrong-password",
            },
        )

    assert response.status_code == 401
    assert response.get_json()["message"] == "Invalid credentials"


def test_login_missing_password(client):
    db = mock_db(user={
        "id": 1,
        "name": "Test User",
        "email": "test@example.com",
        "role": "sales",
        "password": "not-a-valid-bcrypt-hash",
    })

    with patch("app.routes.users.get_db", return_value=db):
        response = client.post(
            "/users/login",
            json={"email": "test@example.com"},
        )

    assert response.status_code == 401
    assert response.get_json()["message"] == "Invalid credentials"


def test_delete_user_success(client):
    db = mock_db(user={"id": 1})

    with patch("app.routes.users.get_db", return_value=db):
        response = client.delete("/users/1")

    assert response.status_code == 200
    assert response.get_json()["message"] == "User deleted successfully"
    db.commit.assert_called_once()

    assert any(
        call.args[0].startswith("DELETE FROM users")
        for call in db.execute.call_args_list
    )


def test_delete_user_not_found(client):
    db = mock_db(user=None)

    with patch("app.routes.users.get_db", return_value=db):
        response = client.delete("/users/999")

    assert response.status_code == 404
    assert response.get_json()["message"] == "User not found"
    db.commit.assert_not_called()
