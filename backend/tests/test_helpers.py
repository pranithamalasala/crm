from app.utils.helpers import row_to_dict, rows_to_list, next_stage


def test_row_to_dict_with_row():
    row = {"id": 1, "name": "Alice"}
    result = row_to_dict(row)

    assert result == {"id": 1, "name": "Alice"}


def test_row_to_dict_with_none():
    assert row_to_dict(None) is None


def test_rows_to_list():
    rows = [
        {"id": 1, "name": "Alice"},
        {"id": 2, "name": "Bob"}
    ]

    result = rows_to_list(rows)

    assert result == [
        {"id": 1, "name": "Alice"},
        {"id": 2, "name": "Bob"}
    ]


def test_next_stage():
    assert next_stage("New Lead") == "Contacted"
    assert next_stage("Contacted") == "Demo"
    assert next_stage("Demo") == "Negotiation"
    assert next_stage("Negotiation") == "Won"


def test_next_stage_terminal():
    assert next_stage("Won") is None
    assert next_stage("Lost") is None


def test_next_stage_invalid():
    assert next_stage("Invalid Stage") is None