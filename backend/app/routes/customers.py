
from flask import Blueprint, request
from app import get_db
from app.utils.helpers import success, error, rows_to_list, row_to_dict

customers_bp = Blueprint("customers", __name__, url_prefix="/customers")


@customers_bp.route("", methods=["GET"])
def get_customers():
    db = get_db()
    rows = db.execute(
        "SELECT * FROM customers ORDER BY created_at DESC"
    ).fetchall()
    return success(rows_to_list(rows))


@customers_bp.route("/<int:customer_id>", methods=["GET"])
def get_customer(customer_id):
    db = get_db()
    row = db.execute(
        "SELECT * FROM customers WHERE customer_id = ?",
        (customer_id,)
    ).fetchone()

    if not row:
        return error("Customer not found", 404)

    return success(row_to_dict(row))


@customers_bp.route("", methods=["POST"])
def create_customer():
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return error("Invalid JSON body", 400)

    for field in ["name", "email"]:
        value = data.get(field)
        if not isinstance(value, str) or not value.strip():
            return error(f"'{field}' is required", 400)

    db = get_db()

    try:
        cur = db.execute(
            """
            INSERT INTO customers (name, email, phone, company, notes)
            VALUES (?, ?, ?, ?, ?)
            """,
            (
                data["name"].strip(),
                data["email"].strip(),
                data.get("phone"),
                data.get("company"),
                data.get("notes"),
            ),
        )
        db.commit()

        return success(
            {"customer_id": cur.lastrowid},
            "Customer created successfully",
            201,
        )

    except Exception:
        db.rollback()
        return error("Unable to create customer", 400)


@customers_bp.route("/<int:customer_id>", methods=["PUT"])
def update_customer(customer_id):
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return error("Invalid JSON body", 400)

    db = get_db()

    customer = db.execute(
        "SELECT customer_id FROM customers WHERE customer_id = ?",
        (customer_id,)
    ).fetchone()

    if not customer:
        return error("Customer not found", 404)

    fields = []
    values = []

    for col in ["name", "email", "phone", "company", "notes"]:
        if col in data:
            fields.append(f"{col} = ?")
            values.append(data[col])

    if not fields:
        return error("No valid fields to update", 400)

    values.append(customer_id)

    db.execute(
        f"UPDATE customers SET {', '.join(fields)} WHERE customer_id = ?",
        values
    )
    db.commit()

    return success(message="Customer updated successfully")


@customers_bp.route("/<int:customer_id>", methods=["DELETE"])
def delete_customer(customer_id):
    db = get_db()

    customer = db.execute(
        "SELECT customer_id FROM customers WHERE customer_id = ?",
        (customer_id,)
    ).fetchone()

    if not customer:
        return error("Customer not found", 404)

    db.execute(
        "DELETE FROM customers WHERE customer_id = ?",
        (customer_id,)
    )
    db.commit()

    return success(message="Customer deleted successfully")
