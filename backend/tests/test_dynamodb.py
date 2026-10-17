
from unittest.mock import patch

from app.utils import dynamodb as dynamodb_module


def test_log_activity_writes_to_dynamodb():
    with patch.object(
        dynamodb_module.activity_table,
        "put_item",
    ) as mock_put_item:
        dynamodb_module.log_activity(
            activity_id=101,
            lead_id=12,
            user_id=3,
            activity_type="call",
            notes="Follow-up scheduled",
        )

    mock_put_item.assert_called_once_with(
        Item={
            "activity_id": "101",
            "lead_id": "12",
            "user_id": "3",
            "type": "call",
            "notes": "Follow-up scheduled",
        }
    )


def test_log_activity_handles_empty_notes():
    with patch.object(
        dynamodb_module.activity_table,
        "put_item",
    ) as mock_put_item:
        dynamodb_module.log_activity(
            activity_id=102,
            lead_id=13,
            user_id=4,
            activity_type="meeting",
            notes=None,
        )

    mock_put_item.assert_called_once_with(
        Item={
            "activity_id": "102",
            "lead_id": "13",
            "user_id": "4",
            "type": "meeting",
            "notes": "",
        }
    )
