
import importlib
import app.config as config_module


def test_secret_key_uses_default(monkeypatch):
    monkeypatch.delenv("SECRET_KEY", raising=False)

    module = importlib.reload(config_module)

    assert module.Config.SECRET_KEY == "dev-secret-key"


def test_secret_key_uses_environment_variable(monkeypatch):
    monkeypatch.setenv("SECRET_KEY", "test-secret-key")

    module = importlib.reload(config_module)

    assert module.Config.SECRET_KEY == "test-secret-key"


def test_debug_is_enabled():
    assert config_module.Config.DEBUG is True
