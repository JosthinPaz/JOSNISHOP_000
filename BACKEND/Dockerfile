# Usar una imagen base de Python oficial y ligera
FROM python:3.11-slim

# Instalar dependencias del sistema necesarias
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        default-libmysqlclient-dev \
        gcc \
        pkg-config \
        libcairo2-dev \
        libfreetype6-dev \
        libssl-dev \
        python3-dev \
        build-essential && \
    apt-get autoremove -y && \
    rm -rf /var/lib/apt/lists/*

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar todo el contenido de la carpeta BACKEND (que ahora es el contexto de construcción)
# Esto copiará el requirements.txt, main.py, etc., a /app dentro del contenedor.
COPY . /app

# Upgrade pip y luego instalar las dependencias de Python
# Como requirements.txt se copió a /app, lo referenciamos directamente:
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# El comando de inicio que se ejecutará al iniciar el contenedor
CMD ["sh", "-c", "alembic upgrade head && uvicorn main:app --host 0.0.0.0 --port 8000"]

# Exponer el puerto
EXPOSE 8000
