from flask import Blueprint, request
from app import get_db
from app.utils.helpers import success, error, rows_to_list, row_to_dict
import bcrypt

users_bp = Blueprint("users", __name__, url_prefix="/users")

VALID_ROLES = ("admin", "sales", "manager")

@users_bp.route("", methods=["GET"])
def get_users():
    db = get_db()
    rows = db.execute("SELECT id, name, email, role, created_at FROM users").fetchall()
    return success(rows_to_list(rows))

@users_bp.route("", methods=["POST"])
def create_user():
    data = request.get_json() or {}
    name     = (data.get("name") or "").strip()
    email    = (data.get("email") or "").strip().lower()
    password = data.get("password", "")
    role     = data.get("role", "sales")
    if not name:
        return error("name is required", 422)
    if not email or "@" not in email:
        return error("a valid email is required", 422)
    if not password or len(password) < 6:
        return error("password must be at least 6 characters", 422)
    if role not in VALID_ROLES:
        return error(f"role must be one of: {', '.join(VALID_ROLES)}", 422)
    db = get_db()
    if db.execute("SELECT id FROM users WHERE email = ?", (email,)).fetchone():
        return error("Email already registered", 409)
    hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
    cur = db.execute(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
        (name, email, hashed, role)
    )
    db.commit()
    row = db.execute("SELECT id, name, email, role, created_at FROM users WHERE id = ?", (cur.lastrowid,)).fetchone()
    return success(row_to_dict(row), "User created successfully", 201)

@users_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    email    = (data.get("email") or "").strip().lower()
    password = data.get("password", "")
    db = get_db()
    row = db.execute("SELECT * FROM users WHERE email = ?", (email,)).fetchone()
    if not row:
        return error("Invalid credentials", 401)
    user = row_to_dict(row)
    try:
        if not bcrypt.checkpw(password.encode(), user["password"].encode()):
            return error("Invalid credentials", 401)
    except Exception:
        return error("Invalid credentials", 401)
    return success({
        "id": user["id"], "name": user["name"],
        "email": user["email"], "role": user["role"]
    }, "Login successful")

@users_bp.route("/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    db = get_db()
    if not db.execute("SELECT id FROM users WHERE id = ?", (user_id,)).fetchone():
        return error("User not found", 404)
    db.execute("DELETE FROM users WHERE id = ?", (user_id,))
    db.commit()
    return success(message="User deleted successfully")
