
import pytest

from app.utils.validators import (
    is_valid_email,
    is_valid_stage,
    validate_lead,
    validate_activity,
    PIPELINE_STAGES,
)


# Email validation tests
@pytest.mark.parametrize(
    "email, expected",
    [
        ("user@example.com", True),
        ("pranitha@gmail.in", True),
        ("invalid-email", False),
        ("user@", False),
        ("", False),
        ("user name@example.com", False),
    ],
)
def test_is_valid_email(email, expected):
    assert is_valid_email(email) == expected


# Pipeline stage validation tests
def test_is_valid_stage():
    for stage in PIPELINE_STAGES:
        assert is_valid_stage(stage) is True

    assert is_valid_stage("Invalid Stage") is False
    assert is_valid_stage("") is False


# Lead validation tests
def test_validate_lead_valid_data():
    data = {
        "name": "Pranitha",
        "email": "pranitha@example.com",
        "status": "New Lead",
    }
    assert validate_lead(data) == []


def test_validate_lead_missing_name():
    data = {"name": " ", "email": "pranitha@example.com"}
    assert validate_lead(data) == ["name is required"]


def test_validate_lead_invalid_email():
    data = {"name": "Pranitha", "email": "invalid-email"}
    assert validate_lead(data) == ["a valid email is required"]


def test_validate_lead_invalid_status():
    data = {
        "name": "Pranitha",
        "email": "pranitha@example.com",
        "status": "Invalid",
    }
    errors = validate_lead(data)
    assert len(errors) == 1
    assert errors[0].startswith("status must be one of:")


def test_validate_lead_multiple_errors():
    errors = validate_lead({"name": "", "email": "", "status": "Invalid"})
    assert len(errors) == 3


# Activity validation tests
def test_validate_activity_valid_data():
    data = {"lead_id": 1, "user_id": 2, "type": "call"}
    assert validate_activity(data) == []


def test_validate_activity_all_fields_missing():
    errors = validate_activity({})
    assert errors == [
        "lead_id is required",
        "user_id is required",
        "type must be call, email, or meeting",
    ]


@pytest.mark.parametrize("activity_type", ["call", "email", "meeting"])
def test_validate_activity_supported_types(activity_type):
    data = {"lead_id": 1, "user_id": 2, "type": activity_type}
    assert validate_activity(data) == []


def test_validate_activity_invalid_type():
    data = {"lead_id": 1, "user_id": 2, "type": "sms"}
    assert validate_activity(data) == [
        "type must be call, email, or meeting"
    ]
