"""
Custom exceptions for the application
"""


class BaseAppException(Exception):
    """Base exception for all application exceptions"""
    def __init__(self, message: str, status_code: int = 500):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)


class NotFoundError(BaseAppException):
    """Exception raised when a resource is not found"""
    def __init__(self, resource: str, identifier: str = None):
        message = f"{resource} not found"
        if identifier:
            message += f" with id: {identifier}"
        super().__init__(message, status_code=404)


class ValidationError(BaseAppException):
    """Exception raised when validation fails"""
    def __init__(self, message: str):
        super().__init__(message, status_code=400)


class UnauthorizedError(BaseAppException):
    """Exception raised when authentication fails"""
    def __init__(self, message: str = "Unauthorized"):
        super().__init__(message, status_code=401)


class ForbiddenError(BaseAppException):
    """Exception raised when access is forbidden"""
    def __init__(self, message: str = "Forbidden"):
        super().__init__(message, status_code=403)


class ConflictError(BaseAppException):
    """Exception raised when a conflict occurs (e.g., duplicate entry)"""
    def __init__(self, message: str):
        super().__init__(message, status_code=409)

