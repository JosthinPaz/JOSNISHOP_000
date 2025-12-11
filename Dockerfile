# Usar una imagen base de Python oficial y ligera
FROM python:3.11-slim

# Instalar dependencias del sistema necesarias (MariaDB y Cairo)
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    \
        # Dependencias de MariaDB/MySQL
        default-libmysqlclient-dev \
        gcc \
        pkg-config \
        \
        # Nuevas dependencias de Cairo y FreeType (para pycairo y ReportLab)
        libcairo2-dev \
        libfreetype6-dev \
        \
        # Paquetes de desarrollo general que podrían ser útiles
        build-essential && \
    rm -rf /var/lib/apt/lists/*

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar todo el contenido del repositorio al directorio de trabajo del contenedor
COPY . /app

# Establecer el directorio de trabajo en la carpeta de la aplicación (BACKEND)
WORKDIR /app/BACKEND

# Instalar las dependencias de Python
RUN pip install --no-cache-dir -r requirements.txt

# El comando de inicio que se ejecutará al iniciar el contenedor
# *** LÍNEA CORREGIDA: Creación de tablas gestionada por main.py, solo iniciamos Uvicorn. ***
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

# Exponer el puerto
EXPOSE 8000
