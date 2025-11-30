"""
Rate Limiting Utilities
Protege contra fuerza bruta, DDoS y abuso de API
"""

from datetime import datetime, timedelta
from typing import Dict, Tuple
from fastapi import HTTPException, Request
from functools import wraps
import os

# Almacenamiento en memoria (en producción, usar Redis)
rate_limit_store: Dict[str, Tuple[int, float]] = {}

# Configuraciones desde .env
MAX_REQUESTS = int(os.getenv("RATE_LIMIT_MAX_REQUESTS", "100"))
RATE_LIMIT_WINDOW = int(os.getenv("RATE_LIMIT_WINDOW_SECONDS", "60"))  # 1 minuto
MAX_LOGIN_ATTEMPTS = int(os.getenv("MAX_LOGIN_ATTEMPTS", "5"))
LOGIN_ATTEMPT_TIMEOUT = int(os.getenv("LOGIN_ATTEMPT_TIMEOUT", "300"))  # 5 minutos


def get_client_ip(request: Request) -> str:
    """Obtener IP del cliente, considerando proxies"""
    if request.headers.get('x-forwarded-for'):
        return request.headers.get('x-forwarded-for').split(',')[0].strip()
    return request.client.host


def rate_limit_by_ip(request: Request, max_requests: int = MAX_REQUESTS, window: int = RATE_LIMIT_WINDOW) -> bool:
    """
    Verificar rate limit por IP del cliente
    
    Retorna True si el cliente está dentro del límite
    Retorna False si excede el límite
    
    Parámetros:
    - max_requests: máximo de solicitudes permitidas
    - window: ventana de tiempo en segundos
    """
    client_ip = get_client_ip(request)
    current_time = datetime.now().timestamp()
    
    if client_ip not in rate_limit_store:
        rate_limit_store[client_ip] = (1, current_time)
        return True
    
    request_count, window_start = rate_limit_store[client_ip]
    time_elapsed = current_time - window_start
    
    # Si pasó la ventana de tiempo, reiniciar contador
    if time_elapsed > window:
        rate_limit_store[client_ip] = (1, current_time)
        return True
    
    # Si no ha pasado la ventana, incrementar contador
    if request_count < max_requests:
        rate_limit_store[client_ip] = (request_count + 1, window_start)
        return True
    
    # Se excedió el límite
    return False


def check_rate_limit(request: Request, max_requests: int = MAX_REQUESTS, window: int = RATE_LIMIT_WINDOW):
    """
    Middleware que verifica rate limit y lanza excepción si se excede
    """
    if not rate_limit_by_ip(request, max_requests, window):
        client_ip = get_client_ip(request)
        raise HTTPException(
            status_code=429,
            detail=f"Demasiadas solicitudes. Intenta de nuevo en {window} segundos."
        )


def reset_rate_limit(client_ip: str):
    """Resetear el contador de rate limit para un cliente específico"""
    if client_ip in rate_limit_store:
        del rate_limit_store[client_ip]


class BruteForceProtection:
    """Protección contra ataques de fuerza bruta (login, etc)"""
    
    failed_attempts: Dict[str, Tuple[int, float]] = {}
    MAX_ATTEMPTS = MAX_LOGIN_ATTEMPTS
    TIMEOUT = LOGIN_ATTEMPT_TIMEOUT
    
    @classmethod
    def is_blocked(cls, identifier: str) -> bool:
        """Verificar si el cliente está bloqueado"""
        if identifier not in cls.failed_attempts:
            return False
        
        attempts, block_until = cls.failed_attempts[identifier]
        current_time = datetime.now().timestamp()
        
        # Si pasó el timeout, desbloquear
        if current_time >= block_until:
            del cls.failed_attempts[identifier]
            return False
        
        return True
    
    @classmethod
    def record_failure(cls, identifier: str):
        """Registrar un intento fallido"""
        current_time = datetime.now().timestamp()
        
        if identifier not in cls.failed_attempts:
            cls.failed_attempts[identifier] = (1, current_time + cls.TIMEOUT)
        else:
            attempts, block_until = cls.failed_attempts[identifier]
            
            if attempts + 1 >= cls.MAX_ATTEMPTS:
                # Bloquear por TIMEOUT segundos
                cls.failed_attempts[identifier] = (attempts + 1, current_time + cls.TIMEOUT)
            else:
                cls.failed_attempts[identifier] = (attempts + 1, block_until)
    
    @classmethod
    def record_success(cls, identifier: str):
        """Limpiar intentos fallidos después de éxito"""
        if identifier in cls.failed_attempts:
            del cls.failed_attempts[identifier]
    
    @classmethod
    def get_remaining_time(cls, identifier: str) -> int:
        """Obtener tiempo restante de bloqueo en segundos"""
        if identifier not in cls.failed_attempts:
            return 0
        
        _, block_until = cls.failed_attempts[identifier]
        current_time = datetime.now().timestamp()
        remaining = max(0, int(block_until - current_time))
        return remaining


def rate_limit_endpoint(max_requests: int = MAX_REQUESTS, window: int = RATE_LIMIT_WINDOW):
    """
    Decorador para aplicar rate limiting a un endpoint específico
    
    Uso:
    @router.post("/login")
    @rate_limit_endpoint(max_requests=5, window=60)
    def login(request: Request, credentials: LoginRequest):
        ...
    """
    def decorator(func):
        @wraps(func)
        async def wrapper(request: Request, *args, **kwargs):
            check_rate_limit(request, max_requests, window)
            return await func(request, *args, **kwargs)
        return wrapper
    return decorator
