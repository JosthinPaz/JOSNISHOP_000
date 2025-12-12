# Dockerfile actual que está fallando (asume que BACKEND está afuera):
# COPY requirements.txt /app/
# COPY BACKEND /app/BACKEND 

# NO! El requirements.txt está DENTRO de la carpeta BACKEND, no en la raíz del repo.

# Asumiendo que el requirements.txt está DENTRO de la carpeta BACKEND:
# CÓDIGO FINAL CORREGIDO DE DOCKERFILE
FROM python:3.11-slim

# ... (instalación de dependencias del sistema) ...

# Establecer el directorio de trabajo base
WORKDIR /app

# Copiar TODO el contenido de la carpeta BACKEND (que ahora es el contexto de construcción)
# Si Root Directory es "BACKEND", el '.' representa todo lo que hay dentro de la carpeta BACKEND
COPY . /app

# Upgrade pip y luego instalar las dependencias de Python
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# El comando de inicio que se ejecutará al iniciar el contenedor
CMD ["sh", "-c", "alembic upgrade head && uvicorn main:app --host 0.0.0.0 --port 8000"]

# Exponer el puerto
EXPOSE 8000
