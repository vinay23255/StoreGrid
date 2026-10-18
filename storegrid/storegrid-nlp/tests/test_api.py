"""
API integration tests for StoreGrid FastAPI endpoints.
Tests GET /, GET /health, POST /classify, validation errors,
and payload responses.
"""

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_home_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "StoreGrid NLP Service" in data["message"]


def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "storegrid-nlp"
    assert data["version"] == "1.0.0"


def test_express_backend_integration_contract():
    """
    Simulates a request from Vinay's Express backend.
    Verifies that all 8 agreed JSON fields are present with correct types and classification.
    """
    payload = {
        "feedbackId": "vinay-node-req-001",
        "storeId": "STORE-HYD-01",
        "text": "The cashier was very rude and unhelpful",
        "sourceType": "express_backend",
        "language": "en",
        "createdAt": "2026-10-16T15:00:00.000Z",
    }
    response = client.post("/classify", json=payload)
    assert response.status_code == 200
    data = response.json()

    # Agreed response fields validation
    expected_fields = [
        "feedbackId",
        "storeId",
        "originalText",
        "cleanedText",
        "category",
        "confidence",
        "needsReview",
        "matchedTerms",
    ]
    for field in expected_fields:
        assert field in data, f"Missing agreed response field: {field}"

    assert data["feedbackId"] == "vinay-node-req-001"
    assert data["storeId"] == "STORE-HYD-01"
    assert data["originalText"] == "The cashier was very rude and unhelpful"
    assert data["cleanedText"] == "the cashier was very rude and unhelpful"
    assert data["category"] == "STAFF_BEHAVIOUR"
    assert isinstance(data["confidence"], float)
    assert data["confidence"] >= 0.85
    assert data["needsReview"] is False
    assert isinstance(data["matchedTerms"], list)
    assert len(data["matchedTerms"]) > 0



def test_classify_valid_request():
    payload = {
        "feedbackId": "fb-101",
        "storeId": "str-vizag-01",
        "text": "   Billing   Chala   SLOW   ga   undi!   ",
        "sourceType": "mobile_app",
        "language": "te-en",
        "createdAt": "2026-10-16T10:00:00Z",
    }
    response = client.post("/classify", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert data["feedbackId"] == "fb-101"
    assert data["storeId"] == "str-vizag-01"
    # Verify originalText preservation
    assert data["originalText"] == "   Billing   Chala   SLOW   ga   undi!   "
    # Verify cleanedText normalization
    assert data["cleanedText"] == "billing chala slow ga undi!"
    assert data["category"] == "BILLING_DELAY"
    assert data["confidence"] >= 0.85
    assert data["needsReview"] is False
    assert "billing chala slow ga undi" in data["matchedTerms"]


def test_classify_optional_created_at():
    payload = {
        "feedbackId": "fb-102",
        "storeId": "str-hyd-04",
        "text": "Sunflower oil was completely out of stock today.",
    }
    response = client.post("/classify", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["category"] == "STOCK_SHORTAGE"
    assert data["needsReview"] is False


def test_classify_conflicting_feedback():
    payload = {
        "feedbackId": "fb-103",
        "storeId": "str-hyd-02",
        "text": "The cashier was very rude and the milk was expired.",
    }
    response = client.post("/classify", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["category"] == "NEEDS_REVIEW"
    assert data["needsReview"] is True
    assert data["confidence"] == 0.40
    assert len(data["matchedTerms"]) >= 2


def test_classify_empty_text():
    payload = {
        "feedbackId": "fb-104",
        "storeId": "str-vja-01",
        "text": "    ",
    }
    response = client.post("/classify", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["category"] == "NEEDS_REVIEW"
    assert data["confidence"] == 0.0
    assert data["needsReview"] is True
    assert data["matchedTerms"] == []


def test_classify_invalid_request_missing_text():
    payload = {
        "feedbackId": "fb-105",
        "storeId": "str-vja-01",
    }
    response = client.post("/classify", json=payload)
    assert response.status_code == 422


def test_classify_invalid_request_missing_store_id():
    payload = {
        "feedbackId": "fb-106",
        "text": "Good store",
    }
    response = client.post("/classify", json=payload)
    assert response.status_code == 422


def test_classify_invalid_request_missing_feedback_id():
    payload = {
        "storeId": "str-01",
        "text": "Good store",
    }
    response = client.post("/classify", json=payload)
    assert response.status_code == 422
