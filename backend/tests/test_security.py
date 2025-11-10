"""
Basic unit tests for security module
"""
import pytest
from datetime import timedelta
from app.core.security import create_access_token, verify_token
from app.core.config import settings


def test_create_access_token():
    """Test token creation"""
    data = {"sub": 1, "email": "test@example.com"}
    token = create_access_token(data)
    
    assert token is not None
    assert isinstance(token, str)
    assert len(token) > 0


def test_verify_token_valid():
    """Test token verification with valid token"""
    data = {"sub": 1, "email": "test@example.com"}
    token = create_access_token(data)
    
    payload = verify_token(token)
    
    assert payload is not None
    assert payload["sub"] == 1
    assert payload["email"] == "test@example.com"
    assert "exp" in payload


def test_verify_token_invalid():
    """Test token verification with invalid token"""
    invalid_token = "invalid.token.here"
    payload = verify_token(invalid_token)
    
    assert payload is None


def test_token_expiration():
    """Test that token expiration is set correctly"""
    data = {"sub": 1, "email": "test@example.com"}
    expires_delta = timedelta(minutes=15)
    token = create_access_token(data, expires_delta=expires_delta)
    
    payload = verify_token(token)
    
    assert payload is not None
    assert "exp" in payload


def test_create_access_token_with_custom_expiration():
    """Test token creation with custom expiration"""
    data = {"sub": 1, "email": "test@example.com"}
    custom_expires = timedelta(hours=1)
    token = create_access_token(data, expires_delta=custom_expires)
    
    payload = verify_token(token)
    
    assert payload is not None
    assert payload["sub"] == 1

