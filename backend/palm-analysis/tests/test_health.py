from fastapi.testclient import TestClient

from app.main import app


def test_health_keeps_analysis_disabled() -> None:
    response = TestClient(app).get("/health")

    assert response.status_code == 200
    assert response.json()["status"] == "ok"
    assert response.json()["analysis_enabled"] is False


def test_no_analysis_upload_route_is_registered() -> None:
    routes = {route.path for route in app.routes}

    assert "/v1/palm-lines/analyze" not in routes
