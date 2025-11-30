import os
import secrets

# Número de WhatsApp del empresario en formato internacional sin '+' ni guiones.
# Ejemplo: '573001234567' para Colombia. Reemplaza el valor por el número real.
BUSINESS_WHATSAPP = os.environ.get("BUSINESS_WHATSAPP", "573150556285")
# API key para integrar con OpenAI (opcional). Si no está definida, la funcionalidad de IA se omite.
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "")

# Clave para cifrar datos sensibles (32 bytes aleatorios en base64)
ENCRYPTION_KEY = os.environ.get("ENCRYPTION_KEY", secrets.token_urlsafe(32))
