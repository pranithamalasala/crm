"""
crm_backend/app/utils/response.py
Uniform JSON response helpers.
"""

from flask import jsonify


def success(data=None, message="Success", status=200):
    payload = {"success": True, "message": message}
    if data is not None:
        payload["data"] = data
    return jsonify(payload), status


def error(message="An error occurred", status=400):
    return jsonify({"success": False, "message": message}), status
