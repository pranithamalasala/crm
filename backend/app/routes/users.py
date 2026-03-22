"""
crm_backend/app/routes/users.py

GET    /users          → list all users (id, name, email, role)
POST   /users          → create a new user
DELETE /users/<id>     → delete a user
"""

from flask import Blueprint, request
from app.utils.db_helpers import query_db, mutate_db
from app.utils.response   import success, error
from app.utils.validators import is_valid_email
import bcrypt

users_bp = Blueprint("users", __name__)

VALID_ROLES = ("admin", "sales", "support")


@users_bp.get("")
def get_users():
    rows = query_db("SELECT id, name, email, role, created_at FROM users")
    return success(rows)


@users_bp.post("")
def create_user():
    data = request.get_json(silent=True) or {}

    name     = (data.get("name") or "").strip()
    email    = (data.get("email") or "").strip().lower()
    password = data.get("password", "")
    role     = data.get("role", "sales")

    if not name:
        return error("name is required", 422)
    if not is_valid_email(email):
        return error("a valid email is required", 422)
    if not password or len(password) < 6:
        return error("password must be at least 6 characters", 422)
    if role not in VALID_ROLES:
        return error(f"role must be one of: {', '.join(VALID_ROLES)}", 422)

    # check duplicate email
    if query_db("SELECT id FROM users WHERE email = %s", (email,), one=True):
        return error("Email already registered", 409)

    hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
    uid = mutate_db(
        "INSERT INTO users (name, email, password, role) VALUES (%s, %s, %s, %s)",
        (name, email, hashed, role),
    )
    user = query_db(
        "SELECT id, name, email, role, created_at FROM users WHERE id = %s",
        (uid,), one=True
    )
    return success(user, "User created successfully", 201)


@users_bp.delete("/<int:user_id>")
def delete_user(user_id):
    if not query_db("SELECT id FROM users WHERE id = %s", (user_id,), one=True):
        return error("User not found", 404)
    mutate_db("DELETE FROM users WHERE id = %s", (user_id,))
    return success(message="User deleted successfully")
