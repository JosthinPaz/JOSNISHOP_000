from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# --- Nueva configuración: Leer variables de entorno ---
DB_USER = os.getenv("DB_USER", "root")          # Usamos 'root' como fallback, aunque en CI es vacío
DB_PASSWORD = os.getenv("DB_PASSWORD", "admin") # Usamos 'admin' como fallback, aunque en CI es vacío
DB_HOST = os.getenv("DB_HOST", "localhost")     # Lee el host. Fallback a 'localhost' para desarrollo local.
DB_PORT = os.getenv("DB_PORT", "3315")          # Lee el puerto. Fallback a '3315' para desarrollo local.
DB_NAME = os.getenv("DB_NAME", "josnishop")     # Lee el nombre de la DB. Fallback a 'josnishop'

# connection string (usando variables de entorno)
SQLALCHEMY_DATABASE_URL = (
    f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
)   # Lee el nombre de la DB. Fallback a 'josnishop'


# crea el objeto de conexion (permite conectarse a la base de datos)
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
