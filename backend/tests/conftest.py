import pytest


@pytest.fixture
def app(tmp_path, monkeypatch):
    import app as app_module

    # Use a temporary database for tests
    test_db = tmp_path / "test_crm.db"
    monkeypatch.setattr(app_module, "DB_PATH", str(test_db))

    application = app_module.create_app()
    application.config.update({
        "TESTING": True,
    })

    yield application


@pytest.fixture
def client(app):
    return app.test_client()