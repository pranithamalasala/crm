from flask import Blueprint, request
from app import get_db
from app.utils.helpers import success, error, rows_to_list, row_to_dict

customers_bp = Blueprint("customers", __name__, url_prefix="/customers")

@customers_bp.route("", methods=["GET"])
def get_customers():
    db = get_db()
    rows = db.execute("SELECT * FROM customers ORDER BY created_at DESC").fetchall()
    return success(rows_to_list(rows))

@customers_bp.route("/<int:customer_id>", methods=["GET"])
def get_customer(customer_id):
    db = get_db()
    row = db.execute("SELECT * FROM customers WHERE customer_id = ?", (customer_id,)).fetchone()
    if not row:
        return error("Customer not found", 404)
    return success(row_to_dict(row))

@customers_bp.route("/<int:customer_id>", methods=["PUT"])
def update_customer(customer_id):
    data = request.get_json() or {}
    db = get_db()
    if not db.execute("SELECT customer_id FROM customers WHERE customer_id = ?", (customer_id,)).fetchone():
        return error("Customer not found", 404)
    fields, values = [], []
    for col in ["name", "email", "phone", "company", "notes"]:
        if col in data:
            fields.append(f"{col} = ?")
            values.append(data[col])
    if not fields:
        return error("No valid fields to update")
    values.append(customer_id)
    db.execute(f"UPDATE customers SET {', '.join(fields)} WHERE customer_id = ?", values)
    db.commit()
    return success(message="Customer updated successfully")

@customers_bp.route("/<int:customer_id>", methods=["DELETE"])
def delete_customer(customer_id):
    db = get_db()
    if not db.execute("SELECT customer_id FROM customers WHERE customer_id = ?", (customer_id,)).fetchone():
        return error("Customer not found", 404)
    db.execute("DELETE FROM customers WHERE customer_id = ?", (customer_id,))
    db.commit()
    return success(message="Customer deleted successfully")
