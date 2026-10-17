import os
import boto3


AWS_REGION = os.getenv("AWS_REGION", "ap-south-1")
DYNAMODB_TABLE_NAME = os.getenv("DYNAMODB_TABLE_NAME", "CRMActivityLogs")

dynamodb = boto3.resource(
    "dynamodb",
    region_name=AWS_REGION
)

activity_table = dynamodb.Table(DYNAMODB_TABLE_NAME)


def log_activity(activity_id, lead_id, user_id, activity_type, notes):
    activity_table.put_item(
        Item={
            "activity_id": str(activity_id),
            "lead_id": str(lead_id),
            "user_id": str(user_id),
            "type": activity_type,
            "notes": notes or "",
        }
    )