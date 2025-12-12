# Usar una imagen base de Python oficial y ligera
FROM python:3.11-slim

# Instalar dependencias del sistema necesarias
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        ca-certificates \
        # Dependencia de MariaDB/MySQL (para mariadb_config)
        default-libmysqlclient-dev \
        # Dependencias de compilación
        gcc \
        pkg-config \
        build-essential \
        python3-dev \
        libssl-dev \
        # Dependencias de Cairo y FreeType (para ReportLab)
        libcairo2-dev \
        libfreetype6-dev && \
    # Limpieza
    apt-get autoremove -y && \
    rm -rf /var/lib/apt/lists/*

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar todo el contenido de la carpeta BACKEND (que es el contexto de construcción)
COPY . /app

# Establecer el directorio de trabajo en /app (ya estamos en /app, pero es para claridad)
# WORKDIR /app/BACKEND NO es necesario si ya se copió a /app
# La siguiente línea asume que requirements.txt está en /app (copiado desde BACKEND)
RUN pip install --upgrade pip setuptools wheel && \
    pip install --no-cache-dir -r requirements.txt

# El comando de inicio que se ejecutará al iniciar el contenedor
CMD ["sh", "-c", "alembic upgrade head && uvicorn main:app --host 0.0.0.0 --port 8000"]

# Exponer el puerto
EXPOSE 8000
