from flask import jsonify

PIPELINE_STAGES = ["New Lead", "Contacted", "Demo", "Negotiation", "Won", "Lost"]

def row_to_dict(row):
    if row is None:
        return None
    return dict(row)

def rows_to_list(rows):
    return [dict(r) for r in rows]

def success(data=None, message="Success", status=200):
    return jsonify({"success": True, "message": message, "data": data}), status

def error(message="Error", status=400):
    return jsonify({"success": False, "message": message, "data": None}), status

def next_stage(current):
    terminal = {"Won", "Lost"}
    if current in terminal:
        return None
    try:
        idx = PIPELINE_STAGES.index(current)
        return PIPELINE_STAGES[idx + 1] if idx + 1 < len(PIPELINE_STAGES) else None
    except ValueError:
        return None
