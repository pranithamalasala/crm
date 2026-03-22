"""
crm_backend/app/utils/validators.py
Simple field-level validation helpers.
"""

import re

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")

PIPELINE_STAGES = ["New Lead", "Contacted", "Demo", "Negotiation", "Won", "Lost"]


def is_valid_email(email: str) -> bool:
    return bool(EMAIL_RE.match(email or ""))


def is_valid_stage(stage: str) -> bool:
    return stage in PIPELINE_STAGES


def validate_lead(data: dict) -> list[str]:
    errors = []
    if not data.get("name", "").strip():
        errors.append("name is required")
    if not is_valid_email(data.get("email", "")):
        errors.append("a valid email is required")
    if "status" in data and not is_valid_stage(data["status"]):
        errors.append(f"status must be one of: {', '.join(PIPELINE_STAGES)}")
    return errors


def validate_activity(data: dict) -> list[str]:
    errors = []
    if not data.get("lead_id"):
        errors.append("lead_id is required")
    if not data.get("user_id"):
        errors.append("user_id is required")
    if data.get("type") not in ("call", "email", "meeting"):
        errors.append("type must be call, email, or meeting")
    return errors
