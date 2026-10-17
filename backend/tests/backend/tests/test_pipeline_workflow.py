from app.utils.helpers import PIPELINE_STAGES, next_stage


def test_pipeline_stages_order():
    assert PIPELINE_STAGES == [
        "New Lead",
        "Contacted",
        "Demo",
        "Negotiation",
        "Won",
        "Lost"
    ]


def test_next_stage_progression():
    assert next_stage("New Lead") == "Contacted"
    assert next_stage("Contacted") == "Demo"
    assert next_stage("Demo") == "Negotiation"
    assert next_stage("Negotiation") == "Won"


def test_terminal_stages():
    assert next_stage("Won") is None
    assert next_stage("Lost") is None


def test_invalid_stage():
    assert next_stage("Invalid") is None