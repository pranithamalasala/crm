
from flask import Blueprint, request
from app import get_db
from app.utils.helpers import success, error, rows_to_list, row_to_dict

customers_bp = Blueprint("customers", __name__, url_prefix="/customers")



@customers_bp.route("", methods=["GET"])
def get_customers():
    db = get_db()

    # 1. Read query parameters
    try:
        page = int(request.args.get("page", 1))
        limit = int(request.args.get("limit", 10))
    except ValueError:
        return error("Page and limit must be integers", 400)

    # 2. Validate pagination
    if page < 1:
        return error("Page must be greater than 0", 400)

    if limit < 1 or limit > 100:
        return error("Limit must be between 1 and 100", 400)

    # 3. Build search filters
    search = request.args.get("search", "").strip()

    conditions = []
    params = []

    if search:
        conditions.append(
            "(name LIKE ? OR email LIKE ? OR company LIKE ?)"
        )
        keyword = f"%{search}%"
        params.extend([keyword, keyword, keyword])

    # 4. Build WHERE clause
    where_clause = ""

    if conditions:
        where_clause = "WHERE " + " AND ".join(conditions)

    # 5. Get total matching customers
    count_query = f"""
        SELECT COUNT(*) AS total
        FROM customers
        {where_clause}
    """

    total = db.execute(
        count_query, params
    ).fetchone()["total"]

    # 6. Calculate pagination
    offset = (page - 1) * limit

    # 7. Fetch only the requested page
    query = f"""
        SELECT *
        FROM customers
        {where_clause}
        ORDER BY created_at DESC, customer_id DESC
        LIMIT ? OFFSET ?
    """

    rows = db.execute(
        query, params + [limit, offset]
    ).fetchall()

    # 8. Return paginated response
    return success({
        "customers": rows_to_list(rows),
        "pagination": {
            "page": page,
            "limit": limit,
            "total": total,
            "total_pages": (total + limit - 1) // limit
        }
    })



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

    except Exception as e:
        db.rollback()
        print("CREATE CUSTOMER ERROR:", repr(e))
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
