from cryptography.fernet import Fernet
import base64
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
import os

# Genera una clave secreta para el cifrado (guárdala de manera segura en variables de entorno)
ENCRYPTION_KEY = os.getenv('ENCRYPTION_KEY', 'tu_clave_secreta_aqui')  # Asegúrate de cambiar esto en producción

def get_encryption_key():
    """Genera una clave de cifrado basada en ENCRYPTION_KEY."""
    salt = b'salt_'  # En producción, usa un salt aleatorio y guárdalo
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=100000,
    )
    key = base64.urlsafe_b64encode(kdf.derive(ENCRYPTION_KEY.encode()))
    return key

def encrypt_data(data: str) -> str:
    """Cifra datos sensibles."""
    if not data:
        return data
    
    f = Fernet(get_encryption_key())
    return f.encrypt(data.encode()).decode()

def decrypt_data(encrypted_data: str) -> str:
    """Descifra datos sensibles."""
    if not encrypted_data:
        return encrypted_data
    
    f = Fernet(get_encryption_key())
    return f.decrypt(encrypted_data.encode()).decode()