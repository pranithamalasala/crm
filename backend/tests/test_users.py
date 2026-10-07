def test_get_users(client):
    response = client.get("/users")

    assert response.status_code == 200

    data = response.get_json()

    assert data["success"] is True
    assert isinstance(data["data"], list)


def test_create_user(client):
    payload = {
        "name": "Test User",
        "email": "testuser@example.com",
        "password": "TestPassword123",
        "role": "sales"
    }

    response = client.post("/users", json=payload)

    assert response.status_code == 201

    data = response.get_json()

    assert data["success"] is True
    assert data["message"] == "User created successfully"
    assert data["data"]["name"] == "Test User"
    assert data["data"]["email"] == "testuser@example.com"
    assert data["data"]["role"] == "sales"


def test_create_user_missing_email(client):
    payload = {
        "name": "No Email User",
        "password": "TestPassword123",
        "role": "sales"
    }

    response = client.post("/users", json=payload)

    assert response.status_code == 422

    data = response.get_json()

    assert data["success"] is False


def test_create_duplicate_user(client):
    payload = {
        "name": "Duplicate User",
        "email": "duplicateuser@example.com",
        "password": "TestPassword123",
        "role": "sales"
    }

    first_response = client.post("/users", json=payload)

    assert first_response.status_code == 201

    second_response = client.post("/users", json=payload)

    assert second_response.status_code == 409

    data = second_response.get_json()

    assert data["success"] is False


def test_invalid_login(client):
    response = client.post(
        "/users/login",
        json={
            "email": "doesnotexist@example.com",
            "password": "WrongPassword123"
        }
    )

    assert response.status_code == 401

    data = response.get_json()

    assert data["success"] is False