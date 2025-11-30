from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError
from pydantic import ValidationError
from typing import Union, Dict, Any
import jwt

class APIError(Exception):
    def __init__(
        self,
        status_code: int,
        message: str,
        detail: Union[str, Dict[str, Any], None] = None
    ):
        self.status_code = status_code
        self.message = message
        self.detail = detail

async def error_handler(request: Request, exc: Exception) -> JSONResponse:
    if isinstance(exc, APIError):
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "error": exc.message,
                "detail": exc.detail,
                "path": request.url.path
            }
        )
    
    if isinstance(exc, ValidationError):
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={
                "error": "Validation Error",
                "detail": exc.errors(),
                "path": request.url.path
            }
        )
    
    if isinstance(exc, SQLAlchemyError):
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "error": "Database Error",
                "detail": "An error occurred while processing your request",
                "path": request.url.path
            }
        )
    
    if isinstance(exc, jwt.PyJWTError):
        return JSONResponse(
            status_code=status.HTTP_401_UNAUTHORIZED,
            content={
                "error": "Authentication Error",
                "detail": "Invalid or expired token",
                "path": request.url.path
            }
        )
    
    # Default error handler for unexpected exceptions
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "Internal Server Error",
            "detail": "An unexpected error occurred",
            "path": request.url.path
        }
    )

def setup_error_handlers(app: FastAPI) -> None:
    app.add_exception_handler(Exception, error_handler)
    app.add_exception_handler(APIError, error_handler)
    app.add_exception_handler(ValidationError, error_handler)
    app.add_exception_handler(SQLAlchemyError, error_handler)
    app.add_exception_handler(jwt.PyJWTError, error_handler)