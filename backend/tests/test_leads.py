def test_get_leads(client):
    response = client.get("/leads")

    assert response.status_code == 200

    data = response.get_json()

    assert data["success"] is True
    assert isinstance(data["data"], list)


def test_get_lead_not_found(client):
    response = client.get("/leads/999999")

    assert response.status_code == 404

    data = response.get_json()

    assert data["success"] is False


def test_create_lead(client):
    payload = {
        "name": "Test Lead",
        "email": "testlead@example.com",
        "phone": "9876543210",
        "company": "Test Company",
        "status": "New Lead"
    }

    response = client.post("/leads", json=payload)

    assert response.status_code == 201

    data = response.get_json()

    assert data["success"] is True
    assert data["message"] == "Lead created successfully"
    assert "id" in data["data"]


def test_create_lead_missing_name(client):
    payload = {
        "email": "noname@example.com"
    }

    response = client.post("/leads", json=payload)

    assert response.status_code == 400

    data = response.get_json()

    assert data["success"] is False


def test_create_lead_missing_email(client):
    payload = {
        "name": "No Email Lead"
    }

    response = client.post("/leads", json=payload)

    assert response.status_code == 400

    data = response.get_json()

    assert data["success"] is False
def test_create_duplicate_lead_email(client):
    payload = {
        "name": "First Lead",
        "email": "duplicate@example.com"
    }

    first_response = client.post("/leads", json=payload)

    assert first_response.status_code == 201

    second_response = client.post("/leads", json=payload)

    assert second_response.status_code == 400

    data = second_response.get_json()

    assert data["success"] is False
def test_update_lead(client):
    # Create a lead first
    create_response = client.post(
        "/leads",
        json={
            "name": "Update Test",
            "email": "update@example.com"
        }
    )

    assert create_response.status_code == 201

    lead_id = create_response.get_json()["data"]["id"]

    # Update it
    response = client.put(
        f"/leads/{lead_id}",
        json={
            "name": "Updated Lead",
            "company": "Updated Company",
            "status": "Negotiation"
        }
    )

    assert response.status_code == 200

    data = response.get_json()

    assert data["success"] is True
    assert data["message"] == "Lead updated successfully"


def test_update_lead_not_found(client):
    response = client.put(
        "/leads/999999",
        json={
            "name": "Updated Lead"
        }
    )

    assert response.status_code == 404

    data = response.get_json()

    assert data["success"] is False
def test_delete_lead(client):
    create_response = client.post(
        "/leads",
        json={
            "name": "Delete Test",
            "email": "delete@example.com"
        }
    )

    assert create_response.status_code == 201

    lead_id = create_response.get_json()["data"]["id"]

    response = client.delete(f"/leads/{lead_id}")

    assert response.status_code == 200

    data = response.get_json()

    assert data["success"] is True
    assert data["message"] == "Lead deleted successfully"


def test_delete_lead_not_found(client):
    response = client.delete("/leads/999999")

    assert response.status_code == 404

    data = response.get_json()

    assert data["success"] is False
def test_delete_lead(client):
    create_response = client.post(
        "/leads",
        json={
            "name": "Delete Test",
            "email": "delete@example.com"
        }
    )

    assert create_response.status_code == 201

    lead_id = create_response.get_json()["data"]["id"]

    response = client.delete(f"/leads/{lead_id}")

    assert response.status_code == 200

    data = response.get_json()

    assert data["success"] is True
    assert data["message"] == "Lead deleted successfully"


def test_delete_lead_not_found(client):
    response = client.delete("/leads/999999")

    assert response.status_code == 404

    data = response.get_json()

    assert data["success"] is False