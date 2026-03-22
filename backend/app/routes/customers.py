# app/routes/customers.py
from flask import Blueprint, request
from app.extensions import mysql
from app.utils.helpers import success, error

customers_bp = Blueprint("customers", __name__, url_prefix="/customers")

# ── GET /customers ───────────────────────────────────────────────────────────
@customers_bp.route("", methods=["GET"])
def get_customers():
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM customers ORDER BY created_at DESC")
    customers = cur.fetchall()
    cur.close()
    return success(customers)

# ── GET /customers/<id> ──────────────────────────────────────────────────────
@customers_bp.route("/<int:customer_id>", methods=["GET"])
def get_customer(customer_id):
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM customers WHERE customer_id = %s", (customer_id,))
    customer = cur.fetchone()
    cur.close()
    if not customer:
        return error("Customer not found", 404)
    return success(customer)

# ── PUT /customers/<id> ──────────────────────────────────────────────────────
@customers_bp.route("/<int:customer_id>", methods=["PUT"])
def update_customer(customer_id):
    data = request.get_json()
    cur = mysql.connection.cursor()
    cur.execute("SELECT customer_id FROM customers WHERE customer_id = %s", (customer_id,))
    if not cur.fetchone():
        cur.close()
        return error("Customer not found", 404)

    fields, values = [], []
    for col in ["name", "email", "phone", "company", "notes"]:
        if col in data:
            fields.append(f"{col} = %s")
            values.append(data[col])

    if not fields:
        cur.close()
        return error("No valid fields to update")

    values.append(customer_id)
    cur.execute(f"UPDATE customers SET {', '.join(fields)} WHERE customer_id = %s", values)
    mysql.connection.commit()
    cur.close()
    return success(message="Customer updated successfully")

# ── DELETE /customers/<id> ───────────────────────────────────────────────────
@customers_bp.route("/<int:customer_id>", methods=["DELETE"])
def delete_customer(customer_id):
    cur = mysql.connection.cursor()
    cur.execute("SELECT customer_id FROM customers WHERE customer_id = %s", (customer_id,))
    if not cur.fetchone():
        cur.close()
        return error("Customer not found", 404)
    cur.execute("DELETE FROM customers WHERE customer_id = %s", (customer_id,))
    mysql.connection.commit()
    cur.close()
    return success(message="Customer deleted successfully")
