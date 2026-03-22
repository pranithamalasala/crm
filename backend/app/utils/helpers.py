# app/utils/helpers.py
from flask import jsonify

PIPELINE_STAGES = ["New Lead", "Contacted", "Demo", "Negotiation", "Won", "Lost"]

def success(data=None, message="Success", status=200):
    return jsonify({"success": True, "message": message, "data": data}), status

def error(message="Error", status=400):
    return jsonify({"success": False, "message": message, "data": None}), status

def next_stage(current):
    """Return the next pipeline stage, or None if already terminal."""
    terminal = {"Won", "Lost"}
    if current in terminal:
        return None
    try:
        idx = PIPELINE_STAGES.index(current)
        return PIPELINE_STAGES[idx + 1] if idx + 1 < len(PIPELINE_STAGES) else None
    except ValueError:
        return None
