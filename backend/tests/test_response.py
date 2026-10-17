
import json
import pytest
from flask import Flask

from app.utils.response import success, error


@pytest.fixture
def app():
    app = Flask(__name__)
    app.config["TESTING"] = True
    return app


def test_success_default_response(app):
    with app.app_context():
        response, status = success()

        assert status == 200
        assert response.get_json() == {
            "success": True,
            "message": "Success",
        }


def test_success_with_data_and_custom_message(app):
    with app.app_context():
        response, status = success(
            data={"id": 1, "name": "Pranitha"},
            message="Lead created",
            status=201,
        )

        assert status == 201
        assert response.get_json() == {
            "success": True,
            "message": "Lead created",
            "data": {"id": 1, "name": "Pranitha"},
        }


def test_success_with_none_data_omits_data_key(app):
    with app.app_context():
        response, status = success(data=None)

        assert status == 200
        assert "data" not in response.get_json()


def test_success_with_empty_data_includes_data_key(app):
    with app.app_context():
        response, status = success(data={})

        assert status == 200
        assert response.get_json()["data"] == {}


def test_error_default_response(app):
    with app.app_context():
        response, status = error()

        assert status == 400
        assert response.get_json() == {
            "success": False,
            "message": "An error occurred",
        }


def test_error_with_custom_message_and_status(app):
    with app.app_context():
        response, status = error(
            message="Lead not found",
            status=404,
        )

        assert status == 404
        assert response.get_json() == {
            "success": False,
            "message": "Lead not found",
        }
